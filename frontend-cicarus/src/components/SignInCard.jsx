// Em: src/components/SignInCard.jsx

import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Button, Card, Checkbox, FormControl, FormControlLabel, Link as MuiLink, TextField, Typography
} from '@mui/material';
import Swal from 'sweetalert2'; // 1. Importe a biblioteca
import ForgotPassword from './ForgotPassword.jsx';

// O componente agora recebe a prop 'onSwitchToSignUp' para acionar a animação.
export default function SignInCard({ onSwitchToSignUp }) {
    const [open, setOpen] = React.useState(false);
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const username = data.get('username');
        const password = data.get('password');

        if (username === 'admin' && password === 'admin123') {
            // 2. Substitua o alerta padrão pelo pop-up de sucesso
            Swal.fire({
                title: 'Login Efetuado!',
                text: 'Seja bem-vindo de volta.',
                icon: 'success',
                timer: 2000, // O pop-up fecha sozinho após 2 segundos
                showConfirmButton: false,
                background: '#282d34', // Cor de fundo para combinar com o tema
                color: '#fff',        // Cor do texto
                timerProgressBar: true,
                didClose: () => {
                    navigate('/dashboard'); // Navega para o dashboard depois que o pop-up fecha
                }
            });
        } else {
            // 3. (Opcional, mas recomendado) Substitua o alerta de erro também
            Swal.fire({
                title: 'Erro!',
                text: 'Usuário ou senha inválidos.',
                icon: 'error',
                confirmButtonText: 'Tentar Novamente',
                background: '#282d34',
                color: '#fff',
                confirmButtonColor: '#e46820'
            });
        }
    };

    const handleForgotPasswordOpen = () => setOpen(true);
    const handleForgotPasswordClose = () => setOpen(false);

    return (
        <Card sx={{
            display: 'flex',
            flexDirection: 'column',
            alignSelf: 'center',
            width: '100%',
            maxWidth: '600px',
            p: 4,
            gap: 3,
            backgroundColor: 'transparent',
            border: 'none',
            boxShadow: 'none',
        }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <img
                    src="https://i.postimg.cc/HntRVrDy/f85b6d78-659d-4b19-85b2-ed764895fa09-removebg-preview.png"
                    alt="CicarusBank Logo"
                    style={{ width: '200px', height: 'auto' }}
                />
            </Box>

            <Typography component="h1" variant="h4" sx={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>
                Acesse sua conta
            </Typography>

            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}>
                <FormControl>
                    <Typography component="label" htmlFor="username" sx={{ color: 'grey.400', mb: 1 }}>Usuário</Typography>
                    <TextField
                        id="username"
                        name="username"
                        autoComplete="username"
                        autoFocus
                        required
                        fullWidth
                        variant="outlined"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                color: '#fff',
                                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                                '&:hover fieldset': { borderColor: 'rgba(228,104,32,0.7)' },
                                '&.Mui-focused fieldset': { borderColor: 'rgba(228,104,32,1)' },
                            },
                        }}
                    />
                </FormControl>
                <FormControl>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography component="label" htmlFor="password" sx={{ color: 'grey.400' }}>Senha</Typography>
                        <MuiLink component="button" type="button" onClick={handleForgotPasswordOpen} variant="body2" sx={{ color: 'grey.400', '&:hover': { color: '#e46820' } }}>
                            Esqueceu sua senha?
                        </MuiLink>
                    </Box>
                    <TextField
                        name="password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        required
                        fullWidth
                        variant="outlined"
                        sx={{
                            mt: 1,
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                color: '#fff',
                                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                                '&:hover fieldset': { borderColor: 'rgba(228,104,32,0.7)' },
                                '&.Mui-focused fieldset': { borderColor: 'rgba(228,104,32,1)' },
                            },
                        }}
                    />
                </FormControl>
                <FormControlLabel
                    control={<Checkbox value="remember" sx={{ color: 'grey.500', '&.Mui-checked': { color: '#e46820' } }} />}
                    label="Lembrar-me"
                    sx={{ color: 'grey.300' }}
                />

                <ForgotPassword open={open} onClose={handleForgotPasswordClose} />

                <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, py: 1.5, fontSize: '1rem', fontWeight: 'bold', backgroundColor: '#e46820', '&:hover': { backgroundColor: '#d15e1c' } }}>
                    Entrar
                </Button>

                <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ color: 'grey.300' }}>
                        Não tem uma conta?{' '}
                        <MuiLink
                            component="button"
                            type="button"
                            variant="body2"
                            onClick={onSwitchToSignUp}
                            sx={{
                                color: '#e46820',
                                fontWeight: 'bold',
                                textDecoration: 'none',
                                cursor: 'pointer',
                                background: 'none',
                                border: 'none',
                                p: 0,
                                fontFamily: 'inherit',
                                fontSize: 'inherit'
                            }}
                        >
                            Cadastre-se
                        </MuiLink>
                    </Typography>
                </Box>
            </Box>
        </Card>
    );
}