import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper, Grid, CircularProgress, Snackbar, Alert } from '@mui/material';
import { LockReset as LockResetIcon } from '@mui/icons-material';

const PasswordChangeSection = ({ onSave, loading }) => {
    const [passwords, setPasswords] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (passwords.newPassword !== passwords.confirmPassword) {
            setError('As novas senhas não correspondem.');
            return;
        }
        if (passwords.newPassword.length < 6) {
            setError('A nova senha deve ter pelo menos 6 caracteres.');
            return;
        }

        try {
            await onSave({
                oldPassword: passwords.oldPassword,
                newPassword: passwords.newPassword
            });
            setSuccess('Senha alterada com sucesso!');
            setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            setError(err.message || 'Ocorreu um erro ao alterar a senha.');
        }
    };

    return (
        <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, borderRadius: '16px', border: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <LockResetIcon sx={{ mr: 1.5, color: 'text.secondary' }} />
                <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                    Alterar Senha
                </Typography>
            </Box>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            required
                            type="password"
                            name="oldPassword"
                            label="Senha Atual"
                            value={passwords.oldPassword}
                            onChange={handleChange}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            required
                            type="password"
                            name="newPassword"
                            label="Nova Senha"
                            value={passwords.newPassword}
                            onChange={handleChange}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            required
                            type="password"
                            name="confirmPassword"
                            label="Confirmar Nova Senha"
                            value={passwords.confirmPassword}
                            onChange={handleChange}
                            variant="outlined"
                            error={!!error && passwords.newPassword !== passwords.confirmPassword}
                        />
                    </Grid>
                </Grid>
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                    >
                        {loading ? 'Salvando...' : 'Salvar Alterações'}
                    </Button>
                </Box>
            </form>
            <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
            <Snackbar open={!!success} autoHideDuration={6000} onClose={() => setSuccess('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert onClose={() => setSuccess('')} severity="success" sx={{ width: '100%' }}>
                    {success}
                </Alert>
            </Snackbar>
        </Paper>
    );
};

export default PasswordChangeSection;

