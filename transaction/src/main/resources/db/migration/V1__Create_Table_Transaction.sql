CREATE TABLE transaction (
                             id BIGINT AUTO_INCREMENT PRIMARY KEY,
                             account_id BIGINT NOT NULL,
                             transaction_type VARCHAR(50) NOT NULL,
                             amount DOUBLE NOT NULL,
                             timestamp DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;