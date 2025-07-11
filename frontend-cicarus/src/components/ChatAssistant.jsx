import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Paper, Box, Typography, TextField, IconButton, List, ListItem, Avatar, ListItemText, InputAdornment, keyframes
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';

// --- ANIMAÇÃO DOS PONTINHOS (Sem alterações) ---
const bounce = keyframes`
    0%, 80%, 100% {
        transform: scale(0);
    }
    40% {
        transform: scale(1.0);
    }
`;

const TypingIndicator = () => (
    <ListItem sx={{ justifyContent: 'flex-start', py: 1, px: 0 }}>
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            p: 1.5,
            borderRadius: '12px',
            bgcolor: 'rgba(255, 255, 255, 0.08)',
        }}>
            <Box
                component="span"
                sx={{
                    height: '8px',
                    width: '8px',
                    mx: '2px',
                    backgroundColor: 'grey.500',
                    borderRadius: '50%',
                    display: 'inline-block',
                    animation: `${bounce} 1.4s infinite ease-in-out both`,
                }}
            />
            <Box
                component="span"
                sx={{
                    height: '8px',
                    width: '8px',
                    mx: '2px',
                    backgroundColor: 'grey.500',
                    borderRadius: '50%',
                    display: 'inline-block',
                    animation: `${bounce} 1.4s infinite ease-in-out both`,
                    animationDelay: '0.2s',
                }}
            />
            <Box
                component="span"
                sx={{
                    height: '8px',
                    width: '8px',
                    mx: '2px',
                    backgroundColor: 'grey.500',
                    borderRadius: '50%',
                    display: 'inline-block',
                    animation: `${bounce} 1.4s infinite ease-in-out both`,
                    animationDelay: '0.4s',
                }}
            />
        </Box>
    </ListItem>
);


// --- ESTILOS (Sem alterações) ---
const widgetStyle = {
    p: 2,
    borderRadius: '16px',
    backgroundColor: '#282d34',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    display: 'flex',
    flexDirection: 'column',
    color: 'white',
    maxWidth: 400,
    mx: 'auto',
    height: 500,
};

// --- CÉREBRO DO BOT: AGORA COM IA ---
// A "knowledgeBase" e a função getBotResponse antigas foram removidas.
// Esta nova função assíncrona irá chamar o seu backend.
const getBotResponse = async (userMessage, chatHistory) => {
    try {
        const response = await fetch('http://localhost:3001/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: userMessage,
                history: chatHistory, // Enviamos o histórico para a IA ter contexto
            }),
        });

        if (!response.ok) {
            throw new Error(`A resposta da rede não foi OK: ${response.statusText}`);
        }

        const data = await response.json();
        // Esperamos que o backend retorne um objeto com a propriedade "response"
        return data.response;

    } catch (error) {
        console.error("Erro ao buscar resposta da IA:", error);
        return "Desculpe, estou com problemas para me conectar ao meu cérebro. Tente novamente mais tarde.";
    }
};


export default function ChatAssistant() {
    const [messages, setMessages] = React.useState([
        // A mensagem inicial foi atualizada para refletir a nova capacidade da IA
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
        // Adiciona a mensagem do utilizador ao estado imediatamente
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setNewMessage('');
        setIsTyping(true);

        // Prepara o histórico para enviar à IA (remove a mensagem inicial de boas-vindas)
        const chatHistory = newMessages.slice(1);

        // Chama a nossa nova função assíncrona para obter a resposta da IA
        const botResponseText = await getBotResponse(newMessage, chatHistory);
        const botMsg = { from: 'bot', text: botResponseText };

        setIsTyping(false);
        setMessages(prev => [...prev, botMsg]);

        // A lógica de navegação pode ser mantida ou adaptada.
        // O ideal é que a IA retorne uma resposta que inclua uma "intenção" de navegar.
        if (botResponseText.toLowerCase().includes("redirecionando para a secção de cartões")) {
            setTimeout(() => navigate('/dashboard'), 1500);
        }
        if (botResponseText.toLowerCase().includes("levá-lo para a sua página de perfil")) {
            setTimeout(() => navigate('/profile'), 1500);
        }
    };

    // --- RENDERIZAÇÃO DO COMPONENTE (Sem alterações) ---
    return (
        <Paper elevation={0} sx={widgetStyle}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, flexShrink: 0 }}>
                <Avatar sx={{ bgcolor: '#e46820', mr: 1.5 }}>
                    <SmartToyIcon />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Assistente Virtual
                </Typography>
            </Box>

            <List sx={{ flexGrow: 1, overflowY: 'auto', pr: 1 }}>
                {messages.map((msg, index) => (
                    <ListItem key={index} sx={{
                        justifyContent: msg.from === 'bot' ? 'flex-start' : 'flex-end',
                        p: 0,
                    }}>
                        <Box sx={{
                            maxWidth: '85%',
                            p: 1.5,
                            borderRadius: '12px',
                            bgcolor: msg.from === 'bot' ? 'rgba(255, 255, 255, 0.08)' : '#e46820',
                            color: 'white', // Corrigido para ser sempre branco para melhor contraste
                            my: 0.5,
                            whiteSpace: 'pre-wrap',
                        }}>
                            <ListItemText primary={msg.text} primaryTypographyProps={{fontSize: '0.9rem', lineHeight: 1.4}} />
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
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: 'rgba(17,16,16,0.8)',
                            borderRadius: '12px',
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