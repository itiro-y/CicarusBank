import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Box,
    Container,
    Typography,
    Paper,
    CircularProgress,
    Alert,
    Stack,
    Chip,
    Grid,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AppAppBar from "../../components/AppAppBar";
import { CardGiftcard, MonetizationOn, Event } from '@mui/icons-material';

export default function BenefitsPage() {
    const [benefits, setBenefits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const API_URL = 'http://localhost:8800';

    useEffect(() => {
        const fetchBenefits = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_URL}/benefits/list/all`);
                setBenefits(response.data);
            } catch (err) {
                console.error("Erro ao buscar benefícios:", err);
                setError("Não foi possível carregar os benefícios.");
            } finally {
                setLoading(false);
            }
        };

        fetchBenefits();
    }, []);

    const getTypeColor = (type) => {
        switch (type) {
            case 'SERVICE':
                return 'primary';
            case 'DISCOUNT':
                return 'success';
            case 'BONUS':
                return 'secondary';
            default:
                return 'default';
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <AppAppBar title="Benefícios Disponíveis Para Todos" />
            <Container maxWidth="md" sx={{ py: 4, pt: 16 }}>
                <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
                    Benefícios Disponíveis Para Todos
                </Typography>

                {loading && <CircularProgress color="primary" />}
                {error && <Alert severity="error">{error}</Alert>}
                {!loading && !error && benefits.length === 0 && (
                    <Typography variant="body1">Nenhum benefício encontrado.</Typography>
                )}

                {!loading && !error && (
                    <Stack spacing={3}>
                        {benefits.map((benefit) => (
                            <Paper
                                key={benefit.id}
                                elevation={4}
                                sx={{
                                    p: 3,
                                    borderRadius: '16px',
                                    background: isDark
                                        ? 'linear-gradient(135deg, #2e2e2e, #4b4b4b)'
                                        : 'linear-gradient(135deg, #f5f5f5, #dcdcdc)',
                                    color: isDark ? 'white' : 'black',
                                    border: isDark
                                        ? '1px solid rgba(255, 255, 255, 0.08)'
                                        : '1px solid rgba(0, 0, 0, 0.05)',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                                    transition: 'all 0.3s ease-in-out',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                                    },
                                }}
                            >
                                <Stack spacing={1}>
                                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                                        <CardGiftcard sx={{ mr: 1, color: 'orange' }} />
                                        {benefit.name}
                                    </Typography>

                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        {benefit.description}
                                    </Typography>

                                    <Grid container spacing={1}>
                                        <Grid item>
                                            <Chip
                                                label={benefit.type}
                                                color={getTypeColor(benefit.type)}
                                                size="small"
                                                variant="outlined"
                                            />
                                        </Grid>

                                        {benefit.value !== null && (
                                            <Grid item>
                                                <Chip
                                                    icon={<MonetizationOn />}
                                                    label={`R$ ${Number(benefit.value).toFixed(2)}`}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            </Grid>
                                        )}

                                        {benefit.validUntil && (
                                            <Grid item>
                                                <Chip
                                                    icon={<Event />}
                                                    label={`Válido até: ${new Date(benefit.validUntil).toLocaleDateString()}`}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            </Grid>
                                        )}
                                    </Grid>
                                </Stack>
                            </Paper>
                        ))}
                    </Stack>
                )}
            </Container>
        </Box>
    );
}
