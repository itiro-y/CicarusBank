-- Cria a nova tabela de histórico de saldos
CREATE TABLE IF NOT EXISTS balance_history (
                                               id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                               account_id BIGINT NOT NULL,
                                               balance    DECIMAL(19,2)    NOT NULL,
    timestamp  DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_balance_history_account
    FOREIGN KEY (account_id)
    REFERENCES account(id)
    );