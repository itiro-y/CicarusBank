import React, { useEffect, useState } from 'react';
import {
    Box, Container, Typography, Paper, Grid, Card, Button,
    Tabs, Tab, TextField, MenuItem, Toolbar
} from '@mui/material';
import AppAppBar from '../../components/AppAppBar.jsx';
import { Link } from 'react-router-dom';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip } from 'recharts';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import Chip from '@mui/material/Chip';
import { useTheme } from '@mui/material/styles';

// Lista de ações para exibir (exemplo: empresas americanas)
const STOCKS = [
    { symbol: 'AAPL', name: 'Apple', icon: 'https://logo.clearbit.com/apple.com' },
    { symbol: 'MSFT', name: 'Microsoft', icon: 'https://logo.clearbit.com/microsoft.com' },
    { symbol: 'GOOGL', name: 'Alphabet', icon: 'https://logo.clearbit.com/abc.xyz' },
    { symbol: 'AMZN', name: 'Amazon', icon: 'https://logo.clearbit.com/amazon.com' },
    { symbol: 'META', name: 'Meta', icon: 'https://logo.clearbit.com/meta.com' },
    { symbol: 'TSLA', name: 'Tesla', icon: 'https://logo.clearbit.com/tesla.com' },
    { symbol: 'NVDA', name: 'Nvidia', icon: 'https://logo.clearbit.com/nvidia.com' },
    { symbol: 'NFLX', name: 'Netflix', icon: 'https://logo.clearbit.com/netflix.com' },
];

