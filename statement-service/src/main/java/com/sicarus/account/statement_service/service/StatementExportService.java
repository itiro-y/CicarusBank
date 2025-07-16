package com.sicarus.account.statement_service.service;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.sicarus.account.statement_service.clients.TransactionClient;
import com.sicarus.account.statement_service.dtos.TransactionDto;

import com.sicarus.account.statement_service.repository.StatementRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
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

    public byte[] generateExcelForUser(Long accountId) throws IOException {
        // 1) buscar transações via Feign
        List<TransactionDto> txs = transactionClient.getAllTransactionsByAccountId(accountId);

        try (Workbook wb = new XSSFWorkbook();
             ByteArrayOutputStream baos = new ByteArrayOutputStream()) {

            Sheet sheet = wb.createSheet("Extrato");
            // 2) cabeçalhos
            String[] cols = {"ID", "Conta", "Tipo", "Valor", "Data / Hora", "Status"};
            Row header = sheet.createRow(0);
            for (int i = 0; i < cols.length; i++) {
                header.createCell(i).setCellValue(cols[i]);
            }

            // 3) estilo de data/hora
            CreationHelper createHelper = wb.getCreationHelper();
            CellStyle dateCellStyle = wb.createCellStyle();
            dateCellStyle.setDataFormat(
                    createHelper.createDataFormat().getFormat("yyyy-mm-dd hh:mm:ss")
            );

            // 4) linhas de dados
            int rowIdx = 1;
            for (TransactionDto tx : txs) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(tx.id());
                row.createCell(1).setCellValue(tx.accountId());
                row.createCell(2).setCellValue(tx.transactionType().name());
                row.createCell(3).setCellValue(tx.amount().doubleValue());

                org.apache.poi.ss.usermodel.Cell dateCell = row.createCell(4);
                dateCell.setCellValue(tx.timestamp());
                dateCell.setCellStyle(dateCellStyle);

                row.createCell(5).setCellValue(tx.transactionStatus().name());
            }

            // 5) auto‐ajustar colunas
            for (int i = 0; i < cols.length; i++) {
                sheet.autoSizeColumn(i);
            }

            // 6) gravar e retornar
            wb.write(baos);
            return baos.toByteArray();
        }
    }

    public byte[] generateExcelForAllUsers() throws IOException {
        // 1) buscar transações via Feign
        List<TransactionDto> txs = transactionClient.getAllTransactions();

        try (Workbook wb = new XSSFWorkbook();
             ByteArrayOutputStream baos = new ByteArrayOutputStream()) {

            Sheet sheet = wb.createSheet("Extrato");
            // 2) cabeçalhos
            String[] cols = {"ID", "Conta", "Tipo", "Valor", "Data / Hora", "Status"};
            Row header = sheet.createRow(0);
            for (int i = 0; i < cols.length; i++) {
                header.createCell(i).setCellValue(cols[i]);
            }

            // 3) estilo de data/hora
            CreationHelper createHelper = wb.getCreationHelper();
            CellStyle dateCellStyle = wb.createCellStyle();
            dateCellStyle.setDataFormat(
                    createHelper.createDataFormat().getFormat("yyyy-mm-dd hh:mm:ss")
            );

            // 4) linhas de dados
            int rowIdx = 1;
            for (TransactionDto tx : txs) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(tx.id());
                row.createCell(1).setCellValue(tx.accountId());
                row.createCell(2).setCellValue(tx.transactionType().name());
                row.createCell(3).setCellValue(tx.amount().doubleValue());

                org.apache.poi.ss.usermodel.Cell dateCell = row.createCell(4);
                dateCell.setCellValue(tx.timestamp());
                dateCell.setCellStyle(dateCellStyle);

                row.createCell(5).setCellValue(tx.transactionStatus().name());
            }

            // 5) auto‐ajustar colunas
            for (int i = 0; i < cols.length; i++) {
                sheet.autoSizeColumn(i);
            }

            // 6) gravar e retornar
            wb.write(baos);
            return baos.toByteArray();
        }
    }
}