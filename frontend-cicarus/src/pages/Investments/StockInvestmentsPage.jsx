import React, { useEffect, useState } from 'react';
import {
    Box, Container, Typography, Paper, Grid, Card, Button,
    Tabs, Tab, TextField, MenuItem, Toolbar
} from '@mui/material';
import AppAppBar from '../../components/AppAppBar.jsx';
import { Link } from 'react-router-dom';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { useTheme } from '@mui/material/styles';
import WalletIcon from '@mui/icons-material/Wallet';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import AddIcon from '@mui/icons-material/Add';

const API_URL = import.meta.env.VITE_API_URL || '';
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


const authHeader = () => {
    const token = localStorage.getItem('token') || '';
    return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
};

export default function StockInvestmentsPage() {
    const accountId = 1; // Substituir quando auth estiver implementado

    const [prices, setPrices] = useState({});
    const [changes, setChanges] = useState({});
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState(0);
    const [history, setHistory] = useState({});
    const [simStock, setSimStock] = useState('AAPL');
    const [simValue, setSimValue] = useState('');
    const [simResult, setSimResult] = useState(null);
    const [buyVolume, setbuyVolume] = useState('');
    const [buyResult, setBuyResult] = useState(null);
    const [buyLoading, setBuyLoading] = useState(false);
    const [buyError, setBuyError] = useState(null);
    const [selectedChartStock, setSelectedChartStock] = useState('AAPL');
    const [usdWallet, setUsdWallet] = useState(0);
    const [wallet, setWallet] = useState([]);
    const [selectedStock, setSelectedStock] = useState('AAPL');
    const theme = useTheme();

    useEffect(() => {
        fetchAll();
        fetchWallet();
        fetchUsdWallet()
    }, []);

    async function fetchUsdWallet(){
        try {
            const response = await fetch(`${API_URL}/account/${accountId}`, {
                headers: authHeader()
            });
            if (!response.ok) {
                throw new Error('Erro ao buscar saldo em USD');
            }
            const data = await response.json();
            setUsdWallet(data.usdWallet || 0)
        } catch (error) {
            console.error('Erro ao buscar saldo em USD:', error);
            return 0;
        }
    }

    async function fetchWallet() {
        try {
            const response = await fetch(`${API_URL}/stock/list/${accountId}`, {
                headers: authHeader()
            });
            if (!response.ok) {
                throw new Error('Erro ao buscar carteira');
            }
            const data = await response.json();
            setWallet(data);
        } catch (error) {
            console.error('Erro ao buscar carteira:', error);
            setWallet([]);
        }
    }

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

    async function handleSell(symbol) {
        try {
            const response = await fetch(`${API_URL}/stock/sell/${symbol}/${accountId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    ...authHeader()
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                try {
                    const data = JSON.parse(errorText);
                    throw new Error(data.message || 'Erro ao vender ação.');
                } catch {
                    throw new Error('Erro ao vender ação.');
                }
            }

            // Apenas tente ler o corpo se houver
            let result = null;
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                result = await response.json();
                console.log('Venda realizada com sucesso:', result);
            } else {
                console.log('Venda realizada com sucesso (sem corpo).');
            }
            await fetchUsdWallet();
            await fetchWallet();

        } catch (error) {
            console.error(error);
        }
    }


    async function handleBuy() {
        setBuyError(null);
        setBuyResult(null);

        if (!buyVolume || isNaN(buyVolume) || Number(buyVolume) <= 0) {
            setBuyError('Informe um valor válido.');
            return;
        }

        const price = prices[selectedStock];
        if (!price) {
            setBuyError('Preço da ação indisponível.');
            return;
        }

        setBuyLoading(true);
        try {
            // Buscar dados da ação com Alpha Vantage
            const OV_API_KEY = "05OPBVBUATY9EPP1";
            const overviewRes = await fetch(`https://www.alphavantage.co/query?function=OVERVIEW&symbol=${selectedStock}&apikey=${OV_API_KEY}`);
            const overviewData = await overviewRes.json();

            const payload = {
                symbol: selectedStock,
                accountId: accountId,
                companyName: overviewData.Name || selectedStock,
                currency: overviewData.Currency || 'USD',
                setor: overviewData.Sector || '',
                currentPrice: Number(price),
                volume: buyVolume,
                marketCap: Number(overviewData.MarketCapitalization) || 0,
                peRatio: Number(overviewData.PERatio) || 0,
                dividendYield: Number(overviewData.DividendYield) || 0
            };

            const response = await fetch(`${API_URL}/stock`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...authHeader()
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao comprar ação.');
            }

            const result = await response.json();
            setBuyResult({
                qty: result.qty,
                price: result.price
            });
            await fetchWallet();
            await fetchUsdWallet()
        } catch (error) {
            console.error(error);
            setBuyError(error.message || 'Erro inesperado.');
        } finally {
            setBuyLoading(false);
        }
    }

    function getStockInfo(symbol) {
        return STOCKS.find(s => s.symbol === symbol) || { name: symbol, icon: '' };
    }

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
                            mt: 5
                        }}
                    >
                        <Tabs value={tab} onChange={handleTabChange}>
                            <Tab label="Compre Ações" sx={{fontWeight:500}}/>
                            <Tab label="Minha Carteira" sx={{fontWeight:500}} />
                        </Tabs>
                        <Button
                            variant="contained"
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
                                            onClick={() => setSelectedStock(stock.symbol)}
                                            sx={{
                                                cursor: 'pointer',
                                                display: 'flex',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                width: '100%',
                                                p: 2,
                                                borderRadius: 3,
                                                bgcolor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : 'grey.50',
                                                boxShadow: 2,
                                                minHeight: 64,
                                                transition: 'transform 0.2s, box-shadow 0.2s',
                                                '&:hover': {
                                                    transform: 'translateY(-4px) scale(1.03)',
                                                    boxShadow: 6,
                                                }
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
                                    src={STOCKS.find(s => s.symbol === selectedStock)?.icon}
                                    alt={STOCKS.find(s => s.symbol === selectedStock)?.name}
                                    style={{ width: 56, height: 56 }}
                                />
                            </Box>
                            <Typography variant="h6" sx={{ fontWeight: 700, mt: 1, mb: -1, textAlign: 'center' }}>
                                Comprar Ações da {STOCKS.find(s => s.symbol === selectedStock)?.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>
                                Escolha a ação, informe o valor em dólar e veja instantaneamente quantas ações pode adquirir.
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
                                <WalletIcon color='primary' sx={{ fontSize: 23 }}/>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Saldo:
                                </Typography>
                                <Typography variant="h6" sx={{ fontSize: 15, fontWeight: 600, mr:6 }}>
                                    US$ {Number(usdWallet).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </Typography>

                                <ShowChartIcon color='primary' sx={{ fontSize: 23 }}/>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Preço da ação:
                                </Typography>
                                <Typography variant="h6" sx={{ fontSize: 16, fontWeight: 600 }}>
                                    US$ {prices[selectedStock] ? Number(prices[selectedStock]).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '--'}
                                </Typography>
                            </Box>
                            <TextField
                                select
                                label="Ação"
                                value={selectedStock}
                                onChange={e => setselectedStock(e.target.value)}
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
                                label="Quantidade de Ações (un.)"
                                value={buyVolume}
                                onChange={e => setbuyVolume(e.target.value)}
                                type="number"
                                fullWidth
                                sx={{ mb: 2 }}
                                InputProps={{
                                    startAdornment: (
                                        <AddIcon color="action" sx={{ mr: 1, fontSize: 15 }} />
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
                                    fontSize: 16,
                                    boxShadow: '0 2px 8px 0 rgba(25, 118, 210, 0.10)',
                                    width: 200
                                }}
                            >
                                {buyLoading ? 'Processando...' : `Comprar ${STOCKS.find(s => s.symbol === selectedStock)?.name}`}
                            </Button>
                            {buyError && (
                                <Typography color="error" sx={{ mt: 2 }}>{buyError}</Typography>)}
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
                                        Você comprou <b>{buyVolume}</b> {selectedStock} a US$ {Number(prices[selectedStock]).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} cada.
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
                                mt: 4,
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
                        >   <Box>

                                <Typography variant="h4" sx={{ fontWeight: 700, mb: 0, textAlign: 'center', color: theme.palette.text.primary }}>
                                    Minha Carteira
                                </Typography>
                            </Box>
                            <Box sx={{mr: 40, mt: 2, display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                                <WalletIcon color='primary' sx={{ fontSize: 23 }}/>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Saldo:
                                </Typography>
                                <Typography variant="h7" sx={{ fontSize: 15, fontWeight: 600, mr:4 }}>
                                    US$ {Number(usdWallet).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </Typography>
                            </Box>
                            {wallet.length === 0 && (
                                <Typography color="text.secondary" sx={{ mb: 2 }}>
                                    Você ainda não possui ações na carteira.
                                </Typography>
                            )}
                            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1, mr: 3 }}>
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
                                            <Box sx={{ textAlign: 'right', flex: 1 }}>
                                                <Typography variant="body2" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                                                    {amount} {symbol}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                                                    {value !== null ? `US$ ${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '--'}
                                                </Typography>
                                            </Box>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                size="small"
                                                onClick={() => handleSell(symbol)}
                                            >
                                                Vender
                                            </Button>
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
