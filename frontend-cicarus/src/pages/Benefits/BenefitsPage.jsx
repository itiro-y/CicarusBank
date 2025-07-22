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
    Snackbar,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { useTheme } from '@mui/material/styles';
import AppAppBar from "../../components/AppAppBar";
import { CardGiftcard, MonetizationOn, Event, CheckCircleOutline, ContentCopy } from '@mui/icons-material';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function BenefitsPage() {
    const [benefits, setBenefits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pageError, setPageError] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [coupons, setCoupons] = useState({});

    const theme = useTheme();

    const API_URL = import.meta.env.VITE_API_URL || '';

    useEffect(() => {
        const fetchBenefits = async () => {
            try {
                setLoading(true);
                setPageError(null);
                const response = await axios.get(`${API_URL}/benefits/list/all`);
                setBenefits(response.data);

                const initialCoupons = {};
                response.data.forEach(benefit => {
                    if (benefit.active) {
                        initialCoupons[benefit.id] = `CICARUS-${benefit.id}-${Math.floor(Math.random() * 9000 + 1000)}`;
                    }
                });
                setCoupons(initialCoupons);

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

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            handleOpenSnackbar("Cupom copiado para a área de transferência!", "success");
        }).catch(err => {
            console.error('Erro ao copiar:', err);
            handleOpenSnackbar("Erro ao copiar o cupom.", "error");
        });
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


            const fakeCoupon = `CICARUS-${benefitToActivate.id}-${Math.floor(Math.random() * 9000 + 1000)}`;

            setCoupons(prev => ({
                ...prev,
                [benefitToActivate.id]: fakeCoupon,
            }));

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
                } else if (err.response.status === 409) {
                    errorMessage = "Este benefício já foi resgatado.";
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
                <Typography variant="h4" gutterBottom sx={{ mb: 4 }} color="text.primary">
                    Benefícios Disponíveis Para Todos
                </Typography>

                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <CircularProgress />
                        <Typography sx={{ ml: 2 }} color="text.secondary">
                            Carregando benefícios...
                        </Typography>
                    </Box>
                )}

                {pageError && (
                    <MuiAlert severity="error" sx={{ mt: 4 }}>
                        {pageError}
                    </MuiAlert>
                )}

                {!loading && !pageError && benefits.length === 0 && (
                    <Typography variant="h6" sx={{ textAlign: 'center', mt: 4 }} color="text.secondary">
                        Nenhum benefício padrão encontrado no momento.
                    </Typography>
                )}

                {!loading && !pageError && (
                    <Stack spacing={3}>
                        {benefits.map((benefit) => (
                            <Paper
                                key={benefit.id}
                                elevation={0}
                                sx={{
                                    p: 3,
                                    borderRadius: '16px',
                                    backgroundColor: 'background.paper',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    transition: 'all 0.3s ease-in-out',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
                                    },
                                }}
                            >
                                <Stack spacing={1}>
                                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }} color="text.primary">
                                        <CardGiftcard sx={{ mr: 1, color: 'orange' }} />
                                        {benefit.name}
                                    </Typography>

                                    <Typography variant="body2" sx={{ mb: 1 }} color="text.secondary">
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

                                        <Grid item xs={12} sm="auto">
                                            {benefit.active ? (
                                                <Stack spacing={1} direction={{ xs: 'column', sm: 'row' }} alignItems="center">
                                                    <Chip
                                                        icon={<CheckCircleOutline />}
                                                        label="Resgatado"
                                                        color="success"
                                                        variant="filled"
                                                    />
                                                    {coupons[benefit.id] && (
                                                        <Button
                                                            variant="outlined"
                                                            color="primary"
                                                            size="small"
                                                            startIcon={<ContentCopy />}
                                                            onClick={() => copyToClipboard(coupons[benefit.id])}
                                                            sx={{ mt: { xs: 1, sm: 0 } }}
                                                        >
                                                            Copiar Cupom
                                                        </Button>
                                                    )}
                                                </Stack>
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