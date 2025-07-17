import React, { useState, useEffect } from 'react';
import {
    Box, Container, Typography, Paper, Stack, Button,
    TableContainer, Table, TableHead, TableBody, TableRow, TableCell,
    Toolbar, CircularProgress
} from '@mui/material';
import AppAppBar from '../../components/AppAppBar.jsx';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || '';
const accountId = 1;

function InvestmentTable({ investments, loading }) {
    if (loading) return <CircularProgress />;
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Conta</TableCell>
                        <TableCell>Tipo</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Valor Investido</TableCell>
                        <TableCell>Valor Atual</TableCell>
                        <TableCell>Rentabilidade Esperada</TableCell>
                        <TableCell>Início</TableCell>
                        <TableCell>Fim</TableCell>
                        <TableCell>Renovar?</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {investments.map(inv => (
                        <TableRow key={inv.id}>
                            <TableCell>{inv.id}</TableCell>
                            <TableCell>{inv.accountId}</TableCell>
                            <TableCell>{inv.type}</TableCell>
                            <TableCell>{inv.status}</TableCell>
                            <TableCell>{Number(inv.amountInvested).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                            <TableCell>{Number(inv.currentValue).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                            <TableCell>{Number(inv.expectedReturnRate).toLocaleString('pt-BR')}%</TableCell>
                            <TableCell>{new Date(inv.startDate).toLocaleDateString('pt-BR')}</TableCell>
                            <TableCell>{new Date(inv.endDate).toLocaleDateString('pt-BR')}</TableCell>
                            <TableCell>{inv.autoRenew ? 'Sim' : 'Não'}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default function AdminInvestmentsPage() {
    const [investments, setInvestments] = useState([]);
    const [loading, setLoading] = useState(false);

    const authHeader = () => {
        const token = localStorage.getItem('token') || '';
        return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
    };

    useEffect(() => {
        fetchInvestments();
    }, []);

    async function fetchInvestments() {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/investment`, { headers: authHeader() });
            const data = await res.json();
            setInvestments(data);
        } catch (error) {
            console.error('Erro ao buscar investimentos:', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <AppAppBar title="Meus Investimentos" />
            <Toolbar />
            <Container maxWidth="lg" sx={{ py: 4, mt: 5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, mb: 2 }}>
                    <Typography variant="h4">Meus Investimentos (Admin)</Typography>
                    <Button
                        variant="outlined"
                        component={Link}
                        to="/user-investments"
                    >
                        Ir para User
                    </Button>
                </Box>
                <InvestmentTable investments={investments} loading={loading} />
            </Container>
        </Box>
    );
}
