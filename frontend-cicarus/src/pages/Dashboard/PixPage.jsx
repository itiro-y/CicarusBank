import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Box, Container, Typography, Paper, TextField, Button, IconButton, Stack,
    Tooltip, useTheme, Avatar, CircularProgress, InputAdornment, Divider,
    Dialog, DialogTitle, DialogContent, Fab, List, ListItem, ListItemAvatar, ListItemText,
    DialogActions, Grid, ListItemButton
} from '@mui/material';
import {
    ContentCopy as ContentCopyIcon,
    QrCode2 as QrCode2Icon,
    ArrowBack as ArrowBackIcon,
    CheckCircle as CheckCircleIcon,
    ErrorOutline as ErrorOutlineIcon,
    Add as AddIcon,
    Close as CloseIcon,
    PhotoCamera,
    MoreHoriz as MoreHorizIcon,
    Key as KeyIcon
} from '@mui/icons-material';
import { FaPix } from "react-icons/fa6";
import AppAppBar from '../../components/AppAppBar.jsx';
import Swal from 'sweetalert2';
import { useUser } from '../../context/UserContext.jsx';

const accountId = localStorage.getItem('accountId');

const API_URL = import.meta.env.VITE_API_URL || '';

const authHeader = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token') || ''}` });

const initialFavoriteContacts = [
    { id: 1, name: 'Maria Silva', avatarUrl: 'https://i.pravatar.cc/150?u=maria', pixKey: 'maria.silva@email.com' },
    { id: 2, name: 'João Santos', avatarUrl: 'https://i.pravatar.cc/150?u=joao', pixKey: '11987654321' },
    { id: 3, name: 'Ana Costa', avatarUrl: 'https://i.pravatar.cc/150?u=ana', pixKey: '123.456.789-00' },
    { id: 4, name: 'Lucas Souza', avatarUrl: 'https://i.pravatar.cc/150?u=lucas', pixKey: '8a1b2c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5d' },
    { id: 5, name: 'Beatriz Lima', avatarUrl: 'https://i.pravatar.cc/150?u=bia', pixKey: 'beatriz.lima@email.com' },
];

const PageHeader = () => (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Stack direction="row" alignItems="center" spacing={1.5} justifyContent="center">
            <Box sx={{ color: '#d75b00', display: 'flex', alignItems: 'center' }}>
                <FaPix size={32} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', letterSpacing: '-0.5px' }}>Área Pix</Typography>
        </Stack>
        <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 1 }}>
            Pague, transfira e receba de forma instantânea e segura.
        </Typography>
    </motion.div>
);

const AddContactModal = ({ open, onClose, onAdd }) => {
    const [name, setName] = useState('');
    const [pixKey, setPixKey] = useState('');
    const [avatarPreview, setAvatarPreview] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setAvatarPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = () => {
        if (!name || !pixKey) {
            Swal.fire('Atenção', 'Nome e Chave Pix são obrigatórios.', 'warning');
            return;
        }
        onAdd({
            id: Date.now(),
            name,
            pixKey,
            avatarUrl: avatarPreview || `https://i.pravatar.cc/150?u=${Date.now()}`
        });
        onClose();
        setName(''); setPixKey(''); setAvatarPreview(null);
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs" disableRestoreFocus BackdropProps={{ sx: { backgroundColor: 'rgba(0, 0, 0, 0.7)' } }} PaperProps={{ sx: { borderRadius: 4 } }}>
            <DialogTitle sx={{ fontWeight: 'bold' }}>Adicionar Novo Favorito</DialogTitle>
            <DialogContent>
                <Stack spacing={3} sx={{ pt: 1 }}>
                    <Stack direction="column" alignItems="center" spacing={2}>
                        <Avatar src={avatarPreview} sx={{ width: 80, height: 80, mb: 1 }} />
                        <Button variant="outlined" size="small" startIcon={<PhotoCamera />} onClick={() => fileInputRef.current.click()}>
                            Escolher Foto
                        </Button>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" hidden />
                    </Stack>
                    <TextField variant="filled" label="Nome Completo" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
                    <TextField variant="filled" label="Chave Pix" value={pixKey} onChange={(e) => setPixKey(e.target.value)} fullWidth />
                </Stack>
            </DialogContent>
            <DialogActions sx={{ p: '16px 24px' }}>
                <Button onClick={onClose}>Cancelar</Button>
                <Button onClick={handleSubmit} variant="contained">Salvar</Button>
            </DialogActions>
        </Dialog>
    );
};

