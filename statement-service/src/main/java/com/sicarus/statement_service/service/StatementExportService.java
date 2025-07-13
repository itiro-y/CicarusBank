package com.sicarus.statement_service.service;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.sicarus.statement_service.clients.TransactionClient;
import com.sicarus.statement_service.dtos.TransactionDto;

import com.sicarus.statement_service.repository.StatementRepository;
import org.antlr.v4.runtime.misc.LogManager;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.List;

@Service
public class StatementExportService {
    private StatementRepository statementRepository;
    private TransactionClient transactionClient;

    public StatementExportService(StatementRepository statementRepository, TransactionClient transactionClient) {
        this.statementRepository = statementRepository;
        this.transactionClient = transactionClient;
    }

    public byte[] generatePdfForUser(Long accountId) throws IOException {
        // 1) Buscar transações via Feign
        List<TransactionDto> txs = transactionClient.getAllTransactionsByAccountId(accountId);

        // 2) Configurar formatação de data
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            // Título
            document.add(new Paragraph("Extrato da conta " + accountId)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontSize(18));

            // Definição da tabela com 6 colunas
            float[] columnWidths = {1, 2, 2, 2, 3, 2};
            Table table = new Table(columnWidths);
            table.setWidth(UnitValue.createPercentValue(100));

            // Cabeçalhos
            table.addHeaderCell(new Cell().add(new Paragraph("ID")));
            table.addHeaderCell(new Cell().add(new Paragraph("Conta")));
            table.addHeaderCell(new Cell().add(new Paragraph("Tipo")));
            table.addHeaderCell(new Cell().add(new Paragraph("Valor")));
            table.addHeaderCell(new Cell().add(new Paragraph("Data / Hora")));
            table.addHeaderCell(new Cell().add(new Paragraph("Status")));

            // Linhas de dados
            for (TransactionDto tx : txs) {
                table.addCell(tx.id().toString());
                table.addCell(tx.accountId().toString());
                table.addCell(tx.transactionType().name());
                table.addCell(tx.amount().toString());
                table.addCell(sdf.format(tx.timestamp()));
                table.addCell(tx.transactionStatus().name());
            }

            document.add(table);
            document.close();
            return baos.toByteArray();
        }
    }

    public byte[] generatePdfForAll() throws IOException {
        // 1) Buscar transações via Feign
        List<TransactionDto> txs = transactionClient.getAllTransactions();

        // 2) Configurar formatação de data
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            // Título
            document.add(new Paragraph("Extrato de todas as contas ")
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontSize(18));

            // Definição da tabela com 6 colunas
            float[] columnWidths = {1, 2, 2, 2, 3, 2};
            Table table = new Table(columnWidths);
            table.setWidth(UnitValue.createPercentValue(100));

            // Cabeçalhos
            table.addHeaderCell(new Cell().add(new Paragraph("ID")));
            table.addHeaderCell(new Cell().add(new Paragraph("Conta")));
            table.addHeaderCell(new Cell().add(new Paragraph("Tipo")));
            table.addHeaderCell(new Cell().add(new Paragraph("Valor")));
            table.addHeaderCell(new Cell().add(new Paragraph("Data / Hora")));
            table.addHeaderCell(new Cell().add(new Paragraph("Status")));

            // Linhas de dados
            for (TransactionDto tx : txs) {
                table.addCell(tx.id().toString());
                table.addCell(tx.accountId().toString());
                table.addCell(tx.transactionType().name());
                table.addCell(tx.amount().toString());
                table.addCell(sdf.format(tx.timestamp()));
                table.addCell(tx.transactionStatus().name());
            }

            document.add(table);
            document.close();
            return baos.toByteArray();
        }
    }

    public StatementRepository getStatementRepository() {
        return statementRepository;
    }
}

//Long id,
//Long accountId,
//TransactionType transactionType,
//BigDecimal amount,
//Date timestamp,
//TransactionStatus transactionStatus