import * as React from 'react';
import { Box, CssBaseline, Stack } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

import AppTheme from '../theme/AppTheme.jsx';
import Content from '../components/Content.jsx';
import SignInCard from '../components/SignInCard.jsx';
import SignUpCard from '../components/SignUpCard.jsx';
import ColorModeIconDropdown from '../theme/ColorModeIconDropdown.jsx';

export default function SignInPage() {
    const [showSignUp, setShowSignUp] = React.useState(false);

    const handleSwitchToSignUp = () => setShowSignUp(true);
    const handleSwitchToSignIn = () => setShowSignUp(false);

    const flipVariants = {
        hidden: { rotateY: -180, opacity: 0, scale: 0.9 },
        visible: { rotateY: 0, opacity: 1, scale: 1 },
        exit: { rotateY: 180, opacity: 0, scale: 0.9 }
    };

    return (
        <AppTheme>
            <CssBaseline />
            <Box sx={{ position: 'relative', minHeight: '100vh' }}>
                <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}>
                    <ColorModeIconDropdown />
                </Box>

                <Stack direction={{ xs: 'column', md: 'row' }} sx={{ minHeight: '100vh' }}>
                    <Stack
                        sx={{
                            width: { xs: '100%', md: '50%' },
                            backgroundColor: 'background.default',
                            justifyContent: 'center',
                            alignItems: 'center',
                            p: 4
                        }}
                    >
                        <Content />
                    </Stack>
                    <Stack
                        component="main"
                        sx={{
                            width: { xs: '100%', md: '50%' },
                            justifyContent: 'center',
                            alignItems: 'center',
                            p: 4,
                            perspective: '1200px',
                            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://i.ibb.co/mV0HpH6Z/Whisk-72734a80a8.jpg')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={showSignUp ? 'signup' : 'signin'}
                                variants={flipVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                transition={{ duration: 0.6, ease: 'easeInOut' }}
                            >
                                {showSignUp ? (
                                    <SignUpCard onSwitchToSignIn={handleSwitchToSignIn} />
                                ) : (
                                    <SignInCard onSwitchToSignUp={handleSwitchToSignUp} />
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </Stack>
                </Stack>
            </Box>
        </AppTheme>
    );
}