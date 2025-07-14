import React from 'react';
import { Navigate } from 'react-router-dom';

// SIMULAÇÃO: No mundo real, esta função viria do seu contexto de autenticação
// (ex: const { user, loading } = useAuth();)
const useAuth = () => {
    // Mude para 'user' ou 'guest' para testar os cenários
    const userRole = 'admin'; // ou 'user' ou null

    // Simula um utilizador logado com a role de 'admin'
    const fakeUser = {
        isLoggedIn: true,
        role: userRole
    };

    // Simula o estado de carregamento da autenticação
    const loading = false;

    return { user: fakeUser, loading };
};


export default function AdminRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        // Pode colocar um spinner de loading aqui
        return <div>Carregando...</div>;
    }

    if (!user.isLoggedIn || user.role !== 'admin') {
        // Se não estiver logado ou não for admin, redireciona para a página de login
        // ou para uma página de "acesso negado".
        return <Navigate to="/login" replace />;
    }

    // Se for admin, renderiza a página de dashboard
    return children;
}