// src/components/CreateCardDialog.jsx
import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
    Stack, Typography, InputAdornment, Alert, CircularProgress, Box
} from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import Swal from 'sweetalert2';


const getAuthenticatedUser = () => {
    // Exemplo: dados do usuário logado
    return {
        id: localStorage.getItem('accountId'), // ID como string, que será convertido para número
        name: localStorage.getItem('userName') || 'Usuário Anônimo',
    };
};

const API_URL = import.meta.env.VITE_API_URL || '';



export default function CreateCardDialog({ open, onClose, onCardAdded }) {
    const [formData, setFormData] = useState({
        cardNumber: '',
        cvv: '',
    });
    const [user, setUser] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState('');

    useEffect(() => {
        if (open) {
            const authenticatedUser = getAuthenticatedUser();
            setUser(authenticatedUser);
        }
    }, [open]);

    const validate = () => {
        const newErrors = {};
        if (formData.cardNumber.replace(/\s/g, '').length !== 16) {
            newErrors.cardNumber = 'O número do cartão deve ter 16 dígitos.';
        }
        if (formData.cvv.length !== 3) {
            newErrors.cvv = 'O CVV deve ter 3 dígitos.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const onlyNums = value.replace(/\D/g, '');
        setFormData(prev => ({ ...prev, [name]: onlyNums }));
    };

    const handleCardNumberChange = (e) => {
        const { value } = e.target;
        const formattedValue = value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').trim();
        setFormData(prev => ({ ...prev, cardNumber: formattedValue }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError('');
        if (!validate() || !user) {
            if (!user) setApiError("Não foi possível obter os dados do usuário.");
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Usuário não autenticado. Faça o login novamente.');
            }

            const rawCardNumber = formData.cardNumber.replace(/\s/g, '');

            // Gera uma data de validade no formato YYYY-MM-DD para 5 anos no futuro
            const expiryDate = new Date();
            expiryDate.setFullYear(expiryDate.getFullYear() + 5);
            // Formata a data para "YYYY-MM-DD"
            const expiry = expiryDate.toISOString().split('T')[0];

            // DTO ajustado para corresponder ao JSON do backend
            const cardRequestDto = {
                customerId: parseInt(user.id, 10), // Convertido para número
                cardholderName: user.name,
                cardNumber: rawCardNumber,
                cvvHash: formData.cvv, // Enviando o CVV; o backend deve hasheá-lo
                last4Digits: rawCardNumber.slice(-4),
                expiry: expiry, // Formato "YYYY-MM-DD"
                creditLimit: 10000.00, // Valor do exemplo
                status: 'ACTIVE',
                network: 'VISA', // Valor do exemplo
                cardType: 'CREDIT',
            };

            const response = await fetch(`${API_URL}/card`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(cardRequestDto),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Erro de comunicação com o servidor.' }));
                throw new Error(errorData.message || 'Falha ao criar o cartão.');
            }

            if (onCardAdded) {
                onCardAdded();
            }
            handleClose();
            Swal.fire({
                icon: 'success',
                title: 'Cartão Criado!',
                text: 'Seu novo cartão foi criado com sucesso.',
                confirmButtonText: 'Ótimo!'
            });

        } catch (error) {
            setApiError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({ cardNumber: '', cvv: '' });
        setErrors({});
        setApiError('');
        setLoading(false);
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
            <DialogTitle>
                <Box sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                    Criar Novo Cartão de Crédito
                </Box>
            </DialogTitle>
            <DialogContent>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 3 }}>
                    Insira os dados para gerar seu novo cartão.
                </Typography>
                {apiError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {apiError}
                    </Alert>
                )}
                <form onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                        <TextField
                            label="Número do Cartão"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleCardNumberChange}
                            error={!!errors.cardNumber}
                            helperText={errors.cardNumber}
                            required
                            fullWidth
                            disabled={loading}
                            inputProps={{ maxLength: 19, inputMode: 'numeric' }}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><CreditCardIcon /></InputAdornment>,
                            }}
                        />
                        <TextField
                            label="CVV"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleChange}
                            error={!!errors.cvv}
                            helperText={errors.cvv}
                            required
                            fullWidth
                            disabled={loading}
                            inputProps={{ maxLength: 3, type: 'tel' }}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><VpnKeyIcon /></InputAdornment>,
                            }}
                        />
                    </Stack>
                </form>
            </DialogContent>
            <DialogActions sx={{ p: '16px 24px' }}>
                <Button onClick={handleClose} disabled={loading}>Cancelar</Button>
                <Button variant="contained" onClick={handleSubmit} disabled={loading}>
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Criar Cartão'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}