import * as React from 'react';
import {
    Box, Button, Card, CardContent, TextField, Typography, Stack, Grid, Link as MuiLink, FormControl,
    Dialog, DialogTitle, DialogContent, DialogActions, useTheme
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Person, Email, Lock, AssignmentInd, Cake, Public, Business, Streetview, LocationCity } from '@mui/icons-material';

const maskCPF = (value) => {
    return value
        .replace(/\D/g, '')
        .substring(0, 11)
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2');
};

const maskCEP = (value) => {
    return value
        .replace(/\D/g, '')
        .replace(/^(\d{5})(\d)/, '$1-$2')
        .substring(0, 9);
};

const FormField = ({ id, label, ...props }) => (
    <FormControl fullWidth sx={{ mt: 1.5 }}>
        <Typography component="label" htmlFor={id} sx={{ color: 'text.secondary', mb: 1 }}>
            {label}
        </Typography>
        <TextField id={id} name={id} {...props} />
    </FormControl>
);

function SignUpCard({ onSwitchToSignIn }) {
    const theme = useTheme();
    const [step, setStep] = React.useState(1);
    const [formData, setFormData] = React.useState({
        name: '', document: '', birthDate: '', email: '', password: '',
        confirmPassword: '', country: 'Brasil', state: '', street: '', city: '', zipCode: ''
    });
    const [showDialog, setShowDialog] = React.useState(false);
    const [dialogMessage, setDialogMessage] = React.useState('');
    const [dialogTitle, setDialogTitle] = React.useState('');

    const logoStyle = {
        width: '200px',
        height: 'auto',
        filter: theme.palette.mode === 'dark' ? 'brightness(0) invert(1)' : 'none',
    };

    const handleOpenDialog = (title, message) => {
        setDialogTitle(title);
        setDialogMessage(message);
        setShowDialog(true);
    };

    const handleCloseDialog = () => {
        setShowDialog(false);
        if (dialogTitle === 'Sucesso!') {
            onSwitchToSignIn();
        }
    };

    const handleChange = (e) => {
        let { name, value } = e.target;
        if (name === 'document') value = maskCPF(value);
        else if (name === 'zipCode') value = maskCEP(value);
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleNext = () => {
        const { name, document, birthDate, email, password, confirmPassword } = formData;
        if (!name || !document || !birthDate || !email || !password || !confirmPassword) {
            handleOpenDialog("Campos Obrigatórios", "Por favor, preencha todos os campos de dados pessoais para continuar.");
            return;
        }
        if (document.length !== 14) {
            handleOpenDialog("CPF Inválido", "Por favor, preencha o CPF completamente no formato correto.");
            return;
        }
        if (password !== confirmPassword) {
            handleOpenDialog("Erro de Senha", "As senhas não coincidem!");
            return;
        }
        setStep(2);
    };

    const handleBack = () => setStep(1);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const { street, city, state, zipCode } = formData;
        if (!street || !city || !state || !zipCode) {
            handleOpenDialog("Campos Obrigatórios", "Por favor, preencha todos os campos de endereço.");
            return;
        }
        if (zipCode.length !== 9) {
            handleOpenDialog("CEP Inválido", "Por favor, preencha o CEP completamente no formato correto.");
            return;
        }
        const unmaskedDocument = formData.document.replace(/\D/g, '');
        const unmaskedZipCode = formData.zipCode.replace(/\D/g, '');
        const payload = {
            name: formData.name, document: unmaskedDocument, email: formData.email, password: formData.password,
            birthDate: formData.birthDate,
            address: { street, city, state, zipCode: unmaskedZipCode, country: formData.country }
        };
        try {
//             const response = await fetch('http://localhost:8300/customers/create', {
            const response = await fetch('https://cicarusbank.app/customers/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (response.ok) {
                handleOpenDialog('Sucesso!', 'Cadastro realizado com sucesso!');
            } else {
                handleOpenDialog("Erro no Cadastro", 'Não foi possível realizar o cadastro. Verifique se os dados estão corretos.');
            }
        } catch (error) {
            handleOpenDialog('Erro de Conexão', 'Não foi possível conectar ao servidor.');
        }
    };

    const slideVariants = {
        hidden: { x: '100%', opacity: 0 },
        visible: { x: '0%', opacity: 1 },
        exit: { x: '-100%', opacity: 0 }
    };

    return (

        <Card sx={{
            width: '100%',
            maxWidth: 600,
            p: 4,
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(40, 45, 52, 0.85)' : 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(10px)',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: '16px',
            overflow: 'hidden'
        }}>
            <Box component="form" noValidate>
                <CardContent component={Stack} spacing={1} alignItems="center">
                    <img src="https://i.postimg.cc/tTNVVxN9/Whisk-ebcbb91926.png" alt="CicarusBank Logo" style={logoStyle} />
                    <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold', color: 'text.primary', pt: 2 }}>Criar Sua Conta</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', pb: 2 }}>Etapa {step} de 2: {step === 1 ? 'Dados Pessoais' : 'Endereço'}</Typography>
                    <AnimatePresence mode="wait">
                        <motion.div key={step} variants={slideVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.4, ease: 'easeInOut' }} style={{ width: '100%' }}>
                            {step === 1 ? (
                                <Grid container spacing={2}>
                                    <Grid item xs={12}><FormField id="name" label="Nome Completo" value={formData.name} onChange={handleChange} InputProps={{ startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} /> }} /></Grid>
                                    <Grid item xs={12} sm={6}><FormField id="document" label="Documento (CPF)" value={formData.document} onChange={handleChange} InputProps={{ startAdornment: <AssignmentInd sx={{ mr: 1, color: 'text.secondary' }} /> }} /></Grid>
                                    <Grid item xs={12} sm={6}><FormField id="birthDate" label="Data de Nascimento" type="date" value={formData.birthDate} onChange={handleChange} InputLabelProps={{ shrink: true }} InputProps={{ startAdornment: <Cake sx={{ mr: 1, color: 'text.secondary' }} /> }} /></Grid>
                                    <Grid item xs={12}><FormField id="email" label="Email" type="email" value={formData.email} onChange={handleChange} InputProps={{ startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} /> }} /></Grid>
                                    <Grid item xs={12} sm={6}><FormField id="password" label="Senha" type="password" value={formData.password} onChange={handleChange} InputProps={{ startAdornment: <Lock sx={{ mr: 1, color: 'text.secondary' }} /> }} /></Grid>
                                    <Grid item xs={12} sm={6}><FormField id="confirmPassword" label="Confirmar Senha" type="password" value={formData.confirmPassword} onChange={handleChange} InputProps={{ startAdornment: <Lock sx={{ mr: 1, color: 'text.secondary' }} /> }} /></Grid>
                                </Grid>
                            ) : (
                                <Grid container spacing={2}>
                                    <Grid item xs={12}><FormField id="zipCode" label="CEP" value={formData.zipCode} onChange={handleChange} InputProps={{ startAdornment: <LocationCity sx={{ mr: 1, color: 'text.secondary' }} /> }} /></Grid>
                                    <Grid item xs={12} sm={6}><FormField id="street" label="Rua" value={formData.street} onChange={handleChange} InputProps={{ startAdornment: <Streetview sx={{ mr: 1, color: 'text.secondary' }} /> }} /></Grid>
                                    <Grid item xs={12} sm={6}><FormField id="city" label="Cidade" value={formData.city} onChange={handleChange} InputProps={{ startAdornment: <Business sx={{ mr: 1, color: 'text.secondary' }} /> }} /></Grid>
                                    <Grid item xs={12} sm={6}><FormField id="state" label="Estado" value={formData.state} onChange={handleChange} InputProps={{ startAdornment: <Business sx={{ mr: 1, color: 'text.secondary' }} /> }} /></Grid>
                                    <Grid item xs={12} sm={6}><FormField id="country" label="País" value={formData.country} onChange={handleChange} InputProps={{ startAdornment: <Public sx={{ mr: 1, color: 'text.secondary' }} /> }} /></Grid>
                                </Grid>
                            )}
                        </motion.div>
                    </AnimatePresence>
                    <Stack direction="row" spacing={2} sx={{ width: '100%', pt: 3 }}>
                        {step === 2 && (<Button fullWidth variant="outlined" type="button" onClick={handleBack} sx={{ py: 1.5 }}>Voltar</Button>)}
                        <Button fullWidth variant="contained" color="primary" type="button" onClick={step === 1 ? handleNext : handleSubmit} sx={{ py: 1.5, fontWeight: 'bold' }}>
                            {step === 1 ? 'Próximo' : 'Finalizar Cadastro'}
                        </Button>
                    </Stack>
                    <Box sx={{ pt: 2, textAlign: 'center' }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>Já tem uma conta?{' '}
                            <MuiLink component="button" variant="body2" onClick={onSwitchToSignIn} sx={{ color: 'primary.main', fontWeight: 'bold', textDecoration: 'none', cursor: 'pointer', background: 'none', border: 'none', p: 0, fontFamily: 'inherit', fontSize: 'inherit' }}>
                                Faça Login
                            </MuiLink>
                        </Typography>
                    </Box>
                </CardContent>
            </Box>

            <Dialog
                open={showDialog}
                onClose={handleCloseDialog}
                PaperProps={{
                    sx: {
                        backgroundColor: 'background.paper',
                        borderRadius: '16px',
                        border: '1px solid',
                        borderColor: 'divider',
                    }
                }}
            >
                <DialogTitle sx={{ color: 'primary.main', fontWeight: 'bold' }}>{dialogTitle}</DialogTitle>
                <DialogContent>
                    <Typography sx={{ color: 'text.primary' }}>
                        {dialogMessage}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary" sx={{ fontWeight: 'bold' }} autoFocus>
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
}

export default SignUpCard;