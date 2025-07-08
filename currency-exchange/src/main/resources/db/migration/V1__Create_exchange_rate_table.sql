CREATE TABLE exchange_rate (
                               id BIGINT AUTO_INCREMENT PRIMARY KEY,
                               from_currency VARCHAR(10) NOT NULL,
                               to_currency VARCHAR(10) NOT NULL,
                               rate DECIMAL(10, 4) NOT NULL,
                               updated_at DATETIME(6) NOT NULL
);
