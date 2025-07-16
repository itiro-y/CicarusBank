import React, { useEffect, useState } from 'react';
import {
    Box, Container, Typography, Paper, Grid, Card, CardContent, Button, CircularProgress,
    Tabs, Tab, TextField, MenuItem, Tooltip, Toolbar
} from '@mui/material';
import AppAppBar from '../components/AppAppBar.jsx';
import { Link } from 'react-router-dom';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

// Lista de moedas para exibir
const CRYPTOS = [
    { symbol: 'BTCUSDT', name: 'Bitcoin', icon: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png' },
    { symbol: 'ETHUSDT', name: 'Ethereum', icon: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png' },
    { symbol: 'BNBUSDT', name: 'BNB', icon: 'https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png' },
    { symbol: 'SOLUSDT', name: 'Solana', icon: 'https://assets.coingecko.com/coins/images/4128/large/solana.png' },
    { symbol: 'ADAUSDT', name: 'Cardano', icon: 'https://assets.coingecko.com/coins/images/975/large/cardano.png' },
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

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <AppAppBar title="Investimentos em Criptomoedas" />
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Toolbar sx={{mt:5}}/>
                <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 3 }}>
                    <Tab label="Mercado" />
                    <Tab label="Simulação" />
                </Tabs>
                {tab === 0 && (
                    <>
                        <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
                            Criptomoedas
                        </Typography>
                        <Button variant="outlined" component={Link} to="/user-investments" sx={{ mb: 3 }}>
                            Voltar para Investimentos
                        </Button>
                        {loading ? (
                            <CircularProgress />
                        ) : error ? (
                            <Typography color="error">{error}</Typography>
                        ) : (
                            <Grid container spacing={3}>
                                {CRYPTOS.map(crypto => {
                                    const price = prices[crypto.symbol];
                                    const change = changes[crypto.symbol];
                                    const isPositive = Number(change) >= 0;
                                    const hist = history[crypto.symbol] || [];
                                    return (
                                        <Grid item xs={12} sm={6} md={4} key={crypto.symbol}>
                                            <Card sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: 4 }}>
                                                <img src={crypto.icon} alt={crypto.name} style={{ width: 48, height: 48, marginBottom: 8 }} />
                                                <Typography variant="h6" sx={{ fontWeight: 600 }}>{crypto.name}</Typography>
                                                <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                                                    {crypto.symbol}
                                                </Typography>
                                                <Typography variant="h5" sx={{ mb: 1, fontWeight: 700 }}>
                                                    US$ {Number(price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </Typography>
                                                <Typography variant="body2" sx={{ mb: 2, color: isPositive ? 'success.main' : 'error.main', fontWeight: 600 }}>
                                                    {isPositive ? '+' : ''}{Number(change).toFixed(2)}% (24h)
                                                </Typography>
                                                <Box sx={{ width: '100%', height: 40, mb: 1 }}>
                                                    <ResponsiveContainer width="100%" height={40}>
                                                        <LineChart data={hist} margin={{ left: 0, right: 0, top: 5, bottom: 5 }}>
                                                            <Line type="monotone" dataKey="price" stroke="#1976d2" strokeWidth={2} dot={false} />
                                                        </LineChart>
                                                    </ResponsiveContainer>
                                                </Box>
                                                <Button variant="contained" color="primary" fullWidth>
                                                    Investir
                                                </Button>
                                            </Card>
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        )}
                    </>
                )}
                {tab === 1 && (
                    <Paper sx={{ p: 4, maxWidth: 400, mx: 'auto', mt: 4 }}>
                        <Typography variant="h5" sx={{ mb: 2 }}>Simulação de Investimento</Typography>
                        <TextField
                            select
                            label="Criptomoeda"
                            value={simCrypto}
                            onChange={e => setSimCrypto(e.target.value)}
                            fullWidth
                            sx={{ mb: 2 }}
                        >
                            {CRYPTOS.map(c => (
                                <MenuItem key={c.symbol} value={c.symbol}>{c.name}</MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            label="Valor a investir (US$)"
                            value={simValue}
                            onChange={e => setSimValue(e.target.value)}
                            type="number"
                            fullWidth
                            sx={{ mb: 2 }}
                        />
                        <Button variant="contained" color="primary" fullWidth onClick={handleSimulate} sx={{ mb: 2 }}>
                            Simular
                        </Button>
                        {simResult && (
                            <Box sx={{ mt: 2 }}>
                                <Typography>Você compraria <b>{simResult.qty.toFixed(6)}</b> {simCrypto.replace('USDT','')} a US$ {Number(simResult.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} cada.</Typography>
                            </Box>
                        )}
                    </Paper>
                )}
            </Container>
        </Box>
    );
}
