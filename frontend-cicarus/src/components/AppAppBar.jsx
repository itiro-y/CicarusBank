import * as React from 'react';
import { styled, alpha, useTheme } from '@mui/material/styles'; // Importação do useTheme
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { Link, useNavigate } from 'react-router-dom'; // Importação do useNavigate
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ColorModeIconDropdown from '../theme/ColorModeIconDropdown.jsx';
import Swal from 'sweetalert2'; // Importação do SweetAlert2

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
    const navigate = useNavigate(); // Hook para navegação
    const theme = useTheme(); // Hook para acessar o tema atual

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    // --- NOVA FUNÇÃO DE LOGOUT ---
    const handleLogout = () => {
        // Fecha o menu drawer se estiver aberto (mobile)
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
            // Estilos para o popup se adaptar ao tema
            background: theme.palette.background.paper,
            color: theme.palette.text.primary,
            confirmButtonColor: theme.palette.error.main,
            cancelButtonColor: theme.palette.grey[500],
        }).then((result) => {
            if (result.isConfirmed) {
                // Se o usuário confirmar, mostra o popup de "deslogando"
                let timerInterval;
                Swal.fire({
                    title: 'Deslogando...',
                    html: 'Você será redirecionado em breve.',
                    timer: 1500, // 1.5 segundos
                    timerProgressBar: true,
                    didOpen: () => {
                        Swal.showLoading();
                    },
                    willClose: () => {
                        clearInterval(timerInterval);
                    },
                    // Estilos para o popup de loading
                    background: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                }).then(() => {
                    // Após o timer, redireciona para a página de login
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
                            src="https://i.postimg.cc/7PTgDFMq/b75972db-ce38-4634-a3f1-18f023cc50c7-removebg-preview.png"
                            style={{ height: '80px', marginRight: '16px', cursor: 'pointer' }}
                            alt="CicarusBank logo"
                            onClick={() => navigate('/dashboard')}
                        />
                        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                            <Button component={Link} to="/dashboard" color="primary" variant="text" size="small">Visão Geral</Button>
                            <Button component={Link} to="/user-transactions" variant="text" color="info" size="small">Transferências</Button>
                            <Button component={Link} to="/user-card" variant="text" color="info" size="small">Cartões</Button>
                            <Button variant="text" color="info" size="small">Investimentos</Button>
                            <Button component={Link} to="/exchange" variant="text" color="info" size="small">Câmbio</Button>
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            display: { xs: 'none', md: 'flex' },
                            gap: 1,
                            alignItems: 'center',
                        }}
                    >
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
                                <MenuItem>Investimentos</MenuItem>
                                <MenuItem onClick={() => { navigate('/exchange'); toggleDrawer(false)(); }}>Câmbio</MenuItem>
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