import React, { useState, useEffect } from 'react';
import {
    Box, Container, Typography, Paper, Stack, Button,
    TableContainer, Table, TableHead, TableBody, TableRow, TableCell,
    Toolbar, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, CircularProgress, Slide, FormControl, InputLabel
} from '@mui/material';

import { NumericFormat } from 'react-number-format';

import {
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';

import { ArrowDownward, ArrowUpward, SwapHoriz } from '@mui/icons-material';
import AppAppBar from '../components/AppAppBar.jsx';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || '';
const useMocks = false;

// Mock data
const mockBalance = 12345.67;
const mockHistory = [
    { name: 'Jan', balance: 10000 },
    { name: 'Feb', balance: 12000 },
    { name: 'Mar', balance: 9000  },
    { name: 'Apr', balance: 15000 },
    { name: 'May', balance: 13000 }
];
const mockTransactions = [
    { id: 1, accountId: 1, accountType: 'WITHDRAW', amount: 500, timestamp: Date.now() - 86400000 * 2, transactionStatus: 'APPROVED' },
    { id: 2, accountId: 1, accountType: 'DEPOSIT', amount: 2000, timestamp: Date.now() - 86400000 * 1, transactionStatus: 'APPROVED' },
    { id: 3, accountId: 1, accountType: 'TRANSFER', amount: 750, timestamp: Date.now(), transactionStatus: 'PENDING' }
];

function BalanceCard({ balance, loading }) {
    return (
        <Paper sx={{ flex: 1, p: 3, minHeight: 120 }}>
            <Typography variant="subtitle2" color="text.secondary">
                Saldo Atual
            </Typography>
            {loading ? (
                <CircularProgress size={24} />
            ) : (
                <Typography variant="h4" color="primary">
                    {balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
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

function TransactionsTable({ transactions, loading }) {
    if (loading) return <CircularProgress />;
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Conta</TableCell>
                        <TableCell>Tipo</TableCell>
                        <TableCell>Valor</TableCell>
                        <TableCell>Data/Hora</TableCell>
                        <TableCell>Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {transactions.map(tx => (
                        <TableRow key={tx.id}>
                            <TableCell>{tx.id}</TableCell>
                            <TableCell>{tx.accountId}</TableCell>
                            <TableCell>{tx.transactionType}</TableCell>
                            <TableCell>
                                {tx.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </TableCell>
                            <TableCell>{new Date(tx.timestamp).toLocaleString('pt-BR')}</TableCell>
                            <TableCell>{tx.transactionStatus}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

// Custom input for currency mask
function NumberFormatCustom(props) {
    const { inputRef, onChange, name, ...other } = props;
    return (
        <NumericFormat {...other}
                       getInputRef={inputRef}
                       onValueChange={(values) => {
                           onChange({
                               target: {
                                   name,
                                   value: values.value,
                               },
                           });
                       }}
                       thousandSeparator='.'
                       decimalSeparator=','
                       prefix='R$ '
                       isnumericstring="true"/>
    );
}

export function TransactionDialogs({ openWithdraw,
                                     onCloseWithdraw,
                                     onConfirmWithdraw,
                                     openDeposit,
                                     onCloseDeposit,
                                     onConfirmDeposit,
                                     openTransfer,
                                     onCloseTransfer,
                                     onConfirmTransfer}) {

    const [amount, setAmount] = useState('');
    const [transferAccount, setTransferAccount] = useState('');
    const [transferAmount, setTransferAmount] = useState('');

    return (
        <>
            <Dialog open={openWithdraw}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={onCloseWithdraw}
                    fullWidth
                    maxWidth="xs">
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ArrowDownward color="error" />
                    <Box component="span" sx={{ fontSize: '1.25rem', fontWeight: 500 }}>Sacar</Box>
                </DialogTitle>
                <DialogContent>
                    <TextField autoFocus
                               margin="dense"
                               placeholder="Valor"
                               name="amount"
                               fullWidth
                               variant="outlined"
                               value={amount}
                               onChange={(e) => setAmount(e.target.value)}
                               InputProps={{ inputComponent: NumberFormatCustom }} />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={onCloseWithdraw}>Cancelar</Button>
                    <Button variant="contained"
                            onClick={() => {
                                onConfirmWithdraw(Number(amount));
                                setAmount('');
                            }}>
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Deposit Dialog */}
            <Dialog open={openDeposit}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={onCloseDeposit}
                    fullWidth
                    maxWidth="xs">
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ArrowUpward color="success" />
                    <Box component="span" sx={{ fontSize: '1.25rem', fontWeight: 500 }}>Depositar</Box>
                </DialogTitle>
                <DialogContent>
                    <TextField autoFocus
                            margin="dense"
                            placeholder="Valor"
                            name="amount"
                            fullWidth
                            variant="outlined"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            InputProps={{ inputComponent: NumberFormatCustom }} />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={onCloseDeposit}>Cancelar</Button>
                    <Button variant="contained"
                            onClick={() => {
                                onConfirmDeposit(Number(amount));
                                setAmount('');
                            }}>
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openTransfer}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={onCloseTransfer}
                    fullWidth
                    maxWidth="xs">
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SwapHoriz color="primary" />
                    <Box component="span" sx={{ fontSize: '1.25rem', fontWeight: 500 }}>Transferir</Box>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ mb: 2 }}>
                        <TextField autoFocus
                                   margin="dense"
                                   placeholder="Numero da Conta Destino"
                                   type="text"
                                   fullWidth
                                   variant="outlined"
                                   value={transferAccount}
                                   onChange={e => setTransferAccount(e.target.value)}/>
                    </Box>
                    <TextField margin="dense"
                               placeholder="Valor"
                               name="transferAmount"
                               fullWidth
                               variant="outlined"
                               value={transferAmount}
                               onChange={e => setTransferAmount(e.target.value)}
                               InputProps={{inputComponent: NumberFormatCustom}}/>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={onCloseTransfer}>Cancelar</Button>
                    <Button variant="contained"
                            onClick={() => {
                                onConfirmTransfer({ toAccountId: transferAccount, amount: Number(transferAmount) });
                                setTransferAccount('');
                                setTransferAmount('');
                            }}>
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

// --- Página Principal ---
export default function UserTransactionsPage() {
    const accountId = 1; // TODO: obter dinamicamente do contexto

    const [selectedPage, setSelectedPage] = useState('user');

    // UI dialogs
    const [openWithdraw, setOpenWithdraw] = useState(false);
    const [openDeposit,  setOpenDeposit]  = useState(false);
    const [openTransfer, setOpenTransfer] = useState(false);

    // data & loading
    const [balance, setBalance]                 = useState(useMocks ? mockBalance : 0);
    const [history, setHistory]                 = useState(useMocks ? mockHistory : []);
    const [transactions, setTransactions]       = useState(useMocks ? mockTransactions : []);
    const [loadingBalance, setLoadingBalance]         = useState(false);
    const [loadingHistory, setLoadingHistory]         = useState(false);
    const [loadingTransactions, setLoadingTransactions] = useState(false);

    const authHeader = () => {
        const token = localStorage.getItem('token') || '';
        return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
    };

    // Carregamento inicial
    useEffect(() => {
        if (!useMocks) {
            fetchBalance();
            fetchHistory();
            fetchTransactions();
        }
    }, []);

    async function fetchBalance() {
        setLoadingBalance(true);
        try {
            const res = await fetch(`${API_URL}/account/${accountId}`, { headers: authHeader() });
            const data = await res.json();
            setBalance(data.balance);
        } catch {} finally { setLoadingBalance(false); }
    }

    async function fetchHistory() {
        setLoadingHistory(true);
        try {
            const res = await fetch(
                `${API_URL}/account/balance-history/${accountId}`,
                { headers: authHeader() }
            );
            if (!res.ok) throw new Error(`Erro ${res.status}`);
            const raw = await res.json();

            // Mapeia para { name, balance }
            const formatted = raw.map(item => ({
                name: new Date(item.timestamp)
                    .toLocaleDateString('pt-BR', {
                        day:   '2-digit',
                        month: '2-digit',
                        year:  'numeric'
                    }),
                balance: item.balance
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
        } catch {} finally { setLoadingTransactions(false); }
    }

    async function handleWithdraw(amount) {
        await fetch(`${API_URL}/transaction`, {
            method: 'POST',
            headers: authHeader(),
            body: JSON.stringify({ accountId,
                                         accountToId: null,
                                         transactionType: 'WITHDRAWAL',
                                         amount})
        });
        setOpenWithdraw(false);
        if (!useMocks) {
            await fetchBalance();
            await fetchTransactions();
            await fetchHistory()
        }
    }

    async function handleDeposit(amount) {
        await fetch(`${API_URL}/transaction`, {
            method: 'POST',
            headers: authHeader(),
            body: JSON.stringify({ accountId,
                                         accountToId: null,
                                         transactionType: 'DEPOSIT',
                                         amount })
        });
        setOpenDeposit(false);
        if (!useMocks) {
            await fetchBalance();
            await fetchTransactions();
            await fetchHistory();}
    }


    async function handleTransfer({ toAccountId, amount }) {
        try {
            const res = await fetch(
                `${API_URL}/transaction`,
                {
                    method: 'POST',
                    headers: authHeader(),
                    body: JSON.stringify({
                        accountId,
                        accountToId: toAccountId,
                        transactionType: 'TRANSFER',
                        amount
                    })
                }
            );

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Erro ${res.status}: ${errorText}`);
            }

            setOpenTransfer(false);
            if (!useMocks) {
                await fetchBalance();
                await fetchTransactions();
                await fetchHistory();
            }
        } catch (error) {
            console.error('Erro ao realizar transferência:', error);
        }
    }

    async function handleExportPdf() {
        try {
            const res = await fetch(`${API_URL}/statement-service/export/pdf/${accountId}`, { headers: authHeader() });
            if (!res.ok) throw new Error(`Erro ${res.status}`);
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `transacoes_${accountId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Erro ao exportar PDF:', error);
        }
    }

    async function handleExportExcel() {
        try {
            const res = await fetch(`${API_URL}/statement-service/export/xlsx/${accountId}`, { headers: authHeader() });
            if (!res.ok) throw new Error(`Erro ${res.status}`);
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `transacoes_${accountId}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Erro ao exportar Excel:', error);
        }
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <AppAppBar title="Minhas Transações" />
            <Toolbar />

            <Container maxWidth="lg" sx={{ py: 4, mt:5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, mb: 2 }}>
                    <Typography variant="h4" gutterBottom>Minhas Transações</Typography>
                    {/* botão para ir para a página de admin */}
                    <Button
                        variant="outlined"
                        sx={{ mb: 2 }}
                        component={Link}
                        to="/admin-transactions"
                    >
                        Ir para Admin
                    </Button>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                    <BalanceCard balance={balance} loading={loadingBalance} />
                    <BalanceChart data={history} loading={loadingHistory} />
                    <ActionPanel
                        onWithdraw={() => setOpenWithdraw(true)}
                        onDeposit={() => setOpenDeposit(true)}
                        onTransfer={() => setOpenTransfer(true)}
                    />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, mb: 2 }}>
                    <Typography variant="h5">Histórico de Transações</Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button variant="outlined" onClick={handleExportPdf}>Exportar PDF</Button>
                        <Button variant="outlined" onClick={handleExportExcel}>Exportar Excel</Button>
                    </Box>
                </Box>
                <TransactionsTable transactions={transactions} loading={loadingTransactions} />
                <TransactionDialogs
                    openWithdraw={openWithdraw}
                    onCloseWithdraw={() => setOpenWithdraw(false)}
                    onConfirmWithdraw={handleWithdraw}

                    openDeposit={openDeposit}
                    onCloseDeposit={() => setOpenDeposit(false)}
                    onConfirmDeposit={handleDeposit}

                    openTransfer={openTransfer}
                    onCloseTransfer={() => setOpenTransfer(false)}
                    onConfirmTransfer={handleTransfer}
                />
            </Container>
        </Box>
    );
}
