import React from 'react';
import Slider from 'react-slick';
import { Paper, Box, Typography, Button } from '@mui/material';
import { TrendingUp, Security, House } from '@mui/icons-material';

// --- DADOS MOCK PARA O CARROSSEL ---
const carouselItems = [
    {
        icon: <TrendingUp sx={{ fontSize: 40, color: '#e46820' }} />,
        title: 'Investimentos com Retorno Acima da Média',
        description: 'Faça seu dinheiro trabalhar por você. Conheça nossos fundos de investimento com assessoria especializada e rentabilidade competitiva.',
        image: 'https://i.postimg.cc/L5nKvcWQ/7dfab5c1-8a75-4a2f-bfee-49f81bf985c4.jpg',
        buttonText: 'Conhecer Fundos'
    },
    {
        icon: <House sx={{ fontSize: 40, color: '#e46820' }} />,
        title: 'O Sonho da Casa Própria mais Perto de Você',
        description: 'Oferecemos as melhores taxas e condições para o seu financiamento imobiliário. Realize seu sonho com a segurança do CicarusBank.',
        image: 'https://i.postimg.cc/4NZrFh9R/14bcbf74-1ca1-4f50-ac3d-58bf3b90140e.jpg',
        buttonText: 'Simular Financiamento'
    },
    {
        icon: <Security sx={{ fontSize: 40, color: '#e46820' }} />,
        title: 'Proteja o que é Importante com Nossos Seguros',
        description: 'Seguro de vida, residencial e automotivo com a cobertura que você precisa e a tranquilidade que sua família merece.',
        image: 'https://i.postimg.cc/3xz1VPc0/31060b73-d7fc-424f-b4f1-7409a41e1ea8.jpg',
        buttonText: 'Ver Opções de Seguro'
    }
];

// --- ESTILO PADRÃO PARA O WIDGET ---
const widgetStyle = {
    borderRadius: '16px',
    backgroundColor: '#282d34',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    color: 'white',
    overflow: 'hidden',
};

export default function PromotionalCarousel() {
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
        <Paper elevation={0} sx={widgetStyle}>
            <Slider {...settings}>
                {carouselItems.map((item, index) => (
                    <Box key={index} sx={{ position: 'relative', width: '100%', height: '300px', backgroundColor: 'black' }}>
                        <img
                            src={item.image}
                            alt={item.title}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover', // ALTERAÇÃO: Garante que a imagem inteira seja exibida
                                borderRadius: '12px',
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
                            color: 'white',
                            // ALTERAÇÃO: Gradiente para garantir legibilidade do texto
                            background: 'linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 70%)',
                            borderRadius: '12px',
                        }}>
                            {item.icon}
                            <Typography variant="h5" sx={{ fontWeight: 'bold', my: 1, textShadow: '1px 1px 3px rgba(0,0,0,0.7)' }}>
                                {item.title}
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'grey.200', mb: 2, maxWidth: '60%', textShadow: '1px 1px 3px rgba(0,0,0,0.7)' }}>
                                {item.description}
                            </Typography>
                            <Button variant="contained" sx={{ backgroundColor: '#e46820', '&:hover': { backgroundColor: '#d15e1c' } }}>
                                {item.buttonText}
                            </Button>
                        </Box>
                    </Box>
                ))}
            </Slider>
        </Paper>
    );
}