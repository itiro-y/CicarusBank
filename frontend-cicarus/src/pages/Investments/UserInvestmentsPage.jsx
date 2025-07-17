import React, { useState, useEffect } from 'react';
import {
    Box, Container, Typography, Paper, Stack, Button,
    TableContainer, Table, TableHead, TableBody, TableRow, TableCell,
    Toolbar, CircularProgress, Grid, Card, CardContent
} from '@mui/material';
import AppAppBar from '../../components/AppAppBar.jsx';
import { Link } from 'react-router-dom';
import InvestmentCarouselInvestments from "../../components/PromotionalCarouselInvestments.jsx";
import { Link as RouterLink } from 'react-router-dom';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Area, AreaChart, Legend } from "recharts";
import { useTheme } from '@mui/material/styles';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';

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

function EvolutionGraph() {
    const theme = useTheme();
    return (
        <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={historico} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorValor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0.05}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                <XAxis dataKey="mes" tick={{ fill: theme.palette.text.secondary }} />
                <YAxis tick={{ fill: theme.palette.text.secondary }} />
                <Tooltip
                    contentStyle={{
                        background: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        color: theme.palette.text.primary,
                        borderRadius: 8,
                        boxShadow: theme.shadows[2],
                    }}
                    labelStyle={{ color: theme.palette.text.secondary }}
                />
                <Area
                    type="monotone"
                    dataKey="valor"
                    stroke={theme.palette.primary.main}
                    fillOpacity={1}
                    fill="url(#colorValor)"
                    strokeWidth={3}
                    dot={{ r: 4, stroke: theme.palette.background.paper, strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                />
                <Legend />
            </AreaChart>
        </ResponsiveContainer>
    );
}

export default function UserInvestmentsPage() {
    const [investments, setInvestments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openRendaFixa, setOpenRendaFixa] = useState(false);
    const [depositValue, setDepositValue] = useState('');
    const [successDialog, setSuccessDialog] = useState(false);

    // Novo estado para Fundo Imobiliário
    const [openFundoImob, setOpenFundoImob] = useState(false);
    const [fundoValue, setFundoValue] = useState('');
    const [successFundoDialog, setSuccessFundoDialog] = useState(false);

    const theme = useTheme();
    const authHeader = () => {
        const token = localStorage.getItem('token') || '';
        return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
    };


    async function handleRendaFixaDeposit() {
        const payload = {
            accountId: accountId,
            type: "RENDA_FIXA",
            status: "ATIVO",
            amountInvested: depositValue,
            currentValue: depositValue,
            expectedReturnRate: 0.065,
            endDate: null,
            autoRenew: true
        };

        try {
            const response = await fetch(`${API_URL}/investment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...authHeader() // adiciona Authorization: Bearer <token>
                },
                body: JSON.stringify(payload)
            });
            await fetchInvestments()
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Erro ao depositar renda fixa:", errorData);
            } else {
                const result = await response.json();
                console.log("Depósito realizado com sucesso:", result);
            }
        } catch (error) {
            console.error("Erro na requisição de renda fixa:", error);
        } finally {
            setOpenRendaFixa(false);
            setSuccessDialog(true);
            setDepositValue('');
        }
    }

    async function handleFundoImobDeposit() {
        const payload = {
            accountId: accountId,
            type: "FUNDO_IMOBILIARIO",
            status: "ATIVO",
            amountInvested: fundoValue,
            currentValue: fundoValue,
            expectedReturnRate: 0.09,
            endDate: null,
            autoRenew: true
        };

        try {
            const response = await fetch(`${API_URL}/investment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...authHeader() // adiciona Authorization: Bearer <token>
                },
                body: JSON.stringify(payload)
            });
            await fetchInvestments()
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Erro ao depositar renda fixa:", errorData);
            } else {
                const result = await response.json();
                console.log("Depósito realizado com sucesso:", result);
            }
        } catch (error) {
            console.error("Erro na requisição de renda fixa:", error);
        } finally {
            setOpenFundoImob(false);
            setSuccessFundoDialog(true);
            setFundoValue('');
        }
    }


    // Atualize os cards para incluir ícones e descrições
    const cards = [
        {
            title: 'Renda Fixa',
            to: '/investments/renda-fixa',
            icon: <AccountBalanceIcon fontSize="large" color="primary" />,
            description: 'Investimentos seguros e previsíveis.',
        },
        {
            title: 'Fundo Imobiliário',
            to: '/investments/fundo-imobiliario',
            icon: <HomeWorkIcon fontSize="large" color="primary" />,
            description: 'Ganhe com imóveis sem burocracia.',
        },
        {
            title: 'Ações',
            to: '/investments/acoes',
            icon: <TrendingUpIcon fontSize="large" color="primary" />,
            description: 'Participe do crescimento das empresas.',
        },
        {
            title: 'Criptomoeda',
            to: '/investments/criptomoeda',
            icon: <CurrencyBitcoinIcon fontSize="large" color="primary" />,
            description: 'Invista em ativos digitais inovadores.',
        },
    ];


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

                <InvestmentCarouselInvestments />

                <Typography variant="h4" sx={{ mb: 2, mt: 3, fontWeight: 700 }}>
                    Dashboard de Investimentos
                </Typography>

                {/* Botões elegantes e alinhados */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {cards.map(card => (
                        <Grid item xs={12} sm={6} md={3} key={card.title}>
                            <Card
                                elevation={3}
                                sx={{
                                    minHeight: 160,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    p: 2,
                                    borderRadius: 3,
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    '&:hover': {
                                        transform: 'translateY(-4px) scale(1.03)',
                                        boxShadow: 6,
                                    },
                                }}
                            >
                                <Box sx={{ mb: -1 }}>{card.icon}</Box>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, textAlign: 'center' }}>
                                    {card.title}
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 2, textAlign: 'center', color: 'text.secondary' }}>
                                    {card.description}
                                </Typography>
                                <Button
                                    component={
                                        card.title === 'Renda Fixa' ? undefined : card.title === 'Fundo Imobiliário'
                                                                    ? undefined : card.title === 'Ações'
                                                                    ? RouterLink : RouterLink
                                    }
                                    to={
                                        card.title === 'Renda Fixa'
                                            ? undefined
                                            : card.title === 'Fundo Imobiliário'
                                                ? undefined
                                                : card.title === 'Ações'
                                                    ? '/investments/acoes'
                                                    : card.to
                                    }
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    sx={{
                                        borderRadius: 2,
                                        fontWeight: 600,
                                        textTransform: 'none',
                                        boxShadow: 'none',
                                    }}
                                    onClick={
                                        card.title === 'Renda Fixa'
                                            ? () => setOpenRendaFixa(true)
                                            : card.title === 'Fundo Imobiliário'
                                                ? () => setOpenFundoImob(true)
                                                : undefined
                                    }
                                >
                                    Ver detalhes
                                </Button>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Dialog para Renda Fixa */}
                <Dialog open={openRendaFixa} onClose={() => setOpenRendaFixa(false)}>
                    <DialogTitle>Depósito em Renda Fixa (Poupança Cicarus Bank)</DialogTitle>
                    <DialogContent>
                        <Typography sx={{ mb: 2 }}>
                            <b>Rendimento:</b> 0,65% ao mês (aprox. 8% ao ano) <br />
                            <b>Liquidez:</b> Resgate a qualquer momento após 30 dias.<br />
                            <b>Garantia:</b> Fundo Garantidor de Créditos (FGC) até R$ 250.000,00.
                        </Typography>
                        <TextField
                            label="Valor para depositar (R$)"
                            type="number"
                            fullWidth
                            value={depositValue}
                            onChange={e => setDepositValue(e.target.value)}
                            sx={{ mt: 1 }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenRendaFixa(false)} color="inherit">
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleRendaFixaDeposit}
                            color="primary"
                            variant="contained"
                            disabled={!depositValue || Number(depositValue) <= 0}
                        >
                            Depositar
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Dialog de sucesso Renda Fixa */}
                <Dialog open={successDialog} onClose={() => setSuccessDialog(false)}>
                    <DialogTitle>Depósito realizado!</DialogTitle>
                    <DialogContent>
                        <Typography>
                            Seu depósito em Renda Fixa foi realizado com sucesso!
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setSuccessDialog(false)} color="primary" autoFocus>
                            Fechar
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Dialog para Fundo Imobiliário */}
                <Dialog open={openFundoImob} onClose={() => setOpenFundoImob(false)}>
                    <DialogTitle>Aplicação em Fundo Imobiliário</DialogTitle>
                    <DialogContent>
                        <Typography sx={{ mb: 2 }}>
                            <b>Rendimento médio:</b> 0,9% ao mês (aprox. 11% ao ano) <br />
                            <b>Liquidez:</b> Resgate em D+30.<br />
                            <b>Dividendos:</b> Pagos mensalmente direto na sua conta.<br />
                            <b>Risco:</b> Moderado. O valor pode oscilar conforme o mercado imobiliário.
                        </Typography>
                        <TextField
                            label="Valor para aplicar (R$)"
                            type="number"
                            fullWidth
                            value={fundoValue}
                            onChange={e => setFundoValue(e.target.value)}
                            sx={{ mt: 1 }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenFundoImob(false)} color="inherit">
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleFundoImobDeposit}
                            color="primary"
                            variant="contained"
                            disabled={!fundoValue || Number(fundoValue) <= 0}
                        >
                            Aplicar
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Dialog de sucesso Fundo Imobiliário */}
                <Dialog open={successFundoDialog} onClose={() => setSuccessFundoDialog(false)}>
                    <DialogTitle>Aplicação realizada!</DialogTitle>
                    <DialogContent>
                        <Typography>
                            Sua aplicação em Fundo Imobiliário foi realizada com sucesso!
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setSuccessFundoDialog(false)} color="primary" autoFocus>
                            Fechar
                        </Button>
                    </DialogActions>
                </Dialog>

                <Typography variant="h6" sx={{ mb: 2 }}>Evolução de seus Investimentos</Typography>
                <Paper sx={{ p: 2, mb: 4 }}>
                    <EvolutionGraph />
                </Paper>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Histórico de Investimentos
                </Typography>
                <InvestmentTable investments={investments} loading={loading} />
            </Container>
        </Box>
    );
}
