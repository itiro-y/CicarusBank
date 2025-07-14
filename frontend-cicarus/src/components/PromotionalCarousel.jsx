import React from 'react';
import Slider from 'react-slick';
import { Paper, Box, Typography, Button, useTheme } from '@mui/material';
import { TrendingUp, Security, House } from '@mui/icons-material';

// --- COMPONENTE DO CARROSSEL ---
export default function PromotionalCarousel() {
    const theme = useTheme(); // 1. Acessar o tema

    // 2. Definir os itens do carrossel dentro do componente para acessar o tema
    const carouselItems = [
        {
            icon: <TrendingUp sx={{ fontSize: 40, color: 'primary.main' }} />, // Cor do ícone usa a cor primária
            title: 'Investimentos com Retorno Acima da Média',
            description: 'Faça seu dinheiro trabalhar por você. Conheça nossos fundos de investimento com assessoria especializada e rentabilidade competitiva.',
            image: 'https://i.postimg.cc/L5nKvcWQ/7dfab5c1-8a75-4a2f-bfee-49f81bf985c4.jpg',
            buttonText: 'Conhecer Fundos'
        },
        {
            icon: <House sx={{ fontSize: 40, color: 'primary.main' }} />, // Cor do ícone usa a cor primária
            title: 'O Sonho da Casa Própria mais Perto de Você',
            description: 'Oferecemos as melhores taxas e condições para o seu financiamento imobiliário. Realize seu sonho com a segurança do CicarusBank.',
            image: 'https://i.postimg.cc/4NZrFh9R/14bcbf74-1ca1-4f50-ac3d-58bf3b90140e.jpg',
            buttonText: 'Simular Financiamento'
        },
        {
            icon: <Security sx={{ fontSize: 40, color: 'primary.main' }} />, // Cor do ícone usa a cor primária
            title: 'Proteja o que é Importante com Nossos Seguros',
            description: 'Seguro de vida, residencial e automotivo com a cobertura que você precisa e a tranquilidade que sua família merece.',
            image: 'https://i.postimg.cc/3xz1VPc0/31060b73-d7fc-424f-b4f1-7409a41e1ea8.jpg',
            buttonText: 'Ver Opções de Seguro'
        }
    ];

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: false,
        dotsClass: "slick-dots slick-thumb",
    };

    return (
        // 3. Aplicar estilos dinâmicos ao Paper, removendo o widgetStyle
        <Paper
            elevation={0}
            sx={{
                borderRadius: '16px',
                backgroundColor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                overflow: 'hidden',
            }}
        >
            <Slider {...settings}>
                {carouselItems.map((item, index) => (
                    <Box key={index} sx={{ position: 'relative', width: '100%', height: '300px' }}>
                        <img
                            src={item.image}
                            alt={item.title}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                borderRadius: '16px', // Ajustado para corresponder ao Paper
                            }}
                        />
                        <Box sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            p: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'flex-start',
                            color: 'white', // Texto branco é mantido para contraste com o gradiente
                            // Gradiente mantido para garantir a legibilidade do texto sobre a imagem
                            background: 'linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 70%)',
                            borderRadius: '16px', // Ajustado para corresponder ao Paper
                        }}>
                            {item.icon}
                            <Typography variant="h5" sx={{ fontWeight: 'bold', my: 1, textShadow: '1px 1px 3px rgba(0,0,0,0.7)' }}>
                                {item.title}
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'grey.200', mb: 2, maxWidth: '60%', textShadow: '1px 1px 3px rgba(0,0,0,0.7)' }}>
                                {item.description}
                            </Typography>
                            {/* 4. Botão agora usa a cor primária do tema */}
                            <Button variant="contained" color="primary">
                                {item.buttonText}
                            </Button>
                        </Box>
                    </Box>
                ))}
            </Slider>
        </Paper>
    );
}