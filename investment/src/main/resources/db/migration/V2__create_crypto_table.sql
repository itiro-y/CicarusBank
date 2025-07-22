CREATE TABLE IF NOT EXISTS crypto (
                                      id                  BIGINT        NOT NULL AUTO_INCREMENT,
                                      account_id          BIGINT        NOT NULL,
                                      type                VARCHAR(50)   NOT NULL,
    status              VARCHAR(50)   NOT NULL,
    amount_invested     DECIMAL(19,8) NOT NULL,
    current_value       DECIMAL(19,8) NOT NULL,
    crypto_multiplier   DECIMAL(19,8) NOT NULL,
    start_date          DATETIME      NOT NULL,
    PRIMARY KEY (id)
    ) ENGINE=InnoDB
    DEFAULT CHARSET=utf8mb4
    COLLATE=utf8mb4_unicode_ci;