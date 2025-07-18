import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Box,
    Container,
    Typography,
    Paper,
    CircularProgress,
    Stack,
    Chip,
    Grid,
    Button,
    Snackbar, // Importe Snackbar
} from '@mui/material';
import MuiAlert from '@mui/material/Alert'; // Importe Alert de um caminho diferente para ser usado com Snackbar
import { useTheme } from '@mui/material/styles';
import AppAppBar from "../../components/AppAppBar";
import { CardGiftcard, MonetizationOn, Event, CheckCircleOutline } from '@mui/icons-material';

// Função auxiliar para o Alert dentro do Snackbar
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function BenefitsPage() {
    const [benefits, setBenefits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pageError, setPageError] = useState(null); // Renomeado para evitar conflito com 'error' do snackbar
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const API_URL = 'http://localhost:8800'; // Ajuste conforme sua configuração

    useEffect(() => {
        const fetchBenefits = async () => {
            try {
                setLoading(true);
                setPageError(null);
                const response = await axios.get(`${API_URL}/benefits/list/all`);
                setBenefits(response.data);
            } catch (err) {
                console.error("Erro ao buscar benefícios:", err);
                setPageError("Não foi possível carregar os benefícios.");
                if (err.response) {
                    if (err.response.status === 401 || err.response.status === 403) {
                        setPageError("Sessão expirada ou não autenticado. Por favor, faça login novamente.");
                    }
                }
            } finally {
                setLoading(false);
            }
        };

        fetchBenefits();
    }, []);

    const handleOpenSnackbar = (message, severity) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const handleActivateBenefit = async (benefitToActivate) => {
        try {
            const updatedBenefitData = {
                id: benefitToActivate.id,
                name: benefitToActivate.name,
                description: benefitToActivate.description,
                type: benefitToActivate.type,
                value: benefitToActivate.value,
                validUntil: benefitToActivate.validUntil,
                active: true,
            };

            const response = await axios.put(`${API_URL}/benefits/${benefitToActivate.id}`, updatedBenefitData);

            setBenefits(prevBenefits =>
                prevBenefits.map(b =>
                    b.id === benefitToActivate.id ? { ...b, active: response.data.active } : b
                )
            );
            handleOpenSnackbar(`Benefício "${response.data.name}" resgatado com sucesso!`, 'success');
        } catch (err) {
            console.error("Erro ao resgatar benefício:", err);
            let errorMessage = "Não foi possível resgatar o benefício. Tente novamente mais tarde.";
            if (err.response) {
                if (err.response.status === 401 || err.response.status === 403) {
                    errorMessage = "Você não está autorizado a resgatar este benefício. Faça login ou verifique suas permissões.";
                } else if (err.response.status === 404) {
                    errorMessage = "Benefício não encontrado.";
                }
            }
            handleOpenSnackbar(errorMessage, 'error');
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'SERVICE': return 'primary';
            case 'DISCOUNT': return 'success';
            case 'BONUS': return 'secondary';
            case 'INSURANCE': return 'error';
            case 'CASHBACK': return 'info';
            default: return 'default';
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <AppAppBar title="Benefícios Disponíveis Para Todos" />
            <Container maxWidth="md" sx={{ py: 4, pt: 16 }}>
                <Typography variant="h4" gutterBottom sx={{ mb: 4 }} color={isDark ? 'white' : 'black'}>
                    Benefícios Disponíveis Para Todos
                </Typography>

                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <CircularProgress />
                        <Typography sx={{ ml: 2 }} color={isDark ? 'text.secondary' : 'text.secondary'}>Carregando benefícios...</Typography>
                    </Box>
                )}

                {pageError && (
                    <MuiAlert severity="error" sx={{ mt: 4 }}>
                        {pageError}
                    </MuiAlert>
                )}

                {!loading && !pageError && benefits.length === 0 && (
                    <Typography variant="h6" sx={{ textAlign: 'center', mt: 4 }} color={isDark ? 'text.secondary' : 'text.secondary'}>
                        Nenhum benefício padrão encontrado no momento.
                    </Typography>
                )}

                {!loading && !pageError && (
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
                                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }} color={isDark ? 'text.primary' : 'text.primary'}>
                                        <CardGiftcard sx={{ mr: 1, color: 'orange' }} />
                                        {benefit.name}
                                    </Typography>

                                    <Typography variant="body2" sx={{ mb: 1 }} color={isDark ? 'text.secondary' : 'text.secondary'}>
                                        {benefit.description}
                                    </Typography>

                                    <Grid container spacing={1} alignItems="center" justifyContent="space-between">
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
                                                    label={`Válido até: ${new Date(benefit.validUntil).toLocaleDateString('pt-BR')}`}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            </Grid>
                                        )}

                                        <Grid item>
                                            {benefit.active ? (
                                                <Chip
                                                    icon={<CheckCircleOutline />}
                                                    label="Resgatado"
                                                    color="success"
                                                    variant="filled"
                                                />
                                            ) : (
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    size="small"
                                                    onClick={() => handleActivateBenefit(benefit)}
                                                    sx={{ mt: { xs: 1, sm: 0 } }}
                                                >
                                                    Resgatar Benefício
                                                </Button>
                                            )}
                                        </Grid>
                                    </Grid>
                                </Stack>
                            </Paper>
                        ))}
                    </Stack>
                )}
            </Container>

            {/* Snackbar para mensagens de sucesso/erro */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}