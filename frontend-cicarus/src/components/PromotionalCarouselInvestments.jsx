import React from 'react';
import Slider from 'react-slick';
import { Paper, Box, Typography, Button, useTheme } from '@mui/material';
import { ShowChart, AccountBalanceWallet, PieChart } from '@mui/icons-material';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default function InvestmentCarouselInvestments() {
    const theme = useTheme();

    // Define carousel items for investments
    const carouselItems = [
        {
            icon: <AccountBalanceWallet sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
            title: 'Renda Fixa',
            description: 'Invista em títulos públicos e privados, garantindo retornos estáveis e proteção contra a volatilidade.',
            image: '/images/banner_rendafixa.jpg',
            buttonText: 'Explorar Opções'
        },
        {
            icon: <ShowChart sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
            title: 'Ações',
            description: 'Invista em empresas de alto crescimento na bolsa e potencialize seus ganhos no mercado acionário.',
            image: '/images/banner_acoes.jpg',
            buttonText: 'Ver Detalhes'
        },
        {
            icon: <HomeWorkIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
            title: 'Fundo Imobiliário',
            description: 'Receba rendimentos periódicos de aluguéis investindo em imóveis de forma prática e acessível.',
            image: '/images/banner_fundo.png',
            buttonText: 'Saiba Mais'
        },
        {
            icon: <CurrencyBitcoinIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
            title: 'Criptomoeda',
            description: 'Participe do mercado de ativos digitais como Bitcoin e Ethereum, buscando valorização e inovação.',
            image: '/images/banner_crypto2.jpg',
            buttonText: 'Saiba Mais'
        }
    ];

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        arrows: false,
        dotsClass: 'slick-dots slick-thumb',
    };

    return (
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
                    <Box key={index} sx={{ position: 'relative', width: '100%', height: 350 }}>
                        <img
                            src={item.image}
                            alt={item.title}
                            style={{
                                width: '100%',
                                height: '130%',
                                objectFit: 'cover',
                            }}
                        />
                        <Box
                            sx={{
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
                                background: 'linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 70%)',
                            }}
                        >
                            {item.icon}
                            <Typography
                                variant="h5"
                                sx={{ fontWeight: 'bold', my: 1, textShadow: '1px 1px 3px rgba(0,0,0,0.7)' }}
                            >
                                {item.title}
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{ color: 'grey.200', mb: 2, maxWidth: '60%', textShadow: '1px 1px 3px rgba(0,0,0,0.7)' }}
                            >
                                {item.description}
                            </Typography>
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