const FavoritesModal = ({ open, onClose, contacts, onAddContact, onSelect }) => {
    const [addDialogOpen, setAddDialogOpen] = useState(false);

    return (
        <>
            <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" disableRestoreFocus BackdropProps={{ sx: { backgroundColor: 'rgba(0, 0, 0, 0.7)' } }} PaperProps={{ sx: { borderRadius: 4, position: 'relative' } }}>
                <DialogTitle sx={{ fontWeight: 'bold', m: 0, p: 2 }}>
                    Contatos Favoritos
                    <IconButton onClick={onClose} sx={{ position: 'absolute', right: 16, top: 12, color: 'grey.500' }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers sx={{ p: 0 }}>
                    <List>
                        {contacts.map(contact => (
                            <ListItemButton key={contact.id} onClick={() => { onSelect(contact.pixKey); onClose(); }}>
                                <ListItemAvatar>
                                    <Avatar src={contact.avatarUrl} />
                                </ListItemAvatar>
                                <ListItemText primary={contact.name} secondary={contact.pixKey} />
                            </ListItemButton>
                        ))}
                    </List>
                </DialogContent>
                <Tooltip title="Adicionar novo favorito">
                    <Fab color="primary" sx={{ position: 'absolute', bottom: 16, right: 16 }} onClick={() => setAddDialogOpen(true)}>
                        <AddIcon />
                    </Fab>
                </Tooltip>
            </Dialog>
            <AddContactModal open={addDialogOpen} onClose={() => setAddDialogOpen(false)} onAdd={onAddContact} />
        </>
    );
};

const SendPixCard = ({ onContinue, onSelectFavorite, onShowAll, favorites }) => {
    const [pixKey, setPixKey] = useState('');
    const [amount, setAmount] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const theme = useTheme();
    const { user } = useUser();                                // ← pega o usuário logado


    async function handleTransaction() {
        if (!accountId) return;

        try {
            localStorage.setItem("fromTransactionEmail", user.name);

            const profileRes = await fetch(
                `${API_URL}/customers/profile/${pixKey}`,
                { headers: authHeader() }
            );
            if (!profileRes.ok) {
                throw new Error(`Failed to fetch customer data (${profileRes.status})`);
            }
            const profileResponse = await profileRes.json();
            localStorage.setItem("toTransactionEmail", profileResponse.email);

            const payload = {
                accountId: accountId,
                accountToId: profileResponse.id,
                transactionType: 'TRANSFER',
                amount: amount
            };

            console.log('Payload:', payload);

            const res = await fetch(`${API_URL}/transaction`, {
                method: 'POST',
                headers: authHeader(),
                body: JSON.stringify(payload)
            });

            if (!res.ok)
                throw new Error(`Erro ${res.status}: ${await res.text()}`);

        } catch (error) {
            console.error(`Erro ao realizar PIX:`, error);
        }
    }

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            setPixKey(text);
        } catch (err) {
            console.error('Failed to read clipboard');
        }
    };

    const handleContinue = () => {
        if (!pixKey || !amount || parseFloat(amount) <= 0) {
            Swal.fire({ title: 'Atenção', text: 'Preencha a chave PIX e um valor válido.', icon: 'warning', background: theme.palette.background.paper, color: theme.palette.text.primary });
            return;
        }
        setIsLoading(true);
        handleTransaction();

        setTimeout(() => {
            setIsLoading(false);
            onContinue(pixKey, amount);
        }, 1000);
    };

    React.useEffect(() => {
        if (onSelectFavorite.key) {
            setPixKey(onSelectFavorite.key)
        }
    }, [onSelectFavorite])

    return (
        <Paper variant="outlined" sx={{ p: { xs: 2, sm: 4 }, borderRadius: 4, height: '100%' }}>
            <Stack spacing={3}>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    Enviar Pix
                </Typography>
                <TextField
                    variant="filled"
                    label="Chave PIX (CPF, Celular, E-mail...)"
                    value={pixKey}
                    onChange={(e) => setPixKey(e.target.value)}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <Tooltip title="Colar Chave">
                                    <IconButton onClick={handlePaste} edge="end">
                                        <ContentCopyIcon />
                                    </IconButton>
                                </Tooltip>
                            </InputAdornment>
                        ),
                        disableUnderline: true,
                    }}
                />
                <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                        Sugestões
                    </Typography>
                    <Stack direction="row" spacing={2} alignItems="center">
                        {favorites.slice(0, 4).map(contact => (
                            <Tooltip key={contact.id} title={contact.name}>
                                <motion.div whileTap={{ scale: 0.9 }}>
                                    <Avatar
                                        src={contact.avatarUrl}
                                        onClick={() => setPixKey(contact.pixKey)}
                                        sx={{ cursor: 'pointer', width: 48, height: 48 }}
                                    />
                                </motion.div>
                            </Tooltip>
                        ))}
                        <Tooltip title="Ver todos os favoritos">
                            <IconButton onClick={onShowAll} sx={{ border: `1px dashed ${theme.palette.divider}`, width: 48, height: 48 }}>
                                <MoreHorizIcon />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </Box>
                <TextField
                    variant="filled"
                    label="Valor a pagar"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    type="number"
                    InputProps={{
                        startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                        disableUnderline: true,
                    }}
                />
                <Button
                    variant="contained"
                    size="large"
                    onClick={handleContinue}
                    disabled={isLoading}
                    sx={{ py: 1.5 }}
                >
                    {isLoading ? <CircularProgress size={26} thickness={5} sx={{ color: 'white' }} /> : 'Continuar'}
                </Button>
            </Stack>
        </Paper>
    );
};

