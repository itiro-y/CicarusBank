import { useLocation } from 'react-router-dom';
import { ChatProvider } from '../contexts/ChatContext';
import VoiceAssistant from './VoiceAssistant';

const Layout = ({ children }) => {
    const location = useLocation();

    const hideAssistantOnRoutes = ['/', '/login'];

    const shouldShowAssistant = !hideAssistantOnRoutes.includes(location.pathname);

    return (
        <ChatProvider>
            {children}
            {shouldShowAssistant && <VoiceAssistant />}
        </ChatProvider>
    );
};

export default Layout;