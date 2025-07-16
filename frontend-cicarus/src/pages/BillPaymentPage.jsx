import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Box, Container, Typography, Paper, Stack, Button, IconButton,
    TextField, List, ListItem, ListItemAvatar, Avatar, ListItemText,
    Divider, CircularProgress, Step, Stepper, StepLabel, InputAdornment, useTheme
} from '@mui/material';
import {
    ArrowBack, ReceiptLong, CheckCircle, ErrorOutline, Search, PriceCheck,
    DocumentScanner // Alterado de Barcode para DocumentScanner
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AppAppBar from '../components/AppAppBar.jsx';

// --- DADOS MOCK ---
const mockBills = [
    { id: 1, issuer: 'Netflix', dueDate: '20/07/2024', value: 39.90, barcode: '84670000000139901234567890123456789012345678' },
    { id: 2, issuer: 'Faculdade Anhanguera', dueDate: '25/07/2024', value: 850.50, barcode: '34191790010101234567890123456789012345678' },
    { id: 3, issuer: 'Condomínio Residencial', dueDate: '30/07/2024', value: 450.00, barcode: '0339985278123456789012345678901234567890' },
];

const pageVariants = {
    initial: { opacity: 0, x: 50 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -50 }
};

const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5
};

// --- COMPONENTES DA TELA ---

const Step0_Initial = ({ onFindBills, onManualEntry }) => {
    const theme = useTheme();
    return (
        <Stack spacing={4} alignItems="center" textAlign="center">
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Como você prefere pagar?</Typography>
            <Button
                variant="contained"
                size="large"
                startIcon={<Search />}
                onClick={onFindBills}
                sx={{ width: '80%', py: 1.5 }}
            >
                Buscar boletos no meu CPF
            </Button>
            <Button
                variant="outlined"
                size="large"
                startIcon={<DocumentScanner />} // Ícone corrigido
                onClick={onManualEntry}
                sx={{ width: '80%', py: 1.5 }}
            >
                Digitar código de barras
            </Button>
        </Stack>
    );
};

const Step1_FindBills = ({ onSelectBill, onBack }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1500); // Simula busca
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>;
    }

    return (
        <Stack spacing={2}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Boletos Encontrados</Typography>
            <List>
                {mockBills.map((bill, index) => (
                    <React.Fragment key={bill.id}>
                        <ListItem
                            secondaryAction={
                                <Button edge="end" onClick={() => onSelectBill(bill)}>Pagar</Button>
                            }
                        >
                            <ListItemAvatar>
                                <Avatar><ReceiptLong /></Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={bill.issuer}
                                secondary={`Vence em: ${bill.dueDate} - R$ ${bill.value.toFixed(2)}`}
                            />
                        </ListItem>
                        {index < mockBills.length - 1 && <Divider />}
                    </React.Fragment>
                ))}
            </List>
            <Button onClick={onBack} sx={{ mt: 2 }}>Voltar</Button>
        </Stack>
    );
};

const Step1_ManualEntry = ({ onConfirm, onBack }) => {
    const [barcode, setBarcode] = useState('');
    return (
        <Stack spacing={3}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Digite ou escaneie o código</Typography>
            <TextField
                fullWidth
                label="Código de Barras"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                placeholder="00000.00000 00000.000000..."
            />
            <Stack direction="row" spacing={2} sx={{ justifyContent: 'space-between' }}>
                <Button onClick={onBack}>Voltar</Button>
                <Button variant="contained" onClick={() => onConfirm({
                    issuer: 'Boleto Genérico',
                    value: 199.99, // Valor viria da decodificação do boleto
                    dueDate: '31/07/2024'
                })} disabled={!barcode}>Continuar</Button>
            </Stack>
        </Stack>
    );
};


