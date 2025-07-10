import * as React from 'react';
import {
    Box, Button, Card, CardContent, TextField, Typography, Stack, Grid, Link as MuiLink, FormControl
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Person, Email, Lock, AssignmentInd, Cake, Public, Business, Streetview, LocationCity } from '@mui/icons-material';

// Função para criar um campo de formulário com o título separado
const FormField = ({ id, label, ...props }) => (
    <FormControl fullWidth sx={{ mt: 1.5 }}>
        <Typography component="label" htmlFor={id} sx={{ color: 'grey.400', mb: 1 }}>
            {label}
        </Typography>
        <TextField id={id} {...props} />
    </FormControl>
);


function SignUpCard({ onSwitchToSignIn }) {
    const [step, setStep] = React.useState(1);

    const handleNext = () => setStep(2);
    const handleBack = () => setStep(1);

    const slideVariants = {
        hidden: { x: '100%', opacity: 0 },
        visible: { x: '0%', opacity: 1 },
        exit: { x: '-100%', opacity: 0 }
    };

    const commonTextFieldProps = {
        variant: 'outlined',
        fullWidth: true,
        sx: {
            '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: '#fff',
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                '&:hover fieldset': { borderColor: 'rgba(228,104,32,0.7)' },
                '&.Mui-focused fieldset': { borderColor: 'rgba(228,104,32,1)' },
            },
        }
    };

    return (
        <Card
            sx={{
                width: '100%',
                maxWidth: 600,
                p: 4,
                backgroundColor: 'rgba(40, 45, 52, 0.85)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                overflow: 'hidden',
            }}
        >
            <CardContent component={Stack} spacing={1} alignItems="center">
                <img
                    src="https://i.postimg.cc/HntRVrDy/f85b6d78-659d-4b19-85b2-ed764895fa09-removebg-preview.png"
                    alt="CicarusBank Logo"
                    style={{ width: '200px', height: 'auto' }}
                />
                <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold', color: 'white', pt: 2 }}>
                    Criar Sua Conta
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', pb: 2 }}>
                    Etapa {step} de 2: {step === 1 ? 'Dados Pessoais' : 'Endereço'}
                </Typography>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        variants={slideVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                        style={{ width: '100%' }}
                    >
                        {step === 1 ? (
                            <Grid container spacing={2}>
                                <Grid item xs={12}><FormField id="nome" label="Nome Completo" InputProps={{ startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} /> }} {...commonTextFieldProps} /></Grid>
                                <Grid item xs={12} sm={6}><FormField id="cpf" label="Documento (CPF)" InputProps={{ startAdornment: <AssignmentInd sx={{ mr: 1, color: 'text.secondary' }} /> }} {...commonTextFieldProps} /></Grid>
                                <Grid item xs={12} sm={6}><FormField id="nascimento" label="Data de Nascimento" type="date" InputLabelProps={{ shrink: true }} InputProps={{ startAdornment: <Cake sx={{ mr: 1, color: 'text.secondary' }} /> }} {...commonTextFieldProps} /></Grid>
                                <Grid item xs={12}><FormField id="email" label="Email" type="email" InputProps={{ startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} /> }} {...commonTextFieldProps} /></Grid>
                                <Grid item xs={12} sm={6}><FormField id="senha" label="Senha" type="password" InputProps={{ startAdornment: <Lock sx={{ mr: 1, color: 'text.secondary' }} /> }} {...commonTextFieldProps} /></Grid>
                                <Grid item xs={12} sm={6}><FormField id="confirmar-senha" label="Confirmar Senha" type="password" InputProps={{ startAdornment: <Lock sx={{ mr: 1, color: 'text.secondary' }} /> }} {...commonTextFieldProps} /></Grid>
                            </Grid>
                        ) : (
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}><FormField id="pais" label="País" InputProps={{ startAdornment: <Public sx={{ mr: 1, color: 'text.secondary' }} /> }} {...commonTextFieldProps} /></Grid>
                                <Grid item xs={12} sm={6}><FormField id="estado" label="Estado" InputProps={{ startAdornment: <Business sx={{ mr: 1, color: 'text.secondary' }} /> }} {...commonTextFieldProps} /></Grid>
                                <Grid item xs={12} sm={6}><FormField id="rua" label="Rua" InputProps={{ startAdornment: <Streetview sx={{ mr: 1, color: 'text.secondary' }} /> }} {...commonTextFieldProps} /></Grid>
                                <Grid item xs={12} sm={6}><FormField id="cep" label="CEP" InputProps={{ startAdornment: <LocationCity sx={{ mr: 1, color: 'text.secondary' }} /> }} {...commonTextFieldProps} /></Grid>
                            </Grid>
                        )}
                    </motion.div>
                </AnimatePresence>

                <Stack direction="row" spacing={2} sx={{ width: '100%', pt: 3 }}>
                    {step === 2 && (
                        <Button fullWidth variant="outlined" onClick={handleBack} sx={{ py: 1.5, color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}>
                            Voltar
                        </Button>
                    )}
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={step === 1 ? handleNext : null}
                        type={step === 2 ? 'submit' : 'button'}
                        sx={{ py: 1.5, backgroundColor: '#e46820', '&:hover': { backgroundColor: '#d15e1c' }, fontWeight: 'bold' }}
                    >
                        {step === 1 ? 'Próximo' : 'Finalizar Cadastro'}
                    </Button>
                </Stack>

                <Box sx={{ pt: 2, textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Já tem uma conta?{' '}
                        <MuiLink component="button" variant="body2" onClick={onSwitchToSignIn} sx={{ color: '#e46820', fontWeight: 'bold', textDecoration: 'none', cursor: 'pointer', background: 'none', border: 'none', p: 0, fontFamily: 'inherit', fontSize: 'inherit' }}>
                            Faça Login
                        </MuiLink>
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
}

export default SignUpCard;