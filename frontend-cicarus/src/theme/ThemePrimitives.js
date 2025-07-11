import { createTheme, alpha } from '@mui/material/styles';

const defaultTheme = createTheme();

// Paletas de cores
export const brand = {
    50: 'hsl(22, 94%, 95%)',
    100: 'hsl(22, 94%, 90%)',
    200: 'hsl(22, 94%, 80%)',
    300: 'hsl(22, 94%, 70%)',
    400: 'hsl(22, 94%, 60%)',
    500: '#e46820', // Cor laranja principal do seu banco
    600: 'hsl(22, 94%, 45%)',
    700: 'hsl(22, 94%, 35%)',
    800: 'hsl(22, 94%, 25%)',
    900: 'hsl(22, 94%, 15%)',
};

export const gray = {
    50: 'hsl(220, 35%, 97%)',
    100: 'hsl(220, 30%, 94%)',
    200: 'hsl(220, 20%, 88%)',
    300: 'hsl(220, 20%, 80%)',
    400: 'hsl(220, 20%, 65%)',
    500: 'hsl(220, 20%, 42%)',
    600: 'hsl(220, 20%, 35%)',
    700: 'hsl(220, 20%, 25%)',
    800: 'hsl(220, 30%, 12%)',
    900: 'hsl(220, 35%, 6%)',
};

export const green = {
    50: 'hsl(120, 80%, 98%)',
    100: 'hsl(120, 75%, 94%)',
    200: 'hsl(120, 75%, 87%)',
    300: 'hsl(120, 61%, 77%)',
    400: 'hsl(120, 44%, 53%)',
    500: 'hsl(120, 59%, 30%)',
    600: 'hsl(120, 70%, 25%)',
    700: 'hsl(120, 75%, 16%)',
    800: 'hsl(120, 84%, 10%)',
    900: 'hsl(120, 87%, 6%)',
};

export const red = {
    50: 'hsl(0, 100%, 97%)',
    100: 'hsl(0, 92%, 90%)',
    200: 'hsl(0, 94%, 80%)',
    300: 'hsl(0, 90%, 65%)',
    400: 'hsl(0, 90%, 40%)',
    500: 'hsl(0, 90%, 30%)',
    600: 'hsl(0, 91%, 25%)',
    700: 'hsl(0, 94%, 18%)',
    800: 'hsl(0, 95%, 12%)',
    900: 'hsl(0, 93%, 6%)',
};


// --- DEFINIÇÕES DOS TEMAS ---
export const colorSchemes = {
    light: {
        palette: {
            primary: {
                main: brand[500],
                light: brand[300],
                dark: brand[700],
                contrastText: '#fff',
            },
            background: {
                default: gray[50], // Fundo principal cinzento-claro
                paper: '#fff',     // Fundo dos "cards" branco puro para contraste
            },
            text: {
                primary: gray[800],
                secondary: gray[600],
            },
            divider: alpha(gray[300], 0.4),
            action: {
                hover: alpha(gray[200], 0.4),
                selected: alpha(gray[200], 0.6),
            },
        },
    },
    dark: {
        palette: {
            primary: {
                main: brand[500],
                light: brand[300],
                dark: brand[700],
                contrastText: '#fff',
            },
            background: {
                default: '#111010',
                paper: '#282d34',
            },
            text: {
                primary: '#fff',
                secondary: gray[400],
            },
            divider: alpha(gray[700], 0.4),
            action: {
                hover: alpha(gray[800], 0.6),
                selected: alpha(gray[800], 0.8),
            },
        },
    },
};

export const typography = {
    fontFamily: "'Inter', 'Helvetica', 'Arial', sans-serif",
    h1: { fontSize: defaultTheme.typography.pxToRem(48), fontWeight: 600, lineHeight: 1.2, letterSpacing: -0.5 },
    h2: { fontSize: defaultTheme.typography.pxToRem(36), fontWeight: 600, lineHeight: 1.2 },
    h3: { fontSize: defaultTheme.typography.pxToRem(30), lineHeight: 1.2 },
    h4: { fontSize: defaultTheme.typography.pxToRem(24), fontWeight: 600, lineHeight: 1.5 },
    h5: { fontSize: defaultTheme.typography.pxToRem(20), fontWeight: 600 },
    h6: { fontSize: defaultTheme.typography.pxToRem(18), fontWeight: 600 },
    subtitle1: { fontSize: defaultTheme.typography.pxToRem(18) },
    subtitle2: { fontSize: defaultTheme.typography.pxToRem(14), fontWeight: 500 },
    body1: { fontSize: defaultTheme.typography.pxToRem(14) },
    body2: { fontSize: defaultTheme.typography.pxToRem(14), fontWeight: 400 },
    caption: { fontSize: defaultTheme.typography.pxToRem(12), fontWeight: 400 },
};

// --- DECLARAÇÕES CORRIGIDAS (SEM DUPLICADOS) ---
export const shape = {
    borderRadius: 12,
};

export const shadows = [
    'none',
    'hsla(220, 30%, 5%, 0.07) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.07) 0px 8px 16px -5px',
    ...defaultTheme.shadows.slice(2),
];