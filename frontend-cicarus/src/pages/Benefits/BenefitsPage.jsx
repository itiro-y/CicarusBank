// src/pages/BenefitsPage.jsx (Relembrando o conteúdo)
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Box, Container, Typography, Paper, CircularProgress, Alert, Stack
} from '@mui/material';
import AppAppBar from '../../components/AppAppBar.jsx'; // Certifique-se de que o caminho está correto

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8765'; // URL base do seu API Gateway

export default function BenefitsPage() {
    const [benefits, setBenefits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBenefits = async () => {
            try {
                setLoading(true);
                setError(null);

                const customerId = 1; // SUBSTITUA PELA LÓGICA REAL DE OBTENÇÃO DO ID DO CLIENTE
                const token = localStorage.getItem('token');
                if (!token) {
                    setError("Token de autenticação não encontrado. Faça login.");
                    setLoading(false);
                    return;
                }

                // AJUSTE A URL EXATA DO SEU ENDPOINT DE BENEFÍCIOS
                const response = await axios.get(`${API_URL}/benefits/api/benefits/customer/${customerId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setBenefits(response.data);
            } catch (err) {
                console.error("Erro ao buscar benefícios:", err);
                setError("Não foi possível carregar os benefícios. Tente novamente mais tarde.");
            } finally {
                setLoading(false);
            }
        };

        fetchBenefits();
    }, []);

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <AppAppBar title="Seus Benefícios" />
            <Container maxWidth="md" sx={{ py: 4, pt: 16 }}>
                <Typography variant="h4" gutterBottom sx={{ color: 'white', mb: 4 }}>
                    Benefícios Disponíveis
                </Typography>

                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <CircularProgress />
                        <Typography sx={{ ml: 2, color: 'text.secondary' }}>Carregando benefícios...</Typography>
                    </Box>
                )}

                {error && (
                    <Alert severity="error" sx={{ mt: 4 }}>
                        {error}
                    </Alert>
                )}

                {!loading && !error && benefits.length === 0 && (
                    <Typography variant="h6" sx={{ color: 'text.secondary', textAlign: 'center', mt: 4 }}>
                        Nenhum benefício encontrado no momento.
                    </Typography>
                )}

                {!loading && !error && benefits.length > 0 && (
                    <Stack spacing={3}>
                        {benefits.map((benefit) => (
                            <Paper
                                key={benefit.id}
                                elevation={3}
                                sx={{
                                    p: 3,
                                    borderRadius: '12px',
                                    bgcolor: '#282d34',
                                    color: 'white',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    transition: 'transform 0.2s',
                                    '&:hover': {
                                        transform: 'translateY(-5px)',
                                    }
                                }}
                            >
                                <Typography variant="h5" sx={{ mb: 1, color: '#f57c00' }}>
                                    {benefit.name}
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary' }}>
                                    {benefit.description}
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        Tipo: <Typography component="span" variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>{benefit.type}</Typography>
                                    </Typography>
                                    {benefit.value && (
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            Valor: <Typography component="span" variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>{benefit.value.toFixed(2)}</Typography>
                                        </Typography>
                                    )}
                                    {benefit.validUntil && (
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            Válido até: <Typography component="span" variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>{new Date(benefit.validUntil).toLocaleDateString()}</Typography>
                                        </Typography>
                                    )}
                                </Box>
                            </Paper>
                        ))}
                    </Stack>
                )}
            </Container>
        </Box>
    );
}