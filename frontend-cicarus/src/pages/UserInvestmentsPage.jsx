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

const API_URL = import.meta.env.VITE_API_URL || '';
const accountId = 1;

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

            <AppAppBar title="Meus Investimentos"/>
            <Toolbar />

            {/* Container único para todo o conteúdo, com padding uniforme */}
            <Container maxWidth="lg" sx={{ pt: 4, pb: 4, mt: 5}}>

                {/* Carrossel dentro do Container */}
                <Box sx={{ mb: 4 }}>
                    <InvestmentCarouselInvestments />
                </Box>
                <InvestmentToolbar />
                <SummaryCard />
                {/*<EvolutionGraph />*/}
                {/* Cabeçalho da página */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h4">Meus Investimentos</Typography>
                    <Button variant="outlined" component={Link} to="/admin-investments">
                        Ir para Admin
                    </Button>
                </Box>

                {/* Tabela de investimentos */}
                <InvestmentTable investments={investments} loading={loading} />
            </Container>
        </Box>
    );

}
