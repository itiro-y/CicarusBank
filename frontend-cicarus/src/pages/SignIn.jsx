import * as React from 'react';
import { Box, CssBaseline, Stack } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

import AppTheme from '../theme/AppTheme.jsx';
import Content from '../components/Content.jsx';
import SignInCard from '../components/SignInCard.jsx';
import SignUpCard from '../components/SignUpCard.jsx';

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
            <Stack direction={{ xs: 'column', md: 'row' }} sx={{ minHeight: '100vh' }}>
                <Stack sx={{ width: { xs: '100%', md: '50%' }, backgroundColor: '#111010', justifyContent: 'center', alignItems: 'center', p: 4 }}>
                    <Content />
                </Stack>
                {/* ESTE STACK NÃO É MAIS UM FORMULÁRIO. ELE APENAS EXIBE O CARD CORRETO. */}
                <Stack
                    component="main"
                    sx={{ width: { xs: '100%', md: '50%' }, backgroundColor: '#282d34', justifyContent: 'center', alignItems: 'center', p: 4, perspective: '1200px' }}
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
        </AppTheme>
    );
}