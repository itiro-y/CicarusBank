import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Container, Typography, Paper, Stack, TextField, Button, Grid, Slider,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Toolbar, Skeleton,
    Dialog, DialogTitle, DialogContent, DialogActions, InputLabel, Select, MenuItem, FormControl, InputAdornment, List, ListItem, ListItemIcon, ListItemText
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AppAppBar from '../components/AppAppBar';
import Swal from 'sweetalert2';

// Ícones
import SavingsIcon from '@mui/icons-material/Savings';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PercentIcon from '@mui/icons-material/Percent';
import PaidIcon from '@mui/icons-material/Paid';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';


const API_URL = import.meta.env.VITE_API_URL || '';
const INTEREST_RATE = 1.8; // Taxa de juros fixa para a simulação (ex: 1.8% a.m.)

export default function LoanSimulationPage() {
    const [value, setValue] = useState(5000);
    const [installments, setInstallments] = useState(12);
    const [simulation, setSimulation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [selectedDay, setSelectedDay] = useState('');
    const [hasLoans, setHasLoans] = useState(false);
    const navigate = useNavigate();

    const checkLoans = useCallback(async () => {
        try {
            const res = await fetch(`${API_URL}/loan/anyLoan/1`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.ok) {
                const data = await res.json();
                setHasLoans(data === true);
            }
        } catch (error) {
            console.error('Erro ao verificar empréstimos:', error);
        }
    }, []);

    useEffect(() => {
        checkLoans();
    }, [checkLoans]);

    const handleSimulate = useCallback(async () => {
        if (!value || !installments) return;

        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/loan/simulate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
                body: JSON.stringify({
                    principal: parseFloat(value),
                    termMonths: parseInt(installments),
                    interestRate: INTEREST_RATE / 100
                })
            });

            if (!res.ok) throw new Error(await res.text());

            const data = await res.json();
            setSimulation(data);
        } catch (err) {
            console.error('Erro ao simular empréstimo:', err);
            setSimulation(null);
        } finally {
            setLoading(false);
        }
    }, [value, installments]);

    useEffect(() => {
        const timer = setTimeout(() => {
            handleSimulate();
        }, 500); // Adiciona um debounce para não chamar a API a cada mudança
        return () => clearTimeout(timer);
    }, [value, installments, handleSimulate]);


    const handleRequestLoan = async () => {
        const dueDate = getNextMonthDueDate(selectedDay);
        try {
            const res = await fetch(`${API_URL}/loan`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
                body: JSON.stringify({
                    customerId: 1,
                    amount: parseFloat(value),
                    termMonths: parseInt(installments),
                    interestRate: INTEREST_RATE / 100,
                    dueDate: dueDate
                })
            });

            if (!res.ok) throw new Error(await res.text());

            setOpenModal(false);
            Swal.fire({
                icon: 'success',
                title: 'Proposta Enviada!',
                text: 'Sua solicitação de empréstimo foi enviada para análise. Você receberá a resposta em breve.',
                confirmButtonColor: '#3085d6'
            });
            // Reset state
            setValue(5000);
            setInstallments(12);
            setSimulation(null);
            setSelectedDay('');
            checkLoans();

        } catch (err) {
            console.error('Erro ao solicitar empréstimo:', err);
            Swal.fire({ icon: 'error', title: 'Erro!', text: 'Não foi possível solicitar o empréstimo.' });
        }
    };

    const getNextMonthDueDate = (day) => {
        const today = new Date();
        const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, day);
        return nextMonth.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <AppAppBar title="Simulação de Empréstimo" />
            <Toolbar />
            <Container maxWidth="lg" sx={{ py: 4, pt: { xs: 4, md: 10 } }}>
                <Grid container spacing={5} alignItems="center">
                    {/* Coluna da Imagem */}
                    <Grid item xs={12} md={5} component={motion.div} initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                            <img src="https://i.postimg.cc/3NnDJSsg/Whisk-2f1c6c8203.png" alt="Ilustração de Finanças" style={{ width: '80%', height: 'auto' }} />
                        </Box>
                        <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2, display: { xs: 'none', md: 'block' } }}>
                            Realize seus sonhos.
                        </Typography>
                        <Typography variant="h6" color="text.secondary" sx={{ display: { xs: 'none', md: 'block' } }}>
                            Simule e contrate seu empréstimo de forma rápida, transparente e 100% digital.
                        </Typography>
                        {hasLoans && (
                            <Button
                                variant="contained"
                                startIcon={<TrackChangesIcon />}
                                onClick={() => navigate('/loan-tracking')}
                                sx={{ mt: 3, py: 1.5, textTransform: 'none', fontSize: '1rem' }}
                            >
                                Acompanhar meus empréstimos
                            </Button>
                        )}
                    </Grid>

                    {/* Coluna do Formulário e Simulação */}
                    <Grid item xs={12} md={7}>
                        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
                            <Paper sx={{ p: {xs: 2, sm: 4}, borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.05)' }}>
                                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
                                    Simulador de Empréstimo
                                </Typography>
                                <Stack spacing={3}>
                                    <TextField
                                        label="Quanto você precisa?"
                                        type="number"
                                        value={value}
                                        onChange={e => setValue(e.target.value)}
                                        fullWidth
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                                        }}
                                    />
                                    <Box>
                                        <Typography gutterBottom>Em quantas parcelas?</Typography>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Slider
                                                value={installments}
                                                onChange={(e, newValue) => setInstallments(newValue)}
                                                aria-labelledby="input-slider"
                                                valueLabelDisplay="auto"
                                                min={1}
                                                max={48}
                                            />
                                            <Paper variant='outlined' sx={{ p: '2px 8px', minWidth: '40px', textAlign: 'center' }}>
                                                <Typography variant='body1' sx={{fontWeight: 'bold'}}>{installments}</Typography>
                                            </Paper>
                                        </Stack>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                                        Taxa de juros: <strong>{INTEREST_RATE}% a.m.</strong>
                                    </Typography>
                                </Stack>
                            </Paper>
                        </motion.div>
                    </Grid>
                </Grid>

                {/* Resultados da Simulação */}
                <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}>
                    {(loading || simulation) && (
                        <Box mt={5}>
                            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
                                Confira sua Simulação
                            </Typography>
                            <Grid container spacing={3} alignItems="flex-start">
                                <Grid item xs={12} md={8}>
                                    <TableContainer component={Paper} sx={{ borderRadius: '16px' }}>
                                        <Table stickyHeader>
                                            <TableHead>
                                                <TableRow>
                                                    {['Parcela', 'Valor', 'Juros', 'Amortização', 'Saldo Devedor'].map(headCell => (
                                                        <TableCell key={headCell} sx={{ fontWeight: 'bold', bgcolor: 'background.paper' }}>{headCell}</TableCell>
                                                    ))}
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {loading ? (
                                                    Array.from(new Array(5)).map((_, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell><Skeleton /></TableCell>
                                                            <TableCell><Skeleton /></TableCell>
                                                            <TableCell><Skeleton /></TableCell>
                                                            <TableCell><Skeleton /></TableCell>
                                                            <TableCell><Skeleton /></TableCell>
                                                        </TableRow>
                                                    ))
                                                ) : (
                                                    simulation?.installments.map((item) => (
                                                        <TableRow key={item.installmentNumber} hover>
                                                            <TableCell>{item.installmentNumber}</TableCell>
                                                            <TableCell>{Number(item.amount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                                                            <TableCell>{Number(item.interest).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                                                            <TableCell>{Number(item.amortization).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                                                            <TableCell>{Number(item.remainingPrincipal).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                                                        </TableRow>
                                                    ))
                                                )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Paper sx={{ p: 2, borderRadius: '16px' }}>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                                            Resumo da Operação
                                        </Typography>
                                        {loading ? (
                                            <Stack spacing={2}><Skeleton variant="rounded" height={40} /><Skeleton variant="rounded" height={40} /><Skeleton variant="rounded" height={40} /></Stack>
                                        ) : (
                                            <List>
                                                <ListItem>
                                                    <ListItemIcon><SavingsIcon color="primary"/></ListItemIcon>
                                                    <ListItemText primary="Valor Solicitado" secondary={Number(simulation?.principal).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemIcon><PercentIcon color="error"/></ListItemIcon>
                                                    <ListItemText primary="Total de Juros" secondary={Number(simulation?.totalInterest).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemIcon><PaidIcon color="success"/></ListItemIcon>
                                                    <ListItemText primary="Total a Pagar" secondary={Number(simulation?.totalAmount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} />
                                                </ListItem>
                                            </List>
                                        )}
                                    </Paper>
                                </Grid>
                            </Grid>
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                <Button
                                    variant="contained"
                                    color="success"
                                    size="large"
                                    startIcon={<CheckCircleIcon />}
                                    disabled={loading || !simulation}
                                    onClick={() => setOpenModal(true)}
                                    sx={{ textTransform: 'none', fontSize: '1.1rem', py: 1.5, px: 4 }}
                                >
                                    Quero Contratar
                                </Button>
                            </Box>
                        </Box>
                    )}
                </motion.div>
            </Container>

            {/* Modal de Confirmação */}
            <Dialog open={openModal} onClose={() => setOpenModal(false)}>
                <DialogTitle sx={{ fontWeight: 'bold' }}>Escolher Data de Vencimento</DialogTitle>
                <DialogContent>
                    <Typography gutterBottom>
                        Escolha o melhor dia para o vencimento da sua primeira parcela. As demais seguirão a mesma data nos meses seguintes.
                    </Typography>
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel id="due-date-select-label">Dia do Vencimento</InputLabel>
                        <Select
                            labelId="due-date-select-label"
                            value={selectedDay}
                            label="Dia do Vencimento"
                            onChange={(e) => setSelectedDay(e.target.value)}
                            startAdornment={<InputAdornment position='start'><EventAvailableIcon/></InputAdornment>}
                        >
                            {[5, 10, 15, 20, 25].map(day => (
                                <MenuItem key={day} value={day}>{`Todo dia ${day}`}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions sx={{ p: '16px 24px' }}>
                    <Button onClick={() => setOpenModal(false)}>Cancelar</Button>
                    <Button
                        variant="contained"
                        onClick={handleRequestLoan}
                        disabled={!selectedDay}
                    >
                        Confirmar Solicitação
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}