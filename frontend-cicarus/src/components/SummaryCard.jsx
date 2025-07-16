// src/components/SummaryCard.jsx
import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

export default function SummaryCard({ title, value, icon, color, prefix = '' }) {
    return (
        <Card sx={{
            display: 'flex',
            alignItems: 'center',
            p: 2,
            borderRadius: 2,
            boxShadow: 3,
            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: 6,
            }
        }}>
            <Box sx={{
                bgcolor: color,
                color: 'white',
                p: 2,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2
            }}>
                {icon}
            </Box>
            <Box>
                <Typography color="textSecondary" gutterBottom>{title}</Typography>
                <Typography variant="h5" component="div" fontWeight="bold">
                    {prefix}{typeof value === 'number' ? value.toLocaleString('pt-BR') : value}
                </Typography>
            </Box>
        </Card>
    );
}