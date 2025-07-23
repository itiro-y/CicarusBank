import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Paper, Box, Typography, TextField, IconButton, List, ListItem, Avatar, ListItemText, InputAdornment, keyframes, useTheme
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';

const bounce = keyframes`
    0%, 80%, 100% { transform: scale(0); }
    40% { transform: scale(1.0); }
`;

const TypingIndicator = () => (
    <ListItem sx={{ justifyContent: 'flex-start', py: 1, px: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', p: 1.5, borderRadius: '12px', bgcolor: 'action.hover' }}>
            <Box component="span" sx={{ height: '8px', width: '8px', mx: '2px', backgroundColor: 'grey.500', borderRadius: '50%', display: 'inline-block', animation: `${bounce} 1.4s infinite ease-in-out both` }}/>
            <Box component="span" sx={{ height: '8px', width: '8px', mx: '2px', backgroundColor: 'grey.500', borderRadius: '50%', display: 'inline-block', animation: `${bounce} 1.4s infinite ease-in-out both`, animationDelay: '0.2s' }}/>
            <Box component="span" sx={{ height: '8px', width: '8px', mx: '2px', backgroundColor: 'grey.500', borderRadius: '50%', display: 'inline-block', animation: `${bounce} 1.4s infinite ease-in-out both`, animationDelay: '0.4s' }}/>
        </Box>
    </ListItem>
);

const getBotResponse = async (userMessage, chatHistory) => {
    try {
        const response = await fetch('http://172.203.234.78:3001/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userMessage, history: chatHistory }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.response || `A resposta da rede não foi OK: ${response.statusText}`);
        }
        const data = await response.json();
        return data.response;
    } catch (error) {
        console.error("Erro ao buscar resposta da IA:", error);
        return error.message || "Desculpe, estou com problemas para me conectar. Tente novamente mais tarde.";
    }
};

export default function ChatAssistant() {
    const theme = useTheme();
    const [messages, setMessages] = React.useState([
        { from: 'bot', text: 'Olá! Sou a Cica, a sua assistente virtual com IA. Como posso ajudar?' },
    ]);
    const [newMessage, setNewMessage] = React.useState('');
    const [isTyping, setIsTyping] = React.useState(false);
    const messagesEndRef = React.useRef(null);
    const navigate = useNavigate();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    React.useEffect(scrollToBottom, [messages, isTyping]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (newMessage.trim() === '' || isTyping) return;

        const userMsg = { from: 'user', text: newMessage };
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setNewMessage('');
        setIsTyping(true);

        const chatHistory = newMessages.slice(1);
        const botResponseText = await getBotResponse(newMessage, chatHistory);

        const navigateRegex = /\[NAVIGATE_TO:(.+?)\]/;
        const match = botResponseText.match(navigateRegex);

        const cleanedResponseText = botResponseText.replace(navigateRegex, "").trim();
        const botMsg = { from: 'bot', text: cleanedResponseText };

        setIsTyping(false);
        setMessages(prev => [...prev, botMsg]);

        if (match && match[1]) {
            const path = match[1];
            console.log(`Navegação detetada! A redirecionar para: ${path}`);
            setTimeout(() => navigate(path), 1500);
        }
    };

    return (
        <Paper
            elevation={0}
            sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 500,
                width: '100%',
                maxWidth: 400,
                mx: 'auto',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: '16px',
                backgroundColor: 'background.paper'
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, flexShrink: 0 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 1.5 }}><SmartToyIcon /></Avatar>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Assistente Virtual</Typography>
            </Box>
            <List sx={{ flexGrow: 1, overflowY: 'auto', pr: 1 }}>
                {messages.map((msg, index) => (
                    <ListItem key={index} sx={{ justifyContent: msg.from === 'bot' ? 'flex-start' : 'flex-end', p: 0 }}>
                        <Box
                            sx={{
                                maxWidth: '85%',
                                p: 1.5,
                                borderRadius: '12px',
                                bgcolor: msg.from === 'bot' ? 'action.hover' : 'primary.main',
                                color: msg.from === 'bot' ? 'text.primary' : 'primary.contrastText',
                                my: 0.5,
                                whiteSpace: 'pre-wrap'
                            }}
                        >
                            <ListItemText primary={msg.text} primaryTypographyProps={{ fontSize: '0.9rem', lineHeight: 1.4 }} />
                        </Box>
                    </ListItem>
                ))}
                {isTyping && <TypingIndicator />}
                <div ref={messagesEndRef} />
            </List>
            <Box component="form" onSubmit={handleSendMessage} sx={{ mt: 2, flexShrink: 0 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Digite sua mensagem..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton type="submit" edge="end" color="primary" disabled={!newMessage.trim() || isTyping}>
                                    <SendIcon />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>
        </Paper>
    );
}