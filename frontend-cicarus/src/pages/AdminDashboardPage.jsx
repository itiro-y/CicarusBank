// src/pages/AdminDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Paper, Toolbar, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, Divider, CircularProgress } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import AppAppBar from '../components/AppAppBar.jsx';
import SummaryCard from '../components/SummaryCard.jsx';
import { PeopleAlt, PointOfSale, Receipt, ShowChart, HourglassTop, SyncAlt } from '@mui/icons-material';

// URL da API
const API_URL = import.meta.env.VITE_API_URL || '';

// Dados de exemplo para o gráfico (pode ser substituído por dados da API)
const chartData = [
    { name: 'Jan', Transações: 4000, "Novos Clientes": 24 },
    { name: 'Fev', Transações: 3000, "Novos Clientes": 13 },
    { name: 'Mar', Transações: 2000, "Novos Clientes": 78 },
    { name: 'Abr', Transações: 2780, "Novos Clientes": 39 },
    { name: 'Mai', Transações: 1890, "Novos Clientes": 48 },
    { name: 'Jun', Transações: 2390, "Novos Clientes": 38 },
];

export default function AdminDashboardPage() {
    // NOVO: Estados para armazenar dados da API
    const [stats, setStats] = useState({ users: 0, transactions: 0, loans: 0 });
    const [pendingLoans, setPendingLoans] = useState([]);
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    const authHeader = { Authorization: `Bearer ${localStorage.getItem('token')}` };

    // NOVO: Função para buscar todos os dados do dashboard
    const fetchAdminData = async () => {
        setLoading(true);
        try {
            // OBS: Estes endpoints são suposições. Adapte para os seus endpoints reais de admin.
            const [loansRes, transactionsRes] = await Promise.all([
                fetch(`${API_URL}/loan`, { headers: authHeader }), // Endpoint que busca todos os empréstimos
                fetch(`${API_URL}/transaction`, { headers: authHeader }) // Endpoint que busca todas as transações
            ]);

            const loansData = await loansRes.json();
            const transactionsData = await transactionsRes.json();

            // Filtra empréstimos pendentes
            const pending = loansData.filter(loan => loan.status === 'PENDING');
            setPendingLoans(pending.slice(0, 5)); // Pega os 5 mais recentes

            // Pega as 5 transações mais recentes
            setRecentTransactions(transactionsData.slice(0, 5));

            // Simula contagens (idealmente, a API forneceria isso)
            setStats({
                users: 1254, // Você precisará de um endpoint para isso, ex: /users/count
                transactions: transactionsData.length,
                loans: loansData.length
            });

        } catch (error) {
            console.error("Erro ao buscar dados do admin:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdminData();
    }, []);


    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
            <AppAppBar />
            <Box component="main" sx={{ flexGrow: 1, overflow: 'auto' }}>
                <Toolbar />
                <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                    <Typography variant="h4" gutterBottom>
                        Dashboard do Administrador
                    </Typography>

                    {/* Cartões de Resumo agora com dados dinâmicos */}
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} sm={6} md={3}>
                            <SummaryCard title="Total de Utilizadores" value={stats.users} icon={<PeopleAlt />} color="primary.main" />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <SummaryCard title="Total de Transações" value={stats.transactions} icon={<PointOfSale />} color="success.main" />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <SummaryCard title="Total de Empréstimos" value={stats.loans} icon={<Receipt />} color="warning.main" />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <SummaryCard title="Empréstimos Pendentes" value={pendingLoans.length} icon={<HourglassTop />} color="error.main" />
                        </Grid>
                    </Grid>

                    {/* Gráfico e Novas Listas */}
                    <Grid container spacing={3}>
                        <Grid item xs={12} lg={8}>
                            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 400 }}>
                                <Typography variant="h6" color="primary" gutterBottom> Visão Geral Semestral </Typography>
                                <ResponsiveContainer>
                                    <BarChart data={chartData}>
                                        <XAxis dataKey="name" /> <YAxis /> <Tooltip /> <Legend />
                                        <Bar dataKey="Transações" fill="#8884d8" />
                                        <Bar dataKey="Novos Clientes" fill="#82ca9d" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} lg={4}>
                            <Paper sx={{ p: 2, height: 400, overflow: 'auto' }}>
                                <Typography variant="h6" gutterBottom> Empréstimos Pendentes </Typography>
                                <List>
                                    {pendingLoans.length > 0 ? pendingLoans.map((loan, index) => (
                                        <React.Fragment key={loan.id}>
                                            <ListItem alignItems="flex-start">
                                                <ListItemAvatar> <Avatar sx={{ bgcolor: 'warning.main' }}> <HourglassTop /> </Avatar> </ListItemAvatar>
                                                <ListItemText
                                                    primary={`Pedido de ${loan.principal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`}
                                                    secondary={`Cliente ID: ${loan.customerId} - ${loan.termMonths} parcelas`}
                                                />
                                            </ListItem>
                                            {index < pendingLoans.length - 1 && <Divider variant="inset" component="li" />}
                                        </React.Fragment>
                                    )) : <Typography sx={{textAlign: 'center', color: 'text.secondary', mt: 4}}>Nenhum empréstimo pendente.</Typography>}
                                </List>
                            </Paper>
                        </Grid>
                        <Grid item xs={12}>
                            <Paper sx={{ p: 2 }}>
                                <Typography variant="h6" gutterBottom>Últimas Transações Globais</Typography>
                                <List>
                                    {recentTransactions.map((tx, index) => (
                                        <React.Fragment key={tx.id}>
                                            <ListItem>
                                                <ListItemAvatar> <Avatar sx={{bgcolor: 'info.main'}}> <SyncAlt /> </Avatar> </ListItemAvatar>
                                                <ListItemText
                                                    primary={`${tx.transactionType} - ${tx.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`}
                                                    secondary={`Conta ID: ${tx.accountId} - Status: ${tx.transactionStatus}`}
                                                />
                                                <Typography variant="body2" color="text.secondary">
                                                    {new Date(tx.timestamp).toLocaleString('pt-BR')}
                                                </Typography>
                                            </ListItem>
                                            {index < recentTransactions.length - 1 && <Divider component="li" />}
                                        </React.Fragment>
                                    ))}
                                </List>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Box>
    );
}