CREATE TABLE cards (
                       id               BIGINT        NOT NULL AUTO_INCREMENT,
                       customer_id      BIGINT        NOT NULL,
                       card_number      VARCHAR(19)   NOT NULL,
                       expiry           DATE          NOT NULL,
                       credit_limit     DECIMAL(15,2) NOT NULL,
                       status           VARCHAR(20)   NOT NULL,
                       cardholder_name  VARCHAR(100)  NOT NULL,
                       network          VARCHAR(20)   NOT NULL,
                       card_type        VARCHAR(20)   NOT NULL,
                       cvv_hash         VARCHAR(255)  NOT NULL,
                       last_4_digits    CHAR(4)       NOT NULL,
                       PRIMARY KEY (id)
);