import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Paper, Box, Typography, TextField, IconButton, List, ListItem, Avatar, ListItemText, InputAdornment, keyframes
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';

// --- ANIMAÇÃO E ESTILOS (Sem alterações) ---
const bounce = keyframes`
    0%, 80%, 100% { transform: scale(0); }
    40% { transform: scale(1.0); }
`;

const TypingIndicator = () => (
    <ListItem sx={{ justifyContent: 'flex-start', py: 1, px: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', p: 1.5, borderRadius: '12px', bgcolor: 'rgba(255, 255, 255, 0.08)' }}>
            <Box component="span" sx={{ height: '8px', width: '8px', mx: '2px', backgroundColor: 'grey.500', borderRadius: '50%', display: 'inline-block', animation: `${bounce} 1.4s infinite ease-in-out both` }}/>
            <Box component="span" sx={{ height: '8px', width: '8px', mx: '2px', backgroundColor: 'grey.500', borderRadius: '50%', display: 'inline-block', animation: `${bounce} 1.4s infinite ease-in-out both`, animationDelay: '0.2s' }}/>
            <Box component="span" sx={{ height: '8px', width: '8px', mx: '2px', backgroundColor: 'grey.500', borderRadius: '50%', display: 'inline-block', animation: `${bounce} 1.4s infinite ease-in-out both`, animationDelay: '0.4s' }}/>
        </Box>
    </ListItem>
);

const widgetStyle = {
    p: 2, borderRadius: '16px', backgroundColor: '#282d34', border: '1px solid rgba(255, 255, 255, 0.05)',
    display: 'flex', flexDirection: 'column', color: 'white', maxWidth: 400, mx: 'auto', height: 500,
};

// --- CÉREBRO DO BOT: CHAMADA À API ---
const getBotResponse = async (userMessage, chatHistory) => {
    try {
        const response = await fetch('http://localhost:3001/api/chat', {
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

    // ===== NOVA FUNÇÃO DE ENVIO COM LÓGICA DE NAVEGAÇÃO =====
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

        // 1. Procura pela tag de navegação [NAVIGATE_TO:/caminho]
        const navigateRegex = /\[NAVIGATE_TO:(.+?)\]/;
        const match = botResponseText.match(navigateRegex);

        // 2. Limpa a tag da mensagem para não a mostrar ao utilizador
        const cleanedResponseText = botResponseText.replace(navigateRegex, "").trim();
        const botMsg = { from: 'bot', text: cleanedResponseText };

        setIsTyping(false);
        setMessages(prev => [...prev, botMsg]);

        // 3. Se a tag foi encontrada, executa a navegação para o caminho extraído
        if (match && match[1]) {
            const path = match[1];
            console.log(`Navegação detetada! A redirecionar para: ${path}`);
            setTimeout(() => navigate(path), 1500); // Espera 1.5s antes de navegar
        }
    };
    // =============================================================

    return (
        <Paper elevation={0} sx={widgetStyle}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, flexShrink: 0 }}>
                <Avatar sx={{ bgcolor: '#e46820', mr: 1.5 }}><SmartToyIcon /></Avatar>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Assistente Virtual</Typography>
            </Box>
            <List sx={{ flexGrow: 1, overflowY: 'auto', pr: 1 }}>
                {messages.map((msg, index) => (
                    <ListItem key={index} sx={{ justifyContent: msg.from === 'bot' ? 'flex-start' : 'flex-end', p: 0 }}>
                        <Box sx={{ maxWidth: '85%', p: 1.5, borderRadius: '12px', bgcolor: msg.from === 'bot' ? 'rgba(255, 255, 255, 0.08)' : '#e46820', color: 'white', my: 0.5, whiteSpace: 'pre-wrap' }}>
                            <ListItemText primary={msg.text} primaryTypographyProps={{ fontSize: '0.9rem', lineHeight: 1.4 }} />
                        </Box>
                    </ListItem>
                ))}
                {isTyping && <TypingIndicator />}
                <div ref={messagesEndRef} />
            </List>
            <Box component="form" onSubmit={handleSendMessage} sx={{ mt: 2, flexShrink: 0 }}>
                <TextField
                    fullWidth variant="outlined" placeholder="Digite sua mensagem..." value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: 'rgba(17,16,16,0.8)', borderRadius: '12px',
                            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                            '&:hover fieldset': { borderColor: '#e46820' },
                        }
                    }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton type="submit" edge="end" sx={{ color: '#e46820' }} disabled={!newMessage.trim() || isTyping}>
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