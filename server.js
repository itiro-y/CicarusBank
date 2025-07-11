// Em: cicarus-backend/server.js
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = 3001;

// --- CONFIGURAÇÃO ---
app.use(cors());
app.use(express.json());

// ATENÇÃO: Coloque a sua chave de API aqui.
// O ideal é usar variáveis de ambiente (process.env.API_KEY)
const GEMINI_API_KEY = "AIzaSyCnZK-DHMhUk5JjGnVE_ZrRArOy2_mUjWA";
if (!GEMINI_API_KEY) {
    throw new Error("API Key não encontrada. Por favor, adicione a sua chave.");
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// --- ROTA DA API ---
app.post('/api/chat', async (req, res) => {
    try {
        const { message, history } = req.body;

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // O "prompt" é a instrução que damos à IA.
        // Aqui dizemos-lhe como se deve comportar.
        const prompt = `
            Você é a Cica, a assistente virtual do CicarusBank.
            Seja sempre amigável, prestativa e profissional.
            Responda de forma concisa e direta.

            **Contexto da Conversa:**
            ${history.map(msg => `${msg.from === 'user' ? 'Usuário' : 'Cica'}: ${msg.text}`).join('\n')}

            **Nova Pergunta do Usuário:**
            ${message}

            **Sua Resposta:**
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ response: text });

    } catch (error) {
        console.error("Erro no backend:", error);
        res.status(500).json({ response: "Ocorreu um erro no servidor." });
    }
});

app.listen(port, () => {
    console.log(`Servidor a rodar em http://localhost:${port}`);
});