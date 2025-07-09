// Em: src/components/SignInCard.jsx
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MuiCard from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import ForgotPassword from './ForgotPassword.jsx';

const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(3),
    backgroundColor: 'transparent',
    border: 'none',
    boxShadow: 'none',
    [theme.breakpoints.up('sm')]: {
        width: '450px',
    },
}));

export default function SignInCard() {
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
            alert("Username ou senha inválidos.");
        }
    };

    return (
        <Card>
            {/* IMAGEM ADICIONADA AQUI */}
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
            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}
            >
                <FormControl>
                    <FormLabel htmlFor="username" sx={{ color: 'grey.400' }}>Username</FormLabel>
                    <TextField
                        id="username"
                        name="username"
                        autoComplete="username"
                        autoFocus
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
                <FormControl>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <FormLabel htmlFor="password" sx={{ color: 'grey.400' }}>Password</FormLabel>
                        <Link component="button" type="button" onClick={() => setOpen(true)} variant="body2" sx={{ color: 'grey.400', '&:hover': { color: '#e46820' } }}>
                            Forgot your password?
                        </Link>
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
                    label="Remember me"
                    sx={{ color: 'grey.300' }}
                />
                <ForgotPassword open={open} handleClose={() => setOpen(false)} />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                        mt: 2,
                        py: 1.5,
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        backgroundColor: '#e46820',
                        '&:hover': {
                            backgroundColor: '#d15e1c',
                        },
                    }}
                >
                    Sign in
                </Button>
                <Typography sx={{ textAlign: 'center', color: 'grey.500', mt: 2 }}>
                    Don't have an account?{' '}
                    <Link href="#" variant="body2" sx={{ color: '#e46820', fontWeight: 'bold' }}>
                        Sign up
                    </Link>
                </Typography>
            </Box>
        </Card>
    );
}