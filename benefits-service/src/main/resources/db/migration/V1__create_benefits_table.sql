CREATE TABLE benefits (
                          id BIGINT AUTO_INCREMENT PRIMARY KEY,
                          name VARCHAR(255) NOT NULL UNIQUE,
                          description VARCHAR(1000) NOT NULL,
                          type VARCHAR(50) NOT NULL,
                          value DECIMAL(19, 2),
                          valid_until DATE,
                          active BOOLEAN NOT NULL
);

CREATE TABLE customer_benefits (
                                   id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                   customer_id BIGINT NOT NULL,
                                   benefit_id BIGINT NOT NULL,
                                   activation_date DATE,
                                   expiration_date DATE,
                                   activated BOOLEAN NOT NULL,
                                   FOREIGN KEY (benefit_id) REFERENCES benefits(id)
);