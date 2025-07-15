import * as React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Box, Container, Typography, Grid, Paper, CircularProgress, Alert, TextField, Button, InputAdornment, useTheme
} from '@mui/material';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import AppAppBar from '../components/AppAppBar.jsx';
import Swal from 'sweetalert2';

const API_URL = import.meta.env.VITE_API_URL || '';

const CurrencyCard = ({ currency, value, flagUrl }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
    >
        <Paper
            elevation={0}
            sx={{
                p: 5,
                borderRadius: '16px',
                backgroundColor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                height: '100%',
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <img src={flagUrl} alt={`${currency} flag`} style={{ width: 24, height: 24, borderRadius: '50%', marginRight: 12, objectFit: 'cover' }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{currency}</Typography>
            </Box>
            <Typography variant="h4" color="primary">R$ {value}</Typography>
        </Paper>
    </motion.div>
);

export default function ExchangePage() {
    const theme = useTheme();
    const [exchangeRates, setExchangeRates] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [historicalData, setHistoricalData] = useState([]);
    const [loadingHistorical, setLoadingHistorical] = useState(true);
    const [errorHistorical, setErrorHistorical] = useState(null);
    const [brlAmount, setBrlAmount] = useState('');
    const [convertedUsd, setConvertedUsd] = useState('0.00');
    const [convertedEur, setConvertedEur] = useState('0.00');
    const [accountData, setAccountData] = useState(null);
    const [loadingExchange, setLoadingExchange] = useState(false);

    const accountId = 1;

    const authHeader = () => {
        const token = localStorage.getItem('token') || '';
        return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
    };

    const fetchAccountData = async () => {
        try {
            const response = await fetch(`${API_URL}/account/${accountId}`, { headers: authHeader() });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            setAccountData(data);
        } catch (e) {
            console.error("Error fetching account data:", e);
            Swal.fire('Erro', 'Não foi possível carregar os dados da conta.', 'error');
        }
    };

    useEffect(() => {
        const fetchExchangeRates = async () => {
            try {
                const response = await fetch('https://open.er-api.com/v6/latest/BRL');
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                setExchangeRates(data.rates);
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchHistoricalRates = async () => {
            try {
                const endDate = new Date();
                const startDate = new Date();
                startDate.setMonth(endDate.getMonth() - 3);
                const formatDate = (date) => date.toISOString().split('T')[0];
                const response = await fetch(`https://api.frankfurter.app/${formatDate(startDate)}..${formatDate(endDate)}?from=BRL&to=USD,EUR`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                if (!data || !data.rates) throw new Error('Invalid API response: rates data missing.');
                const processedData = Object.keys(data.rates).map(date => ({
                    date,
                    usd: data.rates[date].USD ? (1 / data.rates[date].USD) : null,
                    eur: data.rates[date].EUR ? (1 / data.rates[date].EUR) : null,
                })).sort((a, b) => new Date(a.date) - new Date(b.date)); // Ordenar dados
                setHistoricalData(processedData);
            } catch (e) {
                setErrorHistorical(e.message);
            } finally {
                setLoadingHistorical(false);
            }
        };

        fetchExchangeRates();
        fetchHistoricalRates();
        fetchAccountData();
    }, []);

    useEffect(() => {
        if (brlAmount && exchangeRates) {
            const amount = parseFloat(brlAmount);
            if (!isNaN(amount) && amount > 0) {
                setConvertedUsd((amount * exchangeRates.USD).toFixed(2));
                setConvertedEur((amount * exchangeRates.EUR).toFixed(2));
            } else {
                setConvertedUsd('0.00');
                setConvertedEur('0.00');
            }
        } else {
            setConvertedUsd('0.00');
            setConvertedEur('0.00');
        }
    }, [brlAmount, exchangeRates]);

    const handleBrlAmountChange = (event) => {
        // Permite apenas números e um ponto decimal
        const value = event.target.value.replace(/[^0-9.]/g, '');
        setBrlAmount(value);
    };

    const handleExchange = async (currency) => {
        const amount = parseFloat(brlAmount);
        if (isNaN(amount) || amount <= 0) {
            Swal.fire('Erro', 'Por favor, insira um valor válido para a troca.', 'error');
            return;
        }
        if (!accountData || amount > accountData.balance) {
            Swal.fire('Erro', 'Saldo insuficiente para realizar a troca.', 'error');
            return;
        }
        if (!exchangeRates) {
            Swal.fire('Erro', 'Taxas de câmbio não carregadas. Tente novamente mais tarde.', 'error');
            return;
        }
        const convertedAmount = currency === 'USD' ? convertedUsd : convertedEur;
        const endpoint = currency === 'USD' ? '/exchange/convert-brl-to-usd' : '/exchange/convert-brl-to-eur';
        const requestBody = {
            accountId: accountId,
            amount: amount,
            ...(currency === 'USD' ? { usdAmount: parseFloat(convertedUsd) } : { eurAmount: parseFloat(convertedEur) })
        };
        Swal.fire({
            title: 'Confirmar Troca?',
            html: `Você deseja trocar <b>R$ ${amount.toFixed(2).replace('.', ',')}</b> por <b>${currency} ${convertedAmount.replace('.', ',')}</b>?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim, trocar!',
            cancelButtonText: 'Cancelar',
            reverseButtons: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoadingExchange(true);
                try {
                    const response = await fetch(`${API_URL}${endpoint}`, {
                        method: 'POST',
                        headers: authHeader(),
                        body: JSON.stringify(requestBody),
                    });
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                    }
                    Swal.fire('Sucesso!', `Troca de BRL para ${currency} realizada com sucesso!`, 'success');
                    setBrlAmount('');
                    setConvertedUsd('0.00');
                    setConvertedEur('0.00');
                    fetchAccountData();
                } catch (e) {
                    console.error("Error during exchange:", e);
                    Swal.fire('Erro', `Não foi possível realizar a troca: ${e.message}`, 'error');
                } finally {
                    setLoadingExchange(false);
                }
            }
        });
    };

    const paperStyles = {
        p: 5,
        borderRadius: '16px',
        backgroundColor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
    };

    // Lógica de desativação do botão mais clara
    const isExchangeDisabled = loadingExchange || !brlAmount || parseFloat(brlAmount) <= 0 || !accountData || parseFloat(brlAmount) > accountData.balance;

    return (
        <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: 'background.default' }}>
            <AppAppBar />
            <Container maxWidth="lg" sx={{ pt: '120px', pb: 4 }}>
                <Typography variant="h4" gutterBottom sx={{color: 'text.primary'}}>Câmbio</Typography>
                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <CircularProgress />
                    </Box>
                )}
                {error && (
                    <Alert severity="error" sx={{ mt: 4 }}>
                        Error fetching exchange rates: {error}
                    </Alert>
                )}
                {exchangeRates && (
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <CurrencyCard currency="USD" value={exchangeRates.USD ? (1 / exchangeRates.USD).toFixed(2).replace('.', ',') : 'N/A'} flagUrl="https://flagcdn.com/us.svg" />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <CurrencyCard currency="EUR" value={exchangeRates.EUR ? (1 / exchangeRates.EUR).toFixed(2).replace('.', ',') : 'N/A'} flagUrl="https://flagcdn.com/eu.svg" />
                        </Grid>

                        <Grid item xs={12}>
                            <Paper elevation={0} sx={paperStyles}>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                    Meus Saldos
                                </Typography>
                                <Box>
                                    <Typography variant="body1" sx={{ mb: 1 }}>
                                        Saldo em BRL: <b style={{ color: theme.palette.text.primary }}>R$ {accountData?.balance?.toFixed(2).replace('.', ',') || '0,00'}</b>
                                    </Typography>
                                    <Typography variant="body1" sx={{ mb: 1 }}>
                                        Carteira USD: <b style={{ color: theme.palette.text.primary }}>USD {accountData?.usdWallet?.toFixed(2).replace('.', ',') || '0,00'}</b>
                                    </Typography>
                                    <Typography variant="body1" sx={{ mb: 0 }}>
                                        Carteira EUR: <b style={{ color: theme.palette.text.primary }}>EUR {accountData?.eurWallet?.toFixed(2).replace('.', ',') || '0,00'}</b>
                                    </Typography>
                                </Box>
                            </Paper>
                        </Grid>

                        <Grid item xs={12}>
                            <Paper elevation={0} sx={paperStyles}>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                    Realizar Câmbio
                                </Typography>
                                <TextField
                                    label="Valor em BRL para Câmbio"
                                    type="number"
                                    fullWidth
                                    value={brlAmount}
                                    onChange={handleBrlAmountChange}
                                    sx={{ mb: 3 }}
                                    InputProps={{ startAdornment: <InputAdornment position="start">R$</InputAdornment> }}
                                />
                                <Box sx={{ display: 'flex', justifyContent: 'space-around', gap: 2 }}>
                                    {/* Botões atualizados para não expandir */}
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        sx={{ flexGrow: 1, py: 1.5, textTransform: 'none' }}
                                        onClick={() => handleExchange('USD')}
                                        disabled={isExchangeDisabled}
                                    >
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <Typography variant="button">Trocar por USD</Typography>
                                            <Typography variant="caption">({convertedUsd})</Typography>
                                        </Box>
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        sx={{ flexGrow: 1, py: 1.5, textTransform: 'none' }}
                                        onClick={() => handleExchange('EUR')}
                                        disabled={isExchangeDisabled}
                                    >
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <Typography variant="button">Trocar por EUR</Typography>
                                            <Typography variant="caption">({convertedEur})</Typography>
                                        </Box>
                                    </Button>
                                </Box>
                                {loadingExchange && (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                        <CircularProgress />
                                    </Box>
                                )}
                            </Paper>
                        </Grid>
                    </Grid>
                )}
            </Container>

            <Container maxWidth={false} sx={{ px: { xs: 2, sm: 4 }, pb: 4 }}>
                {historicalData.length > 0 && (
                    <>
                        <Typography variant="h5" gutterBottom sx={{ mt: 4, color: 'text.primary', px: { xs: 0, lg: 2 } }}>
                            Histórico de câmbio (3 meses)
                        </Typography>
                        {loadingHistorical && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                <CircularProgress />
                            </Box>
                        )}
                        {errorHistorical && (
                            <Alert severity="error" sx={{ mt: 4 }}>
                                Error fetching historical rates: {errorHistorical}
                            </Alert>
                        )}
                        <Paper elevation={0} sx={{ ...paperStyles, mt: 2, height: '500px', p: { xs: 2, sm: 3, md: 4 } }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={historicalData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <defs>
                                        <linearGradient id="colorUsd" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="colorEur" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={theme.palette.secondary.main} stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor={theme.palette.secondary.main} stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} vertical={false} />
                                    <XAxis dataKey="date" stroke={theme.palette.text.secondary} tick={{ fontSize: 12 }} />
                                    <YAxis stroke={theme.palette.text.secondary} tick={{ fontSize: 12 }} tickFormatter={(value) => `R$${value.toFixed(2)}`} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: theme.palette.background.paper,
                                            borderColor: theme.palette.divider,
                                            borderRadius: '8px'
                                        }}
                                        formatter={(value, name) => [`R$ ${value.toFixed(4)}`, name]}
                                    />
                                    <Legend wrapperStyle={{ color: theme.palette.text.primary }}/>
                                    <Area type="monotone" dataKey="usd" name="USD para BRL" stroke={theme.palette.primary.main} strokeWidth={2} fillOpacity={1} fill="url(#colorUsd)" activeDot={{ r: 8 }} />
                                    <Area type="monotone" dataKey="eur" name="EUR para BRL" stroke={theme.palette.secondary.main} strokeWidth={2} fillOpacity={1} fill="url(#colorEur)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </Paper>
                    </>
                )}
            </Container>
        </Box>
    );
}