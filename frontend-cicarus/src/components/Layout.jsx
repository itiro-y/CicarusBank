import { useLocation } from 'react-router-dom';
import { ChatProvider } from '../contexts/ChatContext';
import VoiceAssistant from './VoiceAssistant';

// This component wraps your pages and conditionally shows the assistant
const Layout = ({ children }) => {
    const location = useLocation();

    // Define the pages where the assistant should NOT appear
    const hideAssistantOnRoutes = ['/', '/login'];

    // Check if the current page is one of the restricted pages
    const shouldShowAssistant = !hideAssistantOnRoutes.includes(location.pathname);

    return (
        <ChatProvider>
            {children} {/* This will render the current page's element */}
            {shouldShowAssistant && <VoiceAssistant />}
        </ChatProvider>
    );
};

export default Layout;