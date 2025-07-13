import * as React from 'react';
import { motion } from 'framer-motion';
import {
    Box, Container, Typography, Grid, Paper
} from '@mui/material';
import AppAppBar from '../components/AppAppBar.jsx';

const widgetStyle = {
    p: 3,
    borderRadius: '16px',
    backgroundColor: '#282d34',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    height: '100%',
    color: 'white',
};

const CurrencyCard = ({ currency, value, flagUrl }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
    >
        <Paper elevation={0} sx={widgetStyle}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <img src={flagUrl} alt={`${currency} flag`} style={{ width: 24, height: 24, borderRadius: '50%', marginRight: 12, objectFit: 'cover' }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{currency}</Typography>
            </Box>
            <Typography variant="h4" sx={{ color: '#e46820' }}>R$ {value}</Typography>
        </Paper>
    </motion.div>
);

export default function ExchangePage() {
    return (
        <Box sx={{ width: '100%', minHeight: '100vh' }}>
            <AppAppBar />
            <Container maxWidth="lg" sx={{ pt: '120px', pb: 4 }}>
                <Typography variant="h4" gutterBottom>Câmbio</Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <CurrencyCard currency="USD" value="5,30" flagUrl="https://flagcdn.com/us.svg" />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <CurrencyCard currency="EUR" value="6,50" flagUrl="https://flagcdn.com/eu.svg" />
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
