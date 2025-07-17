package com.cicarus.investment.controller;

import com.cicarus.investment.dtos.investment.InvestmentDto;
import com.cicarus.investment.dtos.investment.InvestmentRequestDto;
import com.cicarus.investment.model.investment.InvestmentType;
import com.cicarus.investment.service.InvestmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
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

    @Operation(summary = "Get that returns a sum of of a user's investment type RENDA_FIXA")
    @GetMapping("/renda-fixa/sum/{accountId}")
    public BigDecimal getUsersInvestmentRendaFixa(@PathVariable Long accountId) {
        BigDecimal sum = BigDecimal.ZERO;
        List<InvestmentDto> investments = investmentService.findAllByAccountId(accountId);

        for( InvestmentDto investment : investments) {
            if(investment.type().equals(InvestmentType.RENDA_FIXA)) {
                sum = sum.add(investment.amountInvested());
            }
        }
        return sum;
    }

    @Operation(summary = "Get that returns a sum of of a user's investment type FUNDO_IMOBILIARIO")
    @GetMapping("/fundo-imobiliario/sum/{accountId}")
    public BigDecimal getUsersInvestmentFundoImobiliario(@PathVariable Long accountId) {
        BigDecimal sum = BigDecimal.ZERO;
        List<InvestmentDto> investments = investmentService.findAllByAccountId(accountId);

        for( InvestmentDto investment : investments) {
            if (investment.type().equals(InvestmentType.FUNDO_IMOBILIARIO)) {
                sum = sum.add(investment.amountInvested());
            }
        }
        return sum;
    }
}
