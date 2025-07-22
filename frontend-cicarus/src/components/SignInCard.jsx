import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  Checkbox,
  FormControl,
  FormControlLabel,
  Link as MuiLink,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import Swal from "sweetalert2";
import ForgotPassword from "./ForgotPassword.jsx";

const API_URL = import.meta.env.VITE_API_URL || '';

const authHeader = () => {
    const token = localStorage.getItem('token') || '';
    return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
};

export default function SignInCard({ onSwitchToSignUp }) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL || '';
    // const API_URL = import.meta.env.VITE_API_URL || 'http://172.203.234.78:8765';

  const logoStyle = {
    width: "200px",
    height: "auto",
    filter: theme.palette.mode === "dark" ? "brightness(0) invert(1)" : "none",
  };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const username = form.get("username"); // email do usuário
        const password = form.get("password");


        try {
            // 1) Faz login e armazena token
            const loginRes = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });
            if (!loginRes.ok) throw new Error("Usuário ou senha inválidos.");
            const { token } = await loginRes.json();
            localStorage.setItem("token", token);

            // 2) Busca perfil do cliente usando o email (username) como no seu useEffect
            const profileRes = await fetch(
                `${API_URL}/customers/profile/${username}`,
                { headers: authHeader() }
            );
            if (!profileRes.ok) {
                throw new Error(`Failed to fetch customer data (${profileRes.status})`);
            }
            const profileData = await profileRes.json();
            localStorage.setItem("accountId", profileData.id);

            // 3) Notifica e navega
            Swal.fire({
                title: "Login Efetuado!",
                text: "Seja bem-vindo de volta.",
                icon: "success",
                timer: 2000,
                showConfirmButton: false,
                background: theme.palette.background.paper,
                color: theme.palette.text.primary,
                timerProgressBar: true,
                didClose: () => navigate("/dashboard"),
            });

        } catch (error) {
            console.error("Erro no login/perfil:", error);
            Swal.fire({
                title: "Erro!",
                text: error.message,
                icon: "error",
                confirmButtonText: "Tentar Novamente",
                background: theme.palette.background.paper,
                color: theme.palette.text.primary,
                confirmButtonColor: theme.palette.primary.main,
            });
        }
    };

  const handleForgotPasswordOpen = () => setOpen(true);
  const handleForgotPasswordClose = () => setOpen(false);

  return (
    // AQUI ESTÁ A CORREÇÃO DO FUNDO DO CARD
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        alignSelf: "center",
        width: "100%",
        maxWidth: "600px",
        p: 4,
        gap: 3,
        // Fundo semi-transparente que se adapta ao tema
        backgroundColor:
          theme.palette.mode === "dark"
            ? "rgba(0, 0, 0, 0.4)"
            : "rgba(255, 255, 255, 0.7)",
        backdropFilter: "blur(10px)", // Efeito de vidro fosco
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "md",
      }}
    >
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <img
            src="https://i.postimg.cc/tTNVVxN9/Whisk-ebcbb91926.png"
            alt="CicarusBank Logo"
            style={logoStyle}
          />
        </Box>
        <Typography
          component="h1"
          variant="h4"
          sx={{
            color: "text.primary",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Acesse sua conta
        </Typography>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <Typography
            component="label"
            htmlFor="username"
            sx={{ color: "text.secondary", mb: 1 }}
          >
            Usuário
          </Typography>
          <TextField
            id="username"
            name="username"
            autoComplete="username"
            autoFocus
            required
            fullWidth
            variant="outlined"
          />
        </FormControl>
        <FormControl fullWidth sx={{ mt: 1 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              component="label"
              htmlFor="password"
              sx={{ color: "text.secondary" }}
            >
              Senha
            </Typography>
            <MuiLink
              component="button"
              type="button"
              onClick={handleForgotPasswordOpen}
              variant="body2"
              sx={{
                color: "text.secondary",
                "&:hover": { color: "primary.main" },
              }}
            >
              Esqueceu sua senha?
            </MuiLink>
          </Box>
          <TextField
            name="password"
            type="password"
            id="password"
            autoComplete="current-password"
            required
            fullWidth
            variant="outlined"
            sx={{ mt: 1 }}
          />
        </FormControl>
        <FormControlLabel
          control={<Checkbox value="remember" color="primary" />}
          label="Lembrar-me"
          sx={{ color: "text.secondary" }}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 2, py: 1.5, fontSize: "1rem", fontWeight: "bold" }}
        >
          Entrar
        </Button>
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Não tem uma conta?{" "}
            <MuiLink
              component="button"
              type="button"
              variant="body2"
              onClick={onSwitchToSignUp}
              sx={{
                color: "primary.main",
                fontWeight: "bold",
                textDecoration: "none",
                cursor: "pointer",
                background: "none",
                border: "none",
                p: 0,
                fontFamily: "inherit",
                fontSize: "inherit",
              }}
            >
              Cadastre-se
            </MuiLink>
          </Typography>
        </Box>
      </Box>
      <ForgotPassword open={open} onClose={handleForgotPasswordClose} />
    </Card>
  );
}
