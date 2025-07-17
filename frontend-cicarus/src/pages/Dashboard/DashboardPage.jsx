import * as React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Box, Container, Typography, Grid, Paper, IconButton,
    List, ListItem, ListItemAvatar, Avatar, ListItemText, Divider, Stack, Button, useTheme, Skeleton
} from '@mui/material';
import {
    Visibility, VisibilityOff, ArrowUpward, ArrowDownward,
    Pix, ReceiptLong, Smartphone, TrendingUp, Article, Tune, Lock, AddCard, WifiProtectedSetup, ErrorOutline
} from '@mui/icons-material';
import { SiVisa, SiMastercard, SiAmericanexpress } from 'react-icons/si';
import { FaCreditCard } from 'react-icons/fa';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import AppAppBar from '../../components/AppAppBar.jsx';
import ChatAssistant from '../../components/ChatAssistant.jsx';
import PromotionalCarousel from '../../components/PromotionalCarousel.jsx';
import {useEffect, useState} from "react";

// --- DADOS MOCK E API URL ---
const userData = { name: "Admin", avatar: "https://i.pravatar.cc/150?u=admin" };
const accountData = { balance: 15840.75 };
const recentTransactions = [
    { id: 1, type: "Compra Online", store: "Amazon", amount: -150.00, icon: <ArrowDownward color="error" /> },
    { id: 2, type: "Salário", store: "Cicarus Corp", amount: 7500.00, icon: <ArrowUpward color="success" /> },
    { id: 3, type: "Transferência PIX", store: "Maria Silva", amount: -850.00, icon: <ArrowDownward color="error" /> },
];
const balanceHistory = [
    { name: 'Jan', saldo: 12000 }, { name: 'Fev', saldo: 14500 }, { name: 'Mar', saldo: 13000 },
    { name: 'Abr', saldo: 16000 }, { name: 'Mai', saldo: 15500 }, { name: 'Jun', saldo: 15840 },
];
const API_URL = import.meta.env.VITE_API_URL || '';



// --- COMPONENTES DO DASHBOARD ---
const WelcomeHeader = () => (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Avatar src={userData.avatar} sx={{ width: 56, height: 56, mr: 2, border: '2px solid', borderColor: 'primary.main' }} />
            <div>
                <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>Bom dia, {userData.name}!</Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>Bem-vindo de volta ao seu painel CicarusBank.</Typography>
            </div>
        </Box>
    </motion.div>
);

