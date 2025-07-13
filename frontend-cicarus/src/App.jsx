import { Routes, Route } from 'react-router-dom';
import SignInPage from './pages/SignIn.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import AppTheme from './theme/AppTheme.jsx';
import UserTransactionsPage from './pages/UserTransactionsPage.jsx';
import AdminTransactionsPage from "./pages/AdminTransactionsPage.jsx";
import ExchangePage from './pages/ExchangePage.jsx';
import CardManagementPage from "./pages/CardManagementPage.jsx";

function App() {
    return (
        <AppTheme>
            <Routes>
                <Route path="/" element={<SignInPage />} />
                <Route path="/login" element={<SignInPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/user-transactions" element={<UserTransactionsPage />} />
                <Route path="/admin-transactions" element={<AdminTransactionsPage />} />
                <Route path="/profile" element={<ProfilePage />} /> {/* Nova rota adicionada */}
                <Route path="/exchange" element={<ExchangePage />} />
                <Route path="/user-card" element={<CardManagementPage />} />

            </Routes>
        </AppTheme>
    );
}

export default App;