import * as React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import {
    Box, Container, Typography, Grid, Paper, CircularProgress, Alert
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import AppAppBar from '../components/AppAppBar.jsx';

const widgetStyle = {
    p: 5,
    borderRadius: '16px',
    backgroundColor: '#282d34',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    height: '100%',
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
    }, []);

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