const ActionsCard = () => (
    <Paper variant="outlined" sx={{ p: { xs: 2, sm: 4 }, borderRadius: 4, height: '100%' }}>
        <Stack spacing={2}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                Outras Ações
            </Typography>
            <Button variant="text" startIcon={<QrCode2Icon />} sx={{ justifyContent: 'flex-start' }}>Pagar com QR Code</Button>
            <Button variant="text" startIcon={<KeyIcon />} sx={{ justifyContent: 'flex-start' }}>Minhas Chaves Pix</Button>
        </Stack>
    </Paper>
);

const ConfirmationScreen = ({ amount, onConfirm, onBack, isLoading, nome, email }) => (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} style={{
        position: 'fixed',
        top: '30%',
        left: '35%',
        zIndex: 1300
    }}>
        <Paper elevation={0} sx={{ p: 4, width: '500px', borderRadius: '24px', border: '1px solid', borderColor: 'divider', textAlign: 'center', position: 'relative' }}>
            <IconButton onClick={onBack} sx={{ position: 'absolute', top: 16, left: 16 }}>
                <ArrowBackIcon />
            </IconButton>
            <Avatar sx={{ width: 80, height: 80, margin: 'auto', mb: 2, bgcolor: 'primary.light' }}>{'M'}</Avatar>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{nome}</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>email: {email}</Typography>
            <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 4, color: 'primary.main' }}>
                R$ {parseFloat(amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </Typography>
            <Button variant="contained" size="large" onClick={onConfirm} fullWidth disabled={isLoading} sx={{ py: 1.5 }}>
                {isLoading ? <CircularProgress size={24} thickness={5} sx={{ color: 'white' }} /> : 'Confirmar Pagamento'}
            </Button>
        </Paper>
    </motion.div>
);

const ResultScreen = ({ success, onReset }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center' }}>
        {success ? <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} /> : <ErrorOutlineIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />}
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
            {success ? 'Pagamento Enviado!' : 'Pagamento Falhou'}
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
            {success ? 'O valor foi enviado com sucesso e o comprovante está disponível.' : 'Não foi possível concluir o pagamento.'}
        </Typography>
        <Button variant="outlined" onClick={onReset}>Fazer Novo Pagamento</Button>
    </motion.div>
);


export default function PixPage() {
    const [screen, setScreen] = useState('main'); // main, confirm, result
    const [paymentData, setPaymentData] = useState({ key: '', amount: '' });
    const [isSuccess, setIsSuccess] = useState(false);
    const [favoriteContacts, setFavoriteContacts] = useState(initialFavoriteContacts);
    const [favoritesModalOpen, setFavoritesModalOpen] = useState(false);
    const [selectedFavorite, setSelectedFavorite] = useState({ key: null, id: null })

    const handleContinue = (key, amount) => {
        setPaymentData({ key, amount });
        setScreen('confirm');
    };

    const handleConfirmPayment = () => {
        setTimeout(() => {
            const paymentSucceeded = Math.random() > 0.2;
            setIsSuccess(paymentSucceeded);
            setScreen('result');
        }, 2000);
    };

    const handleAddContact = (newContact) => {
        setFavoriteContacts(prev => [newContact, ...prev]);
        Swal.fire('Sucesso!', 'Novo contato favorito adicionado.', 'success');
    };

    const handleReset = () => {
        setScreen('main');
        setPaymentData({ key: '', amount: '' });
    };

    return (
        <>
            <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <AppAppBar />
                <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                    <Container maxWidth="lg" sx={{ py: 4 }}> {/* Alterado para lg para dar mais espaço */}
                        <AnimatePresence mode="wait">
                            {screen === 'main' && (
                                <motion.div
                                    key="main"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <Stack spacing={4}>
                                        <PageHeader />
                                        {/* GRID COM JUSTIFY-CONTENT PARA CENTRALIZAR OS CARDS */}
                                        <Grid container spacing={4} alignItems="stretch" justifyContent="center">
                                            <Grid item xs={12} sm={8} md={6} lg={5}>
                                                <SendPixCard
                                                    onContinue={handleContinue}
                                                    onShowAll={() => setFavoritesModalOpen(true)}
                                                    favorites={favoriteContacts}
                                                    onSelectFavorite={selectedFavorite}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={4} lg={3}>
                                                <ActionsCard />
                                            </Grid>
                                        </Grid>
                                    </Stack>
                                </motion.div>
                            )}
                            {screen === 'confirm' && (
                                <motion.div key="confirm">
                                    <ConfirmationScreen amount={paymentData.amount} onConfirm={handleConfirmPayment} onBack={handleReset} nome={localStorage.getItem('username')} email={localStorage.getItem("toTransactionEmail")} />
                                </motion.div>
                            )}
                            {screen === 'result' && (
                                <motion.div key="result">
                                    <ResultScreen success={isSuccess} onReset={handleReset} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Container>
                </Box>
            </Box>
            <FavoritesModal
                open={favoritesModalOpen}
                onClose={() => setFavoritesModalOpen(false)}
                contacts={favoriteContacts}
                onAddContact={handleAddContact}
                onSelect={(key) => setSelectedFavorite({ key: key, id: Date.now() })}
            />
        </>
    );
}