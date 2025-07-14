import { alpha } from '@mui/material/styles';

// Cores base da sua marca (ajuste se necessário)
const brand = {
    50: '#F0F7FF',
    100: '#C2E0FF',
    200: '#99CCF3',
    300: '#66B2FF',
    400: '#3399FF',
    500: '#007FFF', // Cor primária principal
    600: '#0072E5',
    700: '#0059B2',
    800: '#004C99',
    900: '#003A75',
};

const secondary = {
    50: '#FDF1E8',
    100: '#FCE3D0',
    200: '#F9CBB0',
    300: '#F6B391',
    400: '#F39E7C',
    500: '#E46820', // Sua cor laranja/secundária
    600: '#D65E1D',
    700: '#B24D17',
    800: '#9E4414',
    900: '#7C3510',
};

const grey = {
    50: '#F3F6F9',
    100: '#E7EBF0',
    200: '#E0E3E7',
    300: '#CDD2D7',
    400: '#B2BAC2',
    500: '#A0AAB4',
    600: '#6F7E8C',
    700: '#3E5060',
    800: '#2D3843',
    900: '#1A2027',
};


export const getLPTheme = (mode) => ({
    palette: {
        mode,
        primary: {
            ...brand,
            main: brand[500],
        },
        secondary: {
            ...secondary,
            main: secondary[500],
        },
        grey,
        // A mágica acontece aqui, definindo cores diferentes para cada modo
        ...(mode === 'light'
            ? {
                // Paleta para MODO CLARO
                text: {
                    primary: grey[900],
                    secondary: grey[700],
                },
                background: {
                    default: '#FFFFFF',
                    paper: grey[50], // Fundo dos cards no modo claro
                },
                action: {
                    active: brand[500],
                    hover: alpha(brand[300], 0.2),
                },
                divider: grey[200],
            }
            : {
                // Paleta para MODO ESCURO
                text: {
                    primary: '#FFFFFF',
                    secondary: grey[400],
                },
                background: {
                    default: grey[900], // Fundo da página no modo escuro
                    paper: grey[800],   // <<-- A COR DOS SEUS CARDS NO MODO ESCURO
                },
                action: {
                    active: brand[500],
                    hover: alpha(brand[600], 0.3),
                },
                divider: alpha(grey[100], 0.2),
            }),
    },
    typography: {
        fontFamily: ['"Inter", "sans-serif"'].join(','),
        h5: { fontWeight: 'bold' },
        h6: { fontWeight: 'bold' },
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none', // Garante que não haja gradientes inesperados
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 'bold',
                }
            }
        }
    }
});