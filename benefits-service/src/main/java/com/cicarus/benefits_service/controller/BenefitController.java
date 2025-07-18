package com.cicarus.benefits_service.controller;

import com.cicarus.benefits_service.dto.BenefitRequest;
import com.cicarus.benefits_service.dto.BenefitResponse;
import com.cicarus.benefits_service.dto.CustomerBenefitRequest;
import com.cicarus.benefits_service.dto.CustomerBenefitResponse;
import com.cicarus.benefits_service.service.BenefitService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Benefits Endpoint")
@RestController
@RequestMapping("benefits")
public class BenefitController {

    @Autowired
    private BenefitService service;

    

    
    @Operation(summary = "Cria um novo benefício", description = "Cria um novo tipo de benefício disponível no sistema.")
    @PostMapping("/create")
    public ResponseEntity<BenefitResponse> createBenefit(@RequestBody BenefitRequest request) {
        return ResponseEntity.ok(service.createBenefit(request));
    }

    
    @Operation(summary = "Busca um benefício por ID", description = "Retorna os detalhes de um benefício específico com base no seu ID.")
    @GetMapping("/{id}")
    public ResponseEntity<BenefitResponse> getBenefitById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getBenefitById(id));
    }
    
    @Operation(summary = "Lista todos os benefícios", description = "Retorna uma lista de todos os benefícios registrados no sistema.")
    @GetMapping("/list/all")
    public ResponseEntity<List<BenefitResponse>> getAllBenefits() {
        return ResponseEntity.ok(service.getAllBenefits());
    }

    
    @Operation(summary = "Lista apenas benefícios ativos", description = "Retorna uma lista de benefícios que estão atualmente ativos no sistema.")
    @GetMapping("/list/active")
    public ResponseEntity<List<BenefitResponse>> getActiveBenefits() {
        return ResponseEntity.ok(service.getActiveBenefits());
    }

    
    @Operation(summary = "Atualiza um benefício existente", description = "Atualiza as informações de um benefício com base no seu ID.")
    @PutMapping("/{id}")
    public ResponseEntity<BenefitResponse> updateBenefit(@PathVariable Long id, @RequestBody BenefitRequest request) {
        return ResponseEntity.ok(service.updateBenefit(id, request));
    }

    
    @Operation(summary = "Deleta um benefício por ID", description = "Remove um benefício do sistema com base no seu ID.")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBenefit(@PathVariable Long id) {
        service.deleteBenefit(id);
        return ResponseEntity.noContent().build();
    }

    

    
    @Operation(summary = "Ativa um benefício para um cliente", description = "Associa e ativa um benefício para um cliente específico.")
    @PostMapping("/customer-activate")
    public ResponseEntity<CustomerBenefitResponse> activateBenefitForCustomer(@RequestBody CustomerBenefitRequest request) {
        return ResponseEntity.ok(service.activateBenefitForCustomer(request));
    }
    
    @Operation(summary = "Desativa um benefício de um cliente", description = "Desativa um benefício que um cliente possui, sem removê-lo completamente.")
    @PutMapping("/customer-deactivate/{customerBenefitId}")
    public ResponseEntity<CustomerBenefitResponse> deactivateBenefitForCustomer(@PathVariable Long customerBenefitId) {
        return ResponseEntity.ok(service.deactivateBenefitForCustomer(customerBenefitId));
    }

    
    @Operation(summary = "Lista todos os benefícios de um cliente", description = "Retorna todos os benefícios (ativos e inativos) associados a um cliente.")
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<CustomerBenefitResponse>> getCustomerBenefits(@PathVariable Long customerId) {
        return ResponseEntity.ok(service.getCustomerBenefits(customerId));
    }

    
    @Operation(summary = "Lista os benefícios ativos de um cliente", description = "Retorna apenas os benefícios atualmente ativos para um cliente.")
    @GetMapping("/customer/{customerId}/active")
    public ResponseEntity<List<CustomerBenefitResponse>> getCustomerActiveBenefits(@PathVariable Long customerId) {
        return ResponseEntity.ok(service.getCustomerActiveBenefits(customerId));
    }
}