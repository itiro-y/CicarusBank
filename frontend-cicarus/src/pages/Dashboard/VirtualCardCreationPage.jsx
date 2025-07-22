import React, { useState } from 'react';
import {
    Box, Container, Typography, Paper, Stack, TextField, Button,
    FormControl, InputLabel, Select, MenuItem, CircularProgress, useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AppAppBar from '../../components/AppAppBar.jsx';
import CreditCard from '../../components/CreditCard.jsx';

// Ícones
import AddCardIcon from '@mui/icons-material/AddCard';
import TimelapseIcon from '@mui/icons-material/Timelapse';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const steps = ['Configurar', 'Criando', 'Concluído'];

export default function VirtualCardCreationPage() {
    const [activeStep, setActiveStep] = useState(0);
    const [cardName, setCardName] = useState('');
    const [validity, setValidity] = useState(24); // Em horas
    const [createdCard, setCreatedCard] = useState(null);
    const navigate = useNavigate();
    const theme = useTheme();

    const generateVirtualCard = () => {
        // Simula a geração de dados do cartão
        const cardNumber = `5432 1098 7654 ${Math.floor(1000 + Math.random() * 9000)}`;
        const expiryDate = new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() + 2); // Validade de 2 anos no cartão

        const expiryTimestamp = new Date().getTime() + validity * 60 * 60 * 1000; // Validade de uso

        return {
            id: `virtual-${Date.now()}`,
            cardholderName: cardName || 'Cartão Virtual',
            cardNumber,
            expiry: expiryDate.toISOString().slice(0, 7), // YYYY-MM
            cvvHash: `${Math.floor(100 + Math.random() * 900)}`, // CVV de 3 dígitos
            last4Digits: cardNumber.slice(-4),
            network: Math.random() > 0.5 ? 'Visa' : 'Mastercard',
            cardType: 'VIRTUAL',
            status: 'ACTIVE',
            creditLimit: 5000,
            expiryTimestamp, // Timestamp para remoção automática
        };
    };

    const handleCreateCard = () => {
        setActiveStep(1); // Vai para a tela de "Criando..."

        setTimeout(() => {
            const newCard = generateVirtualCard();
            setCreatedCard(newCard);

            // Salva o cartão no localStorage
            const existingVirtualCards = JSON.parse(localStorage.getItem('virtualCards')) || [];
            localStorage.setItem('virtualCards', JSON.stringify([...existingVirtualCards, newCard]));

            setActiveStep(2); // Vai para a tela de "Concluído"
        }, 3500); // Simula o tempo de criação
    };

    const renderContent = () => {
        switch (activeStep) {
            case 0: // Configurar
                return (
                    <motion.div key="step0" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Personalize seu cartão</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Dê um nome e escolha por quanto tempo ele será válido.
                        </Typography>
                        <Stack spacing={3}>
                            <TextField
                                label="Apelido do Cartão (opcional)"
                                value={cardName}
                                onChange={(e) => setCardName(e.target.value)}
                                variant="outlined"
                                fullWidth
                                InputProps={{ startAdornment: <AddCardIcon sx={{ mr: 1, color: 'text.secondary' }} /> }}
                            />
                            <FormControl fullWidth>
                                <InputLabel>Validade do Cartão</InputLabel>
                                <Select
                                    value={validity}
                                    label="Validade do Cartão"
                                    onChange={(e) => setValidity(e.target.value)}
                                    startAdornment={<TimelapseIcon sx={{ mr: 1, color: 'text.secondary' }} />}
                                >
                                    <MenuItem value={24}>24 Horas</MenuItem>
                                    <MenuItem value={168}>7 Dias</MenuItem>
                                    <MenuItem value={720}>30 Dias</MenuItem>
                                </Select>
                            </FormControl>
                        </Stack>
                        <Button
                            variant="contained"
                            fullWidth
                            size="large"
                            sx={{ mt: 4, py: 1.5 }}
                            onClick={handleCreateCard}
                        >
                            Criar Cartão Virtual
                        </Button>
                    </motion.div>
                );

            case 1: // Criando
                return (
                    <motion.div key="step1" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Estamos construindo seu cartão...</Typography>
                        <Typography color="text.secondary">Aguarde um momento.</Typography>
                        <img
                            src="https://i.postimg.cc/26BXBX5g/credit-card-2.gif"
                            alt="Criando cartão"
                            style={{ width: '80%', maxWidth: '300px', margin: '2rem 0' }}
                        />
                    </motion.div>
                );

            case 2: // Concluído
                return (
                    <motion.div key="step2" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                        <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Seu cartão virtual está pronto!</Typography>
                        <Box sx={{ my: 3, transform: 'scale(0.9)' }}>
                            <CreditCard card={createdCard} />
                        </Box>
                        <Button
                            variant="contained"
                            fullWidth
                            size="large"
                            onClick={() => navigate('/user-card')} // Navega para a página de cartões
                        >
                            Ver Meus Cartões
                        </Button>
                    </motion.div>
                );

            default: return null;
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <AppAppBar />
            <Container maxWidth="sm" sx={{ pt: { xs: 12, md: 16 }, pb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Paper
                    variant="outlined"
                    sx={{
                        p: { xs: 2, sm: 4 },
                        width: '100%',
                        borderRadius: '16px',
                        textAlign: 'center',
                        minHeight: 450,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <AnimatePresence mode="wait">
                        {renderContent()}
                    </AnimatePresence>
                </Paper>
            </Container>
        </Box>
    );
}