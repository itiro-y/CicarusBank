package com.cicarus.card.service;

import com.cicarus.card.dtos.CardDto;
import com.cicarus.card.dtos.CardRequestDto;
import com.cicarus.card.model.Card;
import com.cicarus.card.model.CardStatus;
import com.cicarus.card.repository.CardRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CardService {
    private CardRepository cardRepository;

    public CardService(CardRepository cardRepository) {
        this.cardRepository = cardRepository;
    }

    public List<CardDto> findAll(){
        return cardRepository.findAll().stream()
                                       .map(this::toDto)
                                       .collect(Collectors.toList());
    }

    public CardDto findById(Long id){
        return cardRepository.findById(id).map(this::toDto)
                                          .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Card not found: " + id));
    }

    public List<CardDto> findAllCustomersById(Long id){
        return cardRepository.findAllByCustomerId(id).stream()
                                                     .map(this::toDto)
                                                     .collect(Collectors.toList());
    }

    public CardDto create(CardRequestDto cardRequestDto){
        Card entity = toEntity(cardRequestDto);
        Card saved = cardRepository.save(entity);
        return toDto(saved);
    }

    public ResponseEntity<String> block(Long id){
        if(cardRepository.findById(id).isPresent()){
            Card card = cardRepository.findById(id).get();
            card.setStatus(CardStatus.BLOCKED);
            cardRepository.save(card);
            return ResponseEntity.ok("Card blocked - ID: " + id);
        } else{
            return ResponseEntity.badRequest().body("Card of " + id + " not found");
        }
    }

    public ResponseEntity<String> cancel(Long id){
        if(cardRepository.findById(id).isPresent()){
            Card card = cardRepository.findById(id).get();
            card.setStatus(CardStatus.CANCELLED);
            cardRepository.save(card);
            return ResponseEntity.ok("Card cancelled - ID: " + id);
        } else{
            return ResponseEntity.badRequest().body("Card of " + id + " not found");
        }
    }

    private CardDto toDto(Card c) {
        return new CardDto(
                c.getId(),
                c.getCustomerId(),
                c.getCardNumber(),
                c.getExpiry(),
                c.getCreditLimit(),
                c.getStatus(),
                c.getCardholderName(),
                c.getNetwork(),
                c.getCardType(),
                c.getCvvHash(),
                c.getLast4Digits()
        );
    }

    private Card toEntity(CardRequestDto dto) {
        Card c = new Card();
        c.setCustomerId(dto.customerId());
        c.setCardNumber(dto.cardNumber());
        c.setExpiry(dto.expiry());
        c.setCreditLimit(dto.creditLimit());
        c.setStatus(dto.status());
        c.setCardholderName(dto.cardholderName());
        c.setNetwork(dto.network());
        c.setCardType(dto.cardType());
        c.setCvvHash(dto.cvvHash());
        c.setLast4Digits(dto.last4Digits());
        return c;
    }
}

