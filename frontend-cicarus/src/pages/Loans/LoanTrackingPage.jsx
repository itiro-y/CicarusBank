import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import {
    Box, Container, Typography, Paper, Stack, Button, Collapse, Divider,
    Chip, Tabs, Tab, CircularProgress, Alert, LinearProgress
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import AppAppBar from '../../components/AppAppBar.jsx';
import Swal from 'sweetalert2';

// Ícones
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';
import PaidIcon from '@mui/icons-material/Paid';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import TodayIcon from '@mui/icons-material/Today';

const API_URL = import.meta.env.VITE_API_URL || '';

// --- Componente para uma linha de parcela ---
const InstallmentRow = ({ inst, onPay, loanStatus }) => (
    <Paper
        variant="outlined"
        sx={{
            p: 2,
            mb: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderRadius: '12px',
            opacity: inst.paid ? 0.7 : 1,
            transition: 'all 0.3s'
        }}
    >
        <Stack direction="row" alignItems="center" spacing={2}>
            {inst.paid ? <CheckCircleOutlineIcon color="success" /> : <HourglassEmptyIcon color="warning" />}
            <Box>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    Parcela {inst.installmentNumber} - {Number(inst.amount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Vencimento: {new Date(inst.dueDate + 'T00:00').toLocaleDateString('pt-BR')}
                    {inst.paidAt && ` | Pago em: ${new Date(inst.paidAt).toLocaleDateString('pt-BR')}`}
                </Typography>
            </Box>
        </Stack>
        {!inst.paid && loanStatus === 'APPROVED' && (
            <Button variant="contained" size="small" onClick={onPay}>Pagar</Button>
        )}
    </Paper>
);

// --- Componente para o Card de Empréstimo ---
const LoanCard = ({ loan, onPayInstallment }) => {
    const [expanded, setExpanded] = useState(false);

    const statusConfig = {
        PENDING: { label: 'Em Análise', color: 'warning', icon: <HourglassEmptyIcon /> },
        APPROVED: { label: 'Ativo', color: 'success', icon: <CheckCircleOutlineIcon /> },
        REJECTED: { label: 'Rejeitado', color: 'error', icon: <CancelIcon /> },
        PAID_OFF: { label: 'Quitado', color: 'info', icon: <PaidIcon /> },
    };

    const currentStatus = loan.status === 'APPROVED' && loan.installments.every(i => i.paid)
        ? 'PAID_OFF'
        : loan.status;

    const paidInstallments = loan.installments.filter(i => i.paid).length;
    const progress = (paidInstallments / loan.termMonths) * 100;

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Paper sx={{ p: 2, mb: 3, borderRadius: '16px', overflow: 'hidden' }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="flex-start" spacing={2}>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            Proposta de Empréstimo #{loan.id}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            Solicitado em: {new Date(loan.createdAt).toLocaleDateString('pt-BR')}
                        </Typography>
                        <Chip
                            icon={statusConfig[currentStatus].icon}
                            label={statusConfig[currentStatus].label}
                            color={statusConfig[currentStatus].color}
                            size="small"
                        />
                    </Box>
                    <Stack direction="row" spacing={3} sx={{ mt: { xs: 2, sm: 0 } }}>
                        <Box textAlign="center">
                            <Typography variant="caption" color="text.secondary">Valor Contratado</Typography>
                            <Typography sx={{ fontWeight: 'bold' }}>{Number(loan.principal).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Typography>
                        </Box>
                        <Box textAlign="center">
                            <Typography variant="caption" color="text.secondary">Parcelas</Typography>
                            <Typography sx={{ fontWeight: 'bold' }}>{loan.termMonths}x</Typography>
                        </Box>
                    </Stack>
                </Stack>

                {currentStatus === 'Ativo' && (
                    <Box sx={{ mt: 2 }}>
                        <LinearProgress variant="determinate" value={progress} />
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'right', mt: 0.5 }}>
                            {paidInstallments} de {loan.termMonths} pagas
                        </Typography>
                    </Box>
                )}

                <Divider sx={{ my: 2 }} />

                <Button
                    fullWidth
                    variant="text"
                    onClick={() => setExpanded(!expanded)}
                    endIcon={expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                >
                    {expanded ? 'Ocultar Detalhes' : 'Ver Detalhes e Parcelas'}
                </Button>

                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <Box sx={{ p: 2, pt: 2, bgcolor: 'action.hover', borderRadius: '12px', mt: 1 }}>
                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>Parcelas</Typography>
                        {loan.installments.length > 0 ? (
                            loan.installments.map((inst, idx) => (
                                <InstallmentRow
                                    key={idx}
                                    inst={inst}
                                    loanStatus={loan.status}
                                    onPay={() => onPayInstallment(loan.id, inst.installmentNumber)}
                                />
                            ))
                        ) : (
                            <Typography variant="body2" color="text.secondary">Nenhuma parcela a ser exibida.</Typography>
                        )}
                    </Box>
                </Collapse>
            </Paper>
        </motion.div>
    );
};

// --- Página Principal ---
export default function LoanTrackingPage() {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(0);

    const customerId = 1;

    const fetchLoans = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/loan/client/${customerId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await res.json();
            setLoans(data);
        } catch (err) {
            console.error('Erro ao buscar empréstimos:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLoans();
    }, []);

    const handlePagarParcela = async (loanId, installmentNumber) => {
        try {
            await axios.post(`${API_URL}/loan/${loanId}/installment/${installmentNumber}/pay?userId=${customerId}`);
            Swal.fire('Sucesso!', 'Pagamento da parcela realizado com sucesso.', 'success');
            fetchLoans();
        } catch (error) {
            console.error("Erro ao pagar parcela:", error);
            Swal.fire('Erro!', 'Não foi possível realizar o pagamento.', 'error');
        }
    };

    const filteredLoans = useMemo(() => {
        const isPaidOff = (loan) => loan.installments.every(i => i.paid);
        switch (activeTab) {
            case 0: // Em Análise
                return loans.filter(loan => loan.status === 'PENDING');
            case 1: // Ativos
                return loans.filter(loan => loan.status === 'APPROVED' && !isPaidOff(loan));
            case 2: // Histórico
                return loans.filter(loan => loan.status === 'REJECTED' || (loan.status === 'APPROVED' && isPaidOff(loan)));
            default:
                return [];
        }
    }, [loans, activeTab]);

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <AppAppBar title="Acompanhamento de Empréstimos" />
            <Container maxWidth="md" sx={{ pt: 14, pb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Seus Empréstimos
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Acompanhe o status, visualize as parcelas e gerencie seus pagamentos.
                </Typography>

                <Paper sx={{ position: 'sticky', top: 80, zIndex: 10, mb: 3 }}>
                    <Tabs
                        value={activeTab}
                        onChange={(e, newValue) => setActiveTab(newValue)}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                    >
                        <Tab icon={<HourglassEmptyIcon />} iconPosition="start" label="Em Análise" />
                        <Tab icon={<ReceiptLongIcon />} iconPosition="start" label="Ativos" />
                        <Tab icon={<TodayIcon />} iconPosition="start" label="Histórico" />
                    </Tabs>
                </Paper>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>
                ) : (
                    <AnimatePresence>
                        {filteredLoans.length > 0 ? (
                            filteredLoans.map(loan => (
                                <LoanCard key={loan.id} loan={loan} onPayInstallment={handlePagarParcela} />
                            ))
                        ) : (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                                <Alert severity="info" sx={{ mt: 3 }}>Nenhum empréstimo encontrado nesta categoria.</Alert>
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}
            </Container>
        </Box>
    );
}