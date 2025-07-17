package com.cicarus.investment.controller;

import com.cicarus.investment.dtos.InvestmentDto;
import com.cicarus.investment.dtos.InvestmentRequestDto;
import com.cicarus.investment.model.Investment;
import com.cicarus.investment.service.InvestmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("investment")
@Tag(name = "Investment Microservice")
public class InvestmentController {

    private final InvestmentService investmentService;

    public InvestmentController(InvestmentService investmentService) {
        this.investmentService = investmentService;
    }

    @Operation(summary = "Get that returns a list of all investments")
    @GetMapping
    public List<InvestmentDto> getAllInvestments() {
        return investmentService.findAll();
    }

    @Operation(summary = "Get that returns a list of all investments of a specific accountId")
    @GetMapping("list/{accountId}")
    public List<InvestmentDto> getUserInvestments(@PathVariable Long accountId) {
        return investmentService.findAllByAccountId(accountId);
    }

    @Operation(summary = "Get that returns a investment based on its ID")
    @GetMapping("/{id}")
    public InvestmentDto getInvestment(@PathVariable Long id) {
        return investmentService.findById(id);
    }

    @Operation(summary = "Post that creates a new Investment based on a InvestmentRequestDto JSON")
    @PostMapping()
    public InvestmentDto createInvestment(@RequestBody InvestmentRequestDto investmentRequestDto) {
        return investmentService.create(investmentRequestDto);
    }
}
