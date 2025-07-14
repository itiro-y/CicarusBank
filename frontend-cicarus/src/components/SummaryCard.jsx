import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

export default function SummaryCard({ title, value, icon, color = 'primary.main' }) {
    return (
        <Card sx={{ display: 'flex', alignItems: 'center', p: 2, height: '100%' }}>
            <Box sx={{
                bgcolor: color,
                borderRadius: '50%',
                p: 2,
                mr: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'common.white'
            }}>
                {icon}
            </Box>
            <Box>
                <Typography color="text.secondary" gutterBottom>
                    {title}
                </Typography>
                <Typography variant="h5" component="div">
                    {value}
                </Typography>
            </Box>
        </Card>
    );
}