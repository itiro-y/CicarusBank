CREATE TABLE transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    account_id BIGINT,
    transaction_type VARCHAR(50),
    amount DOUBLE,
    timestamp DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=latin1;