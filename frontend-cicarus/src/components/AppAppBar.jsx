// Em: src/components/AppAppBar.jsx

import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ColorModeIconDropdown from "../theme/ColorModeIconDropdown.jsx";
// A importação do SitemarkIcon foi removida

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: "blur(24px)",
  border: "1px solid",
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
  padding: "8px 12px",
}));

export default function AppAppBar() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: "transparent",
        backgroundImage: "none",
        mt: 2,
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters>
          <Box
            sx={{ flexGrow: 1, display: "flex", alignItems: "center", px: 0 }}
          >
            {/* SUBSTITUIÇÃO FEITA AQUI */}
            <img
              src="https://i.postimg.cc/7PTgDFMq/b75972db-ce38-4634-a3f1-18f023cc50c7-removebg-preview.png"
              style={{ height: "80px", marginRight: "16px" }}
              alt="CicarusBank logo"
            />
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <Button
                component={Link}
                to="/dashboard"
                color="primary"
                variant="text"
                size="small"
              >
                Visão Geral
              </Button>

              <Button
                component={Link}
                to="/user-transactions"
                variant="text"
                color="info"
                size="small"
              >
                Transferências

              </Button>

              <Button
                component={Link}
                to="/user-transactions"
                variant="text"
                color="info"
                size="small"
              >
                Transferências
              </Button>

              <Button variant="text" color="info" size="small">
                Cartões
              </Button>

              <Button variant="text" color="info" size="small">
                Investimentos
              </Button>

              <Button
                component={Link}
                to="/exchange"
                variant="text"
                color="info"
                size="small"
              >
                Câmbio
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 1,
              alignItems: "center",
            }}
          >
            <Button
              component={Link}
              to="/profile"
              color="primary"
              variant="text"
              size="small"
            >
              Perfil
            </Button>
            <Button color="primary" variant="contained" size="small">
              Logout
            </Button>
            <ColorModeIconDropdown />
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" }, gap: 1 }}>
            <ColorModeIconDropdown />
            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer anchor="top" open={open} onClose={toggleDrawer(false)}>
              <Box sx={{ p: 2, backgroundColor: "background.default" }}>
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>
                <MenuItem>Visão Geral</MenuItem>
                <MenuItem>Transferências</MenuItem>
                <MenuItem>Cartões</MenuItem>
                <MenuItem>Investimentos</MenuItem>
                <MenuItem>Cambio</MenuItem>
                <Divider sx={{ my: 3 }} />
                <MenuItem>
                  <Button color="primary" variant="outlined" fullWidth>
                    Perfil
                  </Button>
                </MenuItem>
                <MenuItem>
                  <Button color="primary" variant="contained" fullWidth>
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
