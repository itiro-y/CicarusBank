import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Box, Container, Typography, Grid, Paper, IconButton,
    List, ListItem, ListItemAvatar, Avatar, ListItemText, Stack, Button, useTheme, TextField,
    FormControl, InputLabel, Select, MenuItem, InputAdornment, Step, Stepper, StepLabel, CircularProgress,
} from '@mui/material';
import {
    ArrowBack, CheckCircle, Smartphone, ArrowForward, PhoneIphone
} from '@mui/icons-material';
import AppAppBar from '../../components/AppAppBar.jsx';

// --- DADOS MOCK ---
const operators = [
    { name: 'Vivo', logo: 'https://logodownload.org/wp-content/uploads/2014/02/vivo-logo-4.png' },
    { name: 'Claro', logo: 'https://logodownload.org/wp-content/uploads/2014/02/claro-logo-1.png' },
    { name: 'TIM', logo: 'https://logospng.org/download/tim/logo-tim-2048.png' },
];

const rechargeAmounts = [15, 20, 30, 40, 50, 60];
const steps = ['Informações', 'Valor', 'Confirmação'];

const pageVariants = {
    initial: { opacity: 0, x: 50 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -50 }
};

const pageTransition = {
    type: 'spring',
    stiffness: 300,
    damping: 30
};

