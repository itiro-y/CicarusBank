import * as React from 'react';
import { motion } from 'framer-motion';
import {
    Box, Container, Typography, Grid, Paper, IconButton,
    List, ListItem, ListItemAvatar, Avatar, ListItemText, Divider, Stack, Button
} from '@mui/material';
import {
    Visibility, VisibilityOff, ArrowUpward, ArrowDownward,
    Pix, ReceiptLong, Smartphone, TrendingUp, Article, Tune, Lock, AddCard, WifiProtectedSetup
} from '@mui/icons-material';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import AppAppBar from '../components/AppAppBar.jsx';

// --- DADOS MOCK (PARA SIMULAÇÃO) ---
const userData = {
    name: "Admin",
    avatar: "https://i.pravatar.cc/150?u=admin",
};
const cardData = {
    holderName: "Admin Cicarus",
    number: "**** **** **** 1234",
    expiry: "12/29",
    cvv: "123",
    limit: 25000.00,
    status: "Ativo"
};
const accountData = {
    balance: 15840.75,
    savings: 52300.00,
    investments: 112750.90,
};
const recentTransactions = [
    { id: 1, type: "Compra Online", store: "Amazon", amount: -150.00, icon: <ArrowDownward color="error" /> },
    { id: 2, type: "Salário", store: "Cicarus Corp", amount: 7500.00, icon: <ArrowUpward color="success" /> },
    { id: 3, type: "Transferência PIX", store: "Maria Silva", amount: -850.00, icon: <ArrowDownward color="error" /> },
];
const balanceHistory = [
    { name: 'Jan', saldo: 12000 }, { name: 'Fev', saldo: 14500 },
    { name: 'Mar', saldo: 13000 }, { name: 'Abr', saldo: 16000 },
    { name: 'Mai', saldo: 15500 }, { name: 'Jun', saldo: 15840 },
];
const offers = [
    { title: "Cashback em Dobro", description: "Use seu cartão Cicarus e ganhe o dobro de cashback este mês.", image: "https://i.postimg.cc/4NZrFh9R/14bcbf74-1ca1-4f50-ac3d-58bf3b90140e.jpg" },
    { title: "Novo Fundo de Investimento", description: "Conheça o nosso novo fundo de tecnologia com potencial de alta rentabilidade.", image: "https://i.postimg.cc/L5nKvcWQ/7dfab5c1-8a75-4a2f-bfee-49f81bf985c4.jpg" },
    { title: "Seguro de Vida com 20% OFF", description: "Proteja quem você ama com condições especiais no primeiro ano.", image: "https://i.postimg.cc/3xz1VPc0/31060b73-d7fc-424f-b4f1-7409a41e1ea8.jpg" },
];

// --- ESTILO PADRÃO PARA OS CARDS (WIDGETS) ---
const widgetStyle = {
    p: 3,
    borderRadius: '16px',
    backgroundColor: '#282d34',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    height: '100%',
};

// --- COMPONENTES DO DASHBOARD ---

const WelcomeHeader = () => (
    <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
    >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Avatar src={userData.avatar} sx={{ width: 56, height: 56, mr: 2, border: '2px solid #e46820' }} />
            <div>
                <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
                    Bom dia, {userData.name}!
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    Bem-vindo de volta ao seu painel CicarusBank.
                </Typography>
            </div>
        </Box>
    </motion.div>
);

