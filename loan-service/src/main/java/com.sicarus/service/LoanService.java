package com.sicarus.service;

import com.sicarus.dto.InstallmentDTO;
import com.sicarus.dto.LoanRequest;
import com.sicarus.dto.LoanResponse;
import com.sicarus.dto.SimulateLoanRequest;
import com.sicarus.model.Loan;
import com.sicarus.model.LoanStatus;
import com.sicarus.repository.LoanRepository;
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
    private LoanRepository loanRepository;
    //private final NotificationClient notificationClient; // envia evento

    public LoanService(LoanRepository loanRepository) {
        this.loanRepository = loanRepository;
    }

    public List<InstallmentDTO> simulateLoanSchedule(SimulateLoanRequest request) {
        BigDecimal principal = request.principal();
        int n = request.termMonths();
        BigDecimal i = request.interestRate();

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


}
