package com.cicarus.customer_service.controller;

import com.cicarus.customer_service.dto.CustomerRequest;
import com.cicarus.customer_service.dto.CustomerResponse;
import com.cicarus.customer_service.entities.Customer;
import com.cicarus.customer_service.service.CustomerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Customer Endpoint")
@RestController
@RequestMapping("customers")
public class CustomerController {

    @Autowired
    private CustomerService service;

    @Operation(summary = "Cria um novo cliente", description = "Cria um novo registro de cliente no sistema.")
    @PostMapping("/create")
    public ResponseEntity<CustomerResponse> create(@RequestBody CustomerRequest request) {
        return ResponseEntity.ok(service.create(request));
    }

    @Operation(summary = "Busca um cliente por ID", description = "Retorna os detalhes de um cliente específico com base no seu ID.")
    @GetMapping("/{id}")
    public ResponseEntity<CustomerResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @Operation(summary = "Lista todos os clientes", description = "Retorna uma lista de todos os clientes registrados no sistema.")
    @GetMapping
    public ResponseEntity<List<CustomerResponse>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @Operation(summary = "Deleta um cliente por ID", description = "Remove um cliente do sistema com base no seu ID.")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}

