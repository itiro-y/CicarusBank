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
import NearbyAgenciesPage from './pages/NearbyAgenciesPage.jsx';

import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <AppTheme>
            <Routes>
                <Route path="/" element={<SignInPage />} />
                <Route path="/login" element={<SignInPage />} />
                <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                <Route path="/user-transactions" element={<ProtectedRoute><UserTransactionsPage /></ProtectedRoute>} />
                <Route path="/admin-transactions" element={<ProtectedRoute><AdminTransactionsPage /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                <Route path="/exchange" element={<ProtectedRoute><ExchangePage /></ProtectedRoute>} />
                <Route path="/loan" element={<ProtectedRoute><LoanSimulationPage /></ProtectedRoute>} />
                <Route path="/loan-tracking" element={<ProtectedRoute><LoanTrackingPage /></ProtectedRoute>} />
                <Route path="/user-card" element={<ProtectedRoute><CardManagementPage /></ProtectedRoute>} />
                <Route
                    path="/admin/dashboard"
                    element={
                        <AdminRoute>
                            <AdminDashboardPage />
                        </AdminRoute>
                    }
                />
                <Route path="/agencias" element={<NearbyAgenciesPage />} />

            </Routes>
        </AppTheme>
    );
}

export default App;