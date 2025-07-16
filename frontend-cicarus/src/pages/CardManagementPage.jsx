import React, { useState, useEffect } from 'react';
import {
    Box, Container, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
    Toolbar, Typography, Stack, CircularProgress, Grid, List, ListItem, ListItemText, Divider,
    Alert, Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Importar o SweetAlert2
import AppAppBar from '../components/AppAppBar.jsx';
import CreditCard from '../components/CreditCard.jsx';

// Ícones
import LockIcon from '@mui/icons-material/Lock';
import AddCardIcon from '@mui/icons-material/AddCard';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BlockIcon from '@mui/icons-material/Block';
import CancelIcon from '@mui/icons-material/Cancel';

const API_URL = import.meta.env.VITE_API_URL || '';

// --- Componente do Dialog de 2FA ---
const TwoFactorAuthDialog = ({ open, onClose, onSubmit, loading, error }) => {
    const [code, setCode] = useState('');

    const handleSubmit = () => {
        if (code.length === 6) {
            onSubmit(code);
            setCode(''); // Limpa o código após o envio
        }
    };

    const handleClose = () => {
        setCode(''); // Limpa o código ao fechar
        onClose();
    };


    return (
        <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>Verificação de Segurança</DialogTitle>
            <DialogContent sx={{ textAlign: 'center' }}>
                <LockIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    Enviamos um código de 6 dígitos para o seu dispositivo. Insira-o abaixo para continuar.
                </Typography>
                <TextField
                    label="Código de Verificação"
                    variant="outlined"
                    fullWidth
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                    disabled={loading}
                    inputProps={{
                        maxLength: 6,
                        style: { textAlign: 'center', letterSpacing: '0.5rem' }
                    }}
                />
                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            </DialogContent>
            <DialogActions sx={{ p: '16px 24px' }}>
                <Button onClick={handleClose} disabled={loading}>Cancelar</Button>
                <Button variant="contained" onClick={handleSubmit} disabled={loading || code.length < 6}>
                    {loading ? <CircularProgress size={24} /> : 'Verificar'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

// --- Função para extrair o CVV do Hash ---
const hashToCvv = (hash) => {
    if (!hash) return 'N/A';
    const digits = hash.match(/\d/g);
    if (!digits) return 'N/A';
    return digits.slice(0, 3).join('');
};

// --- Componente para Status do Cartão ---
const StatusChip = ({ status }) => {
    const statusConfig = {
        ACTIVE: { label: 'Ativo', color: 'success', icon: <CheckCircleIcon /> },
        BLOCKED: { label: 'Bloqueado', color: 'warning', icon: <BlockIcon /> },
        CANCELED: { label: 'Cancelado', color: 'error', icon: <CancelIcon /> }
    };

    const config = statusConfig[status] || { label: status, color: 'default' };

    return <Chip label={config.label} color={config.color} icon={config.icon} size="small" />;
};


// --- Página Principal ---
export default function CardManagementPage() {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [fullCardDetails, setFullCardDetails] = useState(null);
    const navigate = useNavigate();

    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
    const [twoFaDialogOpen, setTwoFaDialogOpen] = useState(false);
    const [twoFaLoading, setTwoFaLoading] = useState(false);
    const [twoFaError, setTwoFaError] = useState('');

    useEffect(() => {
        fetchCards();
    }, []);

    async function fetchCards() {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/card/list/1`);
            const physicalCards = await res.json();
            const storedVirtualCards = JSON.parse(localStorage.getItem('virtualCards')) || [];
            const now = new Date().getTime();
            const activeVirtualCards = storedVirtualCards.filter(card => card.expiryTimestamp > now);
            localStorage.setItem('virtualCards', JSON.stringify(activeVirtualCards));
            setCards([...physicalCards, ...activeVirtualCards]);
        } catch (err) {
            console.error('Erro ao buscar cartões:', err);
            const storedVirtualCards = JSON.parse(localStorage.getItem('virtualCards')) || [];
            const activeVirtualCards = storedVirtualCards.filter(card => new Date(card.expiryTimestamp) > new Date());
            setCards(activeVirtualCards);
        } finally {
            setLoading(false);
        }
    }

    const handleCardClick = (card) => {
        // ATUALIZAÇÃO: Exibe um alerta para cartões cancelados em vez de abrir os detalhes.
        if (card.status === 'CANCELED') {
            Swal.fire({
                icon: 'error',
                title: 'Cartão Cancelado',
                text: 'Este cartão foi cancelado e não pode ser gerenciado ou reativado. Para continuar, solicite um novo cartão.',
                confirmButtonText: 'Entendi'
            });
            return;
        }
        setSelectedCard(card);
        setTwoFaDialogOpen(true);
    };

    const handleVerify2FA = async (code) => {
        if (!selectedCard) return;
        if (selectedCard.cardType === 'VIRTUAL') {
            setTwoFaLoading(true);
            await new Promise(resolve => setTimeout(resolve, 500));
            setFullCardDetails(selectedCard);
            setTwoFaDialogOpen(false);
            setDetailsDialogOpen(true);
            setTwoFaLoading(false);
            return;
        }
        setTwoFaLoading(true);
        setTwoFaError('');
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            if (code !== '123456') throw new Error('Código de verificação inválido.');
            const res = await fetch(`${API_URL}/card/${selectedCard.id}`);
            if (!res.ok) throw new Error('Falha ao buscar os detalhes do cartão.');
            const fullDetails = await res.json();
            setFullCardDetails(fullDetails);
            setTwoFaDialogOpen(false);
            setDetailsDialogOpen(true);
        } catch (err) {
            setTwoFaError(err.message || 'Ocorreu um erro.');
        } finally {
            setTwoFaLoading(false);
        }
    };

    const handleDetailsDialogClose = () => {
        setDetailsDialogOpen(false);
        setSelectedCard(null);
        setFullCardDetails(null);
    };

    const handleAction = async (id, action) => {
        if (String(id).startsWith('virtual-')) {
            if (action === 'cancel') {
                const updatedVirtualCards = (JSON.parse(localStorage.getItem('virtualCards')) || []).filter(card => card.id !== id);
                localStorage.setItem('virtualCards', JSON.stringify(updatedVirtualCards));
                await fetchCards();
            }
            handleDetailsDialogClose();
            return;
        }
        try {
            await fetch(`${API_URL}/card/${action}/${id}`, { method: 'PUT' });
            await fetchCards();
            handleDetailsDialogClose();
        } catch (err) {
            console.error(`Erro ao ${action} cartão:`, err);
        }
    };

    const handleAddDialogOpen = () => setAddDialogOpen(true);
    const handleAddDialogClose = () => setAddDialogOpen(false);

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <AppAppBar title="Meus Cartões" />
            <Toolbar />
            <Container maxWidth="lg" sx={{ py: 4, mt: 5 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                    <Typography variant="h4" sx={{fontWeight: 'bold'}}>Meus Cartões</Typography>
                    <Stack direction="row" spacing={2}>
                        <Button variant="outlined" onClick={() => navigate('/virtual-card')} startIcon={<AddCardIcon />}>
                            Criar Cartão Virtual
                        </Button>
                        <Button variant="contained" onClick={handleAddDialogOpen}>Adicionar Físico</Button>
                    </Stack>
                </Box>

                {loading ? (
                    <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>
                ) : (
                    <Grid container spacing={4}>
                        {cards.map(card => (
                            <Grid key={card.id} xs={12} sm={6} md={4}>
                                <CreditCard card={card} onClick={() => handleCardClick(card)} />
                            </Grid>
                        ))}
                    </Grid>
                )}

                <TwoFactorAuthDialog
                    open={twoFaDialogOpen}
                    onClose={() => setTwoFaDialogOpen(false)}
                    onSubmit={handleVerify2FA}
                    loading={twoFaLoading}
                    error={twoFaError}
                />

                {fullCardDetails && (
                    <Dialog open={detailsDialogOpen} onClose={handleDetailsDialogClose} fullWidth maxWidth="xs">
                        <DialogTitle sx={{fontWeight: 'bold'}}>Detalhes do Cartão</DialogTitle>
                        <DialogContent>
                            <List disablePadding>
                                <ListItem>
                                    <ListItemText primary="Apelido/Nome" secondary={fullCardDetails.cardholderName} />
                                </ListItem>
                                <Divider component="li" />
                                <ListItem>
                                    <ListItemText primary="Número do Cartão" secondary={fullCardDetails.cardNumber} />
                                </ListItem>
                                <Divider component="li" />
                                <ListItem>
                                    <ListItemText primary="Validade" secondary={new Date(fullCardDetails.expiry + 'T00:00:00').toLocaleDateString('pt-BR', {month: '2-digit', year: 'numeric'})} />
                                </ListItem>
                                <Divider component="li" />
                                <ListItem>
                                    <ListItemText primary="CVV" secondary={hashToCvv(fullCardDetails.cvvHash)} />
                                </ListItem>
                                {fullCardDetails.cardType !== 'VIRTUAL' && (
                                    <>
                                        <Divider component="li" />
                                        <ListItem>
                                            <ListItemText primary="Limite" secondary={fullCardDetails.creditLimit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} />
                                        </ListItem>
                                    </>
                                )}
                                <Divider component="li" />
                                <ListItem>
                                    <ListItemText primary="Status" />
                                    <StatusChip status={fullCardDetails.status} />
                                </ListItem>
                            </List>
                        </DialogContent>
                        <DialogActions sx={{ p: '16px 24px', justifyContent: 'space-between', gap: 1 }}>
                            {fullCardDetails.cardType !== 'VIRTUAL' && fullCardDetails.status === 'ACTIVE' &&
                                <Button fullWidth variant="outlined" color="warning" onClick={() => handleAction(fullCardDetails.id, 'block')}>Bloquear</Button>
                            }
                            {fullCardDetails.cardType !== 'VIRTUAL' && fullCardDetails.status === 'BLOCKED' &&
                                <Button fullWidth variant="outlined" color="success" onClick={() => handleAction(fullCardDetails.id, 'activate')}>Ativar Cartão</Button>
                            }
                            <Button fullWidth variant="outlined" color="error" onClick={() => handleAction(fullCardDetails.id, 'cancel')}>
                                {fullCardDetails.cardType === 'VIRTUAL' ? 'Excluir' : 'Cancelar'}
                            </Button>
                        </DialogActions>
                    </Dialog>
                )}
            </Container>
        </Box>
    );
}