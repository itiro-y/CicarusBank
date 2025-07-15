CREATE TABLE statements (
                           id          BIGINT        NOT NULL AUTO_INCREMENT,
                           account_id  BIGINT        NOT NULL,
                           created_at  DATE          NOT NULL,
                           format      VARCHAR(20)   NOT NULL,
                           status      VARCHAR(20)   NOT NULL,
                           file_url    VARCHAR(255),
                           file_name   VARCHAR(255),
                           PRIMARY KEY (id)
);