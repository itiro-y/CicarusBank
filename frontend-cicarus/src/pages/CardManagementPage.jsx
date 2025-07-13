import React, { useState, useEffect } from 'react';
import { Box, Container, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, TableContainer,
    Table, TableHead, TableRow, TableCell, TableBody, Paper, Toolbar, Typography, Stack, CircularProgress
} from '@mui/material';
import AppAppBar from '../components/AppAppBar.jsx';

const API_URL = import.meta.env.VITE_API_URL || '';
const useMocks = false;

export default function CardManagementPage({ customerId }) {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [form, setForm] = useState({
        customerId: '',
        cardNumber: '',
        expiry: '',
        creditLimit: '',
        status: 'ACTIVE',
        cardholderName: '',
        network: '',
        cardType: '',
        cvvHash: '',
        last4Digits: ''
    });

    useEffect(() => {
        fetchCards();
    }, []);

    async function fetchCards() {
        setLoading(true);
        try {
            if (useMocks) {
                // mock data if needed
                setCards([]);
            } else {
                const res = await fetch(`${API_URL}/card/list/1`);
                const data = await res.json();
                setCards(data);
            }
        } catch (err) {
            console.error('Erro ao buscar cartões:', err);
        } finally {
            setLoading(false);
        }
    }

    const handleOpen = () => setOpenDialog(true);
    const handleClose = () => setOpenDialog(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'cardNumber') {
            setForm({
                ...form,
                cardNumber: value,
                last4Digits: value.slice(-4)
            });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleSubmit = async () => {
        const payload = {
            customerId: 1,
            cardNumber: form.cardNumber,
            expiry: form.expiry,
            creditLimit: parseFloat(form.creditLimit),
            status: form.status,
            cardholderName: form.cardholderName,
            network: form.network,
            cardType: form.cardType,
            cvvHash: form.cvvHash,
            last4Digits: form.last4Digits
        };
        try {
            await fetch(`${API_URL}/card`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            handleClose();
            fetchCards();
        } catch (err) {
            console.error('Erro ao criar cartão:', err);
        }
    };


    const handleAction = async (id, action) => {
        try {
            await fetch(`${API_URL}/card/${action}/${id}`, { method: 'PUT' });
            fetchCards();
        } catch (err) {
            console.error(`Erro ao ${action} cartão:`, err);
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <AppAppBar title="Meus Cartões" />
            <Toolbar />
            <Container maxWidth="lg" sx={{ py: 4, mt: 5}}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h4">Meus Cartões</Typography>
                    <Button variant="contained" onClick={handleOpen}>Adicionar Cartão</Button>
                </Box>

                {loading ? (
                    <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>
                ) : (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Nome no Cartão</TableCell>
                                    <TableCell>Últimos 4 Dígitos</TableCell>
                                    <TableCell>Expiração</TableCell>
                                    <TableCell>Limite</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Rede</TableCell>
                                    <TableCell>Tipo</TableCell>
                                    <TableCell align="center">Ações</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {cards.map(card => (
                                    <TableRow key={card.id}>
                                        <TableCell>{card.cardholderName}</TableCell>
                                        <TableCell>**** **** **** {card.last4Digits}</TableCell>
                                        <TableCell>{new Date(card.expiry).toLocaleDateString()}</TableCell>
                                        <TableCell>{card.creditLimit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                                        <TableCell>{card.status}</TableCell>
                                        <TableCell>{card.network}</TableCell>
                                        <TableCell>{card.cardType}</TableCell>
                                        <TableCell align="center">
                                            <Button size="small" onClick={() => handleAction(card.id, 'block')}>Bloquear</Button>
                                            <Button size="small" onClick={() => handleAction(card.id, 'cancel')}>Cancelar</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                <Dialog open={openDialog} onClose={handleClose} fullWidth maxWidth="sm">
                    <DialogTitle>Adicionar Cartão</DialogTitle>
                    <DialogContent>
                        <Stack spacing={2} mt={1}>
                            <TextField placeholder="Número do Cartão" name="cardNumber" fullWidth value={form.cardNumber} onChange={handleChange} />
                            <TextField placeholder="Expiração (YYYY-MM-DD)" name="expiry" type="date" fullWidth InputLabelProps={{ shrink: true }} value={form.expiry} onChange={handleChange} />
                            <TextField placeholder="Limite de Crédito" name="creditLimit" type="number" fullWidth value={form.creditLimit} onChange={handleChange} />
                            <TextField placeholder="Nome no Cartão" name="cardholderName" fullWidth value={form.cardholderName} onChange={handleChange} />
                            <TextField placeholder="Rede" name="network" fullWidth value={form.network} onChange={handleChange} />
                            <TextField placeholder="Tipo" name="cardType" fullWidth value={form.cardType} onChange={handleChange} />
                            <TextField placeholder="CVV" name="cvv" type="password" fullWidth value={form.cvv} onChange={handleChange} />
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancelar</Button>
                        <Button variant="contained" onClick={handleSubmit}>Salvar</Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
}
