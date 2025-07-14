import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Box, Container, Typography, Paper, Stack, Button, Collapse, Divider
} from '@mui/material';
import AppAppBar from '../components/AppAppBar';

const API_URL = import.meta.env.VITE_API_URL || '';

export default function LoanTrackingPage() {
    const [loans, setLoans] = useState([]);
    const [expandedLoanId, setExpandedLoanId] = useState(null);

    const customerId = 1; // Id do cliente

    useEffect(() => {
        fetchLoans();
    }, []);

    const fetchLoans = () => {
        fetch(`${API_URL}/loan/client/${customerId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => res.json())
            .then(data => setLoans(data))
            .catch(err => console.error('Erro ao buscar empréstimos:', err));
    };

    const handlePagarParcela = async (loanId, installmentNumber) => {
        try {
            await axios.post(
                `${API_URL}/loan/${loanId}/installment/${installmentNumber}/pay?userId=${customerId}`,
                null, // corpo da requisição é nulo
            );
            await fetchLoans(); // atualiza a tela após pagamento
        } catch (error) {
            console.error("Erro ao pagar parcela:", error);
            alert("Erro ao realizar o pagamento da parcela.");
        }
    };

    const groupedLoans = {
        PENDING: [],
        APPROVED: [],
        REJECTED: [],
    };

    loans.forEach(loan => {
        groupedLoans[loan.status]?.push(loan);
    });

    const toggleInstallments = (loanId) => {
        setExpandedLoanId(prev => (prev === loanId ? null : loanId));
    };

    const renderLoan = (loan) => (
        <Paper key={loan.id} sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1"><strong>ID:</strong> {loan.id}</Typography>
            <Typography><strong>Valor:</strong> R$ {Number(loan.principal).toLocaleString('pt-BR')}</Typography>
            <Typography><strong>Parcelas:</strong> {loan.termMonths}</Typography>
            <Typography><strong>Juros:</strong> {(loan.interestRate * 100).toFixed(2)}%</Typography>
            <Typography><strong>Status:</strong> {loan.status}</Typography>
            <Typography><strong>Criado em:</strong> {new Date(loan.createdAt).toLocaleString('pt-BR')}</Typography>

            <Button
                sx={{ mt: 1 }}
                variant="outlined"
                onClick={() => toggleInstallments(loan.id)}
            >
                {expandedLoanId === loan.id ? 'Ocultar Parcelas' : 'Visualizar Parcelas'}
            </Button>

            <Collapse in={expandedLoanId === loan.id} timeout="auto" unmountOnExit>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" gutterBottom>Parcelas</Typography>
                {loan.installments?.map((inst, idx) => (
                    <Paper
                        key={idx}
                        sx={{
                            p: 1,
                            mb: 1,
                            backgroundColor: inst.paid ? '#2e7d32' : '#1e1e1e', // verde se pago, escuro se não
                            color: '#fff',
                            borderRadius: 2,
                            boxShadow: 1,
                        }}
                    >
                        <Typography><strong>Parcela:</strong> {inst.installmentNumber}</Typography>
                        <Typography><strong>Valor:</strong> R$ {Number(inst.amount).toLocaleString('pt-BR')}</Typography>
                        <Typography><strong>Juros:</strong> R$ {Number(inst.interest).toLocaleString('pt-BR')}</Typography>
                        <Typography><strong>Amortização:</strong> R$ {Number(inst.amortization).toLocaleString('pt-BR')}</Typography>
                        <Typography><strong>Vencimento:</strong> {inst.dueDate ? new Date(inst.dueDate).toLocaleDateString('pt-BR') : 'Não definido'}</Typography>
                        <Typography><strong>Pago:</strong> {inst.paid ? 'Sim' : 'Não'}</Typography>
                        {inst.paidAt && (
                            <Typography><strong>Pago em:</strong> {new Date(inst.paidAt).toLocaleDateString('pt-BR')}</Typography>
                        )}

                        {!inst.paid && loan.status === 'APPROVED' && (
                            <Button
                                variant="contained"
                                color="secondary"
                                sx={{ mt: 1 }}
                                onClick={() => handlePagarParcela(loan.id, inst.installmentNumber)}
                            >
                                Realizar Pagamento
                            </Button>
                        )}
                    </Paper>
                ))}
            </Collapse>
        </Paper>
    );

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <AppAppBar title="Acompanhamento de Empréstimos" />
            <Container maxWidth="md" sx={{ py: 4, pt: 16 }}>
                <Typography variant="h4" gutterBottom>
                    Seus Empréstimos
                </Typography>

                {['PENDING', 'APPROVED', 'REJECTED'].map(status => (
                    groupedLoans[status].length > 0 && (
                        <Box key={status} sx={{ mb: 4 }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                {status === 'PENDING' && 'Em Análise'}
                                {status === 'APPROVED' && 'Aprovados'}
                                {status === 'REJECTED' && 'Rejeitados'}
                            </Typography>
                            {groupedLoans[status].map(renderLoan)}
                        </Box>
                    )
                ))}
            </Container>
        </Box>
    );
}