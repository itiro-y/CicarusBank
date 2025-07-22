package com.cicarus.card.controller;

import com.cicarus.card.dtos.CardDto;
import com.cicarus.card.dtos.CardLimitRequestDto;
import com.cicarus.card.dtos.CardRequestDto;
import com.cicarus.card.dtos.CardStatusRequestDto; 
import com.cicarus.card.service.CardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = " Card Endpoint")
@RestController
@RequestMapping("/card")
public class CardController {
    private CardService cardService;

    public CardController(CardService cardService) {
        this.cardService = cardService;
    }

    @Operation(summary = "Get that returns a list of all cards in DB")
    @GetMapping()
    public List<CardDto> getAllCards(){
        return cardService.findAll();
    }

    @Operation(summary = "Get that returns a Card based on its ID")
    @GetMapping("/{id}")
    public CardDto getCardById(@PathVariable Long id){
        return cardService.findById(id);
    }

    @Operation(summary = "Get that returns a Card based on its ID")
    @GetMapping("/list/{id}")
    public List<CardDto> getCardsById(@PathVariable Long id){
        return cardService.findAllCustomersById(id);
    }

    @Operation(summary = "Post that creates a Card based on a CardRequestDTO JSON")
    @PostMapping
    public CardDto createCard(@RequestBody CardRequestDto cardRequestDto){
        return cardService.create(cardRequestDto);
    }

    @Operation(summary = "Put that sets a Card Status to CANCELLED")
    @PutMapping("/cancel/{id}")
    public ResponseEntity<String> cancelCard(@PathVariable Long id){
        return cardService.cancel(id);
    }

    @Operation(summary = "Put that sets a Card Status to BLOCKED")
    @PutMapping("/block/{id}")
    public ResponseEntity<String> blockCard(@PathVariable Long id){
        return cardService.block(id);
    }

    @Operation(summary = "Put that sets a Card Status to ACTIVE")
    @PutMapping("/activate/{id}")
    public ResponseEntity<String> activateCard(@PathVariable Long id){
        return cardService.activate(id);
    }



    @Operation(summary = "Altera o status de um cartão (ex: ACTIVE, BLOCKED, CANCELED)")
    @PostMapping("/status")
    public ResponseEntity<String> updateCardStatus(@RequestBody CardStatusRequestDto statusRequest) {
        return cardService.updateStatus(statusRequest.cardId(), statusRequest.newStatus());
    }

    @Operation(summary = "Altera o limite de um cartão")
    @PutMapping("/limit")
    public ResponseEntity<String> updateCardLimit(@RequestBody CardLimitRequestDto limitRequest) {
        return cardService.updateLimit(limitRequest.cardId(), limitRequest.newLimit());
    }

    @Operation(summary = "Deleta um cartão pelo ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCard(@PathVariable Long id) {
        return cardService.delete(id);
    }
}