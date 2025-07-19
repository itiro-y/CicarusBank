package com.cicarus.investment.controller;

import com.cicarus.investment.dtos.investment.InvestmentDto;
import com.cicarus.investment.dtos.investment.InvestmentHistoryBrlDto;
import com.cicarus.investment.dtos.investment.InvestmentHistoryUsdDto;
import com.cicarus.investment.dtos.investment.InvestmentRequestDto;
import com.cicarus.investment.model.investment.InvestmentStatus;
import com.cicarus.investment.model.investment.InvestmentType;
import com.cicarus.investment.model.transaction.TransactionType;
import com.cicarus.investment.service.InvestmentService;
import com.cicarus.investment.service.account.AccountService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("investment")
@Tag(name = "Investment Microservice")
public class InvestmentController {

    private final InvestmentService investmentService;
    private final AccountService accountService;

    public InvestmentController(InvestmentService investmentService, AccountService accountService) {
        this.investmentService = investmentService;
        this.accountService = accountService;
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
        accountService.alterarSaldo(investmentRequestDto.accountId(), investmentRequestDto.amountInvested(), TransactionType.WITHDRAWAL);
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

    @Operation(summary = "Get that returns a sum of of a user's investment type RENDA_FIXA and FUNDO_IMOBILIARIO in BRL")
    @GetMapping("/history-brl/{accountId}")
    public InvestmentHistoryBrlDto getInvestmentHistoryBRL(@PathVariable Long accountId) {
        List<InvestmentDto> investments = investmentService.findAllByAccountId(accountId);
        BigDecimal sumOfAllBrlInvestments = BigDecimal.ZERO;
        for( InvestmentDto investment : investments) {
            if (investment.type().equals(InvestmentType.RENDA_FIXA) || investment.type().equals(InvestmentType.FUNDO_IMOBILIARIO)) {
                if(investment.status().equals(InvestmentStatus.ATIVO)) {
                    sumOfAllBrlInvestments = sumOfAllBrlInvestments.add(investment.amountInvested());
                } else if(investment.status().equals(InvestmentStatus.RESGATADO)) {
                    // ** por enquanto .amountInvested() pois ainda nao tempos a ferramenta para calcular o currentValue() com o passar do tempo **
                    sumOfAllBrlInvestments = sumOfAllBrlInvestments.subtract(investment.amountInvested());
                }
            }
        }
        InvestmentHistoryBrlDto investmentHistoryBrlDto = new InvestmentHistoryBrlDto(sumOfAllBrlInvestments, new Date());
        return investmentHistoryBrlDto;
    }

    @Operation(summary = "Get that returns a sum of of a user's investment type RENDA_FIXA and FUNDO_IMOBILIARIO in BRL")
    @GetMapping("/history-usd/{accountId}")
    public InvestmentHistoryUsdDto getInvestmentHistoryUSD(@PathVariable Long accountId) {
        List<InvestmentDto> investments = investmentService.findAllByAccountId(accountId);
        BigDecimal sumOfAllUsdlInvestments = BigDecimal.ZERO;

        for( InvestmentDto investment : investments) {
            if (investment.type().equals(InvestmentType.ACOES) || investment.type().equals(InvestmentType.CRIPTOMOEDA)) {
                if(investment.status().equals(InvestmentStatus.ATIVO)) {
                    sumOfAllUsdlInvestments = sumOfAllUsdlInvestments.add(investment.amountInvested());
                } else if(investment.status().equals(InvestmentStatus.RESGATADO)) {
                    // ** por enquanto .amountInvested() pois ainda nao tempos a ferramenta para calcular o currentValue() com o passar do tempo **
                    sumOfAllUsdlInvestments = sumOfAllUsdlInvestments.subtract(investment.amountInvested());
                }
            }
        }
        InvestmentHistoryUsdDto investmentHistoryUsdDto = new InvestmentHistoryUsdDto(sumOfAllUsdlInvestments, new Date());
        return investmentHistoryUsdDto;
    }
}