async function fetchFinnhubData(symbols) {
    const API_KEY = 'd1sj4jhr01qhe5ra78q0d1sj4jhr01qhe5ra78qg';
    const priceObj = {};
    const changeObj = {};
    const historyObj = {};

    for (const symbol of symbols) {
        try {
            // Cotação atual
            const quoteRes = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`);
            const quoteData = await quoteRes.json();
            priceObj[symbol] = quoteData.c || null;
            changeObj[symbol] = quoteData.dp || null;
        } catch (error) {
            console.error(`Erro ao buscar cotação de ${symbol}`, error);
            priceObj[symbol] = null;
            changeObj[symbol] = null;
        }
    }

    return { priceObj, changeObj, historyObj };
}



export default function StockInvestmentsPage() {
    const [prices, setPrices] = useState({});
    const [changes, setChanges] = useState({});
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState(0);
    const [history, setHistory] = useState({});
    const [simStock, setSimStock] = useState('AAPL');
    const [simValue, setSimValue] = useState('');
    const [simResult, setSimResult] = useState(null);
    const [buyStock, setBuyStock] = useState('AAPL');
    const [buyValue, setBuyValue] = useState('');
    const [buyResult, setBuyResult] = useState(null);
    const [buyLoading, setBuyLoading] = useState(false);
    const [buyError, setBuyError] = useState(null);
    const [selectedChartStock, setSelectedChartStock] = useState('AAPL');
    const [wallet, setWallet] = useState([
        { symbol: 'AAPL', amount: 2 },
        { symbol: 'MSFT', amount: 1.5 },
        { symbol: 'GOOGL', amount: 0.7 },
    ]);
    const theme = useTheme();

    useEffect(() => {
        fetchAll();
    }, []);

    async function fetchAll() {
        setLoading(true);
        try {
            const symbols = STOCKS.map(s => s.symbol);
            const { priceObj, changeObj, historyObj } = await fetchFinnhubData(symbols);
            setPrices(priceObj);
            setChanges(changeObj);
            setHistory(historyObj);
        } catch (e) {
            console.error('Erro geral ao buscar dados do Finnhub:', e);
            setPrices({});
            setChanges({});
            setHistory({});
        } finally {
            setLoading(false);
        }
    }

    function handleTabChange(e, v) {
        setTab(v);
    }

    function handleSimulate() {
        if (!simValue || isNaN(simValue)) return;
        const price = prices[simStock];
        if (!price) return;
        const qty = Number(simValue) / Number(price);
        setSimResult({ qty, price });
    }

    async function handleBuy() {
        setBuyError(null);
        setBuyResult(null);
        if (!buyValue || isNaN(buyValue) || Number(buyValue) <= 0) {
            setBuyError('Informe um valor válido.');
            return;
        }
        const price = prices[buyStock];
        if (!price) {
            setBuyError('Preço da ação indisponível.');
            return;
        }
        setBuyLoading(true);
        setTimeout(() => {
            setBuyResult({
                qty: Number(buyValue) / Number(price),
                price,
            });
            setBuyLoading(false);
        }, 800);
    }

    function getStockInfo(symbol) {
        return STOCKS.find(s => s.symbol === symbol) || { name: symbol, icon: '' };
    }

    // Estatísticas rápidas
    const bestPerformer = Object.entries(changes).sort((a, b) => Number(b[1]) - Number(a[1]))[0];
    const worstPerformer = Object.entries(changes).sort((a, b) => Number(a[1]) - Number(b[1]))[0];

    const chartHistory = history[selectedChartStock] || [];
    const chartChange = chartHistory.length > 1
        ? ((chartHistory[chartHistory.length - 1].price - chartHistory[0].price) / chartHistory[0].price) * 100
        : 0;

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <AppAppBar title="Investimentos em Ações" />
            <Container
                maxWidth="lg"
                sx={{
                    py: 4,
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Toolbar />
                <Box>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            mb: 4,
                            mt: 4
                        }}
                    >
                        <Tabs value={tab} onChange={handleTabChange}>
                            <Tab label="Compre Ações" />
                            <Tab label="Simule uma compra" />
                            <Tab label="Minha Carteira" />
                        </Tabs>
                        <Button
                            variant="outlined"
                            component={Link}
                            to="/user-investments"
                        >
                            Voltar para Investimentos
                        </Button>
                    </Box>
                    {/* Ações centralizadas dentro das abas */}
                    <Box sx={{ width: '100%', mb: 3, display: 'flex', justifyContent: 'center' }}>
                        <Grid
                            container
                            spacing={2}
                            sx={{
                                maxWidth: 900,
                                mx: 'auto',
                                justifyContent: 'center',
                            }}
                        >
                            {STOCKS.map(stock => {
                                const price = prices[stock.symbol];
                                const change = changes[stock.symbol];
                                const isPositive = Number(change) >= 0;
                                return (
                                    <Grid
                                        item
                                        xs={12}
                                        sm={6}
                                        md={3}
                                        lg={3}
                                        key={stock.symbol}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                width: '100%',
                                                p: 2,
                                                borderRadius: 3,
                                                bgcolor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : 'grey.50',
                                                boxShadow: 2,
                                                minHeight: 64,
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: 36,
                                                    height: 36,
                                                    borderRadius: '50%',
                                                    background: theme.palette.mode === 'dark'
                                                        ? 'linear-gradient(135deg, #23272b 60%, #222b36 100%)'
                                                        : 'linear-gradient(135deg, #fff 60%, #e3eafc 100%)',
                                                    boxShadow: 1,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    mr: 2,
                                                }}
                                            >
                                                <img
                                                    src={stock.icon}
                                                    alt={stock.name}
                                                    style={{ width: 24, height: 24 }}
                                                />
                                            </Box>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1 }}>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: 16, lineHeight: 1.1, color: theme.palette.text.primary }}>
                                                    {stock.name}
                                                </Typography>
                                                <Typography variant="caption" sx={{ fontSize: 12, lineHeight: 1.1, color: theme.palette.text.secondary }}>
                                                    {stock.symbol}
                                                </Typography>
                                                <Typography variant="caption" sx={{ fontSize: 13, color: theme.palette.text.primary, lineHeight: 1.1 }}>
                                                    US$ {price ? Number(price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '--'}
                                                </Typography>
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        fontSize: 13,
                                                        color: isPositive ? theme.palette.success.main : theme.palette.error.main,
                                                        fontWeight: 700,
                                                        lineHeight: 1.1,
                                                    }}
                                                >
                                                    {isPositive && change !== null ? '+' : ''}{change !== null ? Number(change).toFixed(2) : '--'}%
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </Box>
                    {tab === 0 && (
                        <Card
                            elevation={8}
                            sx={{
                                mt: 10,
                                mb: 4,
                                maxWidth: 520,
                                mx: 'auto',
                                borderRadius: 4,
                                p: { xs: 2, sm: 4 },
                                bgcolor: 'background.paper',
                                boxShadow: '0 8px 32px 0 rgba(25, 118, 210, 0.10)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                position: 'relative',
                                overflow: 'visible'
                            }}
                        >
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: -48,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    bgcolor: 'background.paper',
                                    borderRadius: '50%',
                                    boxShadow: 3,
                                    width: 80,
                                    height: 80,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    zIndex: 2,
                                }}
                            >
                                <img
                                    src={STOCKS.find(s => s.symbol === buyStock)?.icon}
                                    alt={STOCKS.find(s => s.symbol === buyStock)?.name}
                                    style={{ width: 56, height: 56 }}
                                />
                            </Box>
                            <Typography variant="h6" sx={{ fontWeight: 700, mt: 1, mb: 1, textAlign: 'center' }}>
                                Comprar {STOCKS.find(s => s.symbol === buyStock)?.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>
                                Escolha a ação, informe o valor em dólar e veja instantaneamente quantas ações pode adquirir.
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Preço atual:
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                    US$ {prices[buyStock] ? Number(prices[buyStock]).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '--'}
                                </Typography>
                            </Box>
                            <TextField
                                select
                                label="Ação"
                                value={buyStock}
                                onChange={e => setBuyStock(e.target.value)}
                                fullWidth
                                sx={{ mb: 2 }}
                            >
                                {STOCKS.map(s => (
                                    <MenuItem key={s.symbol} value={s.symbol}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <img src={s.icon} alt={s.name} style={{ width: 20, height: 20 }} />
                                            {s.name}
                                        </Box>
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                label="Valor a investir (US$)"
                                value={buyValue}
                                onChange={e => setBuyValue(e.target.value)}
                                type="number"
                                fullWidth
                                sx={{ mb: 2 }}
                                InputProps={{
                                    startAdornment: (
                                        <MonetizationOnIcon color="action" sx={{ mr: 1 }} />
                                    )
                                }}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                onClick={handleBuy}
                                disabled={buyLoading}
                                sx={{
                                    fontWeight: 700,
                                    borderRadius: 2,
                                    py: 1.2,
                                    fontSize: 18,
                                    boxShadow: '0 2px 8px 0 rgba(25, 118, 210, 0.10)'
                                }}
                            >
                                {buyLoading ? 'Processando...' : `Comprar ${STOCKS.find(s => s.symbol === buyStock)?.name}`}
                            </Button>
                            {buyError && (
                                <Typography color="error" sx={{ mt: 2 }}>{buyError}</Typography>
                            )}
                            {buyResult && (
                                <Paper
                                    elevation={0}
                                    sx={{
                                        mt: 3,
                                        p: 2,
                                        bgcolor: 'success.lighter',
                                        borderRadius: 2,
                                        textAlign: 'center',
                                        width: '100%',
                                    }}
                                >
                                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'success.main' }}>
                                        Compra Realizada
                                    </Typography>
                                    <Typography>
                                        Você comprou <b>{buyResult.qty.toFixed(4)}</b> {buyStock} a US$ {Number(buyResult.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} cada.
                                    </Typography>
                                </Paper>
                            )}
                        </Card>
                    )}
                    {tab === 1 && (
                        <Card
                            elevation={8}
                            sx={{
                                p: { xs: 2, sm: 4 },
                                maxWidth: 520,
                                mx: 'auto',
                                mt: 10,
                                mb: 4,
                                borderRadius: 4,
                                bgcolor: 'background.paper',
                                boxShadow: '0 8px 32px 0 rgba(25, 118, 210, 0.10)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                position: 'relative',
                                overflow: 'visible'
                            }}
                        >
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: -48,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    bgcolor: 'background.paper',
                                    borderRadius: '50%',
                                    boxShadow: 3,
                                    width: 80,
                                    height: 80,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    zIndex: 2,
                                }}
                            >
                                <img
                                    src={STOCKS.find(s => s.symbol === simStock)?.icon}
                                    alt={STOCKS.find(s => s.symbol === simStock)?.name}
                                    style={{ width: 56, height: 56 }}
                                />
                            </Box>
                            <Typography variant="h6" sx={{ fontWeight: 700, mt: 1, mb: 1, textAlign: 'center' }}>
                                Simular Compra de {STOCKS.find(s => s.symbol === simStock)?.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>
                                Escolha a ação, informe o valor em dólar e veja instantaneamente quantas ações poderia adquirir.
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Preço atual:
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                    US$ {prices[simStock] ? Number(prices[simStock]).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '--'}
                                </Typography>
                            </Box>
                            <TextField
                                select
                                label="Ação"
                                value={simStock}
                                onChange={e => setSimStock(e.target.value)}
                                fullWidth
                                sx={{ mb: 2 }}
                            >
                                {STOCKS.map(s => (
                                    <MenuItem key={s.symbol} value={s.symbol}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <img src={s.icon} alt={s.name} style={{ width: 20, height: 20 }} />
                                            {s.name}
                                        </Box>
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                label="Valor a investir (US$)"
                                value={simValue}
                                onChange={e => setSimValue(e.target.value)}
                                type="number"
                                fullWidth
                                sx={{ mb: 2 }}
                                InputProps={{
                                    startAdornment: (
                                        <MonetizationOnIcon color="action" sx={{ mr: 1 }} />
                                    )
                                }}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                onClick={handleSimulate}
                                sx={{
                                    fontWeight: 700,
                                    borderRadius: 2,
                                    py: 1.2,
                                    fontSize: 18,
                                    boxShadow: '0 2px 8px 0 rgba(25, 118, 210, 0.10)'
                                }}
                            >
                                Simular
                            </Button>
                            {simResult && (
                                <Paper
                                    elevation={0}
                                    sx={{
                                        mt: 3,
                                        p: 2,
                                        bgcolor: 'info.lighter',
                                        borderRadius: 2,
                                        textAlign: 'center',
                                        width: '100%',
                                    }}
                                >
                                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'info.main' }}>
                                        Resultado da Simulação
                                    </Typography>
                                    <Typography>
                                        Você compraria <b>{simResult.qty.toFixed(4)}</b> {simStock} a US$ {Number(simResult.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} cada.
                                    </Typography>
                                </Paper>
                            )}
                            <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <EmojiObjectsIcon color="warning" />
                                <Typography variant="body2" color="text.secondary">
                                    Simule diferentes valores para ver quantas ações você pode adquirir.
                                </Typography>
                            </Box>
                        </Card>
                    )}
                    {tab === 2 && (
                        <Card
                            elevation={8}
                            sx={{
                                p: { xs: 2, sm: 4 },
                                maxWidth: 520,
                                mx: 'auto',
                                mt: 10,
                                mb: 1,
                                borderRadius: 4,
                                bgcolor: theme.palette.mode === 'dark' ? theme.palette.grey[900] : 'background.paper',
                                boxShadow: '0 8px 32px 0 rgba(25, 118, 210, 0.10)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                position: 'relative',
                                overflow: 'visible'
                            }}
                        >
                            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0, textAlign: 'center', color: theme.palette.text.primary }}>
                                Minha Carteira
                            </Typography>
                            {wallet.length === 0 && (
                                <Typography color="text.secondary" sx={{ mb: 2 }}>
                                    Você ainda não possui ações na carteira.
                                </Typography>
                            )}
                            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
                                {wallet.map(({ symbol, amount }) => {
                                    const { name, icon } = getStockInfo(symbol);
                                    const price = prices[symbol];
                                    const value = price ? amount * Number(price) : null;
                                    return (
                                        <Box
                                            key={symbol}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 2,
                                                width: '100%',
                                                p: 1.5,
                                                borderRadius: 2,
                                                bgcolor: theme.palette.mode === 'dark'
                                                    ? theme.palette.grey[800]
                                                    : 'grey.50',
                                                boxShadow: 1,
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: 36,
                                                    height: 36,
                                                    borderRadius: '50%',
                                                    background: theme.palette.mode === 'dark'
                                                        ? 'linear-gradient(135deg, #23272b 60%, #222b36 100%)'
                                                        : 'linear-gradient(135deg, #fff 60%, #e3eafc 100%)',
                                                    boxShadow: 1,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <img src={icon} alt={name} style={{ width: 22, height: 22 }} />
                                            </Box>
                                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                                                    {name}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                                                    {symbol}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ textAlign: 'right' }}>
                                                <Typography variant="body2" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                                                    {amount} {symbol}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                                                    {value !== null ? `US$ ${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '--'}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    );
                                })}
                            </Box>
                        </Card>
                    )}
                </Box>
            </Container>
        </Box>
    );
}
