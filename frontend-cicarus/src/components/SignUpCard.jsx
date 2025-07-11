import * as React from 'react';
import {
    Box, Button, Card, CardContent, TextField, Typography, Stack, Grid, Link as MuiLink, FormControl
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Person, Email, Lock, AssignmentInd, Cake, Public, Business, Streetview, LocationCity } from '@mui/icons-material';

// --- Helper Functions for Masks ---

const maskCPF = (value) => {
    const digitsOnly = value.replace(/\D/g, '');
    const limitedDigits = digitsOnly.substring(0, 11);

    let maskedValue = limitedDigits;
    if (limitedDigits.length > 9) {
        maskedValue = limitedDigits.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
    } else if (limitedDigits.length > 6) {
        maskedValue = limitedDigits.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    } else if (limitedDigits.length > 3) {
        maskedValue = limitedDigits.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    }

    return maskedValue;
};

const maskCEP = (value) => {
    return value
        .replace(/\D/g, '')
        .replace(/^(\d{5})(\d)/, '$1-$2')
        .substring(0, 9);
};

const FormField = ({ id, label, value, onChange, ...props }) => (
    <FormControl fullWidth sx={{ mt: 1.5 }}>
        <Typography component="label" htmlFor={id} sx={{ color: 'grey.400', mb: 1 }}>
            {label}
        </Typography>
        <TextField id={id} name={id} value={value} onChange={onChange} {...props} />
    </FormControl>
);

