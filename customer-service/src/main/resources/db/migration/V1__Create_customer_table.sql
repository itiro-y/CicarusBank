CREATE TABLE customer (
                          id BIGINT AUTO_INCREMENT PRIMARY KEY,
                          name VARCHAR(255) NOT NULL,
                          document VARCHAR(255) UNIQUE NOT NULL,
                          email VARCHAR(255),
                          birth_date DATE,
                          street VARCHAR(255),
                          city VARCHAR(255),
                          state VARCHAR(255),
                          zip_code VARCHAR(255)
);

CREATE INDEX idx_customer_document ON customer (document);
CREATE INDEX idx_customer_email ON customer (email);