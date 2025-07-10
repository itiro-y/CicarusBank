import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Button, Card, Checkbox, FormControl, FormControlLabel, Link as MuiLink, TextField, Typography
} from '@mui/material';
import ForgotPassword from './ForgotPassword.jsx';

export default function SignInCard({ onSwitchToSignUp }) {
    const [open, setOpen] = React.useState(false);
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const username = data.get('username');
        const password = data.get('password');

        if (username === 'admin' && password === 'admin123') {
            navigate('/dashboard');
        } else {
            alert("Usuário ou senha inválidos.");
        }
    };

    const handleForgotPasswordOpen = () => setOpen(true);
    const handleForgotPasswordClose = () => setOpen(false);

    return (
        <Card sx={{ display: 'flex', flexDirection: 'column', alignSelf: 'center', width: '100%', maxWidth: '600px', p: 4, gap: 3, backgroundColor: 'transparent', border: 'none', boxShadow: 'none' }}>
            {/* O formulário começa AQUI, envolvendo apenas o que é do login */}
            <Box component="form" onSubmit={handleSubmit} noValidate>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <img src="https://i.postimg.cc/HntRVrDy/f85b6d78-659d-4b19-85b2-ed764895fa09-removebg-preview.png" alt="CicarusBank Logo" style={{ width: '200px', height: 'auto' }} />
                </Box>
                <Typography component="h1" variant="h4" sx={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>
                    Acesse sua conta
                </Typography>
                <FormControl fullWidth sx={{ mt: 2 }}>
                    <Typography component="label" htmlFor="username" sx={{ color: 'grey.400', mb: 1 }}>Usuário</Typography>
                    <TextField id="username" name="username" autoComplete="username" autoFocus required fullWidth variant="outlined"
                               sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'rgba(255, 255, 255, 0.05)', color: '#fff', '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' }, '&:hover fieldset': { borderColor: 'rgba(228,104,32,0.7)' }, '&.Mui-focused fieldset': { borderColor: 'rgba(228,104,32,1)' } } }} />
                </FormControl>
                <FormControl fullWidth sx={{ mt: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography component="label" htmlFor="password" sx={{ color: 'grey.400' }}>Senha</Typography>
                        <MuiLink component="button" type="button" onClick={handleForgotPasswordOpen} variant="body2" sx={{ color: 'grey.400', '&:hover': { color: '#e46820' } }}>
                            Esqueceu sua senha?
                        </MuiLink>
                    </Box>
                    <TextField name="password" type="password" id="password" autoComplete="current-password" required fullWidth variant="outlined"
                               sx={{ mt: 1, '& .MuiOutlinedInput-root': { backgroundColor: 'rgba(255, 255, 255, 0.05)', color: '#fff', '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' }, '&:hover fieldset': { borderColor: 'rgba(228,104,32,0.7)' }, '&.Mui-focused fieldset': { borderColor: 'rgba(228,104,32,1)' } } }} />
                </FormControl>
                <FormControlLabel control={<Checkbox value="remember" sx={{ color: 'grey.500', '&.Mui-checked': { color: '#e46820' } }} />} label="Lembrar-me" sx={{ color: 'grey.300' }} />
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, py: 1.5, fontSize: '1rem', fontWeight: 'bold', backgroundColor: '#e46820', '&:hover': { backgroundColor: '#d15e1c' } }}>
                    Entrar
                </Button>
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ color: 'grey.300' }}>
                        Não tem uma conta?{' '}
                        <MuiLink component="button" type="button" variant="body2" onClick={onSwitchToSignUp} sx={{ color: '#e46820', fontWeight: 'bold', textDecoration: 'none', cursor: 'pointer', background: 'none', border: 'none', p: 0, fontFamily: 'inherit', fontSize: 'inherit' }}>
                            Cadastre-se
                        </MuiLink>
                    </Typography>
                </Box>
            </Box>
            <ForgotPassword open={open} onClose={handleForgotPasswordClose} />
        </Card>
    );
}