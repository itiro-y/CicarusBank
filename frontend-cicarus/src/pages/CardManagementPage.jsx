// src/pages/CardManagementPage.jsx
import React, { useState, useEffect } from 'react';
import {
    Box, Container, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
    Toolbar, Typography, Stack, CircularProgress, Grid, List, ListItem, ListItemText, Divider
} from '@mui/material';
import AppAppBar from '../components/AppAppBar.jsx';
import CreditCard from '../components/CreditCard.jsx'; // Importe o novo componente

const API_URL = import.meta.env.VITE_API_URL || '';

export default function CardManagementPage() {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(false);

    // State para o Dialog de adicionar cartão
    const [addDialogOpen, setAddDialogOpen] = useState(false);

    // State para o Dialog de detalhes do cartão
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);

    const [form, setForm] = useState({
        customerId: '',
        cardNumber: '',
        expiry: '',
        creditLimit: '',
        status: 'ACTIVE',
        cardholderName: '',
        network: '',
        cardType: '',
        cvv: '', // Alterado de cvvHash para cvv
        last4Digits: ''
    });

    useEffect(() => {
        fetchCards();
    }, []);

    async function fetchCards() {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/card/list/1`); // Usando customerId 1 como exemplo
            const data = await res.json();
            setCards(data);
        } catch (err) {
            console.error('Erro ao buscar cartões:', err);
        } finally {
            setLoading(false);
        }
    }

    const handleAddDialogOpen = () => setAddDialogOpen(true);
    const handleAddDialogClose = () => setAddDialogOpen(false);

    const handleCardClick = (card) => {
        setSelectedCard(card);
        setDetailsDialogOpen(true);
    };

    const handleDetailsDialogClose = () => {
        setDetailsDialogOpen(false);
        setSelectedCard(null);
    };

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
        // Lógica para enviar o novo cartão para a API...
        console.log("Novo cartão:", form);
        // ... seu fetch POST aqui ...
        handleAddDialogClose();
        // fetchCards(); // Atualiza a lista após adicionar
    };

    const handleAction = async (id, action) => {
        try {
            await fetch(`${API_URL}/card/${action}/${id}`, { method: 'PUT' });
            fetchCards(); // Atualiza a lista
            handleDetailsDialogClose(); // Fecha o popup de detalhes
        } catch (err) {
            console.error(`Erro ao ${action} cartão:`, err);
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <AppAppBar title="Meus Cartões" />
            <Toolbar />
            <Container maxWidth="lg" sx={{ py: 4, mt: 5 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                    <Typography variant="h4">Meus Cartões</Typography>
                    <Button variant="contained" onClick={handleAddDialogOpen}>Adicionar Cartão</Button>
                </Box>

                {loading ? (
                    <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>
                ) : (
                    <Grid container spacing={4}>
                        {cards.map(card => (
                            <Grid item key={card.id} xs={12} sm={6} md={4}>
                                <CreditCard card={card} onClick={() => handleCardClick(card)} />
                            </Grid>
                        ))}
                    </Grid>
                )}

                {/* Dialog para Adicionar Cartão */}
                <Dialog open={addDialogOpen} onClose={handleAddDialogClose} fullWidth maxWidth="sm">
                    <DialogTitle>Adicionar Novo Cartão</DialogTitle>
                    <DialogContent>
                        <Stack spacing={2} mt={1}>
                            <TextField label="Nome no Cartão" name="cardholderName" fullWidth value={form.cardholderName} onChange={handleChange} />
                            <TextField label="Número do Cartão" name="cardNumber" fullWidth value={form.cardNumber} onChange={handleChange} />
                            <TextField label="Validade (YYYY-MM)" name="expiry" placeholder="YYYY-MM" fullWidth value={form.expiry} onChange={handleChange} />
                            <TextField label="CVV" name="cvv" type="password" fullWidth value={form.cvv} onChange={handleChange} />
                            <TextField label="Limite de Crédito" name="creditLimit" type="number" fullWidth value={form.creditLimit} onChange={handleChange} />
                            <TextField label="Bandeira (ex: Visa)" name="network" fullWidth value={form.network} onChange={handleChange} />
                            <TextField label="Tipo (ex: Crédito)" name="cardType" fullWidth value={form.cardType} onChange={handleChange} />
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleAddDialogClose}>Cancelar</Button>
                        <Button variant="contained" onClick={handleSubmit}>Salvar</Button>
                    </DialogActions>
                </Dialog>

                {/* Dialog para Detalhes do Cartão */}
                {selectedCard && (
                    <Dialog open={detailsDialogOpen} onClose={handleDetailsDialogClose} fullWidth maxWidth="xs">
                        <DialogTitle>Detalhes do Cartão</DialogTitle>
                        <DialogContent>
                            <List disablePadding>
                                <ListItem>
                                    <ListItemText primary="Nome no Cartão" secondary={selectedCard.cardholderName} />
                                </ListItem>
                                <Divider component="li" />
                                <ListItem>
                                    <ListItemText primary="Número" secondary={`**** **** **** ${selectedCard.last4Digits}`} />
                                </ListItem>
                                <Divider component="li" />
                                <ListItem>
                                    <ListItemText primary="Validade" secondary={new Date(selectedCard.expiry).toLocaleDateString()} />
                                </ListItem>
                                <Divider component="li" />
                                <ListItem>
                                    <ListItemText primary="Limite" secondary={selectedCard.creditLimit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} />
                                </ListItem>
                                <Divider component="li" />
                                <ListItem>
                                    <ListItemText primary="Status" secondary={selectedCard.status} />
                                </ListItem>
                            </List>
                        </DialogContent>
                        <DialogActions sx={{ p: '16px 24px', justifyContent: 'center' }}>
                            <Button variant="outlined" color="error" onClick={() => handleAction(selectedCard.id, 'block')}>Bloquear</Button>
                            <Button variant="contained" color="error" onClick={() => handleAction(selectedCard.id, 'cancel')}>Cancelar Cartão</Button>
                        </DialogActions>
                    </Dialog>
                )}
            </Container>
        </Box>
    );
}