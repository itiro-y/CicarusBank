import React, { useState } from 'react';
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
    CircularProgress
} from '@mui/material';
import AppAppBar from '../components/AppAppBar';


const API_URL = import.meta.env.VITE_API_URL || '';

export default function LoanSimulationPage() {
    const [value, setValue] = useState('');
    const [installments, setInstallments] = useState('');
    const [interestRate, setInterestRate] = useState('');
    const [simulation, setSimulation] = useState(null);
    const [loading, setLoading] = useState(false);

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

    const handleRequestLoan = () => {
        // implementar requisição POST /loan/request se desejar
        alert('Requisição de empréstimo enviada!');
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <AppAppBar title="Simulação de Empréstimo" />
            <Toolbar />
            <Container maxWidth="md" sx={{ py: 4, pt: 12}}>
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

                        <Button variant="contained" color="success" onClick={handleRequestLoan}>
                            Solicitar Aprovação de Empréstimo
                        </Button>
                    </>
                )}
            </Container>
        </Box>
    );
}