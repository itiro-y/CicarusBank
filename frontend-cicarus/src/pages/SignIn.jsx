// Em: src/pages/SignIn.jsx
import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import SignInCard from '../components/SignInCard.jsx';
import Content from '../components/Content.jsx';

// Removido o ThemeProvider daqui

export default function SignInPage() {
    return (
        <>
            <CssBaseline />
            <Stack direction={{ xs: 'column', md: 'row' }} sx={{ minHeight: '100vh' }}>

                {/* Lado Esquerdo - Branding */}
                <Stack
                    sx={{
                        width: { xs: '100%', md: '50%' },
                        // Cor de fundo principal
                        backgroundColor: '#111010', // rgb(17,16,16)
                        justifyContent: 'center',
                        alignItems: 'center', // Adicionado para centrar o conteúdo
                        p: 4,
                    }}
                >
                    <Content />
                </Stack>

                {/* Lado Direito - Formulário */}
                <Stack
                    component="main"
                    sx={{
                        width: { xs: '100%', md: '50%' },
                        // Cor de fundo secundária
                        backgroundColor: '#282d34', // rgb(40,45,52)
                        justifyContent: 'center',
                        alignItems: 'center',
                        p: 4,
                    }}
                >
                    <SignInCard />
                </Stack>
            </Stack>
        </>
    );
}