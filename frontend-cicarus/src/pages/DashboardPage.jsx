// Em: src/pages/DashboardPage.jsx
import * as React from 'react';
import { motion } from 'framer-motion';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import AppAppBar from '../components/AppAppBar';

// Placeholder para os futuros "widgets" do dashboard
function WelcomeWidget() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Box sx={{
                p: 4,
                backgroundColor: 'rgba(255, 255, 255, 0.03)', // Fundo subtil
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
            }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Bem-vindo, Admin!
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    Este é o seu centro de controlo financeiro. Veja o resumo das suas contas, transações recentes e muito mais.
                </Typography>
            </Box>
        </motion.div>
    );
}

export default function DashboardPage() {
    return (
        // O fundo da página é definido pelo AppTheme
        <Box sx={{ width: '100%', minHeight: '100vh' }}>
            <AppAppBar />
            <Container
                sx={{
                    pt: '120px', // Espaço para a AppBar flutuante
                    pb: 4,
                }}
            >
                <WelcomeWidget />
                {/* Aqui poderá adicionar mais widgets como Saldo da Conta, Últimas Transações, etc. */}
            </Container>
        </Box>
    );
}