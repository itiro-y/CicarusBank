package com.sicarus.service;

import com.sicarus.clients.AccountClient;
import com.sicarus.clients.LoanCustomer;
import com.sicarus.clients.TransactionClient;
import com.sicarus.dto.*;
import com.sicarus.model.Installment;
import com.sicarus.model.Loan;
import com.sicarus.model.LoanStatus;
import com.sicarus.repository.LoanRepository;
import feign.FeignException;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LoanService {
    private final LoanRepository loanRepository;
    private final LoanCustomer loanCustomer;
    private final TransactionClient transactionClient;
    private final AccountClient accountClient;
    //private final NotificationClient notificationClient; // envia evento

    public LoanService(LoanRepository loanRepository, LoanCustomer loanCustomer, TransactionClient transactionClient, AccountClient accountClient) {
        this.loanRepository = loanRepository;
        this.loanCustomer = loanCustomer;
        this.transactionClient = transactionClient;
        this.accountClient = accountClient;
    }

    public LoanSimulationResponse simulateLoan(SimulateLoanRequest request) {
        LoanSimulationResponse loanSimulationResponse = new LoanSimulationResponse();

        //setar lista detalhada com os valores das parcelas
        loanSimulationResponse.setInstallments(simulateLoanSchedule(request));

        //setar o valor principal do emprestimo
        loanSimulationResponse.setPrincipal(request.getPrincipal());

        //setar o valor total de juros
        BigDecimal totalInterest = BigDecimal.valueOf(0);
        for (InstallmentDTO i : loanSimulationResponse.getInstallments() ){
            totalInterest = totalInterest.add(i.getInterest());
        }
        loanSimulationResponse.setTotalInterest(totalInterest);

        //setar o valor total a ser pago pelo cliente
        totalInterest = totalInterest.add(request.getPrincipal());
        loanSimulationResponse.setTotalAmount(totalInterest);

        return loanSimulationResponse;
    }

    public List<InstallmentDTO> simulateLoanSchedule(SimulateLoanRequest request) {
        BigDecimal principal = request.getPrincipal();
        int n = request.getTermMonths();
        BigDecimal i = request.getInterestRate();

        // Cálculo da parcela fixa (Sistema Price)
        BigDecimal onePlusI = BigDecimal.ONE.add(i);
        BigDecimal numerator = principal.multiply(i).multiply(onePlusI.pow(n));
        BigDecimal denominator = onePlusI.pow(n).subtract(BigDecimal.ONE);
        BigDecimal installmentValue = numerator.divide(denominator, 2, RoundingMode.HALF_UP);

        List<InstallmentDTO> schedule = new ArrayList<>();
        BigDecimal remaining = principal;

        for (int k = 1; k <= n; k++) {
            BigDecimal interest = remaining.multiply(i).setScale(2, RoundingMode.HALF_UP);
            BigDecimal amortization = installmentValue.subtract(interest);
            remaining = remaining.subtract(amortization).max(BigDecimal.ZERO);

            schedule.add(new InstallmentDTO(
                    k,
                    installmentValue,
                    interest,
                    amortization,
                    remaining
            ));
        }

        return schedule;
    }

    public List<Installment> generateInstallment(LoanRequest loanRequest, Loan loan) {

        BigDecimal principal = loanRequest.getAmount();
        int n = loanRequest.getTermMonths();
        BigDecimal i = loanRequest.getInterestRate();

        // Cálculo da parcela fixa (Sistema Price)
        BigDecimal onePlusI = BigDecimal.ONE.add(i);
        BigDecimal numerator = principal.multiply(i).multiply(onePlusI.pow(n));
        BigDecimal denominator = onePlusI.pow(n).subtract(BigDecimal.ONE);
        BigDecimal installmentValue = numerator.divide(denominator, 2, RoundingMode.HALF_UP);

        List<Installment> schedule = new ArrayList<>();
        BigDecimal remaining = principal;

        for (int k = 0; k < n; k++) {
            BigDecimal interest = remaining.multiply(i).setScale(2, RoundingMode.HALF_UP);
            BigDecimal amortization = installmentValue.subtract(interest);
            remaining = remaining.subtract(amortization).max(BigDecimal.ZERO);

            schedule.add(new Installment(
                    k+1,
                    installmentValue,
                    interest,
                    amortization,
                    remaining,
                    loanRequest.getDueDate().plusMonths(k),
                    loan
            ));
        }

        return schedule;
    }


    public LoanResponse createLoan(LoanRequest request) {
        Loan loan = new Loan();
        loan.setCustomerId(request.getCustomerId());
        loan.setPrincipal(request.getAmount());
        loan.setTermMonths(request.getTermMonths());
        loan.setInterestRate(request.getInterestRate());
        loan.setStatus(LoanStatus.PENDING);
        loan.setInstallments(generateInstallment(request, loan));

        ZoneId zone = ZoneId.systemDefault();
        loan.setCreatedAt(LocalDateTime.now().atZone(zone).toInstant());

        Loan saved = loanRepository.save(loan);
        return toResponse(saved);
    }

    public LoanResponse approveLoan(Long id) {
        Loan loan = loanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Empréstimo não encontrado"));

        loan.setStatus(LoanStatus.APPROVED);
        loanRepository.save(loan);

//        // Enviar notificação (mock ou real)
//        notificationClient.sendLoanApproved(loan);

        return toResponse(loan);
    }

    public List<FullLoanResponse> listLoansByCustomer(Long customerId) {
        List<Loan> loans = loanRepository.findByCustomerId(customerId);
        return loans.stream().map(this::toResponseFull).toList();
    }

    public Boolean anyLoanForCustomer(Long customerId) {
        if (loanRepository.findByCustomerId(customerId).isEmpty()) {
            return false;
        }
        return true;
    }

    private LoanResponse toResponse(Loan loan) {
        return new LoanResponse(
                loan.getId(),
                loan.getCustomerId(),
                loan.getPrincipal(),
                loan.getTermMonths(),
                loan.getInterestRate(),
                loan.getStatus(),
                loan.getCreatedAt()
        );
    }

    private FullLoanResponse toResponseFull(Loan loan) {
        FullLoanResponse dto = new FullLoanResponse();
        dto.setId(loan.getId());
        dto.setCustomerId(loan.getCustomerId());
        dto.setPrincipal(loan.getPrincipal());
        dto.setTermMonths(loan.getTermMonths());
        dto.setInterestRate(loan.getInterestRate());
        dto.setStatus(loan.getStatus());
        dto.setCreatedAt(loan.getCreatedAt());
        dto.setInstallments(
                loan.getInstallments()
                        .stream()
                        .map(installment -> {
                            FullInstallmentResponse i = new FullInstallmentResponse();
                            i.setInstallmentNumber(installment.getInstallmentNumber());
                            i.setAmount(installment.getAmount());
                            i.setInterest(installment.getInterest());
                            i.setAmortization(installment.getAmortization());
                            i.setRemainingPrincipal(installment.getRemainingPrincipal());
                            i.setDueDate(installment.getDueDate());
                            i.setPaid(installment.getPaid());
                            i.setPaidAt(installment.getPaidAt());
                            return i;
                        })
                        .collect(Collectors.toList())
        );
        return dto;
    }

    public CustomerDto getCustomerByID(Long id) {
        try {
            // Verifica se o cliente existe
            CustomerDto customer = loanCustomer.findById(id);

            return customer;

        } catch (FeignException.NotFound e) {
            throw new IllegalArgumentException("Cliente não encontrado.");
        }
    }

    @Transactional
    public void pagarParcela(Long loanId, int installmentNumber, Long userId) {

        //Localiza o id da conta do usuario
        Long accountId = accountClient.findById(userId);

        //Localiza o emprestimo no banco
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Empréstimo não encontrado"));

        Installment parcela = loan.getInstallments().stream()
                .filter(i -> i.getInstallmentNumber() == installmentNumber)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Parcela não encontrada"));

        if (parcela.getPaid()) {
            throw new IllegalStateException("Parcela já foi paga");
        }

        // Envia a transação para o micro de transactions
        TransactionRequestDTO request = new TransactionRequestDTO();
        request.setAccountId(accountId);
        request.setAmount(parcela.getAmount());
        request.setTransactionType(TransactionType.PAYMENT);

        ResponseEntity<String> response = transactionClient.processPayment(request);

        if(response.getStatusCode() == HttpStatus.CREATED) {
            // Marca como paga
            parcela.setPaid(true);
            parcela.setPaidAt(LocalDateTime.ofInstant(Instant.now(), ZoneId.systemDefault()));

            // Salva o empréstimo com a parcela atualizada
            loanRepository.save(loan);
        }else {
            throw new RuntimeException("Falha ao realizar pagamento: " + response.getBody());
        }
    }

    public Boolean payInstallment(Long loanId) {
        //Implementar logica de deduzir valor da conta e pagar parcela do emprestimo
        return true;
    }

    public List<FullLoanResponse> listLoansByStatus(LoanStatus status) {
        return loanRepository.findByStatus(status)
                .stream()
                .map(this::toResponseFull)
                .collect(Collectors.toList());
    }

    public List<FullLoanResponse> listAllLoans() {
        return loanRepository.findAll()
            .stream()
            .map(this::toResponseFull)
            .collect(Collectors.toList());
    }
}