// --- COMPONENTE PRINCIPAL ---
export default function MobileRechargePage() {
    const theme = useTheme();
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = React.useState(0);
    const [selectedOperator, setSelectedOperator] = React.useState('');
    const [phoneNumber, setPhoneNumber] = React.useState('');
    const [selectedAmount, setSelectedAmount] = React.useState(0);
    const [isProcessing, setIsProcessing] = React.useState(false);
    const [isSuccess, setIsSuccess] = React.useState(false);

    const handleNext = () => setActiveStep((prev) => prev + 1);
    const handleBack = () => setActiveStep((prev) => prev - 1);

    const handleConfirmRecharge = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setIsSuccess(true);
        }, 2500);
    };

    const isNextDisabled = () => {
        if (activeStep === 0) return !selectedOperator || phoneNumber.length < 15;
        if (activeStep === 1) return selectedAmount === 0;
        return false;
    };

    const formatPhoneNumber = (value) => {
        const cleaned = ('' + value).replace(/\D/g, '');
        let match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
        if (match) {
            return `(${match[1]}) ${match[2]}-${match[3]}`;
        }
        match = cleaned.match(/^(\d{1,2})?(\d{1,5})?(\d{1,4})?$/);
        if (match) {
            let formatted = '';
            if (match[1]) formatted += `(${match[1]}`;
            if (match[2]) formatted += `) ${match[2]}`;
            if (match[3]) formatted += `-${match[3]}`;
            return formatted;
        }
        return value;
    };

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Stack spacing={3}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Operadora e Número</Typography>
                        <FormControl fullWidth>
                            <InputLabel>Operadora</InputLabel>
                            <Select value={selectedOperator} onChange={(e) => setSelectedOperator(e.target.value)} label="Operadora">
                                {operators.map(op => (
                                    <MenuItem key={op.name} value={op.name}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', height: '24px' }}>
                                            <img
                                                src={op.logo}
                                                alt={op.name}
                                                style={{
                                                    maxHeight: '20px',
                                                    maxWidth: '40px',
                                                    marginRight: '10px',
                                                    objectFit: 'contain'
                                                }}
                                            />
                                            {op.name}
                                        </Box>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            fullWidth
                            label="Número de Celular com DDD"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                            placeholder="(XX) XXXXX-XXXX"
                            InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIphone /></InputAdornment> }}
                            inputProps={{ maxLength: 15 }}
                        />
                    </Stack>
                );
            case 1:
                return (
                    <Stack spacing={3}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Escolha o Valor da Recarga</Typography>
                        <Grid container spacing={2}>
                            {rechargeAmounts.map(amount => (
                                <Grid item xs={6} sm={4} key={amount}>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Paper
                                            onClick={() => setSelectedAmount(amount)}
                                            elevation={selectedAmount === amount ? 8 : 1}
                                            sx={{
                                                p: 2,
                                                textAlign: 'center',
                                                cursor: 'pointer',
                                                borderRadius: '12px',
                                                border: '2px solid',
                                                borderColor: selectedAmount === amount ? 'primary.main' : 'divider',
                                                transform: selectedAmount === amount ? 'scale(1.05)' : 'scale(1)',
                                                transition: 'all 0.3s ease-in-out',
                                            }}
                                        >
                                            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>R$ {amount},00</Typography>
                                        </Paper>
                                    </motion.div>
                                </Grid>
                            ))}
                        </Grid>
                    </Stack>
                );
            case 2:
                return (
                    <Stack spacing={3}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Confirme os Dados</Typography>
                        <Paper elevation={0} sx={{ p: 2, borderRadius: '16px', border: '1px solid', borderColor: 'divider', bgcolor: 'action.hover' }}>
                            <List disablePadding>
                                <ListItem sx={{ py: 1.5, display: 'flex', alignItems: 'center' }}>
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: 'grey.300', color: 'black' }}>
                                            <Smartphone />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary="Número" secondary={phoneNumber} primaryTypographyProps={{fontWeight: 'medium'}}/>
                                </ListItem>
                                <ListItem sx={{ py: 1.5, display: 'flex', alignItems: 'center' }}>
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: 'white', p: 0.5, width: 35, height: 35 }}>
                                            <img src={operators.find(o => o.name === selectedOperator)?.logo} alt={selectedOperator} style={{ width: '100%', height: 'auto', objectFit: 'contain' }} />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary="Operadora" secondary={selectedOperator} primaryTypographyProps={{fontWeight: 'medium'}}/>
                                </ListItem>
                                <ListItem sx={{ py: 1.5, display: 'flex', alignItems: 'center' }}>
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: '#a5d6a7', color: 'black' }}>
                                            <CheckCircle />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary="Valor" secondary={`R$ ${selectedAmount.toFixed(2)}`} primaryTypographyProps={{fontWeight: 'medium'}}/>
                                </ListItem>
                            </List>
                        </Paper>
                    </Stack>
                );
            default:
                return null;
        }
    };

    if (isSuccess) {
        return (
            <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: 'background.default' }}>
                <AppAppBar />
                <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '80vh', textAlign: 'center' }}>
                    <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 260, damping: 20, delay: 0.2 } }}>
                        <img src="https://i.ibb.co/RkhCvzBP/Design-sem-nome-1-1.png" alt="Recarga Concluída" style={{ maxWidth: '400px', width: '100%', marginBottom: '2rem' }}/>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main', mb: 1 }}>Recarga Concluída!</Typography>
                        <Typography variant="h6" sx={{ color: 'text.secondary', mb: 4 }}>
                            Seu número {phoneNumber} foi recarregado com R$ {selectedAmount.toFixed(2)}.
                        </Typography>
                        <Button variant="contained" onClick={() => navigate('/dashboard')} size="large">
                            Voltar ao Início
                        </Button>
                    </motion.div>
                </Container>
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: 'background.default' }}>
            <AppAppBar />
            <Container maxWidth="sm" sx={{ pt: {xs: '100px', sm: '120px'}, pb: 4 }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <Paper elevation={0} sx={{ p: { xs: 2, sm: 4 }, borderRadius: '20px', border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                            <IconButton onClick={() => navigate('/dashboard')}><ArrowBack /></IconButton>
                            <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>Recarga de Celular</Typography>
                        </Stack>

                        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                            {steps.map(label => (<Step key={label}><StepLabel>{label}</StepLabel></Step>))}
                        </Stepper>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeStep}
                                variants={pageVariants}
                                initial="initial"
                                animate="in"
                                exit="out"
                                transition={pageTransition}
                                style={{ minHeight: '240px' }}
                            >
                                {renderStepContent(activeStep)}
                            </motion.div>
                        </AnimatePresence>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                            <Button disabled={activeStep === 0} onClick={handleBack}>
                                Voltar
                            </Button>
                            {activeStep === steps.length - 1 ? (
                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={handleConfirmRecharge}
                                    disabled={isProcessing}
                                    startIcon={isProcessing ? <CircularProgress size={20} color="inherit" /> : <CheckCircle />}
                                >
                                    {isProcessing ? 'Processando...' : 'Confirmar Recarga'}
                                </Button>
                            ) : (
                                <Button variant="contained" onClick={handleNext} disabled={isNextDisabled()} endIcon={<ArrowForward />}>
                                    Avançar
                                </Button>
                            )}
                        </Box>
                    </Paper>
                </motion.div>
            </Container>
        </Box>
    );
}