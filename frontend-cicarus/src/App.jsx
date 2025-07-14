import { Routes, Route } from 'react-router-dom';
import SignInPage from './pages/SignIn.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import AppTheme from './theme/AppTheme.jsx';
import UserTransactionsPage from './pages/UserTransactionsPage.jsx';
import AdminTransactionsPage from "./pages/AdminTransactionsPage.jsx";
import ExchangePage from './pages/ExchangePage.jsx';
import CardManagementPage from "./pages/CardManagementPage.jsx";
import LoanSimulationPage from "./pages/LoanSimulationPage.jsx";
import LoanTrackingPage from "./pages/LoanTrackingPage.jsx";
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';
import AdminRoute from './components/AdminRoute.jsx';

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
                <Route path="/loan" element={<LoanSimulationPage />} />
                <Route path="/loan-tracking" element={<LoanTrackingPage />} />
                <Route path="/user-card" element={<CardManagementPage />} />
                <Route
                    path="/admin/dashboard"
                    element={
                        <AdminRoute>
                            <AdminDashboardPage />
                        </AdminRoute>
                    }
                />

            </Routes>
        </AppTheme>
    );
}

export default App;