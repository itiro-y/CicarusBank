import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Container, Grid, Paper, Toolbar, Typography, List, ListItem,
    ListItemAvatar, Avatar, ListItemText, Divider, CircularProgress,
    Button, Chip, Tooltip as MuiTooltip
} from '@mui/material';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, Sector
} from 'recharts';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import {
    PeopleAlt, PointOfSale, Receipt, HourglassTop, CheckCircleOutline,
    HighlightOff, SyncAlt, TrendingUp, MonetizationOn
} from '@mui/icons-material';

import SummaryCard from '../../components/SummaryCard.jsx';

// ==============================================
// CONFIGURAÇÃO E DADOS MOCKADOS (Substitua pela sua API)
// ==============================================

const API_URL = import.meta.env.VITE_API_URL || '';

// Dados mockados para os gráficos. Idealmente, viriam da API.
const monthlyChartData = [
    { name: 'Jan', Transações: 4000, "Novos Clientes": 24 },
    { name: 'Fev', Transações: 3000, "Novos Clientes": 13 },
    { name: 'Mar', Transações: 2000, "Novos Clientes": 98 },
    { name: 'Abr', Transações: 2780, "Novos Clientes": 39 },
    { name: 'Mai', Transações: 1890, "Novos Clientes": 48 },
    { name: 'Jun', Transações: 2390, "Novos Clientes": 38 },
];

const loanStatusData = [
    { name: 'Aprovados', value: 400 },
    { name: 'Pendentes', value: 55 },
    { name: 'Rejeitados', value: 80 },
];

const COLORS = ['#4CAF50', '#FFC107', '#F44336']; // Verde, Amarelo, Vermelho

// ==============================================
// COMPONENTES AUXILIARES
// ==============================================

// Componente para renderizar o setor ativo do Gráfico de Pizza
const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent } = props;
    return (
        <g>
            <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} fontWeight="bold">
                {payload.name}
            </text>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
            />
            <Sector
                cx={cx}
                cy={cy}
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={outerRadius + 6}
                outerRadius={outerRadius + 10}
                fill={fill}
            />
            <text x={cx} y={cy + 30} textAnchor="middle" fill="#333">{`Qtd: ${payload.value}`}</text>
            <text x={cx} y={cy + 50} textAnchor="middle" fill="#999">{`( ${(percent * 100).toFixed(2)}% )`}</text>
        </g>
    );
};


// ==============================================
// PÁGINA PRINCIPAL DO DASHBOARD
// ==============================================

