package com.cicarus.customer_service.controller;

import com.cicarus.customer_service.dto.BriefCustomerDto;
import com.cicarus.customer_service.dto.CustomerRequest;
import com.cicarus.customer_service.dto.CustomerResponse;
import com.cicarus.customer_service.entities.Customer;
import com.cicarus.customer_service.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("customers")
public class CustomerController {

    @Autowired
    private CustomerService service;

    @PostMapping("/create")
    public ResponseEntity<CustomerResponse> create(@RequestBody CustomerRequest request) {
        return ResponseEntity.ok(service.create(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    //Endpoint que retorna BriefCustomerDto (objeto que contem apenas alguns atributos do customer - id, nome e email)
    @GetMapping("/brief/{id}")
    public ResponseEntity<BriefCustomerDto> getBriefCustomerById(@PathVariable Long id) {
        CustomerResponse customer = service.getById(id);
        BriefCustomerDto briefCustomerDto = new BriefCustomerDto(
                customer.getId(),
                customer.getName(),
                customer.getEmail()
        );

        return ResponseEntity.ok(briefCustomerDto);
    }

    @GetMapping
    public ResponseEntity<List<CustomerResponse>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}

