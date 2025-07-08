// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // Nosso axios configurado

function LoginPage() {
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // Esta parte já está correta.
            // O frontend envia um campo "username" e "password".
            // O backend com NoOpPasswordEncoder vai comparar os textos puros.
            const response = await api.post('/auth/login', {
                username: user,
                password,
            });

            const token = response.data.token;

            localStorage.setItem('user-token', token);

            navigate('/dashboard');

        } catch (err) {
            setError('Falha no login. Verifique seu usuário e senha.');
            console.error(err);
        }
    };

    return (
        <div>
            <h2>Login - CicarusBank</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label>Usuário:</label>
                    <input type="text" value={user} onChange={(e) => setUser(e.target.value)} required />
                </div>
                <div>
                    <label>Senha:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit">Entrar</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}

export default LoginPage;