export default function AdminDashboardPage() {
    // === ESTADOS ===
    const [stats, setStats] = useState({ users: 0, transactions: 0, loans: 0, totalVolume: 0 });
    const [pendingLoans, setPendingLoans] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activePieIndex, setActivePieIndex] = useState(0);

    const onPieEnter = useCallback((_, index) => {
        setActivePieIndex(index);
    }, [setActivePieIndex]);

    // === LÓGICA DE BUSCA DE DADOS ===
    const fetchAdminData = useCallback(async () => {
        setLoading(true);
        setError(null);
        const authHeader = { Authorization: `Bearer ${localStorage.getItem('token')}` };

        try {
            const [loansRes, usersRes, transactionsRes] = await Promise.all([
                fetch(`${API_URL}/loan`, { headers: authHeader }),
                fetch(`${API_URL}/user/all`, { headers: authHeader }), // Endpoint para buscar todos os usuários
                fetch(`${API_URL}/transaction`, { headers: authHeader }),
            ]);

            if (!loansRes.ok || !usersRes.ok || !transactionsRes.ok) {
                throw new Error('Falha na comunicação com a API.');
            }

            const loansData = await loansRes.json();
            const usersData = await usersRes.json();
            const transactionsData = await transactionsRes.json();

            // Processamento dos Dados
            const pending = loansData.filter(loan => loan.status === 'PENDING').slice(0, 5);
            const totalVolume = transactionsData.reduce((acc, tx) => acc + tx.amount, 0);

            setPendingLoans(pending);
            setAllUsers(usersData);
            setStats({
                users: usersData.length,
                transactions: transactionsData.length,
                loans: loansData.length,
                totalVolume: totalVolume
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

    // === AÇÕES DO USUÁRIO ===
    const handleLoanAction = async (loanId, action) => {
        console.log(`Ação: ${action} para o empréstimo ID: ${loanId}`);
        // Aqui você chamaria a API para atualizar o status do empréstimo
        // Ex: await fetch(`${API_URL}/loan/${loanId}/status`, { method: 'PATCH', body: JSON.stringify({ status: action }) });
        // Após a chamada, atualize a lista de empréstimos pendentes
        setPendingLoans(prevLoans => prevLoans.filter(loan => loan.id !== loanId));
    };

    // === RENDERIZAÇÃO ===
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: 'grey.100' }}>
                <CircularProgress />
                <Typography ml={2}>Carregando dados do dashboard...</Typography>
            </Box>
        );
    }

    // if (error) {
    //     return (
    //         <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: 'grey.100' }}>
    //             <Typography color="error">Erro ao carregar o dashboard: {error}</Typography>
    //         </Box>
    //     );
    // }

    const userColumns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'fullName', headerName: 'Nome Completo', width: 200, editable: true },
        { field: 'email', headerName: 'Email', width: 250, editable: true },
        { field: 'createdAt', headerName: 'Data de Criação', width: 180, type: 'dateTime', valueGetter: (params) => new Date(params.value) },
        { field: 'status', headerName: 'Status', width: 120, renderCell: (params) => (
                <Chip
                    label={params.value}
                    color={params.value === 'ACTIVE' ? 'success' : 'error'}
                    size="small"
                    variant="outlined"
                />
            )},
    ];

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f4f6f8' }}>
            <Box component="main" sx={{ flexGrow: 1, overflow: 'auto' }}>
                <Toolbar />
                <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
                    <Typography variant="h4" fontWeight="bold" color="primary.dark" gutterBottom>
                        Painel Administrativo
                    </Typography>

                    {/* === CARTÕES DE RESUMO === */}
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} sm={6} md={3}><SummaryCard title="Volume Transacionado" value={stats.totalVolume} icon={<MonetizationOn />} prefix="R$ " color="primary.main" /></Grid>
                        <Grid item xs={12} sm={6} md={3}><SummaryCard title="Total de Utilizadores" value={stats.users} icon={<PeopleAlt />} color="success.main" /></Grid>
                        <Grid item xs={12} sm={6} md={3}><SummaryCard title="Total de Empréstimos" value={stats.loans} icon={<Receipt />} color="warning.main" /></Grid>
                        <Grid item xs={12} sm={6} md={3}><SummaryCard title="Ações Pendentes" value={pendingLoans.length} icon={<HourglassTop />} color="error.main" /></Grid>
                    </Grid>

                    {/* === GRÁFICOS E LISTAS === */}
                    <Grid container spacing={3}>
                        <Grid item xs={12} lg={8}>
                            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 400, borderRadius: 2, boxShadow: 3 }}>
                                <Typography variant="h6" color="primary" gutterBottom> <TrendingUp sx={{verticalAlign: 'middle', mr: 1}}/> Desempenho Mensal </Typography>
                                <ResponsiveContainer>
                                    <BarChart data={monthlyChartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                        <XAxis dataKey="name" stroke="#555" />
                                        <YAxis stroke="#555" />
                                        <Tooltip wrapperStyle={{ border: '1px solid #ccc', borderRadius: '5px' }}/>
                                        <Legend />
                                        <Bar dataKey="Transações" fill="#2979ff" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="Novos Clientes" fill="#4caf50" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} lg={4}>
                            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 400, borderRadius: 2, boxShadow: 3 }}>
                                <Typography variant="h6" color="primary" gutterBottom> Status dos Empréstimos </Typography>
                                <ResponsiveContainer>
                                    <PieChart>
                                        <Pie
                                            activeIndex={activePieIndex}
                                            activeShape={renderActiveShape}
                                            data={loanStatusData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                            onMouseEnter={onPieEnter}
                                        >
                                            {loanStatusData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Legend iconSize={10} layout="horizontal" verticalAlign="bottom" align="center" />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Paper>
                        </Grid>

                        {/* === LISTA DE AÇÕES PENDENTES === */}
                        <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 2, height: 450, overflow: 'auto', borderRadius: 2, boxShadow: 3 }}>
                                <Typography variant="h6" gutterBottom> Aprovações Pendentes </Typography>
                                <List>
                                    {pendingLoans.length > 0 ? pendingLoans.map((loan, index) => (
                                        <React.Fragment key={loan.id}>
                                            <ListItem
                                                secondaryAction={
                                                    <Box>
                                                        <MuiTooltip title="Aprovar">
                                                            <Button size="small" variant="contained" color="success" sx={{mr: 1}} onClick={() => handleLoanAction(loan.id, 'APPROVED')}> <CheckCircleOutline/> </Button>
                                                        </MuiTooltip>
                                                        <MuiTooltip title="Rejeitar">
                                                            <Button size="small" variant="contained" color="error" onClick={() => handleLoanAction(loan.id, 'REJECTED')}> <HighlightOff/> </Button>
                                                        </MuiTooltip>
                                                    </Box>
                                                }>
                                                <ListItemAvatar> <Avatar sx={{ bgcolor: 'warning.light' }}> <HourglassTop /> </Avatar> </ListItemAvatar>
                                                <ListItemText
                                                    primary={`Pedido de ${loan.principal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`}
                                                    secondary={`Cliente ID: ${loan.customerId} - ${loan.termMonths} meses`}
                                                />
                                            </ListItem>
                                            {index < pendingLoans.length - 1 && <Divider variant="inset" component="li" />}
                                        </React.Fragment>
                                    )) : <Typography sx={{textAlign: 'center', color: 'text.secondary', mt: 4}}>Nenhuma aprovação pendente. Bom trabalho!</Typography>}
                                </List>
                            </Paper>
                        </Grid>

                        {/* === TABELA DE ÚLTIMOS USUÁRIOS === */}
                        <Grid item xs={12} md={6}>
                            <Paper sx={{ height: 450, width: '100%', borderRadius: 2, boxShadow: 3 }}>
                                <DataGrid
                                    rows={allUsers}
                                    columns={userColumns}
                                    pageSize={5}
                                    rowsPerPageOptions={[5]}
                                    checkboxSelection
                                    disableSelectionOnClick
                                    components={{ Toolbar: GridToolbar }}
                                    sx={{ border: 0 }}
                                />
                            </Paper>
                        </Grid>

                    </Grid>
                </Container>
            </Box>
        </Box>
    );
}