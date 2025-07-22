const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = "AIzaSyDViInh2lawLONbtbqddBGBvIPwejaZyLs";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

app.post('/api/chat', async (req, res) => {
    const { message, history } = req.body;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const currentDate = new Date().toLocaleString('pt-BR', { dateStyle: 'full', timeStyle: 'short', timeZone: 'America/Sao_Paulo' });

    const maxRetries = 3;
    let delayTime = 1000;

    for (let i = 0; i < maxRetries; i++) {
        try {
            const prompt = `
Você é a Cica, a assistente virtual do CicarusBank. A sua principal função é ajudar os utilizadores e, quando necessário, redirecioná-los para a página correta da aplicação.

**Contexto Atual OBRIGATÓRIO:** A data e hora atuais são: ${currentDate}. Baseie todas as respostas que envolvam tempo nesta informação.

**REGRAS DE REDIRECIONAMENTO OBRIGATÓRIAS:**
- Se o utilizador quiser ver o **perfil, dados da conta, endereço ou dispositivos conectados**, você DEVE redirecioná-lo para a página de perfil ou uma sub-página.
- Se o utilizador quiser ver o **dashboard principal ou a página inicial**, você DEVE redirecioná-lo para o dashboard.
- Se o utilizador quiser ver o **cartão, faturas, limite do cartão ou criar um cartão virtual**, você DEVE redirecioná-lo para a página de cartões apropriada.
- Se o utilizador mencionar **transações ou histórico de transações**, você DEVE redirecioná-lo para a página de transações.
- Se o utilizador mencionar **câmbio ou troca de moeda**, você DEVE redirecioná-lo para a página de câmbio.
- Se o utilizador quiser ver os **empréstimos, simular empréstimo, ou histórico de empréstimos**, você DEVE redirecioná-lo para a página de empréstimos.
- Se o utilizador perguntar sobre **PIX, transferências PIX**, redirecione para a página PIX.
- Se o utilizador quiser fazer **recarga de telemóvel**, redirecione para a página de recarga.
- Se o utilizador quiser **pagar contas ou boletos**, redirecione para a página de pagamentos.
- Se o utilizador perguntar sobre **benefícios ou vantagens**, redirecione para a página de benefícios.
- Se o utilizador quiser ver seus **investimentos (geral, criptomoedas)**, redirecione para a página de investimentos.
- Se o utilizador perguntar sobre **agências próximas**, redirecione para a página de agências.

**FORMATO DE RESPOSTA PARA NAVEGAÇÃO:**
Quando um redirecionamento for necessário, a sua resposta DEVE seguir este formato estrito:
1. Uma mensagem amigável para o utilizador (ex: "Claro, a levá-lo para a sua página de perfil.").
2. SEGUIDA da tag de navegação: **[NAVIGATE_TO:/caminho_da_pagina]**

**Páginas disponíveis para navegação:**
- Perfil: \`/profile\`
- Dashboard: \`/dashboard\`
- Transações: \`/user-transactions\`
- Câmbio: \`/exchange\`
- Empréstimos (Simulação): \`/loan\`
- Acompanhar Empréstimos: \`/loan-tracking\`
- Cartões: \`/user-card\`
- Limite do Cartão: \`/card-limit\`
- Criar Cartão Virtual: \`/virtual-card\`
- PIX: \`/pix\`
- Recarga de Telemóvel: \`/recharge\`
- Pagamento de Contas: \`/payment\`
- Benefícios: \`/benefits\`
- Investimentos: \`/user-investments\`
- Investimentos em Cripto: \`/investments/criptomoeda\`
- Dispositivos Conectados: \`/connected-devices\`
- Agências Próximas: \`/agencias\`

**EXEMPLOS DE RESPOSTAS CORRETAS:**
- Utilizador: "quero ver meu perfil"
  Sua Resposta: Claro, a levá-lo para a sua página de perfil. [NAVIGATE_TO:/profile]
- Utilizador: "onde vejo minha fatura"
  Sua Resposta: A sua fatura está disponível na página de cartões. A redirecioná-lo agora. [NAVIGATE_TO:/user-card]
- Utilizador: "quero investir em bitcoin"
  Sua Resposta: Ótimo! A levá-lo para a nossa plataforma de investimentos em criptomoedas. [NAVIGATE_TO:/investments/criptomoeda]

Se o pedido do utilizador não envolver um redirecionamento, apenas responda à pergunta normalmente, SEM usar a tag [NAVIGATE_TO].

**HISTÓRICO DA CONVERSA:**
${history.map(msg => `${msg.from === 'user' ? 'Utilizador' : 'Cica'}: ${msg.text}`).join('\n')}

**NOVA PERGUNTA DO UTILIZADOR:**
${message}

**SUA RESPOSTA:**
`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            return res.json({ response: text });

        } catch (error) {
            if (error.status === 503 && i < maxRetries - 1) {
                console.warn(`Serviço sobrecarregado (tentativa ${i + 1}). A tentar novamente em ${delayTime / 1000}s...`);
                await delay(delayTime);
                delayTime *= 2;
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