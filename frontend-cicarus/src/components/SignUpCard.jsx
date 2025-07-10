import * as React from 'react';
import {
    Box, Button, Card, CardContent, FormControl, TextField, Typography, Link as MuiLink, Stack, Grid
} from '@mui/material';
import { Person, Email, Lock, AssignmentInd, Cake, LocationCity } from '@mui/icons-material';
import { CicarusFullLogo } from './CustomIcons';

// O componente recebe uma propriedade 'onSwitchToSignIn' para poder voltar à tela de login
function SignUpCard({ onSwitchToSignIn }) {
    return (
        <Card
            sx={{
                width: '100%',
                maxWidth: 550, // Aumentado para acomodar mais campos
                p: 4,
                backgroundColor: 'rgba(40, 45, 52, 0.85)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
            }}
        >
            <CardContent component={Stack} spacing={2} alignItems="center">
                <CicarusFullLogo />
                <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold', color: 'white', mt: 2 }}>
                    Criar Sua Conta
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                    Complete seu cadastro para se juntar ao Cicarus Bank.
                </Typography>

                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField fullWidth label="Nome Completo" InputProps={{ startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} /> }} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Documento (CPF)" InputProps={{ startAdornment: <AssignmentInd sx={{ mr: 1, color: 'text.secondary' }} /> }} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Data de Nascimento" type="date" InputLabelProps={{ shrink: true }} InputProps={{ startAdornment: <Cake sx={{ mr: 1, color: 'text.secondary' }} /> }} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth label="Email" type="email" InputProps={{ startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} /> }} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth label="CEP" InputProps={{ startAdornment: <LocationCity sx={{ mr: 1, color: 'text.secondary' }} /> }} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Senha" type="password" InputProps={{ startAdornment: <Lock sx={{ mr: 1, color: 'text.secondary' }} /> }} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Confirmar Senha" type="password" InputProps={{ startAdornment: <Lock sx={{ mr: 1, color: 'text.secondary' }} /> }} />
                    </Grid>
                </Grid>

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                        py: 1.5,
                        mt: 3,
                        backgroundColor: '#e46820',
                        '&:hover': { backgroundColor: '#d15e1c' },
                        fontWeight: 'bold'
                    }}
                >
                    Finalizar Cadastro
                </Button>

                <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Já tem uma conta?{' '}
                        <MuiLink
                            component="button"
                            variant="body2"
                            onClick={onSwitchToSignIn}
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
                            Faça Login
                        </MuiLink>
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
}

export default SignUpCard;