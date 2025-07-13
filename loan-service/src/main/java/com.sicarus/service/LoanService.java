package com.sicarus.service;

import com.sicarus.clients.LoanCustomer;
import com.sicarus.dto.*;
import com.sicarus.model.Loan;
import com.sicarus.model.LoanStatus;
import com.sicarus.repository.LoanRepository;
import feign.FeignException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;

@Service
public class LoanService {
    private final LoanRepository loanRepository;
    private final LoanCustomer loanCustomer;
    //private final NotificationClient notificationClient; // envia evento

    public LoanService(LoanRepository loanRepository, LoanCustomer loanCustomer) {
        this.loanRepository = loanRepository;
        this.loanCustomer = loanCustomer;
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


    public LoanResponse createLoan(LoanRequest request) {
        Loan loan = new Loan();
        loan.setCustomerId(request.customerId());
        loan.setPrincipal(request.amount());
        loan.setTermMonths(request.termMonths());
        loan.setInterestRate(request.interestRate());
        loan.setStatus(LoanStatus.PENDING);

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

    public List<LoanResponse> listLoansByCustomer(Long customerId) {
        List<Loan> loans = loanRepository.findByCustomerId(customerId);
        return loans.stream().map(this::toResponse).toList();
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

    public CustomerDto getCustomerByID(Long id) {
        try {
            // Verifica se o cliente existe
            CustomerDto customer = loanCustomer.findById(id);

//            // Cria empréstimo
//            Loan loan = new Loan();
//            loan.setCustomerId(customer.getId());
//            loan.setAmount(request.getAmount());
//            loan.setCreatedAt(LocalDate.now());

            return customer;

        } catch (FeignException.NotFound e) {
            throw new IllegalArgumentException("Cliente não encontrado.");
        }
    }
}
