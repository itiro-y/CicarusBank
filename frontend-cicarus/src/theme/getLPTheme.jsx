import { alpha } from '@mui/material/styles';
import { brand, gray } from './ThemePrimitives';

const getLPTheme = (mode) => ({
    palette: {
        mode,
        primary: {
            ...brand,
            main: brand[500],
            light: brand[300],
            dark: brand[700],
        },
        background: {
            default: mode === 'light' ? '#fff' : '#111010', // Alterado de gray[50] para '#fff'
            paper: mode === 'light' ? '#fff' : '#282d34',
        },
        text: {
            primary: mode === 'light' ? gray[900] : '#fff',
            secondary: mode === 'light' ? gray[600] : gray[400],
        },
        divider: mode === 'light' ? alpha(gray[300], 0.4) : alpha(gray[700], 0.4),
        action: {
            selected:
                mode === 'light' ? alpha(brand[200], 0.2) : alpha(brand[800], 0.2),
        },
    },
    typography: {
        fontFamily: "'Inter', 'Helvetica', 'Arial', sans-serif",
        h1: {
            fontSize: '4rem',
            fontWeight: 700,
            lineHeight: 1.2,
            letterSpacing: -0.5,
        },
        h2: {
            fontSize: '3rem',
            fontWeight: 600,
            lineHeight: 1.2,
        },
        h5: {
            fontSize: '1.25rem',
            fontWeight: 600,
        },
        body1: {
            fontSize: '1rem',
        },
        caption: {
            fontSize: '0.875rem',
            color: 'text.secondary',
        },
    },
    shape: {
        borderRadius: 12,
    },
});

export default getLPTheme;