-- src/main/resources/db/migration/V3__create_stocks_table.sql
CREATE TABLE IF NOT EXISTS stocks (
                                      id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                      account_id BIGINT,
                                      symbol VARCHAR(50) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    currency VARCHAR(50) NOT NULL,
    setor VARCHAR(100),
    current_price DECIMAL(19,2),
    trade_time DATE,
    volume DECIMAL(19,2),
    market_cap DECIMAL(19,2),
    pe_ratio DECIMAL(10,4),
    dividend_yield DECIMAL(10,4)
    ) ENGINE=InnoDB
    DEFAULT CHARSET=utf8mb4
    COLLATE=utf8mb4_unicode_ci;
