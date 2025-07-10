import * as React from 'react';
import { motion } from 'framer-motion';
import {
    Box, Container, Typography, Grid, Paper, Avatar, Divider, Stack, Button, List, ListItem, ListItemIcon, ListItemText, IconButton
} from '@mui/material';
import {
    Person, Mail, CalendarToday, LocationOn, Edit, Lock, Shield, CreditCard, AccountBalance,
    Home, VpnKey, PhoneAndroid, Business
} from '@mui/icons-material';
import AppAppBar from '../components/AppAppBar.jsx';

// --- DADOS MOCK (PARA SIMULAÇÃO DO PERFIL) ---
const userProfile = {
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

// --- ESTILO PADRÃO PARA OS CARDS (WIDGETS) ---
const widgetStyle = {
    p: 3,
    borderRadius: '16px',
    backgroundColor: '#282d34',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    height: '100%',
    color: 'white',
};

// --- COMPONENTE DE ITEM DE LISTA DE INFORMAÇÃO ---
const InfoListItem = ({ icon, primary, secondary }) => (
    <ListItem>
        <ListItemIcon sx={{ color: '#e46820', minWidth: '40px' }}>
            {icon}
        </ListItemIcon>
        <ListItemText primary={primary} secondary={secondary}
                      primaryTypographyProps={{ color: 'text.secondary', fontSize: '0.9rem' }}
                      secondaryTypographyProps={{ color: 'white', fontWeight: 'medium', fontSize: '1rem' }}
        />
    </ListItem>
);

// --- COMPONENTES DO PERFIL ---

const ProfileHeader = () => (
    <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
    >
        <Paper elevation={0} sx={{ ...widgetStyle, display: 'flex', alignItems: 'center', gap: 3 }}>
            <Avatar src={userProfile.avatar} sx={{ width: 80, height: 80, border: '3px solid #e46820' }} />
            <Box>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                    {userProfile.name}
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    ID do Cliente: {userProfile.id}
                </Typography>
            </Box>
            <Button variant="outlined" startIcon={<Edit />} sx={{ ml: 'auto', color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}>
                Editar Perfil
            </Button>
        </Paper>
    </motion.div>
);

const PersonalInfo = () => (
    <Paper elevation={0} sx={widgetStyle}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Informações Pessoais</Typography>
        <List dense>
            <InfoListItem icon={<Person />} primary="Nome Completo" secondary={userProfile.name} />
            <Divider component="li" sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
            <InfoListItem icon={<CreditCard />} primary="Documento (CPF)" secondary={userProfile.document} />
            <Divider component="li" sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
            <InfoListItem icon={<Mail />} primary="Email" secondary={userProfile.email} />
            <Divider component="li" sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
            <InfoListItem icon={<CalendarToday />} primary="Data de Nascimento" secondary={userProfile.birthDate} />
        </List>
    </Paper>
);

const AddressInfo = () => (
    <Paper elevation={0} sx={widgetStyle}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Endereço</Typography>
        <List dense>
            <InfoListItem icon={<LocationOn />} primary="País" secondary={userProfile.address.country} />
            <Divider component="li" sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
            <InfoListItem icon={<Business />} primary="Estado / Cidade" secondary={`${userProfile.address.state} / ${userProfile.address.city}`} />
            <Divider component="li" sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
            <InfoListItem icon={<Home />} primary="Rua e CEP" secondary={`${userProfile.address.street}, ${userProfile.address.zip}`} />
        </List>
    </Paper>
);

const AccountInfo = () => (
    <Paper elevation={0} sx={widgetStyle}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Dados Bancários</Typography>
        <List dense>
            <InfoListItem icon={<AccountBalance />} primary="Tipo de Conta" secondary={userProfile.account.type} />
            <Divider component="li" sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
            <InfoListItem icon={<VpnKey />} primary="Agência / Conta" secondary={`${userProfile.account.agency} / ${userProfile.account.accountNumber}`} />
            <Divider component="li" sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
            <InfoListItem icon={<CalendarToday />} primary="Cliente Desde" secondary={userProfile.account.memberSince} />
        </List>
    </Paper>
);

const SecurityActions = () => (
    <Paper elevation={0} sx={widgetStyle}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Segurança</Typography>
        <Stack spacing={2}>
            <Button variant="contained" startIcon={<Lock />} sx={{ justifyContent: 'flex-start', py: 1.5, backgroundColor: '#e46820', '&:hover': {backgroundColor: '#d15e1c'} }}>
                Alterar Senha de Acesso
            </Button>
            <Button variant="outlined" startIcon={<Shield />} sx={{ justifyContent: 'flex-start', py: 1.5, color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}>
                Gerenciar Dispositivos Conectados
            </Button>
            <Button variant="outlined" startIcon={<PhoneAndroid />} sx={{ justifyContent: 'flex-start', py: 1.5, color: 'white', borderColor: 'rgba(255,255,255,0.2)'}}>
                Validar iSafe Token
            </Button>
        </Stack>
    </Paper>
);

// --- PÁGINA PRINCIPAL DO PERFIL ---
export default function ProfilePage() {
    return (
        <Box sx={{ width: '100%', minHeight: '100vh' }}>
            <AppAppBar />
            <Container maxWidth="lg" sx={{ pt: '120px', pb: 4 }}>
                <Stack spacing={3}>
                    <ProfileHeader />
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                                <PersonalInfo />
                            </motion.div>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
                                <AddressInfo />
                            </motion.div>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
                                <AccountInfo />
                            </motion.div>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
                                <SecurityActions />
                            </motion.div>
                        </Grid>
                    </Grid>
                </Stack>
            </Container>
        </Box>
    );
}