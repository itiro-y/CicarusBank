import { Routes, Route } from 'react-router-dom';
import SignInPage from './pages/SignIn/SignIn.jsx';
import DashboardPage from './pages/Dashboard/DashboardPage.jsx';
import ProfilePage from './pages/Profile/ProfilePage.jsx';
import AppTheme from './theme/AppTheme.jsx';
import UserTransactionsPage from './pages/Transactions/UserTransactionsPage.jsx';
import AdminTransactionsPage from "./pages/Transactions/AdminTransactionsPage.jsx";
import ExchangePage from './pages/CurrencyExchange/ExchangePage.jsx';
import CardManagementPage from "./pages/Cards/CardManagementPage.jsx";
import LoanSimulationPage from "./pages/Loans/LoanSimulationPage.jsx";
import LoanTrackingPage from "./pages/Loans/LoanTrackingPage.jsx";
import AdminDashboardPage from './pages/Dashboard/AdminDashboardPage.jsx';
import AdminRoute from './components/AdminRoute.jsx';
import NearbyAgenciesPage from './pages/NearbyAgencies/NearbyAgenciesPage.jsx';
import PixPage from './pages/Dashboard/PixPage.jsx';
import MobileRechargePage from './pages/Dashboard/MobileRechargePage.jsx';
import BenefitsPage from './pages/Benefits/BenefitsPage.jsx';
import UserInvestmentsPage from "./pages/Investments/UserInvestmentsPage.jsx";
import AdminInvestmentsPage from "./pages/Investments/AdminInvestmentsPage.jsx";
// import InvestmentsPage from './pages/InvestmentsPage.jsx';
import VirtualCardCreationPage from './pages/Dashboard/VirtualCardCreationPage.jsx';
import ConnectedDevicesPage from "./pages/Profile/ConnectedDevicesPage.jsx";
import BillPaymentPage from "./pages/Dashboard/BillPaymentPage.jsx";
import CryptoInvestmentsPage from "./pages/Investments/CryptoInvestmentsPage.jsx";
import CardLimitPage from "./pages/Cards/CardLimitPage.jsx";

import ProtectedRoute from './components/ProtectedRoute';
import { UserProvider } from './context/UserContext.jsx';

function App() {
    return (
        <AppTheme>
            <UserProvider>
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
                <Route path="/card-limit" element={<ProtectedRoute><CardLimitPage /></ProtectedRoute>} />
                <Route path="/pix" element={<ProtectedRoute><PixPage /></ProtectedRoute>} />
                <Route path="/recharge" element={<ProtectedRoute><MobileRechargePage /></ProtectedRoute>} />
                <Route path="/payment" element={<ProtectedRoute><BillPaymentPage /></ProtectedRoute>} />
                <Route path="/benefits" element={<ProtectedRoute><BenefitsPage /></ProtectedRoute>} />
                <Route path="/user-investments" element={<ProtectedRoute><UserInvestmentsPage /></ProtectedRoute>} />
                <Route path="/admin-investments" element={<ProtectedRoute><AdminInvestmentsPage /></ProtectedRoute>} />
                <Route path="/connected-devices" element={<ProtectedRoute><ConnectedDevicesPage /></ProtectedRoute>} />
                {/*<Route path="/investments" element={<InvestmentsPage />} />*/}
                <Route
                    path="/admin/dashboard"
                    element={
                        <ProtectedRoute>
                        <AdminRoute>
                            <AdminDashboardPage />
                        </AdminRoute>
                        </ProtectedRoute>
                    }
                />
                <Route path="/agencias" element={<ProtectedRoute><NearbyAgenciesPage /></ProtectedRoute>} />
                <Route path="/virtual-card" element={<ProtectedRoute><VirtualCardCreationPage /></ProtectedRoute>} />
                <Route path="/investments/criptomoeda" element={<ProtectedRoute><CryptoInvestmentsPage /></ProtectedRoute>} />

                </Routes>
            </UserProvider>
        </AppTheme>
    );
}

export default App;