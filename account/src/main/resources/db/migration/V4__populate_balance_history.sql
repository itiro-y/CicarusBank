-- Insere um registro de histórico para cada conta existente
INSERT INTO balance_history (account_id, balance, timestamp)
SELECT id, balance, NOW()
FROM account;