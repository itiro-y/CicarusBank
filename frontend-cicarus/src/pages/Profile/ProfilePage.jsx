import * as React from 'react';
import { motion } from 'framer-motion';
import {
    Box, Container, Typography, Grid, Paper, Avatar, Divider, Stack,
    Button, List, ListItem, ListItemIcon, ListItemText, IconButton, Dialog,
    DialogTitle, DialogContent, DialogActions, TextField, useTheme
} from '@mui/material';
import {
    Person, Mail, CalendarToday, LocationOn, Edit, Lock, Shield,
    CreditCard, AccountBalance, Home, VpnKey, PhoneAndroid, Business, Close
} from '@mui/icons-material';
import AppAppBar from '../components/AppAppBar.jsx';
import { useUser } from '../context/UserContext.jsx';
import { useNavigate } from "react-router-dom";

// ------------------ MOCK ------------------
const initialProfile = {
    id: 'CICARUS-8B7A',
    name: "Admin Cicarus", // This will be overridden by context
    document: "123.456.789-00",
    email: "admin.cicarus@cicarusbank.com",
    birthDate: "01/01/1990",
    avatar: "https://i.pravatar.cc/150?u=admin",
    address: {
        country: "Brasil",
        state: "São Paulo",
        city: "São Paulo",
        street: "Avenida Principal, 123",
        zip: "01234-567"
    },
    account: {
        type: "Conta Corrente Premium",
        agency: "0001",
        accountNumber: "123456-7",
        memberSince: "15/06/2020"
    }
};

// ------------------ MODAL DE EDIÇÃO ------------------
function EditProfileDialog({ open, onClose, data, onSave }) {
    const [form, setForm] = React.useState({ ...data });

    React.useEffect(() => {
        setForm(data);
    }, [data]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [section, field] = name.split('.');
            setForm(prev => ({
                ...prev,
                [section]: { ...prev[section], [field]: value }
            }));
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = () => {
        onSave(form);
        onClose();
    };

    const isFieldDisabled = (field) =>
        ['name', 'document', 'birthDate'].includes(field);

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
                    <Grid item xs={12} md={6}>
                        <TextField name="name" label="Nome Completo" value={form.name} onChange={handleChange} fullWidth margin="normal" disabled={isFieldDisabled('name')} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField name="document" label="Documento (CPF)" value={form.document} onChange={handleChange} fullWidth margin="normal" disabled={isFieldDisabled('document')} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField name="email" label="Email" value={form.email} onChange={handleChange} fullWidth margin="normal" />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField name="birthDate" label="Data de Nascimento" value={form.birthDate} onChange={handleChange} fullWidth margin="normal" disabled={isFieldDisabled('birthDate')} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField name="address.street" label="Rua" value={form.address.street} onChange={handleChange} fullWidth margin="normal" />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField name="address.city" label="Cidade" value={form.address.city} onChange={handleChange} fullWidth margin="normal" />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField name="address.state" label="Estado" value={form.address.state} onChange={handleChange} fullWidth margin="normal" />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField name="address.zip" label="CEP" value={form.address.zip} onChange={handleChange} fullWidth margin="normal" />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">Salvar</Button>
            </DialogActions>
        </Dialog>
    );
}

// ------------------ COMPONENTES ------------------
const InfoListItem = ({ icon, primary, secondary }) => (
    <ListItem>
        <ListItemIcon sx={{ color: 'primary.main', minWidth: '40px' }}>{icon}</ListItemIcon>
        <ListItemText primary={primary} secondary={secondary}
                      primaryTypographyProps={{ color: 'text.secondary', fontSize: '0.9rem' }}
                      secondaryTypographyProps={{ color: 'text.primary', fontWeight: 'medium', fontSize: '1rem' }}
        />
    </ListItem>
);

const ProfileHeader = ({ profile, onEdit }) => {
    const { user } = useUser();
    const userName = user ? user.name : profile.name;
    const userAvatar = user ? user.avatar : profile.avatar;

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Paper elevation={0} sx={{
                p: 3, borderRadius: '16px', bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider',
                display: 'flex', alignItems: 'center', gap: 3
            }}>
                <Avatar src={userAvatar} sx={{ width: 80, height: 80, border: '3px solid', borderColor: 'primary.main' }} />
                <Box>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                        {userName}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                        ID do Cliente: {profile.id}
                    </Typography>
                </Box>
                <Button
                    variant="outlined"
                    startIcon={<Edit />}
                    onClick={onEdit}
                    sx={{ ml: 'auto' }}
                >
                    Editar Perfil
                </Button>
            </Paper>
        </motion.div>
    );
};

