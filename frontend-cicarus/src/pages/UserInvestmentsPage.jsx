import React, { useState, useEffect } from 'react';
import {
    Box, Container, Typography, Paper, Stack, Button,
    TableContainer, Table, TableHead, TableBody, TableRow, TableCell,
    Toolbar, CircularProgress, Grid, Card, CardContent
} from '@mui/material';
import AppAppBar from '../components/AppAppBar.jsx';
import { Link } from 'react-router-dom';
import InvestmentCarouselInvestments from "../components/PromotionalCarouselInvestments.jsx";
import { Link as RouterLink } from 'react-router-dom';
import {Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import { useTheme } from '@mui/material/styles';

const API_URL = import.meta.env.VITE_API_URL || '';
const accountId = 1;
const historico = [
    { mes: 'Jan', valor: 10000 },
    { mes: 'Fev', valor: 10250 },
    { mes: 'Mar', valor: 9800  },
    { mes: 'Abr', valor: 11000 },
    { mes: 'Mai', valor: 11500 },
    { mes: 'Jun', valor: 11800 },
    { mes: 'Jul', valor: 12000 },
    { mes: 'Ago', valor: 12500 },
    { mes: 'Set', valor: 13000 },
    { mes: 'Out', valor: 12800 },
    { mes: 'Nov', valor: 13500 },
    { mes: 'Dez', valor: 14000 },
];

export function InvestmentToolbar() {
    return (
        <Box sx={{ bgcolor: 'background.paper', borderTop: '1px solid', borderColor: 'divider' }}>
            <Toolbar
                component="nav"
                variant="dense"
                sx={{
                    justifyContent: 'center',
                    gap: 2,
                    py: 1,
                }}
            >
                <Button
                    component={RouterLink}
                    to="/investments/renda-fixa"
                    variant="outlined"
                >
                    Renda Fixa
                </Button>
                <Button
                    component={RouterLink}
                    to="/investments/fundo-imobiliario"
                    variant="outlined"
                >
                    Fundo Imobiliário
                </Button>
                <Button
                    component={RouterLink}
                    to="/investments/acoes"
                    variant="outlined"
                >
                    Ações
                </Button>
                <Button
                    component={RouterLink}
                    to="/investments/criptomoeda"
                    variant="outlined"
                >
                    Criptomoeda
                </Button>
            </Toolbar>
        </Box>
    );
}


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

function SummaryCard(){
    return(
        <Grid container spacing={2} sx={{ my: 3 }}>
            <Grid item xs={6} md={3}>
                <Card>
                    <CardContent>
                        <Typography variant="subtitle2">Total Investido</Typography>
                        <Typography variant="h5">R$ 50.000,00</Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={6} md={3}>
                <Card>
                    <CardContent>
                        <Typography variant="subtitle2">Rentabilidade Mês</Typography>
                        <Typography variant="h5">+2,3%</Typography>
                    </CardContent>
                </Card>
            </Grid>
            {/* Outros cards: Rentabilidade Ano, Valor Atual, etc */}
        </Grid>
    )
}

function EvolutionGraph(){
    const theme = useTheme();
    return(
        <ResponsiveContainer width="100%" height={200}>
            <LineChart data={historico}>
                <XAxis dataKey="mes"/>
                <YAxis/>
                <Tooltip/>
                <Line type="monotone" dataKey="valor" stroke={theme.palette.primary.main}/>
            </LineChart>
        </ResponsiveContainer>
    )
}

export default function UserInvestmentsPage() {
    const [investments, setInvestments] = useState([]);
    const [loading, setLoading] = useState(false);
    const theme = useTheme();

    // Simulação de dados para cards
    const cards = [
        {
            title: 'Renda Fixa',
            description: 'Invista com segurança e previsibilidade.',
            to: '/investments/renda-fixa',
            color: theme.palette.success.light,
        },
        {
            title: 'Fundo Imobiliário',
            description: 'Diversifique com imóveis e renda passiva.',
            to: '/investments/fundo-imobiliario',
            color: theme.palette.info.light,
        },
        {
            title: 'Ações',
            description: 'Participe do mercado de capitais.',
            to: '/investments/acoes',
            color: theme.palette.warning.light,
        },
        {
            title: 'Criptomoeda',
            description: 'Invista em moedas digitais.',
            to: '/investments/criptomoeda',
            color: theme.palette.secondary.light,
        },
    ];

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
            const res = await fetch(`${API_URL}/investment/list/${accountId}`, { headers: authHeader() });
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
                <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
                    Dashboard de Investimentos
                </Typography>
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {cards.map(card => (
                        <Grid item xs={12} sm={6} md={3} key={card.title}>
                            <Card sx={{ bgcolor: card.color, minHeight: 180, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <CardContent>
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>{card.title}</Typography>
                                    <Typography variant="body2" sx={{ mb: 2 }}>{card.description}</Typography>
                                    <Button
                                        component={RouterLink}
                                        to={card.to}
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                    >
                                        Ver detalhes
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
                <Typography variant="h6" sx={{ mb: 2 }}>Histórico de Evolução</Typography>
                <Paper sx={{ p: 2, mb: 4 }}>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={historico}>
                            <XAxis dataKey="mes" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="valor" stroke={theme.palette.primary.main} strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </Paper>
                <InvestmentTable investments={investments} loading={loading} />
            </Container>
        </Box>
    );

}
