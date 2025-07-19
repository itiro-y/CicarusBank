-- V2__populate_crypto_table.sql
-- Script para popular a tabela `crypto` com registros de exemplo para account_id 1, 2 e 3

INSERT INTO crypto (
    account_id,
    type,
    status,
    amount_invested,
    current_value,
    crypto_multiplier,
    start_date
) VALUES
      (
          1,
          'BTCUSDT',
          'ACTIVE',
          1000.00,
          0.60,
          1.20,
          '2025-01-10 00:00:00'
      ),
      (
          2,
          'BNBUSDT',
          'ACTIVE',
          1000.00,
          2.10,
          1.05,
          '2025-02-15 00:00:00'
      ),
      (
          3,
          'BTCUSDT',
          'ACTIVE',
          1000.00,
          1350.00,
          1.35,
          '2025-03-20 00:00:00'
      );
