import './setupGlobals';
import React, {useState, useEffect, useRef} from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import {
    Box, IconButton, Badge, Menu, List, ListItem, ListItemIcon, ListItemText,
    Avatar, Typography, Divider, Button, Dialog, DialogTitle, DialogContent,
    Card, CardMedia, keyframes
} from '@mui/material';
import {
    Notifications as NotificationsIcon, Close as CloseIcon, ArrowUpward as ArrowUpwardIcon,
    CheckCircle as CheckCircleIcon, Campaign as CampaignIcon, Security as SecurityIcon
} from '@mui/icons-material';
import { ListItemButton } from '@mui/material';
import { format } from "date-fns";

// --- Mock Data ---
// const mockNotifications = [
//     {
//         id: 1,
//         type: 'transfer_received',
//         title: 'Transferência Recebida',
//         shortDescription: 'Você recebeu R$ 500,00 de João Silva.',
//         fullDescription: 'A transferência de R$ 500,00 enviada por João Silva (CPF ***.123.456-**) foi creditada em sua conta corrente com sucesso.',
//         image: 'https://i.postimg.cc/8PpsdBFy/5cc7a884-24a1-4235-857e-1206f3e1f08e.jpg',
//         timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
//         read: false,
//     },
//     {
//         id: 2,
//         type: 'loan_approved',
//         title: 'Empréstimo Aprovado!',
//         shortDescription: 'Sua solicitação de empréstimo foi aprovada.',
//         fullDescription: 'Parabéns! Sua solicitação de empréstimo no valor de R$ 5.000,00 foi aprovada. O valor estará disponível em sua conta em até 24 horas. Acesse a área de empréstimos para mais detalhes.',
//         image: 'https://i.postimg.cc/4NZrFh9R/14bcbf74-1ca1-4f50-ac3d-58bf3b90140e.jpg',
//         timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
//         read: false,
//     },
//     {
//         id: 3,
//         type: 'promotion',
//         title: 'Invista e Ganhe!',
//         shortDescription: 'Novos fundos de investimento disponíveis.',
//         fullDescription: 'Não perca a chance de fazer seu dinheiro render! Conheça nossos novos fundos de investimento com rentabilidade de até 15% a.a. Fale com seu gerente ou invista diretamente pelo app.',
//         image: 'https://i.postimg.cc/L5nKvcWQ/7dfab5c1-8a75-4a2f-bfee-49f81bf985c4.jpg',
//         timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
//         read: true,
//     },
//     {
//         id: 4,
//         type: 'security_alert',
//         title: 'Alerta de Segurança',
//         shortDescription: 'Um novo dispositivo foi conectado à sua conta.',
//         fullDescription: 'Um novo dispositivo (Chrome em Windows 10) foi autorizado a acessar sua conta. Se não foi você, por favor, altere sua senha imediatamente e entre em contato conosco.',
//         image: 'https://i.postimg.cc/3xz1VPc0/31060b73-d7fc-424f-b4f1-7409a41e1ea8.jpg',
//         timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
//         read: true,
//     },
// ];

// --- Animação ---
const ring = keyframes`
  0% { transform: rotate(0); }
  10% { transform: rotate(30deg); }
  20% { transform: rotate(-28deg); }
  30% { transform: rotate(34deg); }
  40% { transform: rotate(-32deg); }
  50% { transform: rotate(30deg); }
  60% { transform: rotate(-28deg); }
  70% { transform: rotate(34deg); }
  80% { transform: rotate(-32deg); }
  90% { transform: rotate(30deg); }
  100% { transform: rotate(0); }
`;

// --- Ícones ---
const getNotificationIcon = (type) => {
    switch (type) {
        case 'transfer_received':
            return <ArrowUpwardIcon sx={{ color: 'success.main' }} />;
        case 'loan_approved':
            return <CheckCircleIcon sx={{ color: 'primary.main' }} />;
        case 'promotion':
            return <CampaignIcon sx={{ color: 'secondary.main' }} />;
        case 'security_alert':
            return <SecurityIcon sx={{ color: 'error.main' }} />;
        default:
            return <NotificationsIcon />;
    }
};

