// src/pages/AdminTransactionsPage.jsx
// Pagina de transacoes de um admin
// Mostrar historico de transacoes
// Fazer consulta no historico por meio de filtros
// Botoes para cancelar, reembolsar, aprovar transacoes

import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Stack,
    TextField,
    Button,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Toolbar,
    CircularProgress
} from '@mui/material';
import AppAppBar from '../components/AppAppBar.jsx';

// Base URL da sua API, definida em .env
const API_URL = import.meta.env.VITE_API_URL || '';

export default function AdminTransactionsPage() {
    // filtros
    const [accountFilter, setAccountFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    // dados e loading
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);

    // header de autenticação
    const authHeader = () => {
        const token = localStorage.getItem('token') ||
            'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyIiwicm9sZXMiOiJST0xFX1VTRVIiLCJpYXQiOjE3NTIxODY3NjMsImV4cCI6MTc1MjI3MzE2M30.3k_zF2V013zJvRKxUKdu1Sp8QPux1h-8Wz9ptzzbtKI';
        return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
    };

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/transaction`, { headers: authHeader() });

            // clone permite duas leituras independentes
            const clone = res.clone();

            // leitura para log/erro
            const rawText = await clone.text();
            console.log('Resposta bruta:', rawText);

            // leitura para parse JSON
            const data = await res.json();
            setTransactions(data);
        } catch (error) {
            console.error('Erro ao buscar transações:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTransactionsById = async () => {
        setLoading(true);
        try {
            let url = `${API_URL}/transaction`;
            if (accountFilter && !statusFilter) {
                url = `${API_URL}/transaction/accounts/${accountFilter}`;
            } else if (!accountFilter && statusFilter) {
                url = `${API_URL}/transaction/status/${statusFilter}`;
            } else if (accountFilter && statusFilter) {
                url = `${API_URL}/transaction/accounts-status/${accountFilter}/${statusFilter}`;
            }
            const res = await fetch(url, { headers: authHeader() });
            if (!res.ok) {
                const err = await res.text();
                throw new Error(`Erro ${res.status}: ${err}`);
            }
            const data = await res.json();
            setTransactions(data);
        } catch (error) {
            console.error('Erro ao buscar transações:', error);
        } finally {
            setLoading(false);
        }
    };

    const reverseTransaction = async (transactionID) => {
        setLoading(true);
        try {
            const res = await fetch(
                `${API_URL}/transaction/reversal/${transactionID}`,
                {
                        method: 'PUT',
                        headers: authHeader(),
                        body: null
                    }
            );
            const data = await res.json();
            setTransactions(data);
        } catch (error) {
            console.error('Erro ao buscar transações:', error);
        } finally {
            setLoading(false);
        }
    }

    // efeito inicial
    useEffect(() => {
        fetchTransactions();
    }, []);

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <AppAppBar title="Admin - Transações" />
            <Toolbar />
            <Container maxWidth="lg" sx={{ py: 4, mt: 5 }}>
                <Typography variant="h4" gutterBottom>
                    Histórico de Transações (Admin)
                </Typography>

                {/* Filtros */}
                <Paper sx={{ p: 2, mb: 3 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <TextField
                            label="Conta"
                            value={accountFilter}
                            onChange={e => setAccountFilter(e.target.value)}
                            size="small" />
                        <TextField
                            label="Status"
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value)}
                            size="small" />
                        <Button variant="contained" onClick={fetchTransactionsById}>
                            Filtrar
                        </Button>
                    </Stack>
                </Paper>

                {loading ? (<CircularProgress />) : (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>ID Conta</TableCell>
                                    <TableCell>Tipo</TableCell>
                                    <TableCell>Valor</TableCell>
                                    <TableCell>Data/Hora</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Ações</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {transactions.map(tx => (
                                    <TableRow key={tx.id}>
                                        <TableCell>{tx.id}</TableCell>
                                        <TableCell>{tx.accountId}</TableCell>
                                        <TableCell>{tx.transactionType}</TableCell>
                                        <TableCell>
                                            {tx.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(tx.timestamp).toLocaleString('pt-BR', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit' })}
                                        </TableCell>
                                        <TableCell>{tx.transactionStatus}</TableCell>
                                        <TableCell>
                                            <Stack direction="row" spacing={1}>
                                                {tx.transactionStatus === 'PENDING' && (
                                                    <>
                                                        <Button size="small" onClick={() => handleAction(tx.id, 'approve')}>
                                                            Aprovar
                                                        </Button>
                                                        <Button size="small" onClick={() => handleAction(tx.id, 'cancel')}>
                                                            Cancelar
                                                        </Button>
                                                    </>
                                                )}
                                                {tx.transactionStatus === 'COMPLETED' && (
                                                    <Button size="small" onClick={() =>  reverseTransaction(tx.id)}>
                                                        Reembolsar
                                                    </Button>
                                                )}
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Container>
        </Box>
    );
}
