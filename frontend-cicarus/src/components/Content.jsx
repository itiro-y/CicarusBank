import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// Ícones do Material-UI mais adequados para um banco
import SavingsRoundedIcon from '@mui/icons-material/SavingsRounded';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import VerifiedUserRoundedIcon from '@mui/icons-material/VerifiedUserRounded';
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded';

// Conteúdo atualizado com as vantagens do CicarusBank
const items = [
    {
        icon: <VerifiedUserRoundedIcon sx={{ color: 'text.secondary' }} />,
        title: 'Segurança em Primeiro Lugar',
        description:
            'A sua segurança é a nossa prioridade. Usamos tecnologia de ponta para proteger os seus dados e transações.',
    },
    {
        icon: <AccountBalanceWalletRoundedIcon sx={{ color: 'text.secondary' }} />,
        title: 'Gestão Financeira Simplificada',
        description:
            'Aceda à sua conta, faça transferências e pague as suas contas de forma rápida e intuitiva, a qualquer hora e em qualquer lugar.',
    },
    {
        icon: <SavingsRoundedIcon sx={{ color: 'text.secondary' }} />,
        title: 'Condições Vantajosas',
        description:
            'Oferecemos taxas competitivas e produtos de poupança e investimento que fazem o seu dinheiro render mais.',
    },
    {
        icon: <SupportAgentRoundedIcon sx={{ color: 'text.secondary' }} />,
        title: 'Apoio ao Cliente Dedicado',
        description:
            'A nossa equipa de especialistas está sempre disponível para o ajudar a tomar as melhores decisões financeiras.',
    },
];

export default function Content() {
    return (
        <Stack
            sx={{
                flexDirection: 'column',
                alignSelf: 'center',
                gap: 4,
                maxWidth: 450
            }}
        >
            {/* O ícone Sitemark foi removido para um visual mais limpo */}
            {items.map((item, index) => (
                <Stack key={index} direction="row" sx={{ gap: 2, alignItems: 'center' }}>
                    <Box sx={{ color: 'primary.main' }}>
                        {item.icon}
                    </Box>
                    <div>
                        <Typography gutterBottom sx={{ fontWeight: 'medium', color: 'text.primary' }}>
                            {item.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {item.description}
                        </Typography>
                    </div>
                </Stack>
            ))}
        </Stack>
    );
}