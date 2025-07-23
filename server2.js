// Arquivo: backend/server.js

const express = require('express');
const cors = require('cors');

// 1. Configurar o ambiente
const app = express();
const port = 3002;

// Adicione sua chave de API do Hugging Face aqui
const HUGGING_FACE_API_KEY = "SUA_CHAVE_DE_API_AQUI";

// 2. Configurar Middlewares
app.use(cors());
app.use(express.json());

// 3. Criar o endpoint
app.post('/api/generate-avatar', async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'O prompt é obrigatório.' });
    }

    try {
        console.log(`Recebido prompt: "${prompt}". Gerando imagem com Hugging Face...`);

        // URL da API de Inferência para um modelo Stable Diffusion popular.
        // Você pode trocar o nome do modelo por outros disponíveis no Hugging Face.
        const API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0";

        // Faz a chamada para a API do Hugging Face
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                // A autorização usa o token que você gerou
                "Authorization": `Bearer ${HUGGING_FACE_API_KEY}`,
                "Content-Type": "application/json",
            },
            // O corpo da requisição é um JSON com o prompt
            body: JSON.stringify({
                inputs: `a professional close-up avatar of a ${prompt}, 3d character, simple background`,
            }),
        });

        // Tratamento de erro específico do Hugging Face
        if (!response.ok) {
            // Se o modelo estiver carregando (cold start), a API retorna 503
            if (response.status === 503) {
                const errorData = await response.json();
                console.warn(`O modelo está carregando. Tempo estimado: ${errorData.estimated_time}s`);
                // Envia um erro amigável para o frontend
                return res.status(503).json({ error: `O modelo de IA está carregando. Por favor, tente novamente em ${Math.ceil(errorData.estimated_time)} segundos.` });
            }
            throw new Error(`Erro da API do Hugging Face: ${response.status} - ${await response.text()}`);
        }

        console.log("Imagem gerada com sucesso!");

        // A API retorna a imagem diretamente como um 'blob'
        const imageBuffer = Buffer.from(await response.arrayBuffer());
        const imageBase64 = imageBuffer.toString('base64');

        // Envia a imagem de volta para o frontend
        res.json({ imageBase64 });

    } catch (error) {
        console.error("Erro no processo de geração:", error.message);
        res.status(500).json({ error: 'Falha ao gerar a imagem.' });
    }
});

// 4. Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});