const BalanceCard = ({ balance, loading }) => {
    const [showBalance, setShowBalance] = React.useState(true);

    return (
        <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', backgroundColor: 'background.paper', border: '1px solid', borderColor: 'divider', height: '100%' }}>
            <Typography variant="subtitle1" sx={{ color: 'text.secondary', mb: 1 }}>Saldo em Conta Corrente</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {loading ? (
                    <Skeleton variant="text" width={180} height={40} />
                ) : (
                    <Typography variant="h3" component="p" sx={{ fontWeight: 'bold' }}>
                        {showBalance ? `R$ ${balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'R$ ••••••'}
                    </Typography>
                )}
                <IconButton onClick={() => setShowBalance(!showBalance)} size="small" sx={{color: 'text.secondary'}}>
                    {showBalance ? <VisibilityOff /> : <Visibility />}
                </IconButton>
            </Box>
        </Paper>
    );
};

const QuickActions = () => {
    const navigate = useNavigate(); // 2. INICIALIZADO O HOOK
    const actions = [
        { label: 'Transferir', icon: <TrendingUp sx={{ fontSize: 28 }} />, path: '/user-transactions' },
        { label: 'Pagar', icon: <ReceiptLong sx={{ fontSize: 28 }} />, path: '/payment' },
        { label: 'Pix', icon: <Pix sx={{ fontSize: 28 }} />, path: '/pix' }, // 3. ADICIONADO O CAMINHO (path)
        { label: 'Recarga', icon: <Smartphone sx={{ fontSize: 28 }} />, path: '/recharge' },
    ];
    return (
        <Paper elevation={0} sx={{ p: 2, borderRadius: '16px', backgroundColor: 'background.paper', border: '1px solid', borderColor: 'divider', height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2, px: 1 }}>Ações Rápidas</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                {actions.map(action => (
                    <Box
                        key={action.label}
                        onClick={() => action.path && navigate(action.path)}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 1,
                            cursor: 'pointer',
                            p: 1,
                            borderRadius: '12px',
                            transition: 'background-color 0.2s',
                            '&:hover': { backgroundColor: 'action.hover' }
                        }}
                    >
                        <Box sx={{ p: 2, borderRadius: '50%', backgroundColor: 'primary.main', color: 'primary.contrastText', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {action.icon}
                        </Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'medium' }}>{action.label}</Typography>
                    </Box>
                ))}
            </Box>
        </Paper>
    );
};

const getNetworkIcon = (network, theme) => {
    const lowerCaseNetwork = network?.toLowerCase() || '';
    if (lowerCaseNetwork.includes('visa')) return <SiVisa size={40} color="white" />;
    if (lowerCaseNetwork.includes('mastercard')) return <SiMastercard size={40} color="white" />;
    if (lowerCaseNetwork.includes('elo')) {
        return <img src="https://upload.wikimedia.org/wikipedia/commons/d/da/Elo_card_association_logo_-_black_text.svg" alt="Elo logo" style={{ height: '25px', filter: theme.palette.mode === 'dark' ? 'invert(1)' : 'none' }} />;
    }
    if (lowerCaseNetwork.includes('american')) return <SiAmericanexpress size={40} color="white" />;
    return <FaCreditCard size={35} color="white" />;
};

// --- NOVA FUNÇÃO PARA CONVERTER HASH EM CVV ---
const hashToCvv = (hash) => {
    if (!hash) return '123'; // Retorna um padrão caso o hash não exista
    const digits = hash.match(/\d/g); // Encontra todos os caracteres numéricos no hash
    if (!digits) return '123'; // Retorna um padrão se não encontrar dígitos
    // Pega os 3 primeiros dígitos e os une. Se tiver menos de 3, usa os que encontrar.
    return digits.slice(0, 3).join('');
};

const CreditCardComponent = () => {
    const theme = useTheme();
    const [isFlipped, setIsFlipped] = React.useState(false);
    const [cardData, setCardData] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        const fetchPrimaryCard = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const res = await fetch(`${API_URL}/card/list/1`);
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const allCards = await res.json();
                if (allCards && allCards.length > 0) {
                    setCardData(allCards[0]);
                } else {
                    throw new Error("Nenhum cartão encontrado.");
                }
            } catch (err) {
                console.error("Falha ao buscar dados do cartão:", err);
                setError(err.message || "Não foi possível carregar os dados.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchPrimaryCard();
    }, []);

    const cardFrontBg = theme.palette.mode === 'dark' ? 'linear-gradient(45deg, #111010 0%, #282d34 100%)' : 'linear-gradient(45deg, #424242 0%, #616161 100%)';
    const cardBackBg = theme.palette.mode === 'dark' ? 'linear-gradient(45deg, #BDBDBD 0%, #E0E0E0 100%)' : 'linear-gradient(45deg, #E0E0E0 0%, #F5F5F5 100%)';

    if (isLoading) {
        return (
            <Paper elevation={0} sx={{ p: 2, borderRadius: '16px', border: '1px solid', borderColor: 'divider', maxWidth: 400, mx: 'auto' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">Meu Cartão</Typography>
                    <IconButton size="small" disabled><WifiProtectedSetup /></IconButton>
                </Box>
                <Skeleton variant="rectangular" sx={{ borderRadius: '12px', width: '100%', aspectRatio: '1.586 / 1' }} />
            </Paper>
        );
    }

    if (error) {
        return (
            <Paper elevation={0} sx={{ p: 2, borderRadius: '16px', border: '1px solid', borderColor: 'divider', maxWidth: 400, mx: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 280}}>
                <ErrorOutline color="error" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 'bold' }}>Oops!</Typography>
                <Typography variant="body2" color="text.secondary" textAlign="center">Não foi possível carregar o cartão.</Typography>
            </Paper>
        );
    }

    return (
        <Paper elevation={0} sx={{ p: 2, borderRadius: '16px', backgroundColor: 'background.paper', border: '1px solid', borderColor: 'divider', maxWidth: 400, mx: 'auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Meu Cartão</Typography>
                <IconButton onClick={() => setIsFlipped(!isFlipped)} size="small" sx={{color: 'text.secondary'}}>
                    <WifiProtectedSetup />
                </IconButton>
            </Box>
            <Box sx={{ perspective: '1000px' }}>
                <motion.div
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.6 }}
                    style={{ transformStyle: 'preserve-3d', position: 'relative', width: '100%', aspectRatio: '1.586 / 1' }}
                >
                    <Box sx={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', borderRadius: '12px', p: 3, color: 'white', background: cardFrontBg, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <img src="https://i.postimg.cc/jjZF98Pp/download-1.png" alt="logo" style={{ height: '80px', filter: 'brightness(0) invert(1)' }} />
                            <Typography variant="caption">{cardData.status}</Typography>
                        </Box>
                        <Box>
                            <Box sx={{ mb: 1, height: '40px', display: 'flex', alignItems: 'center' }}>
                                {getNetworkIcon(cardData.network, theme)}
                            </Box>
                            <Typography sx={{ fontFamily: 'monospace', fontSize: '1.2rem', letterSpacing: '2px' }}>
                                **** **** **** {cardData.last4Digits}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                            <Box>
                                <Typography variant="caption" sx={{ color: 'grey.300' }}>NOME</Typography>
                                <Typography sx={{ fontWeight: 'medium' }}>{cardData.cardholderName}</Typography>
                            </Box>
                            <Box sx={{ textAlign: 'right' }}>
                                <Typography variant="caption" sx={{ color: 'grey.300' }}>VALIDADE</Typography>
                                <Typography sx={{ fontWeight: 'medium' }}>{new Date(cardData.expiry).toLocaleDateString('pt-BR', { month: '2-digit', year: '2-digit' })}</Typography>
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', borderRadius: '12px', color: 'black', background: cardBackBg, }}>
                        <Box sx={{ height: '40px', backgroundColor: 'black', mt: 3 }} />
                        <Box sx={{ display: 'flex', alignItems: 'center', p: 2, mt: 2, backgroundColor: 'white' }}>
                            <Typography sx={{ flexGrow: 1, fontStyle: 'italic', color: 'grey.700' }}>Assinatura</Typography>
                            <Typography sx={{ fontFamily: 'monospace', backgroundColor: 'rgba(0,0,0,0.1)', p: '2px 4px' }}>
                                {/* CVV GERADO A PARTIR DO HASH */}
                                {hashToCvv(cardData.cvvHash)}
                            </Typography>
                        </Box>
                        <Typography variant="caption" sx={{ p: 2, color: 'grey.800' }}>Mantenha seus dados seguros.</Typography>
                    </Box>
                </motion.div>
            </Box>
        </Paper>
    );
};

const CardManagementActions = () => {
    const navigate = useNavigate();

    const actions = [
        { label: "Ver Fatura", icon: <Article /> },
        { label: "Ajustar Limite", icon: <Tune />, path: '/card-limit' },
        { label: "Bloquear Cartão", icon: <Lock /> },
        { label: "Cartão Virtual", icon: <AddCard />, path: '/virtual-card' },
    ];

    return (
        <Paper elevation={0} sx={{p:2, borderRadius: '16px', backgroundColor: 'background.paper', border: '1px solid', borderColor: 'divider', maxWidth: 400, mx: 'auto'}}>
            <Stack divider={<Divider flexItem />}>
                {actions.map(action => (
                    <Button
                        key={action.label}
                        startIcon={action.icon}
                        onClick={() => {
                            if (action.path) {
                                navigate(action.path);
                            }
                        }}
                        sx={{
                            justifyContent: 'flex-start',
                            p: 1.5,
                            color: 'text.primary',
                            textTransform: 'none'
                        }}
                    >
                        {action.label}
                    </Button>
                ))}
            </Stack>
        </Paper>
    );
};

const RecentTransactions = ({ transactions, loading }) => (
    <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', backgroundColor: 'background.paper', border: '1px solid', borderColor: 'divider', height: '100%' }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>Últimas Transações</Typography>

        {loading ? (
            <Skeleton variant="rectangular" height={150} />
        ) : (
            <List disablePadding>
                {transactions.map((tx, index) => (
                    <React.Fragment key={tx.id}>
                        <ListItem disablePadding sx={{ py: 1 }}>
                            <ListItemAvatar>
                                <Avatar sx={{ bgcolor: 'action.hover' }}>{tx.icon}</Avatar>
                            </ListItemAvatar>
                            <ListItemText primaryTypographyProps={{ fontWeight: 'medium' }} primary={tx.store} secondary={tx.type} />
                            <Typography variant="body1" sx={{ fontWeight: 'bold', color: tx.amount > 0 ? 'success.main' : 'error.main' }}>
                                {tx.amount > 0 ? '+' : '-'} R$ {Math.abs(tx.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </Typography>
                        </ListItem>
                        {index < transactions.length - 1 && <Divider />}
                    </React.Fragment>
                ))}
            </List>
        )}
    </Paper>
);

const BalanceChart = ({ history, loading }) => {
    const theme = useTheme();

    return (
        <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', backgroundColor: 'background.paper', border: '1px solid', borderColor: 'divider', height: 250 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>Evolução do Saldo</Typography>

            {loading ? (
                <Skeleton variant="rectangular" width="100%" height="85%" />
            ) : (
                <ResponsiveContainer width="100%" height="85%">
                    <AreaChart data={history} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorSaldo" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.4} />
                                <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke={theme.palette.text.secondary} fontSize="12px" axisLine={false} tickLine={false} />
                        <YAxis stroke={theme.palette.text.secondary} fontSize="12px" tickFormatter={(value) => `R$${value / 1000}k`} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, borderRadius: '8px' }} />
                        <Area type="monotone" dataKey="saldo" stroke={theme.palette.primary.main} fillOpacity={1} fill="url(#colorSaldo)" strokeWidth={2} />
                    </AreaChart>
                </ResponsiveContainer>
            )}
        </Paper>
    );
};

// --- PÁGINA PRINCIPAL DO DASHBOARD (Layout original mantido) ---
export default function DashboardPage() {
    const [balance, setBalance] = useState(0);
    const [history, setHistory] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loadingBalance, setLoadingBalance] = useState(false);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [loadingTransactions, setLoadingTransactions] = useState(false);

    const accountId = 1; // ou pegue de algum contexto ou autenticação

    const authHeader = () => {
        const token = localStorage.getItem('token') || '';
        return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
    };

    useEffect(() => {
        fetchBalance();
        fetchHistory();
        fetchTransactions();
    }, []);

    async function fetchBalance() {
        setLoadingBalance(true);
        try {
            const res = await fetch(`${API_URL}/account/${accountId}`, { });
            const data = await res.json();
            setBalance(data.balance);
        } catch (err) {
            console.error('Erro ao buscar saldo:', err);
        } finally {
            setLoadingBalance(false);
        }
    }

    async function fetchHistory() {
        setLoadingHistory(true);
        try {
            const res = await fetch(`${API_URL}/account/balance-history/${accountId}`, { headers: authHeader() });
            if (!res.ok) throw new Error(`Erro ${res.status}`);
            const raw = await res.json();
            const formatted = raw.map(item => ({
                name: new Date(item.timestamp).toLocaleDateString('pt-BR', {
                    day: '2-digit', month: '2-digit', year: 'numeric'
                }),
                saldo: item.balance
            }));
            setHistory(formatted);
        } catch (e) {
            console.error('Erro ao buscar histórico:', e);
        } finally {
            setLoadingHistory(false);
        }
    }

    async function fetchTransactions() {
        setLoadingTransactions(true);
        try {
            const res = await fetch(`${API_URL}/transaction/accounts/${accountId}`, { headers: authHeader() });
            setTransactions(await res.json());
        } catch (err) {
            console.error('Erro ao buscar transações:', err);
        } finally {
            setLoadingTransactions(false);
        }
    }

    return (
        <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: 'background.default' }}>
            <AppAppBar />
            <Container maxWidth="lg" sx={{ pt: '120px', pb: 4, px: { xs: 2, sm: 3, md: 4 } }}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <PromotionalCarousel />
                    </Grid>
                    <Grid item xs={12} lg={8}>
                        <Stack spacing={3}>
                            <WelcomeHeader />
                            <Grid container spacing={3}>
                                <BalanceCard balance={balance} loading={loadingBalance}/>
                                <QuickActions />
                            </Grid>
                            <BalanceChart history={history} loading={loadingHistory} />
                            <RecentTransactions transactions={transactions} loading={loadingTransactions} />
                        </Stack>
                    </Grid>
                    <Grid item xs={12} lg={4}>
                        <Stack spacing={3}>
                            <CreditCardComponent />
                            <CardManagementActions />
                            <ChatAssistant />
                        </Stack>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}