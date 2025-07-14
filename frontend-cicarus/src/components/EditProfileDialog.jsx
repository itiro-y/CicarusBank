import * as React from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, Grid, IconButton
} from '@mui/material';
import {
    Close, Person, Email, AssignmentInd, Cake,
    Public, Business, LocationCity, Streetview, Home
} from '@mui/icons-material';
import InputMask from 'react-input-mask';

// Campo com suporte a máscara (CPF, CEP)
function FormField(props) {
    const { mask, ...otherProps } = props;

    if (mask) {
        return (
            <InputMask
                mask={mask}
                value={otherProps.value}
                onChange={otherProps.onChange}
                maskChar={null}
            >
                {(inputProps) => (
                    <TextField
                        {...otherProps}
                        {...inputProps}
                        inputRef={inputProps.ref}
                    />
                )}
            </InputMask>
        );
    }

    return <TextField {...otherProps} />;
}

export default function EditProfileDialog({ open, onClose, data, onSave }) {
    const initialForm = {
        ...data,
        birthDate: data.birthDate ? new Date(data.birthDate).toISOString().split('T')[0] : '',
        document: data.document || '',
        address: {
            ...data.address,
            zip: data.address?.zip || '',
        },
    };

    const [form, setForm] = React.useState(initialForm);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [outer, inner] = name.split('.');
            setForm(prev => ({
                ...prev,
                [outer]: { ...prev[outer], [inner]: value }
            }));
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = () => {
        const dataToSave = {
            ...form,
            birthDate: form.birthDate ? new Date(form.birthDate).toISOString() : null,
            document: form.document.replace(/\D/g, ''),
            address: {
                ...form.address,
                zip: form.address.zip.replace(/\D/g, '')
            }
        };
        onSave(dataToSave);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                Editar Perfil
                <IconButton onClick={onClose} sx={{ position: 'absolute', right: 16, top: 16 }}>
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <FormField
                            id="name"
                            name="name"
                            label="Nome"
                            value={form.name}
                            onChange={handleChange}
                            margin="normal"
                            fullWidth
                            InputProps={{
                                startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormField
                            id="email"
                            name="email"
                            label="Email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            margin="normal"
                            fullWidth
                            InputProps={{
                                startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormField
                            id="document"
                            name="document"
                            label="CPF"
                            value={form.document}
                            onChange={handleChange}
                            margin="normal"
                            fullWidth
                            mask="999.999.999-99"
                            InputProps={{
                                startAdornment: <AssignmentInd sx={{ mr: 1, color: 'text.secondary' }} />
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            id="birthDate"
                            name="birthDate"
                            label="Data de Nascimento"
                            type="date"
                            value={form.birthDate}
                            onChange={handleChange}
                            margin="normal"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormField
                            id="address.country"
                            name="address.country"
                            label="País"
                            value={form.address.country}
                            onChange={handleChange}
                            margin="normal"
                            fullWidth
                            InputProps={{
                                startAdornment: <Public sx={{ mr: 1, color: 'text.secondary' }} />
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormField
                            id="address.state"
                            name="address.state"
                            label="Estado"
                            value={form.address.state}
                            onChange={handleChange}
                            margin="normal"
                            fullWidth
                            InputProps={{
                                startAdornment: <Business sx={{ mr: 1, color: 'text.secondary' }} />
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormField
                            id="address.city"
                            name="address.city"
                            label="Cidade"
                            value={form.address.city}
                            onChange={handleChange}
                            margin="normal"
                            fullWidth
                            InputProps={{
                                startAdornment: <LocationCity sx={{ mr: 1, color: 'text.secondary' }} />
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormField
                            id="address.street"
                            name="address.street"
                            label="Rua"
                            value={form.address.street}
                            onChange={handleChange}
                            margin="normal"
                            fullWidth
                            InputProps={{
                                startAdornment: <Streetview sx={{ mr: 1, color: 'text.secondary' }} />
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormField
                            id="address.zip"
                            name="address.zip"
                            label="CEP"
                            value={form.address.zip}
                            onChange={handleChange}
                            margin="normal"
                            fullWidth
                            mask="99999-999"
                            InputProps={{
                                startAdornment: <Home sx={{ mr: 1, color: 'text.secondary' }} />
                            }}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">Cancelar</Button>
                <Button onClick={handleSubmit} variant="contained" sx={{ backgroundColor: '#e46820' }}>Salvar</Button>
            </DialogActions>
        </Dialog>
    );
}
