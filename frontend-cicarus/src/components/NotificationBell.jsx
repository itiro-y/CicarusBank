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

    const userId = 1;

    const stompClientRef = useRef(null);

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

    const fetchNotifications = async () => {
        try {
            const response = await fetch(`${API_URL}/notification/websocket/${userId}`);
            const data = await response.json();
            setNotifications(data);
        } catch (error) {
            console.error("Erro ao buscar notificações:", error);
        }
    };

    const connectWebSocket = () => {
        const socket = new WebSocket(`${API_URL.replace('http', 'ws')}/notification/ws?userId=${userId}`);

        let stompClient = new Client({
            webSocketFactory: () => socket,
            connectHeaders: {
                userId: String(userId)
            },
            onConnect: () => {
                stompClient.subscribe(`/user/queue/notifications`, (message) => {
                    console.log("📥 Notificação recebida:", message.body);
                    const newNotification = JSON.parse(message.body);
                    setNotifications((prev) => [newNotification, ...prev]);
                });
            },
            onStompError: (frame) => {
                console.error("Erro no WebSocket:", frame);
            }
        });

        stompClient.debug = function(str) {
            console.log("[STOMP DEBUG]", str);
        };

        stompClient.activate();
        window.stompClient = stompClient;
    };

    useEffect(() => {
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

        client.debug = (str) => console.log("[STOMP DEBUG]", str);

        client.activate();
        stompClientRef.current = client;

        return () => {
            if (stompClientRef.current && stompClientRef.current.active) {
                stompClientRef.current.deactivate();
                stompClientRef.current = null;
            }
        };
    }, [userId]);



    useEffect(() => {
        if (!userId) return;
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

        const prevNotifications = [...notifications];

        marcarComoLidaLocal(notificationId);

        fetch(`${API_URL}/notification/${notificationId}/read`, {
            method: "PUT",
        }).catch((err) => {
            console.error("Erro ao marcar notificação como lida no backend", err);
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
                       sx={{
                          '& .MuiBadge-badge': {
                               minWidth: '16px',
                               height: '16px',
                              padding: '0 4px',
                              fontSize: '0.65rem',
                          },
                    }}
                   >
                    <NotificationsIcon />
                </Badge>
            </IconButton>

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