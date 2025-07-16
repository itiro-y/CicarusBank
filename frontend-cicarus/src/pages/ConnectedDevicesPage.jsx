import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Box, Container, Typography, Paper, Stack, Button, IconButton,
    List, ListItem, ListItemAvatar, Avatar, ListItemText, Divider, Dialog,
    DialogTitle, DialogContent, DialogContentText, DialogActions
} from '@mui/material';
import {
    DesktopWindows, Smartphone, TabletMac, Delete, HelpOutline, ArrowBack
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AppAppBar from '../components/AppAppBar.jsx';
import Swal from 'sweetalert2';

// --- DADOS MOCK ---
const initialDevices = [
    {
        id: 1,
        type: 'Desktop',
        name: 'Windows 10',
        browser: 'Chrome',
        location: 'São Paulo, SP, Brasil',
        lastAccess: 'Hoje, às 09:30',
        isCurrent: true,
    },
    {
        id: 2,
        type: 'Smartphone',
        name: 'iPhone 15 Pro',
        browser: 'App CicarusBank',
        location: 'Rio de Janeiro, RJ, Brasil',
        lastAccess: 'Ontem, às 20:15',
        isCurrent: false,
    },
    {
        id: 3,
        type: 'Tablet',
        name: 'Galaxy Tab S9',
        browser: 'Safari',
        location: 'Belo Horizonte, MG, Brasil',
        lastAccess: '02/07/2024',
        isCurrent: false,
    },
];

const getDeviceIcon = (type) => {
    switch (type) {
        case 'Desktop': return <DesktopWindows />;
        case 'Smartphone': return <Smartphone />;
        case 'Tablet': return <TabletMac />;
        default: return <HelpOutline />;
    }
};

export default function ConnectedDevicesPage() {
    const navigate = useNavigate();
    const [devices, setDevices] = useState(initialDevices);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

    const handleOpenDialog = (device) => {
        setSelectedDevice(device);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setSelectedDevice(null);
        setOpenDialog(false);
    };

    const handleRemoveDevice = () => {
        if (selectedDevice) {
            setDevices(devices.filter(d => d.id !== selectedDevice.id));
            handleCloseDialog();
            Swal.fire({
                icon: 'success',
                title: 'Dispositivo Removido!',
                text: `O dispositivo ${selectedDevice.name} foi desconectado da sua conta.`,
                timer: 2000,
                showConfirmButton: false
            });
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 100 }
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <AppAppBar />
            <Container maxWidth="md" sx={{ pt: { xs: 12, md: 16 }, pb: 4 }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                    <IconButton onClick={() => navigate('/profile')}>
                        <ArrowBack />
                    </IconButton>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Dispositivos Conectados</Typography>
                </Stack>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    Gerencie os dispositivos que têm acesso à sua conta. Se não reconhecer algum, remova-o imediatamente.
                </Typography>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <Paper
                        variant="outlined"
                        sx={{ borderRadius: '16px', overflow: 'hidden' }}
                    >
                        <List disablePadding>
                            {devices.map((device, index) => (
                                <React.Fragment key={device.id}>
                                    <motion.div variants={itemVariants}>
                                        <ListItem
                                            sx={{
                                                p: { xs: 2, sm: 3 },
                                                bgcolor: device.isCurrent ? 'action.selected' : 'background.paper'
                                            }}
                                            secondaryAction={
                                                !device.isCurrent && (
                                                    <Button
                                                        variant="outlined"
                                                        color="error"
                                                        startIcon={<Delete />}
                                                        onClick={() => handleOpenDialog(device)}
                                                    >
                                                        Remover
                                                    </Button>
                                                )
                                            }
                                        >
                                            <ListItemAvatar>
                                                <Avatar sx={{ bgcolor: 'grey.200', color: 'black', width: 50, height: 50 }}>
                                                    {getDeviceIcon(device.type)}
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={`${device.name} (${device.browser})`}
                                                secondary={`Localização: ${device.location} • Último acesso: ${device.lastAccess}`}
                                                primaryTypographyProps={{ fontWeight: 'bold' }}
                                                secondaryTypographyProps={{ color: 'text.secondary' }}
                                            />
                                            {device.isCurrent && (
                                                <Typography variant="caption" color="success.main" sx={{ ml: 2, fontWeight: 'bold' }}>
                                                    Sessão Atual
                                                </Typography>
                                            )}
                                        </ListItem>
                                    </motion.div>
                                    {index < devices.length - 1 && <Divider />}
                                </React.Fragment>
                            ))}
                        </List>
                    </Paper>
                </motion.div>

                {/* --- DIALOG DE CONFIRMAÇÃO --- */}
                <Dialog
                    open={openDialog}
                    onClose={handleCloseDialog}
                >
                    <DialogTitle sx={{ fontWeight: 'bold' }}>Confirmar Remoção</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Você tem certeza que deseja remover o dispositivo
                            <strong> {selectedDevice?.name}</strong>? Esta ação irá desconectá-lo da sua conta.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancelar</Button>
                        <Button onClick={handleRemoveDevice} color="error" variant="contained" autoFocus>
                            Remover
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
}