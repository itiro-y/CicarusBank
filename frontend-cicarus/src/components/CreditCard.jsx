// src/components/CreditCard.jsx
import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { FaSimCard } from "react-icons/fa";
import { SiVisa, SiMastercard } from "react-icons/si";

// Função para determinar o ícone da bandeira do cartão
const getNetworkIcon = (network) => {
    if (network?.toLowerCase().includes('visa')) {
        return <SiVisa size={40} color="white" />;
    }
    if (network?.toLowerCase().includes('mastercard')) {
        return <SiMastercard size={40} color="white" />;
    }
    return <Typography sx={{ color: 'white', fontWeight: 'bold' }}>{network}</Typography>;
};

export default function CreditCard({ card, onClick }) {
    return (
        <Paper
            onClick={onClick}
            elevation={6}
            sx={{
                padding: 3,
                height: 220,
                borderRadius: 4,
                background: 'linear-gradient(45deg, #2d3748 30%, #4a5568 90%)',
                color: 'white',
                position: 'relative',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                    transform: 'scale(1.05)'
                }
            }}
        >
            <Box display="flex" justifyContent="space-between" alignItems="center">
                {/* LOGO ADICIONADA AQUI */}
                <img
                    src="https://i.postimg.cc/jjZF98Pp/download-1.png"
                    alt="Bank Logo"
                    style={{ width: '100px', height: 'auto' }}
                />
                {getNetworkIcon(card.network)}
            </Box>

            <Box sx={{ my: 3 }}>
                <FaSimCard size={35} color="#d1d5db" />
            </Box>

            <Typography variant="h5" letterSpacing={3} sx={{ fontFamily: 'monospace' }}>
                **** **** **** {card.last4Digits}
            </Typography>

            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
                <Box>
                    <Typography variant="caption" display="block" sx={{ color: '#d1d5db' }}>
                        Nome do Titular
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {card.cardholderName}
                    </Typography>
                </Box>
                <Box textAlign="right">
                    <Typography variant="caption" display="block" sx={{ color: '#d1d5db' }}>
                        Validade
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {new Date(card.expiry).toLocaleDateString('pt-BR', { month: '2-digit', year: '2-digit' })}
                    </Typography>
                </Box>
            </Box>
        </Paper>
    );
}