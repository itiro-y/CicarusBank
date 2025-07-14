import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Stack,
    TextField,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Toolbar,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    InputLabel,
    Select,
    MenuItem,
    FormControl
} from '@mui/material';
import AppAppBar from '../components/AppAppBar';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';


const API_URL = import.meta.env.VITE_API_URL || '';

export default function LoanSimulationPage() {
    const [value, setValue] = useState('');
    const [installments, setInstallments] = useState('');
    const [interestRate, setInterestRate] = useState('');
    const [simulation, setSimulation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [selectedDay, setSelectedDay] = useState('');
    const [hasLoans, setHasLoans] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        checkLoans();
    }, []);

    const checkLoans = async () => {
        try {
            const res = await fetch(`${API_URL}/loan/anyLoan/1`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (res.ok) {
                const data = await res.json(); // retorna true ou false
                setHasLoans(data === true);
            } else {
                setHasLoans(false);
            }
        } catch (error) {
            console.error('Erro ao verificar empréstimos:', error);
            setHasLoans(false);
        }
    };

    const handleSimulate = async () => {
        setLoading(true);
        setSimulation(null);
        try {
            const res = await fetch(`${API_URL}/loan/simulate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    principal: parseFloat(value),
                    termMonths: parseInt(installments),
                    interestRate: parseFloat(interestRate)/100
                })
            });

            if (!res.ok) throw new Error(await res.text());

            const data = await res.json();
            setSimulation(data);
        } catch (err) {
            console.error('Erro ao simular empréstimo:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRequestLoan = async () => {
        const dueDate = getNextMonthDueDate(selectedDay);

        try {
            const res = await fetch(`${API_URL}/loan`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    customerId: 1,
                    amount: parseFloat(value),
                    termMonths: parseInt(installments),
                    interestRate: parseFloat(interestRate)/100,
                    dueDate: dueDate
                })
            });

            if (!res.ok) {
                const error = await res.text();
                throw new Error(error);
            }

            setOpenModal(false);
            setTimeout(() => {
                Swal.fire({
                    icon: 'success',
                    title: 'Simulação enviada!',
                    text: 'Você receberá um e-mail com a resposta em até 3 dias úteis.'
                });
                setValue('');
                setInstallments('');
                setInterestRate('');
                setSimulation(null);
                setSelectedDay('');

                checkLoans();
            }, 300);

        } catch (err) {
            console.error('Erro ao solicitar empréstimo:', err);
            Swal.fire({
                icon: 'error',
                title: 'Erro!',
                text: 'Não foi possível solicitar o empréstimo.'
            });
        }
    };

    const getNextMonthDueDate = (day) => {
        const today = new Date();
        const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        const year = nextMonth.getFullYear();
        const month = String(nextMonth.getMonth() + 1).padStart(2, '0');
        const date = String(day).padStart(2, '0');
        return `${year}-${month}-${date}`;
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <AppAppBar title="Simulação de Empréstimo" />
            <Toolbar />
            <Container maxWidth="md" sx={{ py: 4, pt: 12}}>
                {hasLoans && (
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => navigate('/loan-tracking')}
                        sx={{ mb: 2 }}
                    >
                        Acompanhar seus empréstimos
                    </Button>
                )}
                <Typography variant="h4" gutterBottom>
                    Simular Empréstimo
                </Typography>

                <Paper sx={{ p: 3, mb: 3 }}>
                    <Stack spacing={2}>
                        <TextField
                            label="Valor do Empréstimo"
                            type="number"
                            value={value}
                            onChange={e => setValue(e.target.value)}
                            fullWidth
                        />
                        <TextField
                            label="Quantidade de Parcelas"
                            type="number"
                            value={installments}
                            onChange={e => setInstallments(e.target.value)}
                            fullWidth
                        />
                        <TextField
                            label="Taxa de Juros (%)"
                            type="number"
                            value={interestRate}
                            onChange={e => setInterestRate(e.target.value)}
                            fullWidth
                        />
                        <Button variant="contained" onClick={handleSimulate}>
                            Simular
                        </Button>
                    </Stack>
                </Paper>

                {loading && <CircularProgress />}

                {simulation && simulation.installments?.length > 0 && (
                    <>
                        <Typography variant="h6" gutterBottom>
                            Simulação de Parcelas
                        </Typography>

                        <TableContainer component={Paper} sx={{ mb: 2 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Parcela</TableCell>
                                        <TableCell>Valor</TableCell>
                                        <TableCell>Juros</TableCell>
                                        <TableCell>Amortização</TableCell>
                                        <TableCell>Saldo Devedor</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {simulation.installments.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{item.installmentNumber}</TableCell>
                                            <TableCell>{Number(item.amount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                                            <TableCell>{Number(item.interest).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                                            <TableCell>{Number(item.amortization).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                                            <TableCell>{Number(item.remainingPrincipal).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* Resumo da operação */}
                        <Paper sx={{ p: 3, mb: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Resumo da Operação
                            </Typography>
                            <Stack spacing={1}>
                                <Typography>
                                    Valor do Empréstimo: <strong>{Number(simulation.principal).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
                                </Typography>
                                <Typography>
                                    Total de Juros: <strong>{Number(simulation.totalInterest).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
                                </Typography>
                                <Typography>
                                    Total a Pagar: <strong>{Number(simulation.totalAmount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
                                </Typography>
                            </Stack>
                        </Paper>

                        <Button
                            variant="contained"
                            color="success"
                            onClick={() => setOpenModal(true)}
                        >
                            Solicitar Aprovação de Empréstimo
                        </Button>
                    </>
                )}

                <Dialog open={openModal} onClose={() => setOpenModal(false)}>
                    <DialogTitle>Escolher Data de Vencimento</DialogTitle>
                    <DialogContent>
                        <Typography gutterBottom>
                            Escolha a data para a primeira parcela. As demais seguirão o mesmo dia nos meses seguintes.
                        </Typography>
                        <FormControl fullWidth sx={{ mt: 2 }}>
                            <InputLabel id="due-date-select-label">Dia</InputLabel>
                            <Select
                                labelId="due-date-select-label"
                                value={selectedDay}
                                label="Dia"
                                onChange={(e) => setSelectedDay(e.target.value)}
                            >
                                {[5, 10, 15, 20, 25, 30].map(day => (
                                    <MenuItem key={day} value={day}>{day}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
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
            </Container>
        </Box>
    );
}