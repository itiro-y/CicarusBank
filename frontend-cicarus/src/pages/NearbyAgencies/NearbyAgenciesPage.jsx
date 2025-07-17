import * as React from 'react';
import { Box, Container, Typography, Paper, useTheme, Card, CardMedia, CardContent } from '@mui/material';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import AppAppBar from '../../components/AppAppBar.jsx';

const Maps_API_KEY = "AIzaSyDQYOUaVv3zqjsRAn7A_2A5B3rJ22JHV7E";

const agencies = [
    {
        id: 1,
        name: 'Cicarus Bank - Agência Centro',
        position: { lat: -23.3106, lng: -51.1696 },
        image: 'https://i.postimg.cc/bYCXGhzt/72487666-8dcd-4c45-8aca-62631987338f.jpg'
    },
    {
        id: 2,
        name: 'Cicarus Bank - Agência Gleba Palhano',
        position: { lat: -23.3325, lng: -51.1923 },
        image: 'https://i.postimg.cc/x8q4GX0b/73582920-7989-4403-811d-f3abd00ebe5c.jpg'
    },
    {
        id: 3,
        name: 'Cicarus Bank - Agência Aeroporto',
        position: { lat: -23.3338, lng: -51.1442 },
        image: 'https://i.postimg.cc/jdw1Lngp/58b942cb-c6c7-462e-81c4-ff76db51d62b.jpg'
    }
];

const darkMapStyle = [
    { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
    { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
    { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
    { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#263c3f' }] },
    { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#6b9a76' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#38414e' }] },
    { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#212a37' }] },
    { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#9ca5b3' }] },
    { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#746855' }] },
    { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#1f2835' }] },
    { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#f3d19c' }] },
    { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#2f3948' }] },
    { featureType: 'transit.station', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#17263c' }] },
    { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#515c6d' }] },
    { featureType: 'water', elementType: 'labels.text.stroke', stylers: [{ color: '#17263c' }] }
];


export default function NearbyAgenciesPage() {
    const theme = useTheme();
    const [activeMarker, setActiveMarker] = React.useState(null);

    const handleMouseOver = (markerId) => {
        setActiveMarker(markerId);
    };

    const handleMouseOut = () => {
        setActiveMarker(null);
    };

    return (
        <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: 'background.default' }}>
            <AppAppBar />
            <Container maxWidth="xl" sx={{ pt: '120px', pb: 4 }}>
                <Typography variant="h4" gutterBottom sx={{ color: 'text.primary' }}>
                    Agências Próximas
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
                    Encontre a agência Cicarus Bank mais perto de você. Passe o mouse sobre um marcador para ver a foto.
                </Typography>

                <Paper elevation={0} sx={{ height: '70vh', width: '100%', borderRadius: '18px', overflow: 'hidden', backgroundColor: 'background.paper', p: 1 }}>
                    <LoadScript googleMapsApiKey={Maps_API_KEY}>
                        <GoogleMap
                            mapContainerStyle={{ width: '100%', height: '100%', borderRadius: '16px' }}
                            center={{ lat: -23.325, lng: -51.17 }}
                            zoom={13}
                            options={{
                                streetViewControl: false,
                                mapTypeControl: false,
                                fullscreenControl: false,
                                styles: theme.palette.mode === 'dark' ? darkMapStyle : []
                            }}
                        >
                            {agencies.map((agency) => (
                                <Marker
                                    key={agency.id}
                                    position={agency.position}
                                    onMouseOver={() => handleMouseOver(agency.id)}
                                    onMouseOut={handleMouseOut}
                                >
                                    {activeMarker === agency.id && (
                                        <InfoWindow
                                            onCloseClick={handleMouseOut}
                                            // AQUI ESTÁ A CORREÇÃO
                                            options={{ disableAutoPan: true }}
                                        >
                                            <Card sx={{ maxWidth: 280, p: 0, boxShadow: 'lg', border: '1px solid', borderColor: 'divider' }}>
                                                <CardMedia
                                                    component="img"
                                                    height="160"
                                                    image={agency.image}
                                                    alt={agency.name}
                                                />
                                                <CardContent>
                                                    <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                                                        {agency.name}
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </InfoWindow>
                                    )}
                                </Marker>
                            ))}
                        </GoogleMap>
                    </LoadScript>
                </Paper>
            </Container>
        </Box>
    );
}