export default function NotificationBell() {
    const API_URL = import.meta.env.VITE_API_URL || '';

    //Posteriormente capturar o userId dinamicamente
    const userId = localStorage.getItem('accountId');

    const stompClientRef = useRef(null);

    // const [notifications, setNotifications] = useState(mockNotifications);
    const [notifications, setNotifications] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const unreadCount = notifications.filter(n => !n.read).length;
    const open = Boolean(anchorEl);

    const handleOpenMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    // Mark all as read when menu is opened
    // useEffect(() => {
    //     if (open) {
    //         const timeout = setTimeout(() => {
    //             setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    //         }, 2000); // delay to show the unread status for a moment
    //         return () => clearTimeout(timeout);
    //     }
    // }, [open])


    // Carrega notificações do banco ao montar o componente
    const authHeader = () => {
        const token = localStorage.getItem('token') || '';
        return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
    };

    const fetchNotifications = async () => {
        try {
            const response = await fetch(`${API_URL}/notification/websocket/${userId}`, {
                headers: authHeader()
            });
            const data = await response.json();
            setNotifications(data);
        } catch (error) {
            console.error("Erro ao buscar notificações:", error);
        }
    };

    useEffect(() => {
        // Evita conexões duplicadas
        if (stompClientRef.current) {
            return;
        }

        const socket = new WebSocket(`${API_URL.replace('http', 'ws')}/notification/ws?userId=${userId}`);

        const client = new Client({
            webSocketFactory: () => socket,
            connectHeaders: {
                userId: String(userId)
            },
            onConnect: () => {
                client.subscribe(`/user/queue/notifications`, (message) => {
                    console.log("📥 Notificação recebida:", message.body);
                    const newNotification = JSON.parse(message.body);
                    setNotifications((prev) => [newNotification, ...prev]);
                });
            },
            onStompError: (frame) => {
                console.error("Erro no WebSocket:", frame);
            },
        });

//         client.debug = (str) => console.log("[STOMP DEBUG]", str);

        client.activate();
        stompClientRef.current = client;

        // Cleanup na desmontagem
        return () => {
            if (stompClientRef.current && stompClientRef.current.active) {
                stompClientRef.current.deactivate();
                stompClientRef.current = null;
            }
        };
    }, [userId]);



    useEffect(() => {
        if (!userId) return;
        //Popula o componente com as informações já presentes no banco de dados
        fetchNotifications();

        if (open) {
            const timeout = setTimeout(() => {
                setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            }, 2000);
            return () => clearTimeout(timeout);
        }
    }, [open]);


    const marcarComoLidaLocal = (notificationId) => {
        setNotifications((prevNotifications) =>
            prevNotifications.map((n) =>
                n.id === notificationId ? { ...n, read: true } : n
            )
        );
    };

    const handleMouseEnter = (notificationId) => {

        // Salva o estado anterior
        const prevNotifications = [...notifications];

        // Atualiza localmente
        marcarComoLidaLocal(notificationId);

        // Envia para o backend
        fetch(`${API_URL}/notification/${notificationId}/read`, {
            method: "PUT",
            headers: authHeader(),
        }).catch((err) => {
            console.error("Erro ao marcar notificação como lida no backend", err);
            // Desfazer alterações locais se não der para atualizar no banco
            setNotifications(prevNotifications);
        });
    };

    const handleNotificationClick = (notification) => {
        setSelectedNotification(notification);
        setDialogOpen(true);
        handleCloseMenu();
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        // A small delay to let the dialog close animation finish
        setTimeout(() => setSelectedNotification(null), 300);
    };

    return (
        <>
            <IconButton
                size="small"
                color="inherit"
                onClick={handleOpenMenu}
                sx={{
                    '& .MuiSvgIcon-root': {
                        animation: unreadCount > 0 ? `${ring} 2s ease-in-out` : 'none',
                    },
                }}
            >
                <Badge
                     badgeContent={unreadCount}
                      color="error"
                       sx={{ // --- ADICIONADO ---
                          '& .MuiBadge-badge': {
                              // Estilos para o círculo vermelho
                               minWidth: '16px',
                               height: '16px',
                              padding: '0 4px',
                              fontSize: '0.65rem', // Diminui a fonte do número
                          },
                    }}
                   >
                    <NotificationsIcon />
                </Badge>
            </IconButton>

            {/* --- Menu de Notificações --- */}
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleCloseMenu}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        minWidth: 340,
                        maxWidth: 360,
                        borderRadius: '12px',
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <Box sx={{ p: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">Notificações</Typography>
                </Box>
                <Divider />

                <List sx={{ p: 0, maxHeight: 400, overflowY: 'auto' }}>
                    {notifications.length > 0 ? notifications.map((notification) => (
                        <ListItem key={notification.id} disablePadding>
                            <ListItemButton
                                onMouseEnter={() => handleMouseEnter(notification.id)}
                                onClick={() => handleNotificationClick(notification)}
                                sx={{
                                    backgroundColor: !notification.read ? 'action.hover' : 'transparent',
                                    '&:hover': {
                                        backgroundColor: 'action.selected'
                                    }
                                }}
                            >
                                <ListItemIcon>
                                    <Avatar sx={{ bgcolor: 'background.paper' }}>
                                        {getNotificationIcon(notification.type)}
                                    </Avatar>
                                </ListItemIcon>
                                <ListItem alignItems="flex-start">
                                    <ListItemText
                                        primary={notification.title}
                                        secondary={
                                            <>
                                                {notification.message}
                                                <br />
                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                    sx={{ mt: 0.5 }}
                                                >
                                                    {format(new Date(notification.timestamp), "dd/MM/yyyy HH:mm:ss")}
                                                </Typography>
                                            </>
                                        }
                                        primaryTypographyProps={{ fontWeight: 'bold' }}
                                        secondaryTypographyProps={{ component: 'div' }}
                                    />

                                    {!notification.read && (
                                        <Box
                                            sx={{
                                                width: 8,
                                                height: 8,
                                                borderRadius: '50%',
                                                bgcolor: 'primary.main',
                                                ml: 1,
                                                flexShrink: 0
                                            }}
                                        />
                                    )}
                                </ListItem>

                            </ListItemButton>
                        </ListItem>
                    )) : (
                        <ListItem>
                            <ListItemText
                                primary="Nenhuma notificação nova."
                                sx={{ textAlign: 'center', color: 'text.secondary' }}
                            />
                        </ListItem>
                    )}
                </List>
                <Divider />
                <Box sx={{p: 1, display: 'flex', justifyContent: 'center'}}>
                    <Button size="small" onClick={handleCloseMenu}>Ver todas</Button>
                </Box>
            </Menu>

            {/* --- Dialog de Notificação Completa --- */}
            {selectedNotification && (
                <Dialog
                    open={dialogOpen}
                    onClose={handleDialogClose}
                    maxWidth="sm"
                    fullWidth
                    PaperProps={{ sx: { borderRadius: '16px' } }}
                >
                    <DialogTitle sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>{selectedNotification.title}</Typography>
                        <IconButton edge="end" onClick={handleDialogClose}>
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent dividers sx={{ p: 0 }}>
                        {selectedNotification.image && (
                            <CardMedia
                                component="img"
                                height="200"
                                image={selectedNotification.image}
                                alt={selectedNotification.title}
                            />
                        )}
                        <Box p={3}>
                            <Typography gutterBottom>
                                {selectedNotification.fullDescription}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {new Date(selectedNotification.timestamp).toLocaleString('pt-BR')}
                            </Typography>
                        </Box>
                    </DialogContent>
                    <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button onClick={handleDialogClose} variant="contained">
                            Fechar
                        </Button>
                    </Box>
                </Dialog>
            )}
        </>
    );
}