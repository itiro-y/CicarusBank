import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const VoiceAssistant = () => {
    const [isListening, setIsListening] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [history, setHistory] = useState([]);
    const navigate = useNavigate();

    const processAICommand = async (text) => {
        setIsProcessing(true);
        try {
            const response = await fetch('http://localhost:3001/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: text,
                    history: history,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.response || 'Erro ao se comunicar com a assistente.');
            }

            const data = await response.json();
            const aiResponse = data.response;

            setHistory(prev => [
                ...prev,
                { from: 'user', text: text },
                { from: 'Cica', text: aiResponse }
            ]);

            handleAIResponse(aiResponse);

        } catch (error) {
            console.error("Erro ao chamar a API da IA:", error);
            speak(`Desculpe, ocorreu um erro de comunicação. ${error.message}`);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleAIResponse = (response) => {
        const navigateRegex = /\[NAVIGATE_TO:(.+?)\]/;
        const match = response.match(navigateRegex);
        const textToSpeak = response.replace(navigateRegex, '').trim();

        if (match && match[1]) {
            const route = match[1];
            speakAndNavigate(textToSpeak, route);
        } else {
            speak(textToSpeak);
        }
    };

    useEffect(() => {
        if (!('webkitSpeechRecognition' in window)) {
            console.error("API de Reconhecimento de Fala não é suportada.");
            return;
        }

        const recognition = new window.webkitSpeechRecognition();
        recognition.lang = 'pt-BR';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = (event) => console.error('Erro de reconhecimento:', event.error);
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript.trim().toLowerCase();
            if (transcript) {
                processAICommand(transcript);
            }
        };

        window.recognition = recognition;
    }, [history]);

    const speakAndNavigate = (text, route) => {
        speak(text, () => navigate(route));
    };

    const speak = (text, onEndCallback) => {
        if (!('speechSynthesis' in window) || !text) {
            if (onEndCallback) onEndCallback();
            return;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pt-BR';

        let voices = window.speechSynthesis.getVoices();
        if (voices.length === 0) {
            window.speechSynthesis.onvoiceschanged = () => {
                voices = window.speechSynthesis.getVoices();
                setVoice(utterance, voices, onEndCallback);
            };
        } else {
            setVoice(utterance, voices, onEndCallback);
        }
    };

    const setVoice = (utterance, voices, onEndCallback) => {
        const femaleVoiceNames = [
            'Microsoft Maria Desktop - Portuguese (Brazil)',
            'Luciana',
            'Google português do Brasil',
            'Fernanda',
            'Camila',
            'Female'
        ];

        let selectedVoice = voices.find(voice =>
            voice.lang === 'pt-BR' &&
            femaleVoiceNames.some(name => voice.name.includes(name))
        );

        if (!selectedVoice) {
            selectedVoice = voices.find(voice => voice.lang === 'pt-BR');
        }

        utterance.voice = selectedVoice;

        utterance.onend = () => {
            if (onEndCallback) onEndCallback();
        };

        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
    }

    const toggleListen = () => {
        if (isListening || isProcessing) {
            window.recognition.stop();
        } else {
            window.recognition.start();
        }
    };

    const assistantStyle = {
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        zIndex: 1000,
    };

    const buttonStyle = {
        // --- LINHA MODIFICADA ---
        backgroundColor: isListening ? '#d9534f' : (isProcessing ? '#f0ad4e' : '#f57c00'), // Azul trocado por Laranja (#f57c00)
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        width: '60px',
        height: '60px',
        fontSize: '24px',
        cursor: isProcessing ? 'wait' : 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        transition: 'background-color 0.3s',
    };

    return (
        <div style={assistantStyle}>
            <button onClick={toggleListen} style={buttonStyle} disabled={isProcessing} aria-label="Assistente de Voz">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z"/>
                    <path d="M8 8a3 3 0 0 0 3-3V3a3 3 0 0 0-6 0v2a3 3 0 0 0 3 3z"/>
                </svg>
            </button>
        </div>
    );
};

export default VoiceAssistant;