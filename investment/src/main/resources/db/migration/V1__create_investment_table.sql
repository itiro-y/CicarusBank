CREATE TABLE investment (
                            id BIGINT PRIMARY KEY AUTO_INCREMENT,
                            account_id BIGINT NOT NULL,
                            type VARCHAR(50) NOT NULL,
                            status VARCHAR(50) NOT NULL,
                            amount_invested DECIMAL(19, 2) NOT NULL,
                            curren_value DECIMAL(19, 2),
                            expected_return_rate DECIMAL(5, 4),
                            start_date DATE NOT NULL,
                            end_date DATE,
                            auto_renew BOOLEAN DEFAULT FALSE
);
