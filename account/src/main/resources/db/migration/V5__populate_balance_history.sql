-- Insere registros de histórico de saldo com valores fixos para a conta de ID 1
INSERT INTO balance_history (account_id, balance, timestamp) VALUES
 (1, 100000.00, '2025-01-01 09:00:00'),
 (1, 102500.00, '2025-02-10 10:30:00'),
 (1,  97500.50, '2025-03-15 11:45:00'),
 (1, 110000.75, '2025-04-20 14:15:00'),
 (1, 105000.25, '2025-05-25 16:50:00');

-- Se houver outras contas, por exemplo ID 2, use valores fixos também:
INSERT INTO balance_history (account_id, balance, timestamp) VALUES
 (2,  50000.00, '2025-01-05 08:20:00'),
 (2,  52500.50, '2025-02-12 12:00:00'),
 (2,  48000.75, '2025-03-18 13:30:00'),
 (2,  60000.00, '2025-04-22 15:10:00'),
 (2,  58000.25, '2025-05-28 17:40:00');