function SignUpCard({ onSwitchToSignIn }) {
    const [step, setStep] = React.useState(1);

    const [formData, setFormData] = React.useState({
        name: '', document: '', birthDate: '', email: '', password: '',
        confirmPassword: '', country: 'Brasil', state: '', street: '', city: '', zipCode: ''
    });

    const handleChange = (e) => {
        let { name, value } = e.target;

        if (name === 'document') {
            value = maskCPF(value);
        } else if (name === 'zipCode') {
            value = maskCEP(value);
        }

        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (step !== 2) return;

        if (formData.password !== formData.confirmPassword) {
            alert("As senhas não coincidem!");
            return;
        }

        // Remove mask characters before sending to the backend
        const unmaskedDocument = formData.document.replace(/\D/g, '');
        const unmaskedZipCode = formData.zipCode.replace(/\D/g, '');

        const payload = {
            name: formData.name,
            document: unmaskedDocument,
            email: formData.email,
            password: formData.password,
            birthDate: formData.birthDate,
            address: {
                street: formData.street,
                city: formData.city,
                state: formData.state,
                zipCode: unmaskedZipCode,
                country: formData.country
            }
        };

        try {
            const response = await fetch('http://localhost:8300/customers/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                alert('Cadastro realizado com sucesso!');
                onSwitchToSignIn();
            } else {
                const errorData = await response.json();
                alert(`Erro ao cadastrar: ${errorData.message || 'Verifique os dados e tente novamente.'}`);
            }
        } catch (error) {
            console.error('Erro de conexão:', error);
            alert('Não foi possível conectar ao servidor. Verifique se o microserviço está em execução.');
        }
    };

    const handleNext = () => setStep(2);
    const handleBack = () => setStep(1);

    const slideVariants = {
        hidden: { x: '100%', opacity: 0 },
        visible: { x: '0%', opacity: 1 },
        exit: { x: '-100%', opacity: 0 }
    };

    const commonTextFieldProps = {
        variant: 'outlined', fullWidth: true,
        sx: {
            '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255, 255, 255, 0.05)', color: '#fff',
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                '&:hover fieldset': { borderColor: 'rgba(228,104,32,0.7)' },
                '&.Mui-focused fieldset': { borderColor: 'rgba(228,104,32,1)' },
            },
        }
    };

    return (
        <Card sx={{ width: '100%', maxWidth: 600, p: 4, backgroundColor: 'rgba(40, 45, 52, 0.85)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '16px', overflow: 'hidden' }}>
            <Box component="form" noValidate>
                <CardContent component={Stack} spacing={1} alignItems="center">
                    <img src="https://i.postimg.cc/HntRVrDy/f85b6d78-659d-4b19-85b2-ed764895fa09-removebg-preview.png" alt="CicarusBank Logo" style={{ width: '200px', height: 'auto' }} />
                    <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold', color: 'white', pt: 2 }}>Criar Sua Conta</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', pb: 2 }}>Etapa {step} de 2: {step === 1 ? 'Dados Pessoais' : 'Endereço'}</Typography>
                    <AnimatePresence mode="wait">
                        <motion.div key={step} variants={slideVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.4, ease: 'easeInOut' }} style={{ width: '100%' }}>
                            {step === 1 ? (
                                <Grid container spacing={2}>
                                    <Grid item xs={12}><FormField id="name" label="Nome Completo" value={formData.name} onChange={handleChange} InputProps={{ startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} /> }} {...commonTextFieldProps} /></Grid>
                                    <Grid item xs={12} sm={6}><FormField id="document" label="Documento (CPF)" value={formData.document} onChange={handleChange} InputProps={{ startAdornment: <AssignmentInd sx={{ mr: 1, color: 'text.secondary' }} /> }} {...commonTextFieldProps} /></Grid>
                                    <Grid item xs={12} sm={6}><FormField id="birthDate" label="Data de Nascimento" type="date" value={formData.birthDate} onChange={handleChange} InputLabelProps={{ shrink: true }} InputProps={{ startAdornment: <Cake sx={{ mr: 1, color: 'text.secondary' }} /> }} {...commonTextFieldProps} /></Grid>
                                    <Grid item xs={12}><FormField id="email" label="Email" type="email" value={formData.email} onChange={handleChange} InputProps={{ startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} /> }} {...commonTextFieldProps} /></Grid>
                                    <Grid item xs={12} sm={6}><FormField id="password" label="Senha" type="password" value={formData.password} onChange={handleChange} InputProps={{ startAdornment: <Lock sx={{ mr: 1, color: 'text.secondary' }} /> }} {...commonTextFieldProps} /></Grid>
                                    <Grid item xs={12} sm={6}><FormField id="confirmPassword" label="Confirmar Senha" type="password" value={formData.confirmPassword} onChange={handleChange} InputProps={{ startAdornment: <Lock sx={{ mr: 1, color: 'text.secondary' }} /> }} {...commonTextFieldProps} /></Grid>
                                </Grid>
                            ) : (
                                <Grid container spacing={2}>
                                    <Grid item xs={12}><FormField id="zipCode" label="CEP" value={formData.zipCode} onChange={handleChange} InputProps={{ startAdornment: <LocationCity sx={{ mr: 1, color: 'text.secondary' }} /> }} {...commonTextFieldProps} /></Grid>
                                    <Grid item xs={12} sm={6}><FormField id="street" label="Rua" value={formData.street} onChange={handleChange} InputProps={{ startAdornment: <Streetview sx={{ mr: 1, color: 'text.secondary' }} /> }} {...commonTextFieldProps} /></Grid>
                                    <Grid item xs={12} sm={6}><FormField id="city" label="Cidade" value={formData.city} onChange={handleChange} InputProps={{ startAdornment: <Business sx={{ mr: 1, color: 'text.secondary' }} /> }} {...commonTextFieldProps} /></Grid>
                                    <Grid item xs={12} sm={6}><FormField id="state" label="Estado" value={formData.state} onChange={handleChange} InputProps={{ startAdornment: <Business sx={{ mr: 1, color: 'text.secondary' }} /> }} {...commonTextFieldProps} /></Grid>
                                    <Grid item xs={12} sm={6}><FormField id="country" label="País" value={formData.country} onChange={handleChange} InputProps={{ startAdornment: <Public sx={{ mr: 1, color: 'text.secondary' }} /> }} {...commonTextFieldProps} /></Grid>
                                </Grid>
                            )}
                        </motion.div>
                    </AnimatePresence>
                    <Stack direction="row" spacing={2} sx={{ width: '100%', pt: 3 }}>
                        {step === 2 && (<Button fullWidth variant="outlined" type="button" onClick={handleBack} sx={{ py: 1.5, color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}>Voltar</Button>)}
                        {step === 1 ? (
                            <Button fullWidth variant="contained" type="button" onClick={handleNext} sx={{ py: 1.5, backgroundColor: '#e46820', '&:hover': { backgroundColor: '#d15e1c' }, fontWeight: 'bold' }}>Próximo</Button>
                        ) : (
                            <Button
                                fullWidth
                                variant="contained"
                                type="button"
                                onClick={handleSubmit}
                                sx={{ py: 1.5, backgroundColor: '#e46820', '&:hover': { backgroundColor: '#d15e1c' }, fontWeight: 'bold' }}
                            >
                                Finalizar Cadastro
                            </Button>
                        )}
                    </Stack>
                    <Box sx={{ pt: 2, textAlign: 'center' }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>Já tem uma conta?{' '}<MuiLink component="button" variant="body2" onClick={onSwitchToSignIn} sx={{ color: '#e46820', fontWeight: 'bold', textDecoration: 'none', cursor: 'pointer', background: 'none', border: 'none', p: 0, fontFamily: 'inherit', fontSize: 'inherit' }}>Faça Login</MuiLink></Typography>
                    </Box>
                </CardContent>
            </Box>
        </Card>
    );
}

export default SignUpCard;
