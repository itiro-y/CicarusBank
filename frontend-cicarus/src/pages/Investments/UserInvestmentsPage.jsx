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
import jwtDecode from "../../utils/jwtDecode.js";
import {useUser} from "../../context/UserContext.jsx";

const API_URL = import.meta.env.VITE_API_URL || '';

const generateHourlyMock = (min=50, max=150) => {
    const now = Date.now();
    return Array.from({ length: 24 }).map((_, i) => {
        const ts = now - (23 - i) * 3_600_000;
        const date = new Date(ts);
        const hour = String(date.getHours()).padStart(2, '0') + ':00';
        const valor = (Math.random() * (max - min) + min).toFixed(2);
        return { hour, valor };
    });
};

function InvestmentTable({ investments, loading }) {
    const formatCurrency = (value, type) => {
        const isReal = ['RENDA_FIXA', 'FUNDO_IMOBILIARIO'].includes(type);
        return Number(value).toLocaleString(
            isReal ? 'pt-BR' : 'en-US',
            { style: 'currency', currency: isReal ? 'BRL' : 'USD' }
        );
    };

    if (loading) return <CircularProgress />;
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID Conta</TableCell>
                        <TableCell>Tipo</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Valor Investido</TableCell>
                        <TableCell>Valor Atual</TableCell>
                        <TableCell>Rentabilidade Esperada</TableCell>
                        <TableCell>Início</TableCell>
                        <TableCell>Renovar?</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {investments.map(inv => (
                        <TableRow key={inv.id}>
                            <TableCell>{inv.accountId}</TableCell>
                            <TableCell>{inv.type}</TableCell>
                            <TableCell>{inv.status}</TableCell>
                            <TableCell>
                                { formatCurrency(inv.amountInvested, inv.type) }
                            </TableCell>
                            <TableCell>
                                { formatCurrency(inv.currentValue,   inv.type) }
                            </TableCell>
                            <TableCell>{Number(inv.expectedReturnRate).toLocaleString('pt-BR')}%</TableCell>
                            <TableCell>{new Date(inv.startDate).toLocaleDateString('pt-BR')}</TableCell>
                            <TableCell>{inv.autoRenew ? 'Sim' : 'Não'}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

function EvolutionGraph({ historicoBRL, historicoUSD }) {
    const theme = useTheme();

    // monta um array [ { mes, valor1, valor2 }, … ]
    const merged = historicoBRL.map((brl, i) => ({
        hour:    brl.hour,
        valor1: brl.valor,
        valor2: historicoUSD[i]?.valor ?? 0
    }));

    return (
        <ResponsiveContainer width="100%" height={250}>
            <AreaChart
                data={merged}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
                <defs>
                    <linearGradient id="gradBRL" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0.05}/>
                    </linearGradient>
                    <linearGradient id="gradUSD" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={theme.palette.secondary.main} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={theme.palette.secondary.main} stopOpacity={0.05}/>
                    </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />

                <XAxis dataKey="hour" tick={{ fill: theme.palette.text.secondary }} />
                <YAxis tick={{ fill: theme.palette.text.secondary }} />

                <Tooltip
                    contentStyle={{
                        background: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 8,
                        boxShadow: theme.shadows[2],
                    }}
                    labelStyle={{ color: theme.palette.text.secondary }}
                />

                {/* As duas áreas */}
                <Area
                    type="monotone"
                    dataKey="valor1"
                    name="BRL"
                    stroke={theme.palette.primary.main}
                    fill="url(#gradBRL)"
                    strokeWidth={2}
                    dot={false}
                />
                <Area
                    type="monotone"
                    dataKey="valor2"
                    name="USD"
                    stroke={theme.palette.secondary.main}
                    fill="url(#gradUSD)"
                    strokeWidth={2}
                    dot={false}
                />

                {/* Legenda */}
                <Legend />
            </AreaChart>
        </ResponsiveContainer>
    );
}


export default function UserInvestmentsPage() {
    const theme = useTheme();
    const authHeader = () => {
        const token = localStorage.getItem('token') || '';
        return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
    };
    const { user } = useUser();
    const [accountId, setAccountId] = useState(0);
    const [customerData, setCustomerData] = useState(null);
    const [loadingCustomerData, setLoadingCustomerData] = useState(false);

    const [investments, setInvestments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openRendaFixa, setOpenRendaFixa] = useState(false);
    const [depositValue, setDepositValue] = useState('');
    const [successDialog, setSuccessDialog] = useState(false);

    const [totalInvestedBRL, setTotalInvestedBRL] = useState(0);
    const [totalInvested, setTotalInvested] = useState(0);
    const [rendaFixaInvestments, setRendaFixaInvestments] = useState(0);
    const [fundoImobInvestments, setFundoImobInvestments] = useState(0);
    const [acoesInvestments, setAcoesInvestments] = useState(0);
    const [criptoInvestments, setCriptoInvestments] = useState(0);

    const [openFundoImob, setOpenFundoImob] = useState(false);
    const [fundoValue, setFundoValue] = useState('');
    const [successFundoDialog, setSuccessFundoDialog] = useState(false);


    const [historicoBRL, setHistoricoBRL] = useState(
        generateHourlyMock(8_000, 10_000)
    );
    const [historicoUSD, setHistoricoUSD] = useState(
        generateHourlyMock(0, 800)
    );
    function ResumoSaldosInvestidos(){
        return(
            <Box sx={{ mt: 3, mb: 4}}>
                <Typography variant="h6" gutterBottom>
                    Resumo de Seus Investimentos
                </Typography>
                <Grid container spacing={2} sx={{mt: 3, justifyContent: 'center', textAlign: 'center' }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Total Investido (BRL)
                            </Typography>
                            <Typography variant="h6">
                                R$ {totalInvestedBRL.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Renda Fixa
                            </Typography>
                            <Typography variant="h6">
                                R$ {rendaFixaInvestments.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Fundos Imobiliários
                            </Typography>
                            <Typography variant="h6">
                                R$ {fundoImobInvestments.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid sx={{ml:3, mr: 3}}/>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Total Investido (USD)
                            </Typography>
                            <Typography variant="h6">
                                US$ {totalInvested.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Ações
                            </Typography>
                            <Typography variant="h6">
                                US$ {acoesInvestments.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Criptomoedas
                            </Typography>
                            <Typography variant="h6">
                                US$ {criptoInvestments.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        )
    }


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
                    ...authHeader()
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
            await fetchBRLInverstments();
            await fetchUSDInverstments();
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
            await fetchBRLInverstments();
            await fetchUSDInverstments();
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
        if (!accountId) return;

        fetchInvestments();
        fetchInvestmentRendaFixa();
        fetchInvestmentFundoImobiliario();
        fetchInvestmentStocks();
        fetchInvestmentCrypto();
        fetchBRLInverstments();
        fetchUSDInverstments();
    }, [accountId]);

    // só recalcula totais quando qualquer valor individual mudar
    useEffect(() => {
        const brl = rendaFixaInvestments + fundoImobInvestments;
        const usd = acoesInvestments + criptoInvestments;
        setTotalInvestedBRL(brl);
        setTotalInvested(usd);
    }, [rendaFixaInvestments, fundoImobInvestments, acoesInvestments, criptoInvestments]);

    useEffect(() => {
        if (!user) return;  // só roda quando 'user' estiver disponível

        const fetchCustomerData = async () => {
            setLoadingCustomerData(true);
            try {
                const email = user.name;
                if (!email) {
                    setLoadingCustomerData(false);
                    return;
                }

                const response = await fetch(
                    `${API_URL}/customers/profile/${email}`,
                    { headers: authHeader() }
                );

                if (!response.ok) {
                    throw new Error(`Failed to fetch customer data (${response.status})`);
                }

                const data = await response.json();
                setCustomerData(data);
                setAccountId(data.id);
            } catch (error) {
                console.error('Error fetching initial data:', error);
            } finally {
                setLoadingCustomerData(false);
            }
        };

        fetchCustomerData();
    }, [user, setAccountId]);

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

    async function fetchInvestmentRendaFixa(){
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/investment/renda-fixa/sum/${accountId}`, { headers: authHeader() });
            const data = await res.json();
            setRendaFixaInvestments(data);
        } catch (error) {
            console.error('Erro ao buscar saldo de renda fixa:', error);
        } finally {
            setLoading(false);
        }
    }

    async function fetchInvestmentFundoImobiliario(){
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/investment/fundo-imobiliario/sum/${accountId}`, { headers: authHeader() });
            const data = await res.json();
            setFundoImobInvestments(data);
        } catch (error) {
            console.error('Erro ao buscar saldo de renda fixa:', error);
        } finally {
            setLoading(false);
        }
    }

    async function fetchInvestmentStocks(){
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/stock/sum/${accountId}`, { headers: authHeader() });
            const data = await res.json();
            setAcoesInvestments(data);
        } catch (error) {
            console.error('Erro ao buscar saldo de renda fixa:', error);
        } finally {
            setLoading(false);
        }
    }

    async function fetchInvestmentCrypto(){
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/crypto/sum/${accountId}`, { headers: authHeader() });
            const data = await res.json();
            setCriptoInvestments(data);
        } catch (error) {
            console.error('Erro ao buscar saldo de renda fixa:', error);
        } finally {
            setLoading(false);
        }
    }

    async function fetchBRLInverstments(){
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/investment/history-brl/${accountId}`, { headers: authHeader() });
            const data = await res.json();               // { sumOfAllBrlInvestments, dateOfLastInvestment }
            const items = Array.isArray(data) ? data : [data];

            const shaped = items.map(item => {
                const d = new Date(item.dateOfLastInvestment);
                return {
                    hour: new Date(item.dateOfLastInvestment).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                    valor: item.sumOfAllBrlInvestments.toFixed(2)
                };
            });
            setHistoricoBRL(prev => [...prev, ...shaped]);
        } finally {
            setLoading(false);
        }
    }

    async function fetchUSDInverstments(){
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/investment/history-usd/${accountId}`, { headers: authHeader() });
            const data = await res.json();
            const items = Array.isArray(data) ? data : [data];
            console.log(items);
            const shaped = items.map(item => {
                const d = new Date(item.dateOfLastInvestment);
                return {
                    hour: new Date(item.dateOfLastInvestment).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                    valor: item.sumOfAllUsdInvestments.toFixed(2)
                };
            });
            setHistoricoUSD(prev => [...prev, ...shaped]);
        } catch (error) {
            console.error(error);
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
                                    Investir
                                </Button>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <ResumoSaldosInvestidos />

                <Paper sx={{ p: 2, mb: 4 }}>
                    <EvolutionGraph historicoBRL={historicoBRL} historicoUSD={historicoUSD} />
                </Paper>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Histórico de Investimentos
                </Typography>
                <InvestmentTable investments={investments} loading={loading} />

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
            </Container>
        </Box>
    );
}
