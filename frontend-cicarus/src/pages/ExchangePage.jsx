import * as React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Box, Container, Typography, Grid, Paper, CircularProgress, Alert, TextField, Button, InputAdornment
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import AppAppBar from '../components/AppAppBar.jsx';
import Swal from 'sweetalert2';

const API_URL = import.meta.env.VITE_API_URL || ''; // Assuming API_URL is defined in .env

const widgetStyle = {
    p: 5,
    borderRadius: '16px',
    backgroundColor: '#282d34',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    
    color: 'white',
};

const CurrencyCard = ({ currency, value, flagUrl }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
    >
        <Paper elevation={0} sx={widgetStyle}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <img src={flagUrl} alt={`${currency} flag`} style={{ width: 24, height: 24, borderRadius: '50%', marginRight: 12, objectFit: 'cover' }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{currency}</Typography>
            </Box>
            <Typography variant="h4" sx={{ color: '#e46820' }}>R$ {value}</Typography>
        </Paper>
    </motion.div>
);

export default function ExchangePage() {
    const [exchangeRates, setExchangeRates] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [historicalData, setHistoricalData] = useState([]);
    const [loadingHistorical, setLoadingHistorical] = useState(true);
    const [errorHistorical, setErrorHistorical] = useState(null);

    const [brlAmount, setBrlAmount] = useState('');
    const [convertedUsd, setConvertedUsd] = useState(0);
    const [convertedEur, setConvertedEur] = useState(0);
    const [accountData, setAccountData] = useState(null);
    const [loadingExchange, setLoadingExchange] = useState(false);

    const accountId = 1; // TODO: Get dynamically from user context

    const authHeader = () => {
        const token = localStorage.getItem('token') || ''; // Replace with actual token retrieval
        return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
    };

    const fetchAccountData = async () => {
        try {
            const response = await fetch(`${API_URL}/account/${accountId}`, { headers: authHeader() });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
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
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
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
                startDate.setMonth(endDate.getMonth() - 3); // Last 3 months

                const formatDate = (date) => date.toISOString().split('T')[0];

                const response = await fetch(`https://api.frankfurter.app/${formatDate(startDate)}..${formatDate(endDate)}?from=BRL&to=USD,EUR`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();

                if (!data || !data.rates) {
                    throw new Error('Invalid API response: rates data missing. Raw data: ' + JSON.stringify(data));
                }

                const processedData = Object.keys(data.rates).map(date => ({
                    date,
                    usd: data.rates[date].USD ? (1 / data.rates[date].USD) : null,
                    eur: data.rates[date].EUR ? (1 / data.rates[date].EUR) : null,
                }));

                setHistoricalData(processedData);
            } catch (e) {
                setErrorHistorical(e.message);
            } finally {
                setLoadingHistorical(false);
            }
        };

        fetchExchangeRates();
        fetchHistoricalRates();
        fetchAccountData(); // Fetch account data on component mount
    }, []);

    useEffect(() => {
        if (brlAmount && exchangeRates) {
            const amount = parseFloat(brlAmount);
            if (!isNaN(amount)) {
                setConvertedUsd((amount * exchangeRates.USD).toFixed(2));
                setConvertedEur((amount * exchangeRates.EUR).toFixed(2));
            } else {
                setConvertedUsd(0);
                setConvertedEur(0);
            }
        }
    }, [brlAmount, exchangeRates]);

    const handleBrlAmountChange = (event) => {
        setBrlAmount(event.target.value);
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
                    setConvertedUsd(0);
                    setConvertedEur(0);
                    fetchAccountData(); // Refresh account data
                } catch (e) {
                    console.error("Error during exchange:", e);
                    Swal.fire('Erro', `Não foi possível realizar a troca: ${e.message}`, 'error');
                } finally {
                    setLoadingExchange(false);
                }
            }
        });
    };

    return (
        <Box sx={{ width: '100%', minHeight: '100vh' }}>
            <AppAppBar />
            <Container maxWidth="lg" sx={{ pt: '120px', pb: 4 }}>
                <Typography variant="h4" gutterBottom>Câmbio</Typography>
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
                            <Paper elevation={0} sx={widgetStyle}>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                    Minhas Carteiras
                                </Typography>
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="body1" sx={{ mb: 1 }}>
                                        Saldo em BRL: <b>R$ {accountData?.balance?.toFixed(2).replace('.', ',') || '0,00'}</b>
                                    </Typography>
                                    <Typography variant="body1" sx={{ mb: 1 }}>
                                        Carteira USD: <b>USD {accountData?.usdWallet?.toFixed(2).replace('.', ',') || '0,00'}</b>
                                    </Typography>
                                    <Typography variant="body1" sx={{ mb: 0 }}>
                                        Carteira EUR: <b>EUR {accountData?.eurWallet?.toFixed(2).replace('.', ',') || '0,00'}</b>
                                    </Typography>
                                </Box>
                            </Paper>
                        </Grid>

                        <Grid item xs={12}>
                            <Paper elevation={0} sx={widgetStyle}>
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
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                                    }}
                                />
                                <Box sx={{ display: 'flex', justifyContent: 'space-around', gap: 2 }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        sx={{ flexGrow: 1, py: 1.5 }}
                                        onClick={() => handleExchange('USD')}
                                        disabled={loadingExchange || !brlAmount || parseFloat(brlAmount) <= 0 || !accountData || parseFloat(brlAmount) > accountData.balance}
                                    >
                                        Trocar por USD ({convertedUsd})
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        sx={{ flexGrow: 1, py: 1.5 }}
                                        onClick={() => handleExchange('EUR')}
                                        disabled={loadingExchange || !brlAmount || parseFloat(brlAmount) <= 0 || !accountData || parseFloat(brlAmount) > accountData.balance}
                                    >
                                        Trocar por EUR ({convertedEur})
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

                <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>Histórico de câmbio (3 meses)</Typography>
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
                {historicalData.length > 0 && (
                    <Paper elevation={0} sx={{ ...widgetStyle, mt: 4, height: 400 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={historicalData}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                                <XAxis dataKey="date" stroke="white" />
                                <YAxis stroke="white" />
                                <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
                                <Legend />
                                <Line type="monotone" dataKey="usd" stroke="#8884d8" activeDot={{ r: 8 }} name="USD para BRL" />
                                <Line type="monotone" dataKey="eur" stroke="#82ca9d" name="EUR para BRL" />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                )}
            </Container>
        </Box>
    );
}