const Step2_Confirmation = ({ bill, onConfirm, onBack, processing }) => {
    return (
        <Stack spacing={3} textAlign="center">
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Confirme o Pagamento</Typography>
            <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid', borderColor: 'divider', bgcolor: 'action.hover' }}>
                <Typography variant="h5">{bill.issuer}</Typography>
                <Typography variant="h3" sx={{ my: 2, fontWeight: 'bold', color: 'primary.main' }}>
                    R$ {bill.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </Typography>
                <Typography color="text.secondary">Vencimento: {bill.dueDate}</Typography>
            </Paper>
            <Stack direction="row" spacing={2} sx={{ justifyContent: 'space-between' }}>
                <Button onClick={onBack} disabled={processing}>Voltar</Button>
                <Button variant="contained" onClick={onConfirm} disabled={processing} startIcon={processing && <CircularProgress size={20} />}>
                    {processing ? 'Pagando...' : 'Confirmar Pagamento'}
                </Button>
            </Stack>
        </Stack>
    );
};

const Step3_Result = ({ success, onReset }) => (
    <Stack spacing={2} alignItems="center" textAlign="center">
        {success ? (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }}>
                <CheckCircle sx={{ fontSize: 80, color: 'success.main' }} />
            </motion.div>
        ) : (
            <ErrorOutline sx={{ fontSize: 80, color: 'error.main' }} />
        )}
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            {success ? 'Pagamento Realizado!' : 'Pagamento Falhou'}
        </Typography>
        <Typography color="text.secondary">
            {success ? 'Seu boleto foi pago com sucesso. O comprovante está disponível em seu extrato.' : 'Não foi possível concluir o pagamento. Tente novamente.'}
        </Typography>
        <Button variant="contained" onClick={onReset} sx={{ mt: 2 }}>Fazer Novo Pagamento</Button>
    </Stack>
);

// --- PÁGINA PRINCIPAL ---
export default function BillPaymentPage() {
    const navigate = useNavigate();
    const [screen, setScreen] = useState('initial'); // initial, findBills, manualEntry, confirm, result
    const [selectedBill, setSelectedBill] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleFindBills = () => setScreen('findBills');
    const handleManualEntry = () => setScreen('manualEntry');

    const handleSelectBill = (bill) => {
        setSelectedBill(bill);
        setScreen('confirm');
    };

    const handleConfirmPayment = () => {
        setIsProcessing(true);
        setTimeout(() => {
            const success = Math.random() > 0.2; // Simula sucesso/falha
            setIsSuccess(success);
            setIsProcessing(false);
            setScreen('result');
        }, 2000);
    };

    const handleReset = () => {
        setScreen('initial');
        setSelectedBill(null);
    };

    const renderContent = () => {
        switch (screen) {
            case 'initial':
                return <Step0_Initial onFindBills={handleFindBills} onManualEntry={handleManualEntry} />;
            case 'findBills':
                return <Step1_FindBills onSelectBill={handleSelectBill} onBack={handleReset} />;
            case 'manualEntry':
                return <Step1_ManualEntry onConfirm={handleSelectBill} onBack={handleReset} />;
            case 'confirm':
                return <Step2_Confirmation bill={selectedBill} onConfirm={handleConfirmPayment} onBack={() => setScreen(selectedBill.barcode ? 'manualEntry' : 'findBills')} processing={isProcessing} />;
            case 'result':
                return <Step3_Result success={isSuccess} onReset={handleReset} />;
            default:
                return null;
        }
    };

    return (
        <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: 'background.default' }}>
            <AppAppBar />
            <Container maxWidth="sm" sx={{ pt: { xs: '100px', sm: '120px' }, pb: 4 }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <Paper elevation={0} sx={{ p: { xs: 2, sm: 4 }, borderRadius: '20px', border: '1px solid', borderColor: 'divider' }}>
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 4 }}>
                            <IconButton onClick={() => navigate('/dashboard')}><ArrowBack /></IconButton>
                            <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>Pagamentos</Typography>
                        </Stack>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={screen}
                                variants={pageVariants}
                                initial="initial"
                                animate="in"
                                exit="out"
                                transition={pageTransition}
                            >
                                {renderContent()}
                            </motion.div>
                        </AnimatePresence>
                    </Paper>
                </motion.div>
            </Container>
        </Box>
    );
}