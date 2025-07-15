import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Button, Card, Checkbox, FormControl, FormControlLabel, Link as MuiLink, TextField, Typography, useTheme
} from '@mui/material';
import Swal from 'sweetalert2';
import ForgotPassword from './ForgotPassword.jsx';

export default function SignInCard({ onSwitchToSignUp }) {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const navigate = useNavigate();

    const logoStyle = {
        width: '200px',
        height: 'auto',
        filter: theme.palette.mode === 'dark' ? 'brightness(0) invert(1)' : 'none',
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const username = data.get('username');
        const password = data.get('password');

        if (username === 'admin' && password === 'admin123') {
            Swal.fire({
                title: 'Login Efetuado!',
                text: 'Seja bem-vindo de volta.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
                background: theme.palette.background.paper,
                color: theme.palette.text.primary,
                timerProgressBar: true,
                didClose: () => {
                    navigate('/dashboard');
                }
            });
        } else {
            Swal.fire({
                title: 'Erro!',
                text: 'Usuário ou senha inválidos.',
                icon: 'error',
                confirmButtonText: 'Tentar Novamente',
                background: theme.palette.background.paper,
                color: theme.palette.text.primary,
                confirmButtonColor: theme.palette.primary.main,
            });
        }
    };

    const handleForgotPasswordOpen = () => setOpen(true);
    const handleForgotPasswordClose = () => setOpen(false);

    return (
        // AQUI ESTÁ A CORREÇÃO DO FUNDO DO CARD
        <Card sx={{
            display: 'flex',
            flexDirection: 'column',
            alignSelf: 'center',
            width: '100%',
            maxWidth: '600px',
            p: 4,
            gap: 3,
            // Fundo semi-transparente que se adapta ao tema
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(10px)', // Efeito de vidro fosco
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: 'md',
        }}>
            <Box component="form" onSubmit={handleSubmit} noValidate>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <img src="https://i.postimg.cc/HntRVrDy/f85b6d78-659d-4b19-85b2-ed764895fa09-removebg-preview.png" alt="CicarusBank Logo" style={logoStyle} />
                </Box>
                <Typography component="h1" variant="h4" sx={{ color: 'text.primary', fontWeight: 'bold', textAlign: 'center' }}>
                    Acesse sua conta
                </Typography>
                <FormControl fullWidth sx={{ mt: 2 }}>
                    <Typography component="label" htmlFor="username" sx={{ color: 'text.secondary', mb: 1 }}>Usuário</Typography>
                    <TextField id="username" name="username" autoComplete="username" autoFocus required fullWidth variant="outlined" />
                </FormControl>
                <FormControl fullWidth sx={{ mt: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography component="label" htmlFor="password" sx={{ color: 'text.secondary' }}>Senha</Typography>
                        <MuiLink component="button" type="button" onClick={handleForgotPasswordOpen} variant="body2" sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
                            Esqueceu sua senha?
                        </MuiLink>
                    </Box>
                    <TextField name="password" type="password" id="password" autoComplete="current-password" required fullWidth variant="outlined" sx={{ mt: 1 }}/>
                </FormControl>
                <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Lembrar-me" sx={{ color: 'text.secondary' }} />
                <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 2, py: 1.5, fontSize: '1rem', fontWeight: 'bold' }}>
                    Entrar
                </Button>
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Não tem uma conta?{' '}
                        <MuiLink component="button" type="button" variant="body2" onClick={onSwitchToSignUp} sx={{ color: 'primary.main', fontWeight: 'bold', textDecoration: 'none', cursor: 'pointer', background: 'none', border: 'none', p: 0, fontFamily: 'inherit', fontSize: 'inherit' }}>
                            Cadastre-se
                        </MuiLink>
                    </Typography>
                </Box>
            </Box>
            <ForgotPassword open={open} onClose={handleForgotPasswordClose} />
        </Card>
    );
}