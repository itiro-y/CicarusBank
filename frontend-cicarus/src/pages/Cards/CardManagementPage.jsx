import React, { useState, useEffect } from 'react';
import {
    Box, Container, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
    Toolbar, Typography, Stack, CircularProgress, Grid, List, ListItem, ListItemText, Divider,
    Alert, Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import AppAppBar from '../../components/AppAppBar.jsx';
import CreditCard from '../../components/CreditCard.jsx';
import { useUser } from '../../context/UserContext.jsx';
import AddPhysicalCardDialog from '../../components/AddPhysicalCardDialog.jsx';

// Ícones
import LockIcon from '@mui/icons-material/Lock';
import AddCardIcon from '@mui/icons-material/AddCard';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BlockIcon from '@mui/icons-material/Block';
import CancelIcon from '@mui/icons-material/Cancel';
import TuneIcon from '@mui/icons-material/Tune';

const API_URL = import.meta.env.VITE_API_URL || '';
const accountId = localStorage.getItem('accountId');

const TwoFactorAuthDialog = ({ open, onClose, onSubmit, loading, error }) => {
    const [code, setCode] = useState('');

    const handleSubmit = () => {
        if (code.length === 6) {
            onSubmit(code);
            setCode('');
        }
    };

    const handleClose = () => {
        setCode('');
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>Verificação de Segurança</DialogTitle>
            <DialogContent sx={{ textAlign: 'center' }}>
                <LockIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    Para sua segurança, insira o código iSafe gerado na sua página de perfil.
                </Typography>
                <TextField
                    label="Código de Verificação"
                    variant="outlined"
                    fullWidth
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                    disabled={loading}
                    inputProps={{ maxLength: 6, style: { textAlign: 'center', letterSpacing: '0.5rem' } }}
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

const hashToCvv = (hash) => {
    if (!hash) return 'N/A';
    const digits = hash.match(/\d/g);
    if (!digits) return 'N/A';
    return digits.slice(0, 3).join('');
};

const StatusChip = ({ status }) => {
    const statusConfig = {
        ACTIVE: { label: 'Ativo', color: 'success', icon: <CheckCircleIcon /> },
        BLOCKED: { label: 'Bloqueado', color: 'warning', icon: <BlockIcon /> },
        CANCELED: { label: 'Cancelado', color: 'error', icon: <CancelIcon /> }
    };
    const config = statusConfig[status] || { label: status, color: 'default' };
    return <Chip label={config.label} color={config.color} icon={config.icon} size="small" />;
};


export default function CardManagementPage() {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCard, setSelectedCard] = useState(null);
    const [fullCardDetails, setFullCardDetails] = useState(null);
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
    const [twoFaDialogOpen, setTwoFaDialogOpen] = useState(false);
    const [twoFaLoading, setTwoFaLoading] = useState(false);
    const [twoFaError, setTwoFaError] = useState('');
    const { user } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        fetchCards();
    }, []);

    async function fetchCards() {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/card/list/${accountId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const physicalCards = await res.json();
            const storedVirtualCards = JSON.parse(localStorage.getItem('virtualCards')) || [];
            const now = new Date().getTime();
            const activeVirtualCards = storedVirtualCards.filter(card => card.expiryTimestamp > now);

            // Combina todos os cartões, incluindo os cancelados, para exibição
            const allCards = [...physicalCards, ...activeVirtualCards];
            setCards(allCards);

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
        setSelectedCard(card);
        setTwoFaDialogOpen(true);
    };

    const handleVerify2FA = async (code) => {
        if (!selectedCard) return;

        if (selectedCard.cardType === 'VIRTUAL') {
            setFullCardDetails(selectedCard);
            setTwoFaDialogOpen(false);
            setDetailsDialogOpen(true);
            return;
        }

        setTwoFaLoading(true);
        setTwoFaError('');
        try {
            await new Promise(resolve => setTimeout(resolve, 500));

            const storedISafe = JSON.parse(localStorage.getItem('isafeCode'));

            if (!storedISafe) {
                throw new Error('Nenhum código iSafe ativo. Gere um na página de perfil.');
            }
            if (Date.now() > storedISafe.expiry) {
                localStorage.removeItem('isafeCode');
                throw new Error('O código iSafe expirou. Por favor, gere um novo.');
            }
            if (code !== storedISafe.code) {
                throw new Error('Código de verificação inválido.');
            }

            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/card/${selectedCard.id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!res.ok) {
                throw new Error('Falha ao buscar os detalhes do cartão.');
            }

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
            const token = localStorage.getItem('token');
            let url = `${API_URL}/card/${action}/${id}`;
            let method = 'PUT';

            if (action === 'delete') {
                url = `${API_URL}/card/${id}`;
                method = 'DELETE';
            }

            await fetch(url, {
                method: method,
                headers: { 'Authorization': `Bearer ${token}` }
            });
            await fetchCards();
            handleDetailsDialogClose();
        } catch (err) {
            console.error(`Erro ao ${action} cartão:`, err);
        }
    };

    const handleDeleteCard = async (id) => {
        const result = await Swal.fire({
            title: 'Tem certeza?',
            text: "O cartão será removido permanentemente da sua visualização. Esta ação não pode ser desfeita.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sim, excluir!',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            // AQUI VOCÊ DEVE ADICIONAR A LÓGICA PARA CHAMAR A API DE EXCLUSÃO
            // Ex: await fetch(`${API_URL}/card/delete/${id}`, { method: 'DELETE', ... });

            console.log(`Simulando exclusão do cartão ${id} no backend.`);

            handleDetailsDialogClose();
            await fetchCards(); // Re-carrega a lista de cartões

            Swal.fire(
                'Excluído!',
                'O cartão foi removido com sucesso.',
                'success'
            );
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
                        <Button variant="contained" color="secondary" onClick={() => navigate('/card-limit')} startIcon={<TuneIcon />}>
                            Ajustar Limites
                        </Button>
                        <Button variant="outlined" onClick={() => navigate('/virtual-card')} startIcon={<AddCardIcon />}>
                            Criar Cartão Virtual
                        </Button>
                        <Button variant="contained" onClick={handleAddDialogOpen}>Adicionar Físico</Button>
                    </Stack>
                </Box>

                {loading ? (
                    <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>
                ) : cards.length === 0 ? (
                    <Box textAlign="center" mt={10}>
                        <img src="https://i.ibb.co/Fb11BLwx/credit-card-4.gif" alt="Sem cartões" style={{ width: '100px', opacity: 0.6 }} />
                        <Typography variant="h6" color="text.secondary" mt={2}>
                            Você ainda não possui cartões.
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Crie um cartão virtual ou adicione um cartão físico para começar.
                        </Typography>
                    </Box>
                ) : (
                    <Grid container spacing={4}>
                        {cards.map(card => (
                            <Grid item key={card.id} xs={12} sm={6} md={4}>
                                <CreditCard card={card} onClick={() => handleCardClick(card)} />
                            </Grid>
                        ))}
                    </Grid>
                )}

                <AddPhysicalCardDialog
                    open={addDialogOpen}
                    onClose={handleAddDialogClose}
                    onCardAdded={fetchCards}
                />

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
                                <ListItem><ListItemText primary="Apelido/Nome" secondary={fullCardDetails.cardholderName} /></ListItem>
                                <Divider component="li" />
                                <ListItem><ListItemText primary="Número do Cartão" secondary={fullCardDetails.cardNumber} /></ListItem>
                                <Divider component="li" />
                                <ListItem><ListItemText primary="Validade" secondary={new Date(fullCardDetails.expiry + 'T00:00:00').toLocaleDateString('pt-BR', {month: '2-digit', year: 'numeric'})} /></ListItem>
                                <Divider component="li" />
                                <ListItem><ListItemText primary="CVV" secondary={hashToCvv(fullCardDetails.cvvHash)} /></ListItem>
                                {fullCardDetails.cardType !== 'VIRTUAL' && (
                                    <>
                                        <Divider component="li" />
                                        <ListItem><ListItemText primary="Limite" secondary={fullCardDetails.creditLimit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} /></ListItem>
                                    </>
                                )}
                                <Divider component="li" />
                                <ListItem>
                                    <ListItemText primary="Status" />
                                    <StatusChip status={fullCardDetails.status} />
                                </ListItem>
                            </List>
                        </DialogContent>
                        {/* LÓGICA DE AÇÕES CONDICIONAL BASEADA NO STATUS DO CARTÃO */}
                        <DialogActions sx={{ p: '16px 24px', justifyContent: 'center', gap: 1 }}>

                            {fullCardDetails.status === 'CANCELED' && (
                                <Button fullWidth variant="contained" color="error" onClick={() => handleDeleteCard(fullCardDetails.id)}>
                                    Excluir Cartão
                                </Button>
                            )}

                            {fullCardDetails.cardType !== 'VIRTUAL' && fullCardDetails.status === 'ACTIVE' && (
                                <>
                                    <Button fullWidth variant="outlined" color="warning" onClick={() => handleAction(fullCardDetails.id, 'block')}>Bloquear</Button>
                                    <Button fullWidth variant="outlined" color="error" onClick={() => handleAction(fullCardDetails.id, 'cancel')}>Cancelar</Button>
                                </>
                            )}

                            {fullCardDetails.cardType !== 'VIRTUAL' && fullCardDetails.status === 'BLOCKED' && (
                                <>
                                    <Button fullWidth variant="outlined" color="success" onClick={() => handleAction(fullCardDetails.id, 'activate')}>Ativar Cartão</Button>
                                    <Button fullWidth variant="outlined" color="error" onClick={() => handleAction(fullCardDetails.id, 'cancel')}>Cancelar</Button>
                                </>
                            )}

                            {fullCardDetails.status === 'CANCELLED' && (
                                <Button fullWidth variant="outlined" color="error" onClick={() => handleAction(fullCardDetails.id, 'delete')}>
                                    Excluir Cartão
                                </Button>
                            )}

                            {fullCardDetails.cardType === 'VIRTUAL' && (
                                <Button fullWidth variant="outlined" color="error" onClick={() => handleAction(fullCardDetails.id, 'cancel')}>
                                    Excluir
                                </Button>
                            )}
                        </DialogActions>
                    </Dialog>
                )}
            </Container>
        </Box>
    );
}