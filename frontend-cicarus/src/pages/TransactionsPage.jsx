// src/pages/TransactionsPage.jsx
import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Stack,
    Button,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Toolbar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField
} from '@mui/material';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid
} from 'recharts';
import { orange } from '@mui/material/colors';
import AppAppBar from '../components/AppAppBar.jsx';

// 1) Card de Saldo
function BalanceCard({ balance }) {
    return (
        <Paper sx={{ flex: 1, p: 3 }}>
            <Typography variant="subtitle2" color="text.secondary">
                Saldo Atual
            </Typography>
            <Typography variant="h4" color="primary">
                {balance.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                })}
            </Typography>
            <Paper sx={{ flex: 1, p: 1, mt: 2, ml: -1}}>
                <Typography variant="subtitle3" color="text.secondary">Resumo Mensal</Typography>
                <Stack direction="row" justifyContent="flex-start" sx={{mt: 0.5}}>
                    <Box>
                        <Typography variant="h6">+ R$ 3.200</Typography>
                        <Typography variant="caption">Entradas</Typography>
                    </Box>
                    <Box marginLeft={2}>
                        <Typography variant="h6" >– R$ 1.850</Typography>
                        <Typography variant="caption">Saídas</Typography>
                    </Box>
                </Stack>
            </Paper>
        </Paper>
    );
}

// 2) Gráfico de Histórico de Saldo
function BalanceChart({ data }) {
    return (
        <Paper sx={{ flex: 2, p: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Histórico de Saldo
            </Typography>
            <ResponsiveContainer width="100%" height={150}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis hide domain={['dataMin', 'dataMax']} />
                    <Tooltip
                        formatter={value =>
                            value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                        }
                    />
                    <Line type="monotone" dataKey="balance" stroke="#8884d8" strokeWidth={2} dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </Paper>
    );
}

// 3) Painel de Ações
function ActionPanel({ onWithdraw, onDeposit, onTransfer }) {
    return (
        <Paper sx={{ flex: 1, p: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Ações
            </Typography>
            <Stack spacing={2}>
                <Button variant="contained" onClick={onWithdraw} sx={{'&:hover': {bgcolor: orange[500], olor: '#fff'}}}>
                    Sacar
                </Button>
                <Button variant="contained" onClick={onDeposit} sx={{'&:hover': {bgcolor: orange[500], color: '#fff'}}}>
                    Depositar
                </Button>
                <Button variant="contained" onClick={onTransfer} sx={{'&:hover': {bgcolor: orange[500], color: '#fff'}}}>
                    Transferir
                </Button>
            </Stack>
        </Paper>
    );
}

// 4) Tabela de Histórico de Transações
function TransactionsTable({ transactions }) {
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
                            <TableCell>{tx.type}</TableCell>
                            <TableCell>
                                {tx.amount.toLocaleString('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL'
                                })}
                            </TableCell>
                            <TableCell>
                                {new Date(tx.timestamp).toLocaleString('pt-BR', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </TableCell>
                            <TableCell>{tx.status}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

// 5) Conjunto de diálogos para Sacar, Depositar, Transferir
function TransactionDialogs({
                                openWithdraw, onCloseWithdraw,
                                openDeposit,  onCloseDeposit,
                                openTransfer, onCloseTransfer
                            }) {
    return (
        <>
            <Dialog open={openWithdraw} onClose={onCloseWithdraw}>
                <DialogTitle>Sacar</DialogTitle>
                <DialogContent>
                    <TextField autoFocus margin="dense" label="Valor" type="number" fullWidth />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onCloseWithdraw}>Cancelar</Button>
                    <Button onClick={onCloseWithdraw}>Confirmar</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openDeposit} onClose={onCloseDeposit}>
                <DialogTitle>Depositar</DialogTitle>
                <DialogContent>
                    <TextField autoFocus margin="dense" label="Valor" type="number" fullWidth />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onCloseDeposit}>Cancelar</Button>
                    <Button onClick={onCloseDeposit}>Confirmar</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openTransfer} onClose={onCloseTransfer}>
                <DialogTitle>Transferir</DialogTitle>
                <DialogContent>
                    <TextField margin="dense" label="Conta Destino" type="text" fullWidth />
                    <TextField margin="dense" label="Valor"         type="number" fullWidth />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onCloseTransfer}>Cancelar</Button>
                    <Button onClick={onCloseTransfer}>Confirmar</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

// --- Página Principal ---
export default function TransactionsPage() {
    // estados de abertura de diálogo
    const [openWithdraw, setOpenWithdraw] = useState(false);
    const [openDeposit,  setOpenDeposit]  = useState(false);
    const [openTransfer, setOpenTransfer] = useState(false);

    // mocks de exemplo
    const mockBalance = 1234.56;
    const mockBalanceHistory = [
        { name: '01/07', balance: 1000 },
        { name: '02/07', balance: 1100 },
        { name: '03/07', balance: 1050 },
        { name: '04/07', balance: 1200 },
        { name: '05/07', balance: 1150 },
        { name: '06/07', balance: 1300 },
        { name: '07/07', balance: mockBalance }
    ];
    const mockTransactions = [
        { id: 1, accountId: 1, type: 'DEPOSIT',    amount: 150, timestamp: '2025-07-10T09:15:00Z', status: 'COMPLETED' },
        { id: 2, accountId: 1, type: 'WITHDRAWAL', amount:  50, timestamp: '2025-07-11T14:30:00Z', status: 'COMPLETED' },
        { id: 3, accountId: 1, type: 'TRANSFER',   amount: 200, timestamp: '2025-07-12T18:45:00Z', status: 'COMPLETED' }
    ];

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <AppAppBar title="Transferências" />
            <Toolbar />
            <Container maxWidth="lg" sx={{ py: 4, mt: 5}}>
                <Typography variant="h4" gutterBottom>
                    Transferências
                </Typography>

                {/* Dashboard de Cards + Gráfico + Ações */}
                <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                    <BalanceCard balance={mockBalance} />
                    <BalanceChart data={mockBalanceHistory} />
                    <ActionPanel
                        onWithdraw={() => setOpenWithdraw(true)}
                        onDeposit={()  => setOpenDeposit(true)}
                        onTransfer={() => setOpenTransfer(true)}
                    />
                </Box>

                {/* Histórico de Transações */}
                <Typography variant="h5" gutterBottom>
                    Histórico de Transações
                </Typography>
                <TransactionsTable transactions={mockTransactions} />

                {/* Diálogos */}
                <TransactionDialogs
                    openWithdraw  = {openWithdraw}  onCloseWithdraw  = {() => setOpenWithdraw(false)}
                    openDeposit   = {openDeposit}   onCloseDeposit   = {() => setOpenDeposit(false)}
                    openTransfer  = {openTransfer}  onCloseTransfer  = {() => setOpenTransfer(false)}
                />
            </Container>
        </Box>
    );
}
