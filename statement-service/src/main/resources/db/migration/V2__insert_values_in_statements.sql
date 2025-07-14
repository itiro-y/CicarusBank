INSERT INTO statements (
    account_id,
    created_at,
    format,
    status,
    file_url,
    file_name
) VALUES
-- Extrato gerado em 2025-06-01 para conta 1
(1, '2025-06-01', 'PDF',       'GENERATED', '/files/statements/1_2025-06.pdf', 'statement_1_2025-06.pdf'),
-- Extrato gerado em 2025-05-01 para conta 1
(1, '2025-05-01', 'CSV',       'GENERATED', '/files/statements/1_2025-05.csv', 'statement_1_2025-05.csv'),

-- Extrato gerado em 2025-06-01 para conta 2
(2, '2025-06-01', 'PDF',       'GENERATED', '/files/statements/2_2025-06.pdf', 'statement_2_2025-06.pdf'),
-- Extrato pendente para conta 2 em 2025-05-01
(2, '2025-05-01', 'PDF',       'PENDING',   '',                             ''),

-- Extrato gerado em 2025-06-01 para conta 3
(3, '2025-06-01', 'CSV',       'GENERATED', '/files/statements/3_2025-06.csv', 'statement_3_2025-06.csv'),
-- Extrato falhado para conta 3 em 2025-04-01
(3, '2025-04-01', 'PDF',       'FAILED',    '',                             '');