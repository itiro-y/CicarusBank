import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Paper, Box, Typography, TextField, IconButton, List, ListItem, Avatar, ListItemText, InputAdornment, keyframes
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';

// --- ANIMAÇÃO DOS PONTINHOS ---
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


// --- ESTILOS ---
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
    height: 500, // Altura fixa para o componente
};

// --- CÉREBRO DO BOT: Base de Conhecimento (mantido da versão anterior) ---
const knowledgeBase = [
    {
        keywords: ['cartão', 'cartao', 'meu cartão'],
        response: (navigate) => {
            setTimeout(() => navigate('/dashboard'), 2000);
            return 'Claro! A redirecioná-lo para a secção de cartões...';
        },
    },
    {
        keywords: ['fatura', 'faturas', 'conta'],
        response: (navigate) => {
            setTimeout(() => navigate('/dashboard'), 2000);
            return 'Entendido. A verificar as suas faturas agora mesmo...';
        },
    },
    {
        keywords: ['perfil', 'meus dados', 'minha conta', 'endereço'],
        response: (navigate) => {
            setTimeout(() => navigate('/profile'), 2000);
            return 'A levá-lo para a sua página de perfil para que possa ver ou atualizar os seus dados.';
        },
    },
    {
        keywords: ['problema', 'ajuda', 'dificuldade', 'não consigo', 'erro', 'socorro'],
        response: (message) => {
            if (message.includes('cartão') || message.includes('cartao')) {
                return `Lamento que esteja com problemas no seu cartão. Sugestões:\n- Verifique se o cartão está bloqueado na opção 'Bloquear Cartão'.\n- Confirme se o seu limite de crédito não foi excedido.\nSe o problema persistir, por favor, envie um email detalhado para cicarusbank@gmail.com.`;
            }
            if (message.includes('fatura')) {
                return `Percebo. Se o problema é com a fatura, tente:\n- Aceda à opção 'Ver Fatura' para garantir que os lançamentos estão corretos.\n- Verifique se o pagamento da fatura anterior já foi processado.\nCaso não resolva, contacte-nos através do email cicarusbank@gmail.com.`;
            }
            if (message.includes('acesso') || message.includes('entrar') || message.includes('senha')) {
                return `Se está com problemas de acesso, tente redefinir a sua senha na página de login. Por segurança, nunca partilhe a sua senha. Se suspeita de fraude, contacte imediatamente o nosso suporte em cicarusbank@gmail.com.`;
            }
            return `Como posso ajudar? Descreva o seu problema para que eu possa encontrar a melhor solução. Se preferir, pode contactar diretamente o nosso suporte em cicarusbank@gmail.com.`;
        },
    },
    {
        keywords: ['limite', 'aumentar limite'],
        response: `Pode consultar e solicitar um ajuste do seu limite na secção 'Meu Cartão', clicando em 'Ajustar Limite'. A análise é feita em poucos minutos.`,
    },
    {
        keywords: ['pix', 'chave pix'],
        response: `As suas chaves Pix podem ser geridas na secção 'Pix'. Lá pode criar novas chaves ou ver as existentes. Para fazer uma transferência, vá em 'Ações Rápidas' > 'Pix'.`,
    },
    {
        keywords: ['roubado', 'perdi meu cartão', 'furto'],
        response: `Lamento muito por isso. Bloqueie o seu cartão imediatamente na opção 'Bloquear Cartão'. Em seguida, entre em contacto com o nosso suporte pelo email cicarusbank@gmail.com para emitirmos uma segunda via.`,
    },
    {
        keywords: ['obrigado', 'obg', 'valeu'],
        response: 'De nada! Se precisar de mais alguma coisa, é só chamar. 😊',
    },
    {
        keywords: ['olá', 'oi', 'bom dia', 'boa tarde', 'boa noite'],
        response: 'Olá! Como posso ser útil hoje?',
    },
];

const getBotResponse = (userMessage, navigate) => {
    const message = userMessage.toLowerCase();
    for (const intent of knowledgeBase) {
        const match = intent.keywords.some(keyword => message.includes(keyword));
        if (match) {
            if (typeof intent.response === 'function') {
                return intent.response(navigate, message);
            }
            return intent.response;
        }
    }
    return "Desculpe, não entendi muito bem. Pode tentar reformular? Pode perguntar sobre 'faturas', 'problema no cartão' ou 'aumentar limite'.";
};


export default function ChatAssistant() {
    const [messages, setMessages] = React.useState([
        { from: 'bot', text: 'Olá! Sou a Cica, sua assistente virtual. Em que posso ajudar?' },
    ]);
    const [newMessage, setNewMessage] = React.useState('');
    const [isTyping, setIsTyping] = React.useState(false); // 1. NOVO ESTADO
    const messagesEndRef = React.useRef(null);
    const navigate = useNavigate();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    React.useEffect(scrollToBottom, [messages, isTyping]); // Adicionado isTyping para scrollar quando a animação aparecer

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim() === '' || isTyping) return;

        const userMsg = { from: 'user', text: newMessage };
        setMessages(prev => [...prev, userMsg]);
        setNewMessage('');
        setIsTyping(true); // 2. ATIVAR ANIMAÇÃO

        // Simula o tempo de resposta do bot
        setTimeout(() => {
            const botResponseText = getBotResponse(newMessage, navigate);
            const botMsg = { from: 'bot', text: botResponseText };

            setIsTyping(false); // 3. DESATIVAR ANIMAÇÃO
            setMessages(prev => [...prev, botMsg]);
        }, 2000); // Aumentei o tempo para a animação ser mais visível
    };

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
                            color: msg.from === 'bot' ? 'text.primary' : 'white',
                            my: 0.5,
                            whiteSpace: 'pre-wrap',
                        }}>
                            <ListItemText primary={msg.text} primaryTypographyProps={{fontSize: '0.9rem', lineHeight: 1.4}} />
                        </Box>
                    </ListItem>
                ))}

                {/* 4. RENDERIZAR ANIMAÇÃO CONDICIONALMENTE */}
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
                                <IconButton type="submit" edge="end" sx={{ color: '#e46820' }} disabled={isTyping}>
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