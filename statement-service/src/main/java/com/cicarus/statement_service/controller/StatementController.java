package com.cicarus.statement_service.controller;

import com.cicarus.statement_service.dtos.StatementDto;
import com.cicarus.statement_service.service.StatementService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "Statemente Service Microservice")
@RestController
@RequestMapping("statement-service")
public class StatementController {

    private StatementService statementService;

    public StatementController(StatementService statementService) {
        this.statementService = statementService;
    }

    @Operation(summary = "Get that returns all statements")
    @GetMapping
    public List<StatementDto> getAllStatements(){
        return statementService.findAll();
    }

    @Operation(summary = "Get that returns a statement by its ID")
    @GetMapping("/{id}")
    public StatementDto getStatementById(@PathVariable Long id){
        return statementService.findById(id);
    }

    @Operation(summary = "Get that returns all statements of a customerID")
    @GetMapping("/list/{customerId}")
    public List<StatementDto> getAllStatementsById(@PathVariable Long customerId){
        return statementService.findAllByCustomerId(customerId);
    }


}