const BalanceCard = () => {
    const [showBalance, setShowBalance] = React.useState(true);
    return (
        <Paper elevation={0} sx={widgetStyle}>
            <Typography variant="subtitle1" sx={{ color: 'text.secondary', mb: 1 }}>
                Saldo em Conta Corrente
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="h3" component="p" sx={{ fontWeight: 'bold' }}>
                    {showBalance ? `R$ ${accountData.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'R$ ••••••'}
                </Typography>
                <IconButton onClick={() => setShowBalance(!showBalance)} size="small" sx={{color: 'text.secondary'}}>
                    {showBalance ? <VisibilityOff /> : <Visibility />}
                </IconButton>
            </Box>
        </Paper>
    );
};

const QuickActions = () => {
    const actions = [
        { label: 'Transferir', icon: <TrendingUp sx={{ fontSize: 28 }} /> },
        { label: 'Pagar', icon: <ReceiptLong sx={{ fontSize: 28 }} /> },
        { label: 'Pix', icon: <Pix sx={{ fontSize: 28 }} /> },
        { label: 'Recarga', icon: <Smartphone sx={{ fontSize: 28 }} /> },
    ];

    return (
        <Paper elevation={0} sx={{ ...widgetStyle, p: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2, px: 1 }}>
                Ações Rápidas
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                {actions.map(action => (
                    <Box
                        key={action.label}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 1,
                            cursor: 'pointer',
                            p: 1,
                            borderRadius: '12px',
                            transition: 'background-color 0.2s',
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.05)'
                            }
                        }}
                    >
                        <Box
                            sx={{
                                p: 2,
                                borderRadius: '50%',
                                backgroundColor: 'rgba(17,16,16,0.8)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#e46820'
                            }}
                        >
                            {action.icon}
                        </Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'medium' }}>
                            {action.label}
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Paper>
    );
};

const CreditCardComponent = () => {
    const [isFlipped, setIsFlipped] = React.useState(false);

    return (
        <Paper elevation={0} sx={{ ...widgetStyle, p: 2 }}>
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
                    <Box sx={{
                        position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden',
                        borderRadius: '12px', p: 3, color: 'white',
                        background: 'linear-gradient(45deg, #111010 0%, #282d34 100%)',
                        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                    }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <img src="https://i.postimg.cc/jjZF98Pp/download-1.png" alt="logo" style={{ height: '25px', opacity: 0.8 }} />
                            <Typography variant="caption">{cardData.status}</Typography>
                        </Box>
                        <Box>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Elo_card_association_logo_-_black_text.svg/2560px-Elo_card_association_logo_-_black_text.svg.png" alt="chip" style={{ width: '40px', marginBottom: '8px' }} />
                            <Typography sx={{ fontFamily: 'monospace', fontSize: '1.2rem', letterSpacing: '2px' }}>
                                {cardData.number}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                            <Box>
                                <Typography variant="caption" sx={{ color: 'grey.400' }}>NOME</Typography>
                                <Typography sx={{ fontWeight: 'medium' }}>{cardData.holderName}</Typography>
                            </Box>
                            <Box sx={{ textAlign: 'right' }}>
                                <Typography variant="caption" sx={{ color: 'grey.400' }}>VALIDADE</Typography>
                                <Typography sx={{ fontWeight: 'medium' }}>{cardData.expiry}</Typography>
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{
                        position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)', borderRadius: '12px', color: 'black',
                        background: 'linear-gradient(45deg, #9E9E9E 0%, #E0E0E0 100%)',
                    }}>
                        <Box sx={{ height: '40px', backgroundColor: 'black', mt: 3 }} />
                        <Box sx={{ display: 'flex', alignItems: 'center', p: 2, mt: 2, backgroundColor: 'white' }}>
                            <Typography sx={{ flexGrow: 1, fontStyle: 'italic', color: 'grey.700' }}>Assinatura</Typography>
                            <Typography sx={{ fontFamily: 'monospace', backgroundColor: 'rgba(0,0,0,0.1)', p: '2px 4px' }}>
                                {cardData.cvv}
                            </Typography>
                        </Box>
                        <Typography variant="caption" sx={{ p: 2, color: 'grey.800' }}>
                            Mantenha seus dados seguros.
                        </Typography>
                    </Box>
                </motion.div>
            </Box>
        </Paper>
    );
};

const CardManagementActions = () => {
    const actions = [
        { label: "Ver Fatura", icon: <Article /> },
        { label: "Ajustar Limite", icon: <Tune /> },
        { label: "Bloquear Cartão", icon: <Lock /> },
        { label: "Cartão Virtual", icon: <AddCard /> },
    ];
    return (
        <Paper elevation={0} sx={{...widgetStyle, p:2}}>
            <Stack divider={<Divider flexItem sx={{borderColor: 'rgba(255, 255, 255, 0.05)'}} />}>
                {actions.map(action => (
                    <Button key={action.label} startIcon={action.icon} sx={{ justifyContent: 'flex-start', p: 1.5, color: 'text.secondary', textTransform: 'none' }}>
                        {action.label}
                    </Button>
                ))}
            </Stack>
        </Paper>
    );
};

const RecentTransactions = () => (
    <Paper elevation={0} sx={widgetStyle}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            Últimas Transações
        </Typography>
        <List disablePadding>
            {recentTransactions.map((tx, index) => (
                <React.Fragment key={tx.id}>
                    <ListItem disablePadding sx={{py: 1}}>
                        <ListItemAvatar>
                            <Avatar sx={{ bgcolor: 'rgba(17,16,16,0.8)' }}>
                                {tx.icon}
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primaryTypographyProps={{ fontWeight: 'medium' }}
                            primary={tx.store}
                            secondary={tx.type}
                        />
                        <Typography variant="body1" sx={{ fontWeight: 'bold', color: tx.amount > 0 ? '#4caf50' : 'text.primary' }}>
                            {tx.amount > 0 ? '+' : ''}R$ {Math.abs(tx.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </Typography>
                    </ListItem>
                    {index < recentTransactions.length - 1 && <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.05)' }} />}
                </React.Fragment>
            ))}
        </List>
    </Paper>
);

const BalanceChart = () => (
    <Paper elevation={0} sx={{...widgetStyle, height: 250 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            Evolução do Saldo
        </Typography>
        <ResponsiveContainer width="100%" height="85%">
            <AreaChart data={balanceHistory} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorSaldo" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#e46820" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#e46820" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="rgba(255, 255, 255, 0.5)" fontSize="12px" axisLine={false} tickLine={false} />
                <YAxis stroke="rgba(255, 255, 255, 0.5)" fontSize="12px" tickFormatter={(value) => `R$${value/1000}k`} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#111010', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="saldo" stroke="#e46820" fillOpacity={1} fill="url(#colorSaldo)" strokeWidth={2} />
            </AreaChart>
        </ResponsiveContainer>
    </Paper>
);

const OffersCarousel = () => {
    const [activeIndex, setActiveIndex] = React.useState(0);
    React.useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prevIndex) => (prevIndex + 1) % offers.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Paper elevation={0} sx={{...widgetStyle, p: 0, position: 'relative', height: '200px', overflow: 'hidden' }}>
            {offers.map((offer, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: index === activeIndex ? 1 : 0 }}
                    transition={{ duration: 1, ease: 'easeInOut' }}
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backgroundImage: `linear-gradient(to right, rgba(17,16,16,0.8), rgba(17,16,16,0.2)), url(${offer.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{offer.title}</Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>{offer.description}</Typography>
                    </Box>
                </motion.div>
            ))}
        </Paper>
    );
};


// --- PÁGINA PRINCIPAL DO DASHBOARD ---

export default function DashboardPage() {
    return (
        <Box sx={{ width: '100%', minHeight: '100vh' }}>
            <AppAppBar />
            <Container maxWidth="xl" sx={{ pt: '120px', pb: 4 }}>
                <Grid container spacing={3}>
                    {/* Coluna Esquerda */}
                    <Grid item xs={12} lg={7}>
                        <Stack spacing={3}>
                            <WelcomeHeader />
                            <BalanceCard />
                            <BalanceChart />
                            <OffersCarousel />
                        </Stack>
                    </Grid>

                    {/* Coluna Direita */}
                    <Grid item xs={12} lg={5}>
                        <Stack spacing={3}>
                            <CreditCardComponent />
                            <CardManagementActions />
                            <QuickActions />
                            <RecentTransactions />
                        </Stack>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
