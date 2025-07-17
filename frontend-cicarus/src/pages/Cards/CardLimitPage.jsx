import React, { useState, useEffect } from 'react';
import {
    Box, Container, Typography, Paper, Slider, Button,
    CircularProgress, Grid, Toolbar, useTheme, Alert
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import AppAppBar from '../../components/AppAppBar.jsx';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { SiVisa, SiMastercard } from 'react-icons/si';

const API_URL = import.meta.env.VITE_API_URL || '';

// --- 3D Card Component (Simulated with CSS & Framer Motion) ---
const Card3D = ({ card, isSelected, onClick }) => {
    const theme = useTheme();

    const getNetworkIcon = (network) => {
        if (network?.toLowerCase().includes('visa')) return <SiVisa size={40} color="white" />;
        if (network?.toLowerCase().includes('mastercard')) return <SiMastercard size={40} color="white" />;
        return null;
    };

    return (
        <motion.div
            onClick={onClick}
            animate={{ scale: isSelected ? 1.05 : 1, z: isSelected ? 10 : 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{
                perspective: '1000px',
                cursor: 'pointer'
            }}
        >
            <Paper
                elevation={isSelected ? 12 : 4}
                sx={{
                    padding: 3,
                    height: 220,
                    borderRadius: 4,
                    background: 'linear-gradient(45deg, #2d3748 30%, #4a5568 90%)',
                    color: 'white',
                    position: 'relative',
                    transition: 'box-shadow 0.3s ease-in-out',
                    transformStyle: 'preserve-3d',
                }}
            >
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <img
                        src="https://i.postimg.cc/jjZF98Pp/download-1.png"
                        alt="Bank Logo"
                        style={{ width: '100px', height: 'auto' }}
                    />
                    {getNetworkIcon(card.network)}
                </Box>

                <Typography variant="h5" letterSpacing={3} sx={{ fontFamily: 'monospace', my: 4 }}>
                    **** **** **** {card.last4Digits}
                </Typography>

                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {card.cardholderName}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {new Date(card.expiry).toLocaleDateString('pt-BR', { month: '2-digit', year: '2-digit' })}
                    </Typography>
                </Box>
            </Paper>
        </motion.div>
    );
};


// --- Main Page Component ---
export default function CardLimitPage() {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCard, setSelectedCard] = useState(null);
    const [newLimit, setNewLimit] = useState(0);
    const [updating, setUpdating] = useState(false);
    const theme = useTheme();

    useEffect(() => {
        fetchCards();
    }, []);

    async function fetchCards() {
        setLoading(true);
        try {
            // Fetch only physical cards that can have their limits adjusted
            const res = await fetch(`${API_URL}/card/list/1`);
            const allCards = await res.json();
            const physicalCards = allCards.filter(c => c.cardType !== 'VIRTUAL');
            setCards(physicalCards);
            if (physicalCards.length > 0) {
                handleCardSelect(physicalCards[0]);
            }
        } catch (err) {
            console.error('Erro ao buscar cartões:', err);
        } finally {
            setLoading(false);
        }
    }

    const handleCardSelect = (card) => {
        setSelectedCard(card);
        setNewLimit(card.creditLimit);
    };

    const handleLimitChange = (event, value) => {
        setNewLimit(value);
    };

    const handleUpdateLimit = async () => {
        setUpdating(true);
        try {
            // Mock API call
            console.log(`Updating limit for card ${selectedCard.id} to ${newLimit}`);
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Update card in local state for immediate feedback
            const updatedCards = cards.map(c =>
                c.id === selectedCard.id ? { ...c, creditLimit: newLimit } : c
            );
            setCards(updatedCards);
            setSelectedCard(prev => ({ ...prev, creditLimit: newLimit }));


            Swal.fire({
                icon: 'success',
                title: 'Limite Atualizado!',
                text: `O novo limite do seu cartão final ${selectedCard.last4Digits} é de R$ ${newLimit.toLocaleString('pt-BR')}.`,
                background: theme.palette.background.paper,
                color: theme.palette.text.primary,
            });

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Erro!',
                text: 'Não foi possível atualizar o limite do cartão.',
                background: theme.palette.background.paper,
                color: theme.palette.text.primary,
            });
        } finally {
            setUpdating(false);
        }
    };

    const pageVariants = {
        initial: { opacity: 0, y: 50 },
        in: { opacity: 1, y: 0 },
        out: { opacity: 0, y: -50 }
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <AppAppBar />
            <Toolbar />
            <Container maxWidth="md" sx={{ py: 4, mt: 5 }}>
                <motion.div initial="initial" animate="in" variants={pageVariants} transition={{ duration: 0.5 }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 2 }}>
                        Ajuste de Limite
                    </Typography>
                    <Typography color="text.secondary" sx={{ textAlign: 'center', mb: 4 }}>
                        Selecione um cartão e deslize para definir um novo limite de crédito.
                    </Typography>

                    {loading ? (
                        <Box display="flex" justifyContent="center"><CircularProgress /></Box>
                    ) : (
                        <Grid container spacing={4} justifyContent="center">
                            {cards.map(card => (
                                <Grid item key={card.id} xs={12} sm={6} md={5}>
                                    <Card3D
                                        card={card}
                                        isSelected={selectedCard?.id === card.id}
                                        onClick={() => handleCardSelect(card)}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    )}

                    <AnimatePresence>
                        {selectedCard && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                            >
                                <Paper variant="outlined" sx={{ mt: 5, p: 4, borderRadius: 4 }}>
                                    <Typography sx={{ fontWeight: 'bold' }}>
                                        Limite do cartão final {selectedCard.last4Digits}
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                        <Typography color="text.secondary">Disponível: R$ {selectedCard.creditLimit.toLocaleString('pt-BR')}</Typography>
                                        <Typography color="primary" sx={{ fontWeight: 'bold' }}>
                                            Novo Limite: R$ {newLimit.toLocaleString('pt-BR')}
                                        </Typography>
                                    </Box>
                                    <Slider
                                        value={newLimit}
                                        onChange={handleLimitChange}
                                        min={500}
                                        max={25000}
                                        step={100}
                                        sx={{ mt: 2 }}
                                    />
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        size="large"
                                        sx={{ mt: 3 }}
                                        onClick={handleUpdateLimit}
                                        disabled={updating || newLimit === selectedCard.creditLimit}
                                    >
                                        {updating ? <CircularProgress size={24} color="inherit" /> : 'Confirmar Novo Limite'}
                                    </Button>
                                </Paper>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    {!loading && cards.length === 0 && (
                        <Alert severity="info" sx={{ mt: 4 }}>
                            Você não possui cartões físicos disponíveis para ajuste de limite.
                        </Alert>
                    )}
                </motion.div>
            </Container>
        </Box>
    );
}