import React, { useEffect, useState } from 'react';
import {
    Box, Container, Typography, Paper, Grid, Card, CardContent, Button, CircularProgress,
    Tabs, Tab, TextField, MenuItem, Tooltip, Toolbar
} from '@mui/material';
import AppAppBar from '../../components/AppAppBar.jsx';
import { Link } from 'react-router-dom';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { useTheme } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import WalletIcon from '@mui/icons-material/Wallet';
import {useUser} from "../../context/UserContext.jsx";
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

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
    const [buyValue, setBuyValue] = useState('');
    const [buyResult, setBuyResult] = useState(null);
    const [buyLoading, setBuyLoading] = useState(false);
    const [buyError, setBuyError] = useState(null);
    const [selectedChartCrypto, setSelectedChartCrypto] = useState('BTCUSDT');
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [successOpen, setSuccessOpen] = useState(false);
    const [usdWallet, setUsdWallet] = useState(0);
    const [selectedCrypto, setSelectedCrypto] = useState('BTCUSDT');

    const { user } = useUser();
    const [accountId, setAccountId] = useState(0);
    const [customerData, setCustomerData] = useState(null);
    const [loadingCustomerData, setLoadingCustomerData] = useState(false);

    const [wallet, setWallet] = useState([]);
    const theme = useTheme();
    const API_URL = import.meta.env.VITE_API_URL || '';
    const authHeader = () => {
        const token = localStorage.getItem('token') || '';
        return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
    };
    useEffect(() => {
        fetchPrices();
        fetchHistory();
    }, []);

    useEffect(() => {
        if (!user) return;

        const fetchCustomerData = async () => {
            setLoadingCustomerData(true);
            try {
                const email = user.name;
                if (!email) return;

                const res = await fetch(`${API_URL}/customers/profile/${email}`, {
                    headers: authHeader()
                });
                if (!res.ok) throw new Error(res.statusText);

                const data = await res.json();
                setCustomerData(data);
                setAccountId(data.id);
            } catch (err) {
                console.error('Error fetching customer data:', err);
            } finally {
                setLoadingCustomerData(false);
            }
        };

        fetchCustomerData();
    }, [user]);


    useEffect(() => {
        if (!accountId) return;

        // você já tem as funções definidas abaixo
        fetchUsdWallet();
        fetchWallet();
    }, [accountId]);

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
            const response = await fetch(`${API_URL}/crypto/list/${accountId}`, {
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

    async function fetchHistory() {
        const newHistory = {};
        for (const crypto of CRYPTOS) {
            try {
                const res = await fetch(`https://api.binance.com/api/v3/klines?symbol=${crypto.symbol}&interval=1d&limit=7`);
                const data = await res.json();

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
            const res = await fetch(`https://api.binance.com/api/v3/ticker/price`);
            const data = await res.json();
            const filtered = {};
            data.forEach(item => {
                if (CRYPTOS.find(c => c.symbol === item.symbol)) {
                    filtered[item.symbol] = item.price;
                }
            });
            setPrices(filtered);

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

    async function handleSell(type) {
        try {
            const response = await fetch(`${API_URL}/crypto/sell/${type}/${accountId}`, {
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
                    throw new Error(data.message || 'Erro ao vender criptomoeda.');
                } catch {
                    throw new Error('Erro ao vender criptomoeda.');
                }
            }

            let result = null;
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                result = await response.json();
                console.log('Venda realizada com sucesso:', result);
            } else {
                console.log('Venda realizada com sucesso.');
            }
            await fetchUsdWallet();
            await fetchWallet();

        } catch (error) {
            console.error(error);
        }
    }

    async function handleBuy() {
        setBuyError(null);

        if (!buyValue || isNaN(buyValue) || Number(buyValue) <= 0) {
            setBuyError('Informe um valor válido.');
            return;
        }

        const payload = {
            accountId,
            type: selectedCrypto,
            status: 'ACTIVE',
            amountInvested: Number(buyValue),
            currentValue: Number(buyValue) / Number(prices[selectedCrypto]),
            cryptoMultiplier: 0
        };

        setBuyLoading(true);
        setConfirmOpen(false);

        try {
            const res = await fetch(`${API_URL}/crypto`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...authHeader()
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const msg = await res.text();
                throw new Error(`Erro ${res.status}: ${msg}`);
            }

            setSuccessOpen(true);
            await fetchWallet();
            await fetchUsdWallet();
        } catch (err) {
            setBuyError(err.message);
        } finally {
            setBuyLoading(false);
        }
    }

    function getCryptoInfo(symbol) {
        return CRYPTOS.find(c => c.symbol === symbol) || { name: symbol, icon: '' };
    }

    const chartHistory = history[selectedCrypto] || [];
    const chartData = {
        labels: chartHistory.map(item => item.date),
        datasets: [
            {
                label: `Histórico de Preço (${selectedCrypto})`,
                data: chartHistory.map(item => item.price),
                borderColor: theme.palette.primary.main,
                backgroundColor: theme.palette.primary.light,
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'top',
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Data',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Preço (USD)',
                },
            },
        },
    };

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
                            mt: 5
                        }}
                    >
                        <Tabs value={tab} onChange={handleTabChange}>
                            <Tab label="Compre Criptomoedas" sx={{fontWeight: 500}}/>
                            <Tab label="Minha Carteira" sx={{fontWeight: 500}}/>
                        </Tabs>
                        <Button
                            variant="contained"
                            component={Link}
                            to="/user-investments"
                        >
                            Voltar para Investimentos
                        </Button>
                    </Box>
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
                                            onClick = {() => setSelectedCrypto(crypto.symbol)}
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
                            {chartHistory.length > 0 && (
                                <Box sx={{ mt: 4, mb: 4, maxWidth: 600, mx: 'auto' }}>
                                    <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
                                        Histórico de Preço - Últimos 7 Dias ({selectedCrypto})
                                    </Typography>
                                    <Line data={chartData} options={chartOptions} />
                                </Box>
                            )}
                            <Card
                                elevation={8}
                                sx={{
                                    mt: 8,
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
                                    overflow: 'visible',
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
                                        src={CRYPTOS.find(c => c.symbol === selectedCrypto)?.icon}
                                        alt={CRYPTOS.find(c => c.symbol === selectedCrypto)?.name}
                                        style={{ width: 56, height: 56 }}
                                    />
                                </Box>
                                <Typography variant="h6" sx={{ fontWeight: 700, mt: 1, mb: 1, textAlign: 'center' }}>
                                    Comprar {CRYPTOS.find(c => c.symbol === selectedCrypto)?.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>
                                    Escolha a criptomoeda, informe o valor em dólar e veja instantaneamente quanto você pode adquirir.
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
                                        <WalletIcon color="primary" sx={{ fontSize: 23 }} />
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Saldo:
                                        </Typography>
                                        <Typography variant="h6" sx={{ fontSize:15, fontWeight: 600, mr:6}}>
                                            US$ {Number(usdWallet).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </Typography>
                                    <CurrencyBitcoinIcon color="primary" sx={{ fontSize: 23 }} />
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Preço atual:
                                    </Typography>
                                    <Typography variant="h6" sx={{fontSize:15,  fontWeight: 600 }}>
                                        US$ {prices[selectedCrypto] ? Number(prices[selectedCrypto]).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '--'}
                                    </Typography>
                                </Box>
                                <TextField
                                    select
                                    label="Criptomoeda"
                                    value={selectedCrypto}
                                    onChange={e => setSelectedCrypto(e.target.value)}
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
                                        fontWeight: 600,
                                        color: 'white' ,
                                        borderRadius: 2,
                                        py: 1.2,
                                        fontSize: 16,
                                        boxShadow: '0 2px 8px 0 rgba(25, 118, 210, 0.10)',
                                        width: 200
                                    }}
                                >
                                    {buyLoading ? 'Processando...' : `Comprar ${CRYPTOS.find(c => c.symbol === selectedCrypto)?.name}`}
                                </Button>
                            </Card>

                            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                                <DialogTitle>Confirmar Compra</DialogTitle>
                                <DialogContent>
                                    <Typography>
                                        Tem certeza que deseja comprar {buyValue || '--'} USD em {CRYPTOS.find(c => c.symbol === selectedCrypto)?.name} ({(buyValue / prices[selectedCrypto]).toFixed(6)} {CRYPTOS.find(c => c.symbol === selectedCrypto)?.name}s)?
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

                            <Dialog open={successOpen} onClose={() => setSuccessOpen(false)}>
                                <DialogTitle>Compra Realizada</DialogTitle>
                                <DialogContent>
                                    <Typography>
                                        Sua compra de {buyValue || '--'} USD em {CRYPTOS.find(c => c.symbol === selectedCrypto)?.name} foi realizada com sucesso!
                                    </Typography>
                                    {buyResult && (
                                        <Typography sx={{ mt: 2 }}>
                                            Você comprou <b>{(buyValue / prices[selectedCrypto]).toFixed(6)}</b> {selectedCrypto.replace('USDT','')} a US$ {Number(buyResult.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} cada.
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
                            <Box sx={{mr: 40, mt: 2, display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                                <WalletIcon color='primary' sx={{ fontSize: 23 }}/>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Saldo:
                                </Typography>
                                <Typography variant="h7" sx={{ fontSize:15 , fontWeight: 600, mr:4, mb: 0.1}}>
                                    US$ {Number(usdWallet).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </Typography>
                            </Box>
                            {wallet.length === 0 && (
                                <Typography color="text.secondary" sx={{ mb: 2 }}>
                                    Você ainda não possui criptomoedas na carteira.
                                </Typography>
                            )}
                            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1, mr: 3}}>
                                {wallet.map(({ type, currentValue }) => {
                                    const { name, icon } = getCryptoInfo(type);
                                    const price = prices[type];
                                    const value = price ? currentValue * Number(price) : null;
                                    return (
                                        <Box
                                            key={type}
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
                                                    {type}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ textAlign: 'right' }}>
                                                <Typography variant="body2" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                                                    {currentValue} {type.replace('USDT', '')}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                                                    {value !== null ? `US$ ${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '--'}
                                                </Typography>
                                            </Box>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                size="small"
                                                onClick={() => handleSell(type)}
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
