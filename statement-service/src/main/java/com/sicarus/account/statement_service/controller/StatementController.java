package com.sicarus.account.statement_service.controller;

import com.sicarus.account.statement_service.dtos.StatementDto;
import com.sicarus.account.statement_service.dtos.StatementRequestDto;
import com.sicarus.account.statement_service.model.Statement;
import com.sicarus.account.statement_service.model.StatementFormat;
import com.sicarus.account.statement_service.model.StatementStatus;
import com.sicarus.account.statement_service.service.StatementExportService;
import com.sicarus.account.statement_service.service.StatementService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Date;
import java.util.List;

@Tag(name = "Statemente Service Microservice")
@RestController
@RequestMapping("statement-service")
public class StatementController {

    private StatementService statementService;
    private StatementExportService statementExportService;

    public StatementController(StatementService statementService, StatementExportService statementExportService) {
        this.statementService = statementService;
        this.statementExportService = statementExportService;
    }

    @Operation(summary = "Get that returns all statements")
    @GetMapping
    public List<StatementDto> getAllStatements() {
        return statementService.findAll();
    }

    @Operation(summary = "Get that returns a statement by its ID")
    @GetMapping("/{id}")
    public StatementDto getStatementById(@PathVariable Long id) {
        return statementService.findById(id);
    }

    @Operation(summary = "Get that returns all statements of a customerID")
    @GetMapping("/list/{customerId}")
    public List<StatementDto> getAllStatementsById(@PathVariable Long customerId) {
        return statementService.findAllByCustomerId(customerId);
    }

    @Operation(summary = "Post that inserts a new statement based on a StatementRequestDto JSON")
    @PostMapping()
    public StatementDto postStatement(@RequestBody StatementRequestDto statementRequestDto) {
        return statementService.create(statementRequestDto);
    }

    @GetMapping("/export/pdf/{accountId}")
    public ResponseEntity<byte[]> exportUserPdf(@PathVariable Long accountId) throws IOException {
        byte[] pdf = statementExportService.generatePdfForUser(accountId);
        // (Opcional) persistir metadata do Statement aqui antes de retornar

        Statement meta = new Statement(
                null,
                accountId,
                new Date(),                       // createdAt
                StatementFormat.PDF,
                StatementStatus.GENERATED,
                "/files/statement_" + accountId + ".pdf",  // fileUrl
                "statement_" + accountId + ".pdf"          // fileName
        );
        statementExportService.getStatementRepository().save(meta);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=statement_" + accountId + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    @GetMapping("/export/pdf")
    public ResponseEntity<byte[]> exportAllPdf() throws IOException {
        byte[] pdf = statementExportService.generatePdfForAll();
        // (Opcional) persistir metadata do Statement aqui antes de retornar

        Statement meta = new Statement(
                null,
                0L,
                new Date(),                       // createdAt
                StatementFormat.PDF,
                StatementStatus.GENERATED,
                "/files/statement_forAllUsers" + ".pdf",  // fileUrl
                "statement_forAllUsers" + ".pdf"          // fileName
        );
        statementExportService.getStatementRepository().save(meta);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=statement_forAllUsers" + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    @GetMapping("/export/xlsx/{accountId}")
    public ResponseEntity<byte[]> exportUserXlsx(@PathVariable Long accountId) throws IOException {
        byte[] xlsx = statementExportService.generateExcelForUser(accountId);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=statement_" + accountId + ".xlsx")
                .contentType(
                        MediaType.parseMediaType(
                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(xlsx);
    }

    @GetMapping("/export/xlsx")
    public ResponseEntity<byte[]> exportAllXlsx() throws IOException {
        byte[] xlsx = statementExportService.generateExcelForAllUsers();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=statement_forAllUsers" + ".xlsx")
                .contentType(
                        MediaType.parseMediaType(
                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(xlsx);
    }
}
