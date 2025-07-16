INSERT INTO investment (
    account_id,
    type,
    status,
    amount_invested,
    curren_value,
    expected_return_rate,
    start_date,
    end_date,
    auto_renew
) VALUES
-- Exemplo 1: Renda fixa, ativo
(1, 'RENDA_FIXA', 'ATIVO', 10000.00, 10250.00, 0.0750, '2025-01-01', '2026-01-01', TRUE),

-- Exemplo 2: Ações, resgatado
(2, 'ACOES', 'RESGATADO', 5000.00, 4800.00, 0.1200, '2024-01-01', '2025-01-01', FALSE),

-- Exemplo 3: CDB, ativo
(3, 'FUNDO_IMOBILIARIO', 'ATIVO', 20000.00, 21500.00, 0.0900, '2025-03-15', '2026-03-15', TRUE);
