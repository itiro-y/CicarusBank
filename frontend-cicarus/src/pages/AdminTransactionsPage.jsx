import React, { useState, useEffect } from 'react';
import {
    Box, Container, Typography, Paper, Stack, TextField, Button, TableContainer,
    Table, TableHead, TableBody, TableRow, TableCell, Toolbar, CircularProgress,
    Select, MenuItem, FormControl, InputLabel, Chip, IconButton
} from '@mui/material';
import {
    NorthEast, SouthWest, ReceiptLong, CheckCircleOutline, HourglassTop,
    ErrorOutline, Check, Cancel, History, CleaningServices
} from '@mui/icons-material';
import { RiRefund2Line } from "react-icons/ri";
import AppAppBar from '../components/AppAppBar.jsx';
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || '';

// --- Componentes Auxiliares ---

function StatusChip({ status }) {
    let color = 'default', label = status, icon = null;
    switch (status) {
        case 'COMPLETED': color = 'success'; label = 'Completa'; icon = <CheckCircleOutline />; break;
        case 'PENDING': color = 'warning'; label = 'Pendente'; icon = <HourglassTop />; break;
        case 'FAILED': color = 'error'; label = 'Falhou'; icon = <ErrorOutline />; break;
        case 'REVERSED': color = 'info'; label = 'Reembolsada'; icon = <History />; break;
        case 'CANCELLED': color = 'default'; label = 'Cancelada'; icon = <Cancel />; break;
    }
    return <Chip icon={icon} label={label} color={color} size="small" variant="outlined" />;
}

function getTransactionDetails(tx) {
    switch (tx.transactionType) {
        case 'DEPOSIT': return { icon: <SouthWest color="success" /> };
        case 'WITHDRAWAL': return { icon: <NorthEast color="error" /> };
        case 'TRANSFER': return { icon: <NorthEast /> };
        case 'PAYMENT': return { icon: <ReceiptLong color="error" /> };
        default: return { icon: null };
    }
}

// --- Página Principal do Admin ---

