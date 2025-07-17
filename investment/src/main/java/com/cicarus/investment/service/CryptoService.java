package com.cicarus.investment.service;

import com.cicarus.investment.dtos.CryptoDto;
import com.cicarus.investment.dtos.CryptoRequestDto;
import com.cicarus.investment.dtos.InvestmentDto;
import com.cicarus.investment.dtos.InvestmentRequestDto;
import com.cicarus.investment.model.Crypto;
import com.cicarus.investment.model.Investment;
import com.cicarus.investment.repository.CryptoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CryptoService {
    private CryptoRepository cryptoRepository;

    public CryptoService(CryptoRepository cryptoRepository) {
        this.cryptoRepository = cryptoRepository;
    }

    public List<CryptoDto> findAll(){
        return cryptoRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public CryptoDto findById(Long id){
        return cryptoRepository.findById(id).map(this::toDto).orElse(null);
    }

    public CryptoDto create(CryptoRequestDto requestDto){
        Crypto crypto = toEntity(requestDto);
        Crypto saved = cryptoRepository.save(crypto);
        return toDto(saved);
    }

    public List<CryptoDto> findAllByAccountId(Long accountId){
        return cryptoRepository.findAllByAccountId(accountId).stream().map(this::toDto).collect(Collectors.toList());
    }

    public CryptoDto toDto(Crypto crypto) {
        return new CryptoDto(
                crypto.getId(),
                crypto.getAccountId(),
                crypto.getType(),
                crypto.getStatus(),
                crypto.getAmountInvested(),
                crypto.getCurrentValue(),
                crypto.getCryptoMultiplier(),
                crypto.getStartDate()
        );
    }

    public Crypto toEntity(CryptoRequestDto request) {
        Crypto crypto = new Crypto();
        crypto.setAccountId(request.accountId());
        crypto.setType(request.type());
        crypto.setStatus(request.status());
        crypto.setAmountInvested(request.amountInvested());
        crypto.setCurrentValue(request.currentValue());
        crypto.setCryptoMultiplier(request.cryptoMultiplier());
        crypto.setStartDate(request.startDate());
        return crypto;
    }
}
