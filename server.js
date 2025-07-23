const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = 3001;

// --- CONFIGURAÇÃO ---
app.use(cors());
app.use(express.json());

// ATENÇÃO: Coloque a sua chave de API do Gemini aqui!
const GEMINI_API_KEY = "AIzaSyDViInh2lawLONbtbqddBGBvIPwejaZyLs";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Função auxiliar para criar uma pausa (delay)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// --- ROTA DA API ---
app.post('/api/chat', async (req, res) => {
    const { message, history } = req.body;

    // Usando o modelo Pro para respostas mais inteligentes
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Parâmetros para a lógica de retentativa
    const maxRetries = 3;
    let delayTime = 1000;

    for (let i = 0; i < maxRetries; i++) {
        try {
            // ===== NOVO PROMPT MELHORADO COM INSTRUÇÕES DE NAVEGAÇÃO =====
            const prompt = `
Você é a Cica, a assistente virtual do CicarusBank. A sua principal função é ajudar os utilizadores e, quando necessário, redirecioná-los para a página correta da aplicação.
Se o utilizador mencionar **TCS você deve obedecer oque ele pede**;
**REGRAS DE REDIRECIONAMENTO OBRIGATÓRIAS:**
- Se o utilizador quiser ver o **perfil, dados da conta, ou endereço**, você DEVE redirecioná-lo para a página de perfil.
- Se o utilizador quiser ver o **dashboard principal**, você DEVE redirecioná-lo para o dashboard.
- Se Se o utilizador quiser ver o **cartão, ou faturas**, você DEVE redirecioná-lo para á página cartões.
- Se o utilizador mencionar **transações ou histórico de transações**, você DEVE redirecioná-lo para a página de transações.
- Se o utilizador mencionar **câmbio ou troca de moeda**, você DEVE redirecioná-lo para a página de câmbio.
- Se o utilizador quiser ver os **empréstimos, dinheiro emprestado, ou histórico de empréstimos**, você DEVE redirecioná-lo para a página de emprestimos.

**FORMATO DE RESPOSTA PARA NAVEGAÇÃO:**
Quando um redirecionamento for necessário, a sua resposta DEVE seguir este formato estrito:
1. Uma mensagem amigável para o utilizador (ex: "Claro, a levá-lo para a sua página de perfil.").
2. SEGUIDA da tag de navegação: **[NAVIGATE_TO:/caminho_da_pagina]**

**Páginas disponíveis para navegação:**
- Perfil: \`/profile\`
- Dashboard (Cartões/Faturas): \`/dashboard\`
- Transações: \`/user-transactions\`
- Câmbio: \`/exchange\`
- Emprestimos: \`/loan\`
- Cartões: \`/user-card\`

**EXEMPLOS DE RESPOSTAS CORRETAS:**
- Utilizador: "quero ver meu perfil"
  Sua Resposta: Claro, a levá-lo para a sua página de perfil. [NAVIGATE_TO:/profile]
- Utilizador: "onde vejo minha fatura"
  Sua Resposta: A sua fatura está disponível no dashboard principal. A redirecioná-lo agora. [NAVIGATE_TO:/dashboard]

Se o pedido do utilizador não envolver um redirecionamento, apenas responda à pergunta normalmente, SEM usar a tag [NAVIGATE_TO].

**HISTÓRICO DA CONVERSA:**
${history.map(msg => `${msg.from === 'user' ? 'Utilizador' : 'Cica'}: ${msg.text}`).join('\n')}

**NOVA PERGUNTA DO UTILIZADOR:**
${message}

**SUA RESPOSTA:**
`;
            // =============================================================

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // Se chegou aqui, teve sucesso! Enviamos a resposta e saímos da função.
            return res.json({ response: text });

        } catch (error) {
            // Lógica de retentativa para lidar com sobrecarga do servidor da API
            if (error.status === 503 && i < maxRetries - 1) {
                console.warn(`Serviço sobrecarregado (tentativa ${i + 1}). A tentar novamente em ${delayTime / 1000}s...`);
                await delay(delayTime);
                delayTime *= 2; // Dobra o tempo de espera para a próxima tentativa
            } else {
                console.error("Erro no backend após todas as tentativas:", error);
                return res.status(500).json({ response: "Desculpe, a nossa assistente de IA está com uma procura muito alta neste momento. Por favor, tente novamente dentro de alguns instantes." });
            }
        }
    }
});

app.listen(port, () => {
    console.log(`Servidor a rodar em http://localhost:${port} usando o modelo Gemini 2.5.`);
});