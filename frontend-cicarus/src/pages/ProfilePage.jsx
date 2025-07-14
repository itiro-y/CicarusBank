import * as React from 'react';
import { motion } from 'framer-motion';
import {
    Box, Container, Typography, Grid, Paper, Avatar, Divider, Stack,
    Button, List, ListItem, ListItemIcon, ListItemText, IconButton, Dialog,
    DialogTitle, DialogContent, DialogActions, TextField
} from '@mui/material';
import {
    Person, Mail, CalendarToday, LocationOn, Edit, Lock, Shield,
    CreditCard, AccountBalance, Home, VpnKey, PhoneAndroid, Business, Close
} from '@mui/icons-material';
import AppAppBar from '../components/AppAppBar.jsx';

// ------------------ MOCK ------------------
const initialProfile = {
    id: 'CICARUS-8B7A',
    name: "Admin Cicarus",
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

// ------------------ ESTILO GLOBAL ------------------
const widgetStyle = {
    p: 3,
    borderRadius: '16px',
    backgroundColor: '#282d34',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    height: '100%',
    color: 'white',
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
                <Grid container spacing={6}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Nome"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            disabled={isFieldDisabled('name')}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="CPF"
                            name="document"
                            value={form.document}
                            onChange={handleChange}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            disabled={isFieldDisabled('document')}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Data de Nascimento"
                            name="birthDate"
                            value={form.birthDate}
                            onChange={handleChange}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            disabled={isFieldDisabled('birthDate')}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField label="País" name="address.country" value={form.address.country} onChange={handleChange} fullWidth slotProps={{ inputLabel: { shrink: true } }}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField label="Estado" name="address.state" value={form.address.state} onChange={handleChange} fullWidth slotProps={{ inputLabel: { shrink: true } }}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField label="Cidade" name="address.city" value={form.address.city} onChange={handleChange} fullWidth slotProps={{ inputLabel: { shrink: true } }}
                        />
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <TextField label="Rua" name="address.street" value={form.address.street} onChange={handleChange} slotProps={{ inputLabel: { shrink: true } }}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField label="CEP" name="address.zip" value={form.address.zip} onChange={handleChange} fullWidth slotProps={{ inputLabel: { shrink: true } }}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button onClick={handleSubmit} variant="contained" sx={{ backgroundColor: '#e46820' }}>Salvar</Button>
            </DialogActions>
        </Dialog>
    );
}

// ------------------ COMPONENTES ------------------
const InfoListItem = ({ icon, primary, secondary }) => (
    <ListItem>
        <ListItemIcon sx={{ color: '#e46820', minWidth: '40px' }}>{icon}</ListItemIcon>
        <ListItemText primary={primary} secondary={secondary}
                      primaryTypographyProps={{ color: 'text.secondary', fontSize: '0.9rem' }}
                      secondaryTypographyProps={{ color: 'white', fontWeight: 'medium', fontSize: '1rem' }}
        />
    </ListItem>
);

const ProfileHeader = ({ profile, onEdit }) => (
    <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
    >
        <Paper elevation={0} sx={{ ...widgetStyle, display: 'flex', alignItems: 'center', gap: 3 }}>
            <Avatar src={profile.avatar} sx={{ width: 80, height: 80, border: '3px solid #e46820' }} />
            <Box>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                    {profile.name}
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    ID do Cliente: {profile.id}
                </Typography>
            </Box>
            <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={onEdit}
                sx={{ ml: 'auto', color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}
            >
                Editar Perfil
            </Button>
        </Paper>
    </motion.div>
);

const PersonalInfo = ({ profile }) => (
    <Paper elevation={0} sx={widgetStyle}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Informações Pessoais</Typography>
        <List dense>
            <InfoListItem icon={<Person />} primary="Nome Completo" secondary={profile.name} />
            <Divider component="li" sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
            <InfoListItem icon={<CreditCard />} primary="Documento (CPF)" secondary={profile.document} />
            <Divider component="li" sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
            <InfoListItem icon={<Mail />} primary="Email" secondary={profile.email} />
            <Divider component="li" sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
            <InfoListItem icon={<CalendarToday />} primary="Data de Nascimento" secondary={profile.birthDate} />
        </List>
    </Paper>
);

const AddressInfo = ({ profile }) => (
    <Paper elevation={0} sx={widgetStyle}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Endereço</Typography>
        <List dense>
            <InfoListItem icon={<LocationOn />} primary="País" secondary={profile.address.country} />
            <Divider component="li" sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
            <InfoListItem icon={<Business />} primary="Estado / Cidade" secondary={`${profile.address.state} / ${profile.address.city}`} />
            <Divider component="li" sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
            <InfoListItem icon={<Home />} primary="Rua e CEP" secondary={`${profile.address.street}, ${profile.address.zip}`} />
        </List>
    </Paper>
);

const AccountInfo = ({ profile }) => (
    <Paper elevation={0} sx={widgetStyle}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Dados Bancários</Typography>
        <List dense>
            <InfoListItem icon={<AccountBalance />} primary="Tipo de Conta" secondary={profile.account.type} />
            <Divider component="li" sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
            <InfoListItem icon={<VpnKey />} primary="Agência / Conta" secondary={`${profile.account.agency} / ${profile.account.accountNumber}`} />
            <Divider component="li" sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
            <InfoListItem icon={<CalendarToday />} primary="Cliente Desde" secondary={profile.account.memberSince} />
        </List>
    </Paper>
);

const SecurityActions = () => (
    <Paper elevation={0} sx={widgetStyle}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Segurança</Typography>
        <Stack spacing={2}>
            <Button variant="contained" startIcon={<Lock />} sx={{ justifyContent: 'flex-start', py: 1.5, backgroundColor: '#e46820' }}>
                Alterar Senha de Acesso
            </Button>
            <Button variant="outlined" startIcon={<Shield />} sx={{ justifyContent: 'flex-start', py: 1.5, color: 'white' }}>
                Gerenciar Dispositivos Conectados
            </Button>
            <Button variant="outlined" startIcon={<PhoneAndroid />} sx={{ justifyContent: 'flex-start', py: 1.5, color: 'white' }}>
                Validar iSafe Token
            </Button>
        </Stack>
    </Paper>
);

// ------------------ PÁGINA PRINCIPAL ------------------
export default function ProfilePage() {
    const [profile, setProfile] = React.useState(initialProfile);
    const [openEdit, setOpenEdit] = React.useState(false);

    return (
        <Box sx={{ width: '100%', minHeight: '100vh' }}>
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