export default function AdminTransactionsPage() {
    const [filters, setFilters] = useState({ accountId: '', status: '' });
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);

    const authHeader = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token') || ''}` });

    // LÓGICA DE BUSCA CORRIGIDA
    const fetchTransactions = async (currentFilters) => {
        setLoading(true);
        let endpoint = `${API_URL}/transaction`; // Endpoint padrão

        const { accountId, status } = currentFilters;

        // Constrói a URL com base nos filtros (usando parâmetros de rota)
        if (accountId && status) {
            endpoint = `${API_URL}/transaction/accounts-status/${accountId}/${status}`;
        } else if (accountId) {
            endpoint = `${API_URL}/transaction/accounts/${accountId}`;
        } else if (status) {
            endpoint = `${API_URL}/transaction/status/${status}`;
        }

        try {
            const res = await fetch(endpoint, { headers: authHeader() });
            if (!res.ok) throw new Error(`Erro ${res.status}: ${await res.text()}`);

            const data = await res.json();
            setTransactions(Array.isArray(data) ? data : [data]);

        } catch (error) {
            console.error('Erro ao buscar transações:', error);
            setTransactions([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (transactionId, action) => {
        const endpointMap = {
            approve: { url: `/transaction/approve/${transactionId}`, method: 'PUT' },
            cancel: { url: `/transaction/cancel/${transactionId}`, method: 'PUT' },
            reverse: { url: `/transaction/reversal/${transactionId}`, method: 'POST' }
        };

        const actionConfig = endpointMap[action];
        if (!actionConfig) return;

        setLoading(true);
        try {
            const res = await fetch(`${API_URL}${actionConfig.url}`, {
                method: actionConfig.method,
                headers: authHeader()
            });
            if (!res.ok) throw new Error(`Erro ao ${action} transação: ${await res.text()}`);

            await fetchTransactions(filters);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleApplyFilters = () => {
        fetchTransactions(filters);
    };

    const handleClearFilters = () => {
        const clearedFilters = { accountId: '', status: '' };
        setFilters(clearedFilters);
        fetchTransactions(clearedFilters);
    };

    async function handleExport(format) {
        // A exportação pode precisar de ajuste dependendo de como a API espera os filtros
        // Esta implementação assume que o serviço de exportação não aceita filtros
        const url = new URL(`${API_URL}/statement-service/export/${format}`);

        try {
            const res = await fetch(url.toString(), { headers: authHeader() });
            if (!res.ok) throw new Error(`Erro ${res.status}`);
            const blob = await res.blob();
            const fileUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = fileUrl;
            link.setAttribute('download', `transacoes_${Date.now()}.${format}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(fileUrl);
        } catch (error) {
            console.error(`Erro ao exportar ${format.toUpperCase()}:`, error);
        }
    }

    useEffect(() => {
        fetchTransactions({ accountId: '', status: '' }); // Carga inicial sem filtros
    }, []);

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <AppAppBar title="Admin - Transações" />
            <Toolbar />
            <Container maxWidth="xl" sx={{ py: 4, mt: 5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h4" gutterBottom>Painel de Transações</Typography>
                    <Button variant="outlined" component={Link} to="/user-transactions">Ver Página do Usuário</Button>
                </Box>

                <Paper sx={{ p: 2, mb: 3 }}>
                    <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                        <Stack direction="row" spacing={1.5} alignItems="center">
                            <Typography variant="subtitle2">Filtros:</Typography>
                            <TextField name="accountId" label="ID da Conta" value={filters.accountId} onChange={handleFilterChange} size="small" />
                            <FormControl size="small" sx={{ minWidth: 150 }}>
                                <InputLabel>Status</InputLabel>
                                <Select name="status" value={filters.status} label="Status" onChange={handleFilterChange}>
                                    <MenuItem value=""><em>Todos</em></MenuItem>
                                    <MenuItem value="COMPLETED">Completa</MenuItem>
                                    <MenuItem value="PENDING">Pendente</MenuItem>
                                    <MenuItem value="FAILED">Falhou</MenuItem>
                                    <MenuItem value="CANCELLED">Cancelada</MenuItem>
                                    <MenuItem value="REVERSED">Reembolsada</MenuItem>
                                </Select>
                            </FormControl>
                            <Button variant="contained" onClick={handleApplyFilters}>Filtrar</Button>
                            <Button variant="text" startIcon={<CleaningServices />} onClick={handleClearFilters}>Limpar</Button>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                            <Button variant="outlined" onClick={() => handleExport('pdf')}>Exportar PDF</Button>
                            <Button variant="outlined" onClick={() => handleExport('xlsx')}>Exportar Excel</Button>
                        </Stack>
                    </Stack>
                </Paper>

                {loading ? <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box> : (
                    <TableContainer component={Paper}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ width: '1%' }}></TableCell>
                                    <TableCell>ID Trans.</TableCell>
                                    <TableCell>ID Conta</TableCell>
                                    <TableCell>Tipo</TableCell>
                                    <TableCell>Valor</TableCell>
                                    <TableCell>Data/Hora</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell align="center">Ações</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {transactions.map(tx => {
                                    const { icon } = getTransactionDetails(tx);
                                    return (
                                        <TableRow key={tx.id} hover>
                                            <TableCell>{icon}</TableCell>
                                            <TableCell>{tx.id}</TableCell>
                                            <TableCell>{tx.accountId}</TableCell>
                                            <TableCell>{tx.transactionType}</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>
                                                {tx.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                            </TableCell>
                                            <TableCell>{new Date(tx.timestamp).toLocaleString('pt-BR')}</TableCell>
                                            <TableCell><StatusChip status={tx.transactionStatus} /></TableCell>
                                            <TableCell align="center">
                                                {tx.transactionStatus === 'PENDING' && (
                                                    <>
                                                        <IconButton color="success" onClick={() => handleAction(tx.id, 'approve')} title="Aprovar"><Check /></IconButton>
                                                        <IconButton color="error" onClick={() => handleAction(tx.id, 'cancel')} title="Cancelar"><Cancel /></IconButton>
                                                    </>
                                                )}
                                                {tx.transactionStatus === 'COMPLETED' && (
                                                    <IconButton color="warning" onClick={() => handleAction(tx.id, 'reverse')} title="Reembolsar"><RiRefund2Line /></IconButton>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Container>
        </Box>
    );
}