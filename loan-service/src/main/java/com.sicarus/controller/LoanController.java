package com.sicarus.controller;

import com.sicarus.dto.*;
import com.sicarus.service.LoanService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/loan")
public class LoanController {

    private LoanService loanService;

    public LoanController(LoanService loanService) {
        this.loanService = loanService;
    }

    @PostMapping("/simulate")
    public ResponseEntity<LoanSimulationResponse> simulateLoan(@RequestBody SimulateLoanRequest request) {
        LoanSimulationResponse response = loanService.simulateLoan(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<LoanResponse> create(@RequestBody LoanRequest request) {
        LoanResponse response = loanService.createLoan(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<LoanResponse> approve(@PathVariable Long id) {
        LoanResponse response = loanService.approveLoan(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/anyLoan/{customerId}")
    public ResponseEntity<Boolean> anyLoanForCustomer(@PathVariable Long customerId) {
        return ResponseEntity.ok(loanService.anyLoanForCustomer(customerId));
    }

    @GetMapping("/client/{customerId}")
    public ResponseEntity<List<FullLoanResponse>> getByCustomer(@PathVariable Long customerId) {
        return ResponseEntity.ok(loanService.listLoansByCustomer(customerId));
    }

    @GetMapping("/clientData/{customerId}")
    public ResponseEntity<CustomerDto> getCustomerById(@PathVariable Long customerId) {
        return ResponseEntity.ok(loanService.getCustomerByID(customerId));
    }

    @PostMapping("/{loanId}/installment/{installmentNumber}/pay")
    public ResponseEntity<Void> pagarParcela(
            @PathVariable Long loanId,
            @PathVariable int installmentNumber,
            @RequestParam Long userId
    ) {
        loanService.pagarParcela(loanId, installmentNumber, userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/ping")
    public String ping(){
        return "ping";
    }

}
