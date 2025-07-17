import React, { useState, useEffect } from 'react';
import {
    Box, Container, Typography, Paper, Stack, Button,
    TableContainer, Table, TableHead, TableBody, TableRow, TableCell,
    Toolbar, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, CircularProgress, Slide, Chip
} from '@mui/material';

import { NumericFormat } from 'react-number-format';

import {
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';

// --- ÍCONES ---
// Todos os ícones necessários para a página, incluindo os de status
import {
    ArrowDownward, ArrowUpward, SwapHoriz, NorthEast, SouthWest, ReceiptLong,
    CheckCircleOutline, HourglassTop, ErrorOutline
} from '@mui/icons-material';

import AppAppBar from '../../components/AppAppBar.jsx';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || '';

// --- Componentes de UI ---

function BalanceCard({ balance, loading }) {
    return (
        <Paper sx={{ flex: 1, p: 3, minHeight: 120, textAlign: "center"}}>
            <Typography variant="subtitle1" color="text.secondary" sx={{mt: 8}}>
                Saldo Atual
            </Typography>
            {loading ? (
                <CircularProgress size={24} />
            ) : (
                <Typography variant="h4" color="primary">
                    {balance != null
                        ? balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                        : 'Carregando...'}
                </Typography>
            )}
        </Paper>
    );
}

function BalanceChart({ data, loading }) {
    return (
        <Paper sx={{ flex: 2, p: 3, minHeight: 200 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Histórico de Saldo
            </Typography>
            {loading ? (
                <CircularProgress />
            ) : (
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                        <YAxis hide domain={[ 'dataMin', 'dataMax' ]} />
                        <Tooltip formatter={value => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} />
                        <Line type="monotone" dataKey="balance" strokeWidth={2} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            )}
        </Paper>
    );
}

function ActionPanel({ onWithdraw, onDeposit, onTransfer }) {
    return (
        <Paper sx={{ flex: 1, p: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Ações
            </Typography>
            <Stack spacing={2}>
                <Button variant="contained" onClick={onWithdraw}>Sacar</Button>
                <Button variant="contained" onClick={onDeposit}>Depositar</Button>
                <Button variant="contained" onClick={onTransfer}>Transferir</Button>
            </Stack>
        </Paper>
    );
}

// NOVO COMPONENTE AUXILIAR PARA O STATUS VISUAL
function StatusChip({ status }) {
    let color = 'default';
    let label = status;
    let icon = null;

    switch (status) {
        case 'COMPLETED':
            color = 'success';
            label = 'Completa';
            icon = <CheckCircleOutline sx={{ fontSize: '1.2rem' }} />;
            break;
        case 'PENDING':
            color = 'warning';
            label = 'Pendente';
            icon = <HourglassTop sx={{ fontSize: '1.2rem' }} />;
            break;
        case 'FAILED':
            color = 'error';
            label = 'Falhou';
            icon = <ErrorOutline sx={{ fontSize: '1.2rem' }} />;
            break;
    }

    return <Chip icon={icon} label={label} color={color} size="small" variant="outlined" />;
}

function TransactionsTable({ transactions, loading, accountId }) {
    if (loading) return <CircularProgress />;

    const getTransactionDetails = (tx) => {
        const isSender = tx.accountId === accountId;
        switch (tx.transactionType) {
            case 'DEPOSIT':
                return { icon: <SouthWest color="success" />, label: 'Depósito Recebido', color: 'success.main', prefix: '+ ', otherAccount: '-' };
            case 'WITHDRAWAL':
                return { icon: <NorthEast color="error" />, label: 'Saque Efetuado', color: 'error.main', prefix: '- ', otherAccount: '-' };
            case 'TRANSFER':
                return isSender
                    ? { icon: <NorthEast color="error" />, label: 'Transferência Enviada', color: 'error.main', prefix: '- ', otherAccount: `Conta ${tx.accountToId}` }
                    : { icon: <SouthWest color="success" />, label: 'Transferência Recebida', color: 'success.main', prefix: '+ ', otherAccount: `Conta ${tx.accountId}` };
            case 'PAYMENT':
                return { icon: <ReceiptLong color="error" />, label: 'Pagamento de Empréstimo', color: 'error.main', prefix: '- ', otherAccount: 'Empréstimo' };
            default:
                return { icon: null, label: tx.transactionType, color: 'text.primary', prefix: '', otherAccount: '-' };
        }
    };

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ width: '1%' }}></TableCell>
                        <TableCell>Tipo</TableCell>
                        <TableCell>Valor</TableCell>
                        <TableCell>Origem/Destino</TableCell>
                        <TableCell>Data/Hora</TableCell>
                        <TableCell>Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {transactions.map(tx => {
                        const details = getTransactionDetails(tx);
                        return (
                            <TableRow key={tx.id}>
                                <TableCell>{details.icon}</TableCell>
                                <TableCell>{details.label}</TableCell>
                                <TableCell sx={{ color: details.color, fontWeight: 'bold' }}>
                                    {`${details.prefix}${tx.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`}
                                </TableCell>
                                <TableCell>{details.otherAccount}</TableCell>
                                <TableCell>{new Date(tx.timestamp).toLocaleString('pt-BR')}</TableCell>
                                <TableCell>
                                    <StatusChip status={tx.transactionStatus} />
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function NumberFormatCustom(props) {
    const { inputRef, onChange, name, ...other } = props;
    return (
        <NumericFormat {...other} getInputRef={inputRef} onValueChange={(values) => { onChange({ target: { name, value: values.value } }); }}
                       thousandSeparator='.' decimalSeparator=',' prefix='R$ ' isnumericstring="true"/>
    );
}

export function TransactionDialogs({ openWithdraw, onCloseWithdraw, onConfirmWithdraw,
                                       openDeposit, onCloseDeposit, onConfirmDeposit,
                                       openTransfer, onCloseTransfer, onConfirmTransfer}) {
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [depositAmount, setDepositAmount] = useState('');
    const [transferAccount, setTransferAccount] = useState('');
    const [transferAmount, setTransferAmount] = useState('');

    return (
        <>
            <Dialog open={openWithdraw} TransitionComponent={Transition} keepMounted onClose={onCloseWithdraw} fullWidth maxWidth="xs">
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ArrowDownward color="error" /><Box component="span" sx={{ fontSize: '1.25rem', fontWeight: 500 }}>Sacar</Box>
                </DialogTitle>
                <DialogContent>
                    <TextField autoFocus margin="dense" placeholder="Valor" name="withdrawAmount" fullWidth variant="outlined"
                               value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} InputProps={{ inputComponent: NumberFormatCustom }} />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={onCloseWithdraw}>Cancelar</Button>
                    <Button variant="contained" onClick={() => { onConfirmWithdraw(Number(withdrawAmount)); setWithdrawAmount(''); }}>Confirmar</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openDeposit} TransitionComponent={Transition} keepMounted onClose={onCloseDeposit} fullWidth maxWidth="xs">
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ArrowUpward color="success" /><Box component="span" sx={{ fontSize: '1.25rem', fontWeight: 500 }}>Depositar</Box>
                </DialogTitle>
                <DialogContent>
                    <TextField autoFocus margin="dense" placeholder="Valor" name="depositAmount" fullWidth variant="outlined"
                               value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} InputProps={{ inputComponent: NumberFormatCustom }} />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={onCloseDeposit}>Cancelar</Button>
                    <Button variant="contained" onClick={() => { onConfirmDeposit(Number(depositAmount)); setDepositAmount(''); }}>Confirmar</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openTransfer} TransitionComponent={Transition} keepMounted onClose={onCloseTransfer} fullWidth maxWidth="xs">
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SwapHoriz color="primary" /><Box component="span" sx={{ fontSize: '1.25rem', fontWeight: 500 }}>Transferir</Box>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ mb: 2 }}>
                        <TextField autoFocus margin="dense" placeholder="Numero da Conta Destino" type="text" fullWidth variant="outlined"
                                   value={transferAccount} onChange={e => setTransferAccount(e.target.value)}/>
                    </Box>
                    <TextField margin="dense" placeholder="Valor" name="transferAmount" fullWidth variant="outlined"
                               value={transferAmount} onChange={e => setTransferAmount(e.target.value)} InputProps={{inputComponent: NumberFormatCustom}}/>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={onCloseTransfer}>Cancelar</Button>
                    <Button variant="contained" onClick={() => { onConfirmTransfer({ toAccountId: transferAccount, amount: Number(transferAmount) }); setTransferAccount(''); setTransferAmount(''); }}>Confirmar</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

// --- Página Principal ---
export default function UserTransactionsPage() {
    const accountId = 1;
    const [openWithdraw, setOpenWithdraw] = useState(false);
    const [openDeposit,  setOpenDeposit]  = useState(false);
    const [openTransfer, setOpenTransfer] = useState(false);
    const [balance, setBalance] = useState(0);
    const [history, setHistory] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loadingBalance, setLoadingBalance] = useState(false);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [loadingTransactions, setLoadingTransactions] = useState(false);

    const authHeader = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token') || ''}` });

    async function fetchAllData() {
        await Promise.all([ fetchBalance(), fetchHistory(), fetchTransactions() ]);
    }

    useEffect(() => { fetchAllData(); }, []);

    async function fetchBalance() {
        setLoadingBalance(true);
        try {
            const res = await fetch(`${API_URL}/account/${accountId}`, { headers: authHeader() });
            const data = await res.json();
            setBalance(data.balance);
        } catch(error) {
            console.error("Erro ao buscar saldo:", error); }
        finally { setLoadingBalance(false); }
    }

    async function fetchHistory() {
        setLoadingHistory(true);
        try {
            const res = await fetch(`${API_URL}/account/balance-history/${accountId}`, { headers: authHeader() });
            if (!res.ok) throw new Error(`Erro ${res.status}`);
            const raw = await res.json();
            const formatted = raw.map(item => ({ name: new Date(item.timestamp).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }), balance: item.balance }));
            setHistory(formatted);
        } catch (e) { console.error('Erro ao buscar histórico de saldo:', e); }
        finally { setLoadingHistory(false); }
    }

    async function fetchTransactions() {
        setLoadingTransactions(true);
        try {
            const res = await fetch(`${API_URL}/transaction/accounts/${accountId}`, { headers: authHeader() });
            setTransactions(await res.json());
        } catch(error) { console.error("Erro ao buscar transações:", error); }
        finally { setLoadingTransactions(false); }
    }

    async function handleTransaction(type, payload) {
        let body;
        switch (type) {
            case 'WITHDRAWAL': body = { accountId, transactionType: 'WITHDRAWAL', amount: payload }; break;
            case 'DEPOSIT': body = { accountId, transactionType: 'DEPOSIT', amount: payload }; break;
            case 'TRANSFER': body = { accountId, accountToId: payload.toAccountId, transactionType: 'TRANSFER', amount: payload.amount }; break;
            default: return;
        }
        try {
            const res = await fetch(`${API_URL}/transaction`, { method: 'POST', headers: authHeader(), body: JSON.stringify(body) });
            if (!res.ok) throw new Error(`Erro ${res.status}: ${await res.text()}`);
            setOpenWithdraw(false);
            setOpenDeposit(false);
            setOpenTransfer(false);
            await fetchAllData();
        } catch (error) { console.error(`Erro ao realizar ${type}:`, error); }
    }

    async function handleExport(format) {
        try {
            const res = await fetch(`${API_URL}/statement-service/export/${format}/${accountId}`, { headers: authHeader() });
            if (!res.ok) throw new Error(`Erro ${res.status}`);
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `transacoes_${accountId}.${format}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) { console.error(`Erro ao exportar ${format.toUpperCase()}:`, error); }
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <AppAppBar title="Minhas Transações" />
            <Toolbar />
            <Container maxWidth="lg" sx={{ py: 4, mt:5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h4" gutterBottom>Minhas Transações</Typography>
                    <Button variant="outlined" component={Link} to="/admin-transactions">Ir para Admin</Button>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                    <BalanceCard balance={balance} loading={loadingBalance} />
                    <BalanceChart data={history} loading={loadingHistory} />
                    <ActionPanel onWithdraw={() => setOpenWithdraw(true)} onDeposit={() => setOpenDeposit(true)} onTransfer={() => setOpenTransfer(true)} />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h5">Histórico de Transações</Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button variant="outlined" onClick={() => handleExport('pdf')}>Exportar PDF</Button>
                        <Button variant="outlined" onClick={() => handleExport('xlsx')}>Exportar Excel</Button>
                    </Box>
                </Box>
                <TransactionsTable transactions={transactions} loading={loadingTransactions} accountId={accountId} />
                <TransactionDialogs
                    openWithdraw={openWithdraw} onCloseWithdraw={() => setOpenWithdraw(false)} onConfirmWithdraw={(amount) => handleTransaction('WITHDRAWAL', amount)}
                    openDeposit={openDeposit} onCloseDeposit={() => setOpenDeposit(false)} onConfirmDeposit={(amount) => handleTransaction('DEPOSIT', amount)}
                    openTransfer={openTransfer} onCloseTransfer={() => setOpenTransfer(false)} onConfirmTransfer={(payload) => handleTransaction('TRANSFER', payload)}
                />
            </Container>
        </Box>
    );
}