package com.cicarus.investment.service;

import com.cicarus.investment.dtos.investment.InvestmentDto;
import com.cicarus.investment.dtos.investment.InvestmentRequestDto;
import com.cicarus.investment.model.investment.Investment;
import com.cicarus.investment.repository.InvestmentRepository;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class InvestmentService {
    private InvestmentRepository investmentRepository;

    public InvestmentService(InvestmentRepository investmentRepository) {
        this.investmentRepository = investmentRepository;
    }

    public List<InvestmentDto> findAll(){
        return investmentRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public InvestmentDto findById(Long id){
        return investmentRepository.findById(id).map(this::toDto).orElse(null);
    }

    public InvestmentDto create(InvestmentRequestDto requestDto){
        Investment investment = toEntity(requestDto);
        Investment saved = investmentRepository.save(investment);
        return toDto(saved);
    }

    public List<InvestmentDto> findAllByAccountId(Long accountId){
        return investmentRepository.findAllByAccountId(accountId).stream().map(this::toDto).collect(Collectors.toList());
    }

    public InvestmentDto toDto(Investment investment) {
        return new InvestmentDto(
                investment.getId(),
                investment.getAccountId(),
                investment.getType(),
                investment.getStatus(),
                investment.getAmountInvested(),
                investment.getCurrentValue(),
                investment.getExpectedReturnRate(),
                investment.getStartDate(),
                investment.getEndDate(),
                investment.getAutoRenew()
        );
    }

    public Investment toEntity(InvestmentRequestDto request) {
        Investment investment = new Investment();
        investment.setAccountId(request.accountId());
        investment.setType(request.type());
        investment.setStatus(request.status());
        investment.setAmountInvested(request.amountInvested());
        investment.setCurrentValue(request.currentValue());
        investment.setExpectedReturnRate(request.expectedReturnRate());
        investment.setStartDate(new Date());
        investment.setEndDate(request.endDate());
        investment.setAutoRenew(request.autoRenew());
        return investment;
    }
}


