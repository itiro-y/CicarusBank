// DEPOIS (corrigido)
import { alpha } from '@mui/material/styles';
// A paleta 'brand' já é importada.
import { gray, brand, red, green } from '../ThemePrimitives.js';

export const feedbackCustomizations = {
    MuiAlert: {
        styleOverrides: {
            root: ({ theme }) => ({
                borderRadius: 10,
                backgroundColor: brand[100], // Substituído para 'brand'
                color: (theme.vars || theme).palette.text.primary,
                border: `1px solid ${alpha(brand[300], 0.5)}`, // Substituído para 'brand'
                '& .MuiAlert-icon': {
                    color: brand[500], // Substituído para 'brand'
                },
                ...theme.applyStyles('dark', {
                    backgroundColor: `${alpha(brand[900], 0.5)}`, // Substituído para 'brand'
                    border: `1px solid ${alpha(brand[800], 0.5)}`, // Substituído para 'brand'
                }),
            }),
        },
    },
    //...
};