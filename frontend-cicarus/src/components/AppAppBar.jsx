import * as React from 'react';
import { styled, alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { Link, useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ColorModeIconDropdown from '../theme/ColorModeIconDropdown.jsx';
import Swal from 'sweetalert2'; // Importação do SweetAlert2
import NotificationBell from './NotificationBell.jsx';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
    borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
    backdropFilter: 'blur(24px)',
    border: '1px solid',
    borderColor: (theme.vars || theme).palette.divider,
    backgroundColor: theme.vars
        ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
        : alpha(theme.palette.background.default, 0.4),
    boxShadow: (theme.vars || theme).shadows[1],
    padding: '8px 12px',
}));

export default function AppAppBar() {
    const [open, setOpen] = React.useState(false);
    const navigate = useNavigate();
    const theme = useTheme();

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    const handleLogout = () => {
        if (open) {
            setOpen(false);
        }

        Swal.fire({
            title: 'Você tem certeza?',
            text: "Sua sessão atual será encerrada.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim, sair!',
            cancelButtonText: 'Cancelar',
            reverseButtons: true,
            background: theme.palette.background.paper,
            color: theme.palette.text.primary,
            confirmButtonColor: theme.palette.error.main,
            cancelButtonColor: theme.palette.grey[500],
        }).then((result) => {
            if (result.isConfirmed) {
                let timerInterval;
                Swal.fire({
                    title: 'Deslogando...',
                    html: 'Você será redirecionado em breve.',
                    timer: 1500,
                    timerProgressBar: true,
                    didOpen: () => {
                        Swal.showLoading();
                    },
                    willClose: () => {
                        clearInterval(timerInterval);
                    },
                    background: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                }).then(() => {
                    navigate('/');
                });
            }
        });
    };

    return (
        <AppBar
            position="fixed"
            enableColorOnDark
            sx={{
                boxShadow: 0,
                bgcolor: 'transparent',
                backgroundImage: 'none',
                mt: 2,
            }}
        >
            <Container maxWidth="lg">
                <StyledToolbar variant="dense" disableGutters>
                    <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0 }}>
                        <img
                            src="https://i.postimg.cc/13MB7w9d/download.png"
                            style={{ height: '80px', marginRight: '16px', cursor: 'pointer' }}
                            alt="CicarusBank logo"
                            onClick={() => navigate('/dashboard')}
                        />
                        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                            <Button component={Link} to="/dashboard" color="primary" variant="text" size="small">Visão Geral</Button>
                            <Button component={Link} to="/user-transactions" variant="text" color="info" size="small">Transferências</Button>
                            <Button component={Link} to="/user-card" variant="text" color="info" size="small">Cartões</Button>
                            <Button component={Link} to="/user-investments" variant="text" color="info" size="small">Investimentos</Button>
                            <Button component={Link} to="/loan" variant="text" color="info" size="small">Empréstimos</Button>
                            <Button component={Link} to="/exchange" variant="text" color="info" size="small">Câmbio</Button>
                            <Button component={Link} to="/agencias" variant="text" color="info" size="small">Agências</Button>
                            {/* NOVO BOTÃO DE BENEFÍCIOS PARA DESKTOP - MOVIDO AQUI */}
                            <Button
                                component={Link}
                                to="/benefits"
                                sx={{
                                    bgcolor: '#f57c00', // Laranja
                                    color: 'white', // Cor do texto branco para contraste
                                    '&:hover': {
                                        bgcolor: '#ef6c00', // Tom mais escuro no hover
                                    },
                                    textTransform: 'none', // Manter o texto como você digitou
                                    fontWeight: 'bold', // Deixar negrito
                                    px: 2, // Preenchimento horizontal
                                    py: 0.8, // Preenchimento vertical
                                    borderRadius: '8px', // Bordas arredondadas
                                    ml: 1 // Adicionar uma margem esquerda para separar de "Agências"
                                }}
                                size="small"
                            >
                                Benefícios
                            </Button>
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            display: { xs: 'none', md: 'flex' },
                            gap: 1,
                            alignItems: 'center',
                        }}
                    >
                        <NotificationBell />
                        <Button component={Link} to="/profile" color="primary" variant="text" size="small">
                            Perfil
                        </Button>
                        {/* Botão de Logout Desktop com a nova função */}
                        <Button color="primary" variant="contained" size="small" onClick={handleLogout}>
                            Logout
                        </Button>
                        <ColorModeIconDropdown />
                    </Box>
                    <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
                        <NotificationBell />
                        <ColorModeIconDropdown />
                        <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
                            <MenuIcon />
                        </IconButton>
                        <Drawer anchor="top" open={open} onClose={toggleDrawer(false)}>
                            <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <IconButton onClick={toggleDrawer(false)}>
                                        <CloseRoundedIcon />
                                    </IconButton>
                                </Box>
                                <MenuItem onClick={() => { navigate('/dashboard'); toggleDrawer(false)(); }}>Visão Geral</MenuItem>
                                <MenuItem onClick={() => { navigate('/user-transactions'); toggleDrawer(false)(); }}>Transferências</MenuItem>
                                <MenuItem onClick={() => { navigate('/user-card'); toggleDrawer(false)(); }}>Cartões</MenuItem>
                                <MenuItem onClick={() => { navigate('/investments'); toggleDrawer(false)(); }}>Investimentos</MenuItem>
                                <MenuItem onClick={() => { navigate('/loan'); toggleDrawer(false)(); }}>Empréstimos</MenuItem>
                                <MenuItem onClick={() => { navigate('/exchange'); toggleDrawer(false)(); }}>Câmbio</MenuItem>
                                <MenuItem onClick={() => { navigate('/agencias'); toggleDrawer(false)(); }}>Agências</MenuItem>
                                {/* NOVO ITEM DE MENU PARA BENEFÍCIOS (MOBILE) - MOVIDO AQUI */}
                                <MenuItem onClick={() => { navigate('/benefits'); toggleDrawer(false)(); }}>
                                    <Button
                                        color="primary"
                                        variant="text"
                                        fullWidth
                                        sx={{
                                            bgcolor: '#f57c00',
                                            color: 'white',
                                            '&:hover': { bgcolor: '#ef6c00' },
                                            textTransform: 'none',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        Benefícios
                                    </Button>
                                </MenuItem>
                                <Divider sx={{ my: 3 }} />
                                <MenuItem>
                                    <Button color="primary" variant="outlined" fullWidth onClick={() => { navigate('/profile'); toggleDrawer(false)(); }}>
                                        Perfil
                                    </Button>
                                </MenuItem>
                                <MenuItem>
                                    {/* Botão de Logout Mobile com a nova função */}
                                    <Button color="primary" variant="contained" fullWidth onClick={handleLogout}>
                                        Logout
                                    </Button>
                                </MenuItem>
                            </Box>
                        </Drawer>
                    </Box>
                </StyledToolbar>
            </Container>
        </AppBar>
    );
}