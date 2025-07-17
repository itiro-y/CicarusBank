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
    { symbol: 'LTCUSDT', name: 'Litecoin', icon: 'https://assets.coingecko.com/coins/images/2/large/litecoin.png' },
    { symbol: 'TRXUSDT', name: 'TRON', icon: 'https://assets.coingecko.com/coins/images/1094/large/tron-logo.png' },
    { symbol: 'LINKUSDT', name: 'Chainlink', icon: 'https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png' },
    { symbol: 'SHIBUSDT', name: 'Shiba Inu', icon: 'https://assets.coingecko.com/coins/images/11939/large/shiba.png' },
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
        // Simulação de POST (substitua por chamada real futuramente)
        setTimeout(() => {
            setBuyResult({
                qty: Number(buyValue) / Number(price),
                price,
            });
            setBuyLoading(false);
        }, 800);
    }

    // Estatísticas rápidas do mercado
    const totalMarketCap = Object.values(prices).reduce((acc, price, idx) => {
        // Simulação: soma dos preços (não é market cap real)
        return acc + Number(price || 0);
    }, 0);

    const bestPerformer = Object.entries(changes).sort((a, b) => Number(b[1]) - Number(a[1]))[0];
    const worstPerformer = Object.entries(changes).sort((a, b) => Number(a[1]) - Number(b[1]))[0];

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
                {/* Dicas de segurança */}
                <Paper sx={{ mt: 13, mb: -6, p: 3, bgcolor: 'grey.100', borderLeft: '6px solid #1976d2', display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <ShieldIcon color="primary" sx={{ fontSize: 36, mt: 0.5 }} />
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                            Dica de Segurança
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Nunca compartilhe suas senhas ou chaves privadas. Use autenticação em dois fatores e mantenha seus dispositivos protegidos para garantir a segurança dos seus investimentos em criptomoedas.
                        </Typography>
                    </Box>
                </Paper>
                <Toolbar />
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mb: 3
                    }}
                >
                    <Tabs value={tab} onChange={handleTabChange}>
                        <Tab label="Mercado" />
                        <Tab label="Simulação" />
                    </Tabs>

                    <Button
                        variant="outlined"
                        component={Link}
                        to="/user-investments"
                    >
                        Voltar para Investimentos
                    </Button>
                </Box>
                {tab === 0 && (
                    <>
                        <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
                            Criptomoedas
                        </Typography>
                        {loading ? (
                            <CircularProgress />
                        ) : error ? (
                            <Typography color="error">{error}</Typography>
                        ) : (
                            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                <Grid
                                    container
                                    spacing={2}
                                    sx={{
                                        maxWidth: 1200,
                                        mx: 'auto',
                                        alignItems: 'stretch',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {CRYPTOS.map(crypto => {
                                        const price = prices[crypto.symbol];
                                        const change = changes[crypto.symbol];
                                        const isPositive = Number(change) >= 0;
                                        const hist = history[crypto.symbol] || [];
                                        return (
                                            <Grid
                                                item
                                                xs={12}
                                                sm={6}
                                                md={4}
                                                lg={3}
                                                key={crypto.symbol}
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'stretch',
                                                }}
                                            >
                                                <Card
                                                    sx={{
                                                        p: 1.5,
                                                        display: 'flex',
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                        gap: 2,
                                                        boxShadow: 2,
                                                        borderRadius: 3,
                                                        minHeight: 90,
                                                        width: '100%',
                                                        transition: 'transform 0.18s, box-shadow 0.18s',
                                                        '&:hover': {
                                                            transform: 'translateY(-2px) scale(1.025)',
                                                            boxShadow: 6,
                                                        },
                                                    }}
                                                >
                                                    <img
                                                        src={crypto.icon}
                                                        alt={crypto.name}
                                                        style={{ width: 36, height: 36, marginRight: 8 }}
                                                    />
                                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                                        <Typography variant="subtitle1" sx={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                            {crypto.name}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
                                                            {crypto.symbol}
                                                        </Typography>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                                            <Chip
                                                                label={`US$ ${price ? Number(price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '--'}`}
                                                                size="small"
                                                                sx={{
                                                                    bgcolor: 'grey.100',
                                                                    fontWeight: 700,
                                                                    fontSize: 13,
                                                                }}
                                                            />
                                                            <Chip
                                                                label={`${isPositive ? '+' : ''}${Number(change).toFixed(2)}%`}
                                                                size="small"
                                                                sx={{
                                                                    bgcolor: isPositive ? 'success.lighter' : 'error.lighter',
                                                                    color: isPositive ? 'success.main' : 'error.main',
                                                                    fontWeight: 700,
                                                                    fontSize: 13,
                                                                }}
                                                            />
                                                        </Box>
                                                    </Box>
                                                    <Box sx={{ width: 60, height: 32 }}>
                                                        <ResponsiveContainer width="100%" height="100%">
                                                            <LineChart data={hist}>
                                                                <Line
                                                                    type="monotone"
                                                                    dataKey="price"
                                                                    stroke={isPositive ? "#2e7d32" : "#d32f2f"}
                                                                    strokeWidth={2}
                                                                    dot={false}
                                                                />
                                                            </LineChart>
                                                        </ResponsiveContainer>
                                                    </Box>
                                                </Card>
                                            </Grid>
                                        );
                                    })}
                                </Grid>
                            </Box>
                        )}
                        {/* Nova seção de compra refinada */}
                        <Card
                            elevation={8}
                            sx={{
                                mt: 7,
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
                            <Typography variant="h6" sx={{ fontWeight: 700, mt: 6, mb: 1, textAlign: 'center' }}>
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
                                InputProps={{
                                    startAdornment: (
                                        <img
                                            src={CRYPTOS.find(c => c.symbol === buyCrypto)?.icon}
                                            alt={CRYPTOS.find(c => c.symbol === buyCrypto)?.name}
                                            style={{ width: 24, height: 24, marginRight: 8 }}
                                        />
                                    )
                                }}
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
                                {buyLoading ? 'Processando...' : `Comprar ${CRYPTOS.find(c => c.symbol === buyCrypto)?.name}`}
                            </Button>
                            {buyError && (
                                <Typography color="error" sx={{ mt: 1 }}>{buyError}</Typography>
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
                                        Compra simulada!
                                    </Typography>
                                    <Typography>
                                        Você compraria <b>{buyResult.qty.toFixed(6)}</b> {buyCrypto.replace('USDT','')} a US$ {Number(buyResult.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} cada.
                                    </Typography>
                                </Paper>
                            )}
                        </Card>
                    </>
                )}
                {tab === 1 && (
                    <Card
                        elevation={8}
                        sx={{
                            p: { xs: 2, sm: 4 },
                            maxWidth: 520,
                            mx: 'auto',
                            mt: 7,
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
                        <Typography variant="h6" sx={{ fontWeight: 700, mt: 6, mb: 1, textAlign: 'center' }}>
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
                            InputProps={{
                                startAdornment: (
                                    <img
                                        src={CRYPTOS.find(c => c.symbol === simCrypto)?.icon}
                                        alt={CRYPTOS.find(c => c.symbol === simCrypto)?.name}
                                        style={{ width: 24, height: 24, marginRight: 8 }}
                                    />
                                )
                            }}
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
                        <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <EmojiObjectsIcon color="warning" />
                            <Typography variant="body2" color="text.secondary">
                                Simule diferentes valores para ver quantas moedas você pode adquirir.
                            </Typography>
                        </Box>
                    </Card>
                )}
            </Container>
        </Box>
    );
}
