package com.cicarus.statement_service.model;

import jakarta.persistence.*;

import java.util.Date;
import java.util.Objects;

@Entity
@Table(name = "statements")
public class Statement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "account_id")
    private Long accountId;

    @Column
    @Temporal(TemporalType.DATE)
    private Date createdAt;

    @Column
    @Enumerated(EnumType.STRING)
    private StatementFormat format;

    @Column
    @Enumerated(EnumType.STRING)
    private StatementStatus status;

    @Column(name = "file_url")
    private String fileUrl;

    @Column(name = "file_name")
    private String fileName;

    public Statement() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getAccountId() {
        return accountId;
    }

    public void setAccountId(Long accountId) {
        this.accountId = accountId;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public StatementFormat getFormat() {
        return format;
    }

    public void setFormat(StatementFormat format) {
        this.format = format;
    }

    public StatementStatus getStatus() {
        return status;
    }

    public void setStatus(StatementStatus status) {
        this.status = status;
    }

    public String getFileUrl() {
        return fileUrl;
    }

    public void setFileUrl(String fileUrl) {
        this.fileUrl = fileUrl;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Statement statement = (Statement) o;
        return Objects.equals(id, statement.id) && Objects.equals(accountId, statement.accountId) && Objects.equals(createdAt, statement.createdAt) && format == statement.format && status == statement.status && Objects.equals(fileUrl, statement.fileUrl) && Objects.equals(fileName, statement.fileName);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, accountId, createdAt, format, status, fileUrl, fileName);
    }

    @Override
    public String toString() {
        return "Statement{" +
                "id=" + id +
                ", accountId=" + accountId +
                ", createdAt=" + createdAt +
                ", format=" + format +
                ", status=" + status +
                ", fileUrl='" + fileUrl + '\'' +
                ", fileName='" + fileName + '\'' +
                '}';
    }
}
