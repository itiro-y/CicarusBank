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

const ExchangeHeader = () => (
    <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
    >
        <Paper elevation={0} sx={{ ...widgetStyle }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                Câmbio
            </Typography>
        </Paper>
    </motion.div>
);

export default function ExchangePage() {
    return (
        <Box sx={{ width: '100%', minHeight: '100vh' }}>
            <AppAppBar />
            <Container maxWidth="lg" sx={{ pt: '120px', pb: 4 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <ExchangeHeader />
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
