package com.sicarus.controller;

import com.sicarus.dto.InstallmentDTO;
import com.sicarus.dto.LoanRequest;
import com.sicarus.dto.LoanResponse;
import com.sicarus.dto.SimulateLoanRequest;
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
    public ResponseEntity<List<InstallmentDTO>> simulateLoan(@RequestBody SimulateLoanRequest request) {
        List<InstallmentDTO> schedule = loanService.simulateLoanSchedule(request);
        return ResponseEntity.ok(schedule);
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

    @GetMapping("/client/{customerId}")
    public ResponseEntity<List<LoanResponse>> getByCustomer(@PathVariable Long customerId) {
        return ResponseEntity.ok(loanService.listLoansByCustomer(customerId));
    }

}
