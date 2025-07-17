import React, { useEffect, useState } from 'react';
import {
    Box, Container, Typography, Paper, Grid, Card, CardContent, Button, CircularProgress,
    Tabs, Tab, TextField, MenuItem, Tooltip, Toolbar
} from '@mui/material';
import AppAppBar from '../../components/AppAppBar.jsx';
import { Link } from 'react-router-dom';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ShieldIcon from '@mui/icons-material/Shield';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import Chip from '@mui/material/Chip';
import { useTheme } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

// Lista de moedas para exibir
const CRYPTOS = [
    { symbol: 'BTCUSDT', name: 'Bitcoin', icon: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png' },
    { symbol: 'ETHUSDT', name: 'Ethereum', icon: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png' },
    { symbol: 'BNBUSDT', name: 'BNB', icon: 'https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png' },
    { symbol: 'SOLUSDT', name: 'Solana', icon: 'https://assets.coingecko.com/coins/images/4128/large/solana.png' },
    { symbol: 'ADAUSDT', name: 'Cardano', icon: 'https://assets.coingecko.com/coins/images/975/large/cardano.png' },
    { symbol: 'XRPUSDT', name: 'XRP', icon: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png' },
    { symbol: 'DOGEUSDT', name: 'Dogecoin', icon: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png' },
    { symbol: 'MATICUSDT', name: 'Polygon', icon: 'https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png' },
    { symbol: 'DOTUSDT', name: 'Polkadot', icon: 'https://assets.coingecko.com/coins/images/12171/large/polkadot.png' },
    { symbol: 'AVAXUSDT', name: 'Avalanche', icon: 'https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png' },

];

export default function CryptoInvestmentsPage() {
    const [prices, setPrices] = useState({});
    const [changes, setChanges] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tab, setTab] = useState(0);
    const [history, setHistory] = useState({});
    const [simCrypto, setSimCrypto] = useState('BTCUSDT');
    const [simValue, setSimValue] = useState('');
    const [simResult, setSimResult] = useState(null);
    const [buyCrypto, setBuyCrypto] = useState('BTCUSDT');
    const [buyValue, setBuyValue] = useState('');
    const [buyResult, setBuyResult] = useState(null);
    const [buyLoading, setBuyLoading] = useState(false);
    const [buyError, setBuyError] = useState(null);
    const [selectedChartCrypto, setSelectedChartCrypto] = useState('BTCUSDT');
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [successOpen, setSuccessOpen] = useState(false);
    const [wallet, setWallet] = useState([
        { symbol: 'BTCUSDT', amount: 0.025 },
        { symbol: 'ETHUSDT', amount: 0.5 },
        { symbol: 'BNBUSDT', amount: 2 },
        { symbol: 'ADAUSDT', amount: 150 },
    ]);
    const theme = useTheme();

    useEffect(() => {
        fetchPrices();
        fetchHistory();
    }, []);

    async function fetchHistory() {
        // Busca dados históricos (últimos 7 dias, 1 ponto por dia)
        const newHistory = {};
        for (const crypto of CRYPTOS) {
            try {
                const res = await fetch(`https://api.binance.com/api/v3/klines?symbol=${crypto.symbol}&interval=1d&limit=7`);
                const data = await res.json();
                // Cada item: [openTime, open, high, low, close, ...]
                newHistory[crypto.symbol] = data.map(item => ({
                    date: new Date(item[0]).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' }),
                    price: Number(item[4])
                }));
            } catch (e) {
                newHistory[crypto.symbol] = [];
            }
        }
        setHistory(newHistory);
    }

    async function fetchPrices() {
        setLoading(true);
        setError(null);
        try {
            // Preço atual
            const res = await fetch(`https://api.binance.com/api/v3/ticker/price`);
            const data = await res.json();
            const filtered = {};
            data.forEach(item => {
                if (CRYPTOS.find(c => c.symbol === item.symbol)) {
                    filtered[item.symbol] = item.price;
                }
            });
            setPrices(filtered);
            // Variação 24h
            const res24h = await fetch(`https://api.binance.com/api/v3/ticker/24hr`);
            const data24h = await res24h.json();
            const filteredChange = {};
            data24h.forEach(item => {
                if (CRYPTOS.find(c => c.symbol === item.symbol)) {
                    filteredChange[item.symbol] = item.priceChangePercent;
                }
            });
            setChanges(filteredChange);
        } catch (e) {
            setError('Erro ao buscar preços das criptomoedas.');
        } finally {
            setLoading(false);
        }
    }

    function handleTabChange(e, v) {
        setTab(v);
    }

    function handleSimulate() {
        if (!simValue || isNaN(simValue)) return;
        const price = prices[simCrypto];
        if (!price) return;
        // Simulação simples: quantidade de moedas compradas
        const qty = Number(simValue) / Number(price);
        setSimResult({ qty, price });
    }

    // Função para simular compra (substitua por POST futuramente)
    async function handleBuy() {
        setBuyError(null);
        setBuyResult(null);
        if (!buyValue || isNaN(buyValue) || Number(buyValue) <= 0) {
            setBuyError('Informe um valor válido.');
            return;
        }
        const price = prices[buyCrypto];
        if (!price) {
            setBuyError('Preço da moeda indisponível.');
            return;
        }
        setBuyLoading(true);
        setConfirmOpen(false);
        // Simulação de POST (substitua por chamada real futuramente)
        setTimeout(() => {
            setBuyResult({
                qty: Number(buyValue) / Number(price),
                price,
            });
            setBuyLoading(false);
            setSuccessOpen(true);
        }, 800);
    }

    // Helper para pegar nome e ícone da moeda
    function getCryptoInfo(symbol) {
        return CRYPTOS.find(c => c.symbol === symbol) || { name: symbol, icon: '' };
    }

    // Estatísticas rápidas do mercado
    const totalMarketCap = Object.values(prices).reduce((acc, price, idx) => {
        // Simulação: soma dos preços (não é market cap real)
        return acc + Number(price || 0);
    }, 0);

    const bestPerformer = Object.entries(changes).sort((a, b) => Number(b[1]) - Number(a[1]))[0];
    const worstPerformer = Object.entries(changes).sort((a, b) => Number(a[1]) - Number(b[1]))[0];

    // Cálculo da variação percentual dos últimos 7 dias para o gráfico
    const chartHistory = history[selectedChartCrypto] || [];
    const chartChange = chartHistory.length > 1
        ? ((chartHistory[chartHistory.length - 1].price - chartHistory[0].price) / chartHistory[0].price) * 100
        : 0;

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <AppAppBar title="Investimentos em Criptomoedas" />
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
                            <Tab label="Compre Criptomoedas" />
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
                    {/* Moedas centralizadas dentro das abas */}
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
                            {CRYPTOS.map(crypto => {
                                const price = prices[crypto.symbol];
                                const change = changes[crypto.symbol];
                                const isPositive = Number(change) >= 0;
                                return (
                                    <Grid
                                        item
                                        xs={12}
                                        sm={6}
                                        md={3}
                                        lg={3}
                                        key={crypto.symbol}
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
                                                    src={crypto.icon}
                                                    alt={crypto.name}
                                                    style={{ width: 24, height: 24 }}
                                                />
                                            </Box>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1 }}>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: 16, lineHeight: 1.1, color: theme.palette.text.primary }}>
                                                    {crypto.name}
                                                </Typography>
                                                <Typography variant="caption" sx={{ fontSize: 12, lineHeight: 1.1, color: theme.palette.text.secondary }}>
                                                    {crypto.symbol}
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
                                                    {isPositive ? '+' : ''}{Number(change).toFixed(2)}%
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </Box>
                    {tab === 0 && (
                        <>
                            {/* Nova seção de compra refinada */}
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
                                        src={CRYPTOS.find(c => c.symbol === buyCrypto)?.icon}
                                        alt={CRYPTOS.find(c => c.symbol === buyCrypto)?.name}
                                        style={{ width: 56, height: 56 }}
                                    />
                                </Box>
                                <Typography variant="h6" sx={{ fontWeight: 700, mt: 1, mb: 1, textAlign: 'center' }}>
                                    Comprar {CRYPTOS.find(c => c.symbol === buyCrypto)?.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>
                                    Escolha a criptomoeda, informe o valor em dólar e veja instantaneamente quanto você pode adquirir.
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                    <CurrencyBitcoinIcon color="primary" sx={{ fontSize: 28 }} />
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Preço atual:
                                    </Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                        US$ {prices[buyCrypto] ? Number(prices[buyCrypto]).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '--'}
                                    </Typography>
                                </Box>
                                <TextField
                                    select
                                    label="Criptomoeda"
                                    value={buyCrypto}
                                    onChange={e => setBuyCrypto(e.target.value)}
                                    fullWidth
                                    sx={{ mb: 2 }}
                                >
                                    {CRYPTOS.map(c => (
                                        <MenuItem key={c.symbol} value={c.symbol}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <img src={c.icon} alt={c.name} style={{ width: 20, height: 20 }} />
                                                {c.name}
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
                                    onClick={() => setConfirmOpen(true)}
                                    disabled={buyLoading}
                                    sx={{
                                        fontWeight: 700,
                                        borderRadius: 2,
                                        py: 1.2,
                                        fontSize: 18,
                                        boxShadow: '0 2px 8px 0 rgba(25, 118, 210, 0.10)'
                                    }}
                                >
                                    {buyLoading ? 'Processando...' : `Comprar ${CRYPTOS.find(c => c.symbol === buyCrypto)?.name}`}
                                </Button>
                            </Card>

                            {/* Confirmação de compra */}
                            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                                <DialogTitle>Confirmar Compra</DialogTitle>
                                <DialogContent>
                                    <Typography>
                                        Tem certeza que deseja comprar {buyValue || '--'} USD em {CRYPTOS.find(c => c.symbol === buyCrypto)?.name}?
                                    </Typography>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={() => setConfirmOpen(false)} color="inherit">
                                        Cancelar
                                    </Button>
                                    <Button
                                        onClick={handleBuy}
                                        color="primary"
                                        variant="contained"
                                        disabled={buyLoading}
                                    >
                                        Confirmar
                                    </Button>
                                </DialogActions>
                            </Dialog>

                            {/* Sucesso da compra */}
                            <Dialog open={successOpen} onClose={() => setSuccessOpen(false)}>
                                <DialogTitle>Compra Realizada</DialogTitle>
                                <DialogContent>
                                    <Typography>
                                        Sua compra de {buyValue || '--'} USD em {CRYPTOS.find(c => c.symbol === buyCrypto)?.name} foi realizada com sucesso!
                                    </Typography>
                                    {buyResult && (
                                        <Typography sx={{ mt: 2 }}>
                                            Você comprou <b>{buyResult.qty.toFixed(6)}</b> {buyCrypto.replace('USDT','')} a US$ {Number(buyResult.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} cada.
                                        </Typography>
                                    )}
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={() => setSuccessOpen(false)} color="primary" autoFocus>
                                        Fechar
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </>
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
                                    src={CRYPTOS.find(c => c.symbol === simCrypto)?.icon}
                                    alt={CRYPTOS.find(c => c.symbol === simCrypto)?.name}
                                    style={{ width: 56, height: 56 }}
                                />
                            </Box>
                            <Typography variant="h6" sx={{ fontWeight: 700, mt: 1, mb: 1, textAlign: 'center' }}>
                                Simular Compra de {CRYPTOS.find(c => c.symbol === simCrypto)?.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>
                                Escolha a criptomoeda, informe o valor em dólar e veja instantaneamente quanto você poderia adquirir.
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <CurrencyBitcoinIcon color="primary" sx={{ fontSize: 28 }} />
                                <Typography variant="subtitle2" color="text.secondary">
                                    Preço atual:
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                    US$ {prices[simCrypto] ? Number(prices[simCrypto]).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '--'}
                                </Typography>
                            </Box>
                            <TextField
                                select
                                label="Criptomoeda"
                                value={simCrypto}
                                onChange={e => setSimCrypto(e.target.value)}
                                fullWidth
                                sx={{ mb: 2 }}
                            >
                                {CRYPTOS.map(c => (
                                    <MenuItem key={c.symbol} value={c.symbol}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <img src={c.icon} alt={c.name} style={{ width: 20, height: 20 }} />
                                            {c.name}
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
                                        Você compraria <b>{simResult.qty.toFixed(6)}</b> {simCrypto.replace('USDT','')} a US$ {Number(simResult.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} cada.
                                    </Typography>
                                </Paper>
                            )}
                            {/* Dica de simulação */}
                            <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <EmojiObjectsIcon color="warning" />
                                <Typography variant="body2" color="text.secondary">
                                    Simule diferentes valores para ver quantas moedas você pode adquirir.
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
                                    Você ainda não possui criptomoedas na carteira.
                                </Typography>
                            )}
                            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
                                {wallet.map(({ symbol, amount }) => {
                                    const { name, icon } = getCryptoInfo(symbol);
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
                                                    {amount} {symbol.replace('USDT', '')}
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
