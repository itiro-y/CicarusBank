import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Container, Grid, Paper, Toolbar, Typography, List, ListItem,
    ListItemAvatar, Avatar, ListItemText, Divider, CircularProgress,
    Button, Chip, Tooltip as MuiTooltip, Snackbar, Alert
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import {
    PeopleAlt, Receipt, HourglassTop, CheckCircleOutline,
    HighlightOff, MonetizationOn, TrendingUp
} from '@mui/icons-material';
import SummaryCard from '../components/SummaryCard';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8765';

export default function AdminDashboard() {
    const [stats, setStats] = useState({ users: 0, transactions: 0, loans: 0, totalVolume: 0 });
    const [pendingLoans, setPendingLoans] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [allTransactions, setAllTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

    const fetchAdminData = useCallback(async () => {
        setLoading(true);
        setError(null);
        const authHeader = { Authorization: `Bearer ${localStorage.getItem('token')}` };

        try {
            const [loansRes, usersRes, transactionsRes] = await Promise.all([
                fetch(`${API_URL}/loan/all`, { headers: authHeader }),
                fetch(`${API_URL}/customers/list`, { headers: authHeader }),
                fetch(`${API_URL}/transaction`, { headers: authHeader }),
            ]);

            if (!loansRes.ok || !usersRes.ok || !transactionsRes.ok) {
                throw new Error('Falha ao buscar dados do admin.');
            }

            const loansData = await loansRes.json();
            const usersData = await usersRes.json();
            const transactionsData = await transactionsRes.json();

            const pending = loansData.filter(loan => loan.status === 'PENDING');
            const totalVolume = transactionsData.reduce((acc, tx) => acc + (tx.amount || 0), 0);

            setPendingLoans(pending);
            setAllUsers(usersData);
            setAllTransactions(transactionsData);
            setStats({
                users: usersData.length,
                transactions: transactionsData.length,
                loans: loansData.length,
                totalVolume: totalVolume,
            });

        } catch (err) {
            console.error("Erro ao buscar dados do admin:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAdminData();
    }, [fetchAdminData]);

    const handleLoanAction = async (loanId, action) => {
        const authHeader = { Authorization: `Bearer ${localStorage.getItem('token')}` };
        const endpoint = action === 'approve'
            ? `${API_URL}/loan/${loanId}/approve`
            : `${API_URL}/loan/${loanId}/reject`;

        try {
            const res = await fetch(endpoint, { method: 'PUT', headers: authHeader });
            if (!res.ok) {
                throw new Error(`Falha ao ${action === 'approve' ? 'aprovar' : 'rejeitar'} o empréstimo.`);
            }
            setNotification({ open: true, message: `Empréstimo ${action === 'approve' ? 'aprovado' : 'rejeitado'} com sucesso!`, severity: 'success' });
            fetchAdminData(); // Re-fetch data to update the view
        } catch (err) {
            console.error(err);
            setNotification({ open: true, message: err.message, severity: 'error' });
        }
    };

    const handleCloseNotification = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setNotification({ ...notification, open: false });
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
                <Typography ml={2}>Carregando painel administrativo...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Typography color="error">Erro: {error}</Typography>
            </Box>
        );
    }

    const userColumns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'name', headerName: 'Nome', width: 200 },
        { field: 'email', headerName: 'Email', width: 250 },
        { field: 'document', headerName: 'Documento', width: 150 },
    ];

    const transactionColumns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'accountId', headerName: 'ID da Conta', width: 120 },
        { field: 'transactionType', headerName: 'Tipo', width: 120 },
        { field: 'amount', headerName: 'Valor', width: 120, type: 'number', valueFormatter: ({ value }) => `R$ ${value.toFixed(2)}` },
        { field: 'transactionStatus', headerName: 'Status', width: 120, renderCell: (params) => (
            <Chip label={params.value} color={params.value === 'COMPLETED' ? 'success' : 'warning'} size="small" />
        )},
        { field: 'timestamp', headerName: 'Data', width: 180, type: 'dateTime', valueGetter: (params) => new Date(params.value) },
    ];

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f4f6f8' }}>
            <Box component="main" sx={{ flexGrow: 1, overflow: 'auto' }}>
                <Toolbar />
                <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
                    <Typography variant="h4" fontWeight="bold" color="primary.dark" gutterBottom>
                        Painel Administrativo
                    </Typography>

                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <SummaryCard title="Volume Transacionado" value={stats.totalVolume.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} icon={<MonetizationOn />} color="primary.main" />
                        <SummaryCard title="Total de Clientes" value={stats.users} icon={<PeopleAlt />} color="success.main" />
                        <SummaryCard title="Total de Empréstimos" value={stats.loans} icon={<Receipt />} color="warning.main" />
                        <SummaryCard title="Aprovações Pendentes" value={pendingLoans.length} icon={<HourglassTop />} color="error.main" />
                    </Grid>

                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
                                <Typography variant="h6" gutterBottom>Aprovações de Empréstimos Pendentes</Typography>
                                <List>
                                    {pendingLoans.length > 0 ? pendingLoans.map((loan, index) => (
                                        <React.Fragment key={loan.id}>
                                            <ListItem
                                                secondaryAction={
                                                    <Box>
                                                        <MuiTooltip title="Aprovar Empréstimo">
                                                            <Button size="small" variant="contained" color="success" sx={{ mr: 1 }} onClick={() => handleLoanAction(loan.id, 'approve')}>
                                                                <CheckCircleOutline />
                                                            </Button>
                                                        </MuiTooltip>
                                                        <MuiTooltip title="Rejeitar Empréstimo">
                                                            <Button size="small" variant="contained" color="error" onClick={() => handleLoanAction(loan.id, 'reject')}>
                                                                <HighlightOff />
                                                            </Button>
                                                        </MuiTooltip>
                                                    </Box>
                                                }>
                                                <ListItemAvatar>
                                                    <Avatar sx={{ bgcolor: 'warning.light' }}><HourglassTop /></Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={`Pedido de ${loan.principal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`}
                                                    secondary={`Cliente ID: ${loan.customerId} | Prazo: ${loan.termMonths} meses | Juros: ${(loan.interestRate * 100).toFixed(2)}%`}
                                                />
                                            </ListItem>
                                            {index < pendingLoans.length - 1 && <Divider variant="inset" component="li" />}
                                        </React.Fragment>
                                    )) : <Typography sx={{ textAlign: 'center', color: 'text.secondary', mt: 2 }}>Nenhum empréstimo pendente.</Typography>}
                                </List>
                            </Paper>
                        </Grid>

                        <Grid item xs={12}>
                            <Paper sx={{ height: 500, width: '100%', borderRadius: 2, boxShadow: 3 }}>
                                <Typography variant="h6" sx={{ p: 2 }}>Gerenciamento de Clientes</Typography>
                                <DataGrid
                                    rows={allUsers}
                                    columns={userColumns}
                                    components={{ Toolbar: GridToolbar }}
                                    sx={{ border: 0 }}
                                />
                            </Paper>
                        </Grid>

                        <Grid item xs={12}>
                            <Paper sx={{ height: 500, width: '100%', borderRadius: 2, boxShadow: 3 }}>
                                <Typography variant="h6" sx={{ p: 2 }}>Gerenciamento de Transações</Typography>
                                <DataGrid
                                    rows={allTransactions}
                                    columns={transactionColumns}
                                    components={{ Toolbar: GridToolbar }}
                                    sx={{ border: 0 }}
                                />
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
            <Snackbar open={notification.open} autoHideDuration={6000} onClose={handleCloseNotification}>
                <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
                    {notification.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}

