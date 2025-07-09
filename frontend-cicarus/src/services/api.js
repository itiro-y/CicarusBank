// src/services/api.js
import axios from 'axios';

// Verifique a porta do seu API Gateway no arquivo application.properties dele!
// Geralmente é 8080, 8088, ou algo configurado por você.
const API_GATEWAY_URL = 'http://localhost:8766'; // <-- MUDE A PORTA SE NECESSÁRIO

const api = axios.create({
    baseURL: API_GATEWAY_URL,
});

// IMPORTANTE: Interceptor para adicionar o token de autenticação em futuras requisições
// Depois que o usuário fizer login, você salvará o token (ex: no localStorage)
// e este interceptor vai adicioná-lo em todas as chamadas para a API.
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('user-token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;