const InfoWidget = ({ title, children }) => (
    <Paper elevation={0} sx={{
        p: 3, borderRadius: '16px', bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', height: '100%'
    }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>{title}</Typography>
        {children}
    </Paper>
);


const PersonalInfo = ({ profile }) => (
    <InfoWidget title="Informações Pessoais">
        <List dense>
            <InfoListItem icon={<Person />} primary="Nome Completo" secondary={profile.name} />
            <Divider component="li" sx={{ borderColor: 'divider' }} />
            <InfoListItem icon={<CreditCard />} primary="Documento (CPF)" secondary={profile.document} />
            <Divider component="li" sx={{ borderColor: 'divider' }} />
            <InfoListItem icon={<Mail />} primary="Email" secondary={profile.email} />
            <Divider component="li" sx={{ borderColor: 'divider' }} />
            <InfoListItem icon={<CalendarToday />} primary="Data de Nascimento" secondary={profile.birthDate} />
        </List>
    </InfoWidget>
);

const AddressInfo = ({ profile }) => (
    <InfoWidget title="Endereço">
        <List dense>
            <InfoListItem icon={<LocationOn />} primary="País" secondary={profile.address.country} />
            <Divider component="li" sx={{ borderColor: 'divider' }} />
            <InfoListItem icon={<Business />} primary="Estado / Cidade" secondary={`${profile.address.state} / ${profile.address.city}`} />
            <Divider component="li" sx={{ borderColor: 'divider' }} />
            <InfoListItem icon={<Home />} primary="Rua e CEP" secondary={`${profile.address.street}, ${profile.address.zip}`} />
        </List>
    </InfoWidget>
);

const AccountInfo = ({ profile }) => (
    <InfoWidget title="Dados Bancários">
        <List dense>
            <InfoListItem icon={<AccountBalance />} primary="Tipo de Conta" secondary={profile.account.type} />
            <Divider component="li" sx={{ borderColor: 'divider' }} />
            <InfoListItem icon={<VpnKey />} primary="Agência / Conta" secondary={`${profile.account.agency} / ${profile.account.accountNumber}`} />
            <Divider component="li" sx={{ borderColor: 'divider' }} />
            <InfoListItem icon={<CalendarToday />} primary="Cliente Desde" secondary={profile.account.memberSince} />
        </List>
    </InfoWidget>
);

const SecurityActions = () => {
    const navigate = useNavigate();

    return (
        <InfoWidget title="Segurança">
            <Stack spacing={2}>
                <Button variant="contained" startIcon={<Lock />} color="primary" sx={{ justifyContent: 'flex-start', py: 1.5 }}>
                    Alterar Senha de Acesso
                </Button>
                <Button
                    variant="outlined"
                    startIcon={<Shield />}
                    sx={{ justifyContent: 'flex-start', py: 1.5 }}
                    onClick={() => navigate('/connected-devices')}
                >
                    Gerenciar Dispositivos Conectados
                </Button>
                <Button variant="outlined" startIcon={<PhoneAndroid />} sx={{ justifyContent: 'flex-start', py: 1.5 }}>
                    Validar iSafe Token
                </Button>
            </Stack>
        </InfoWidget>
    );
};


// ------------------ PÁGINA PRINCIPAL ------------------
export default function ProfilePage() {
    const [profile, setProfile] = React.useState(initialProfile);
    const [openEdit, setOpenEdit] = React.useState(false);
    const theme = useTheme();

    const widgetStyle = {
        p: 3,
        borderRadius: '16px',
        backgroundColor: theme.palette.background.paper,
        border: '1px solid',
        borderColor: theme.palette.divider,
        height: '100%',
    };


    return (
        <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: 'background.default' }}>
            <AppAppBar />
            <Container maxWidth="lg" sx={{ pt: '120px', pb: 4 }}>
                <Stack spacing={3}>
                    <ProfileHeader profile={profile} onEdit={() => setOpenEdit(true)} />
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                                <PersonalInfo profile={profile} />
                            </motion.div>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
                                <AddressInfo profile={profile} />
                            </motion.div>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
                                <AccountInfo profile={profile} />
                            </motion.div>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
                                <SecurityActions />
                            </motion.div>
                        </Grid>
                    </Grid>
                </Stack>

                <EditProfileDialog
                    open={openEdit}
                    onClose={() => setOpenEdit(false)}
                    data={profile}
                    onSave={setProfile}
                />
            </Container>
        </Box>
    );
}