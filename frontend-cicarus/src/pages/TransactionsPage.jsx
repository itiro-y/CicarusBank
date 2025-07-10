// src/pages/TransactionsPage.jsx
import React, {useState} from 'react';
import {
    Box,
    Container,
    Typography,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableContainer,
    Paper,
    Toolbar, Grid, TextField, Stack, Button
} from '@mui/material';

import AppAppBar from '../components/AppAppBar.jsx';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

const mockTransactions = [
    {
        id: 1,
        accountId:1,
        transactionType: 'DEPOSIT',
        amount: 150.0,
        timestamp: '2025-07-10T09:15:00Z',
        transactionStatus: 'COMPLETED'
    },
    {
        id: 2,
        accountId:1,
        transactionType: 'WITHDRAWAL',
        amount: 150.0,
        timestamp: '2025-07-10T09:15:00Z',
        transactionStatus: 'COMPLETED'
    },
    {
        id: 3,
        accountId:1,
        transactionType: 'DEPOSIT',
        amount: 150.0,
        timestamp: '2025-07-10T09:15:00Z',
        transactionStatus: 'COMPLETED'
    }
];

export default function TransactionsPage() {
    const [openWithdraw, setOpenWithdraw] = useState(false);
    const [openDeposit, setOpenDeposit]   = useState(false);
    const [openTransfer, setOpenTransfer] = useState(false);

    const handleOpen = setter => () => setter(true);
    const handleClose = setter => () => setter(false);

    return (
        <Box sx={{ minHeight: '100vh',
                   bgcolor: 'background.default',
                   pt: 8}}>
            <AppAppBar title="Transações" />

            <Toolbar />


            <Stack direction="row" paddingLeft={150} spacing={2} sx={{ mb: 3 }}>
                <Button variant="contained" onClick={handleOpen(setOpenWithdraw)}>
                    Sacar
                </Button>
                <Button variant="contained" onClick={handleOpen(setOpenDeposit)}>
                    Depositar
                </Button>
                <Button variant="contained" onClick={handleOpen(setOpenTransfer)}>
                    Transferir
                </Button>
            </Stack>

            <Container sx={{ py: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Histórico de Transações
                </Typography>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>ID da Conta</TableCell>
                                <TableCell>Tipo</TableCell>
                                <TableCell>Valor</TableCell>
                                <TableCell>Data/Hora</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {mockTransactions.map(tx => (
                                <TableRow key={tx.id}>
                                    <TableCell id={"id"}> {tx.id} </TableCell>

                                    <TableCell id={"accountId"}> {tx.id} </TableCell>

                                    <TableCell id={"transactionType"}> {tx.transactionType} </TableCell>

                                    <TableCell id={"amount"}>
                                        {tx.amount.toLocaleString('pt-BR', {
                                            style: 'currency',
                                            currency: 'BRL'
                                        })}
                                    </TableCell>

                                    <TableCell id={"timestamp"}>
                                        {new Date(tx.timestamp).toLocaleString('pt-BR', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </TableCell>

                                    <TableCell id={"transactionType"}> {tx.transactionStatus} </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Diálogo de Sacar */}
                <Dialog open={openWithdraw} onClose={handleClose(setOpenWithdraw)}>
                    <DialogTitle>Sacar</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Valor"
                            type="number"
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose(setOpenWithdraw)}>Cancelar</Button>
                        <Button onClick={handleClose(setOpenWithdraw)}>Confirmar</Button>
                    </DialogActions>
                </Dialog>

                {/* Diálogo de Depositar */}
                <Dialog open={openDeposit} onClose={handleClose(setOpenDeposit)}>
                    <DialogTitle>Depositar</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Valor"
                            type="number"
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose(setOpenDeposit)}>Cancelar</Button>
                        <Button onClick={handleClose(setOpenDeposit)}>Confirmar</Button>
                    </DialogActions>
                </Dialog>

                {/* Diálogo de Transferir */}
                <Dialog open={openTransfer} onClose={handleClose(setOpenTransfer)}>
                    <DialogTitle>Transferir</DialogTitle>
                    <DialogContent>
                        <TextField
                            margin="dense"
                            label="Conta Destino"
                            type="text"
                            fullWidth
                        />
                        <TextField
                            margin="dense"
                            label="Valor"
                            type="number"
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose(setOpenTransfer)}>Cancelar</Button>
                        <Button onClick={handleClose(setOpenTransfer)}>Confirmar</Button>
                    </DialogActions>
                </Dialog>

            </Container>
        </Box>
    );
}
