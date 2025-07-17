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
import StockInvestmentsPage from "./pages/Investments/StockInvestmentsPage.jsx";

function App() {
    return (
        <AppTheme>
            <Routes>
                <Route path="/" element={<SignInPage />} />
                <Route path="/login" element={<SignInPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/user-transactions" element={<UserTransactionsPage />} />
                <Route path="/admin-transactions" element={<AdminTransactionsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/exchange" element={<ExchangePage />} />
                <Route path="/loan" element={<LoanSimulationPage />} />
                <Route path="/loan-tracking" element={<LoanTrackingPage />} />
                <Route path="/user-card" element={<CardManagementPage />} />
                <Route path="/card-limit" element={<CardLimitPage />} />
                <Route path="/pix" element={<PixPage />} />
                <Route path="/recharge" element={<MobileRechargePage />} />
                <Route path="/payment" element={<BillPaymentPage />} />
                <Route path="/benefits" element={<BenefitsPage />} />
                <Route path="/user-investments" element={<UserInvestmentsPage />} />
                <Route path="/admin-investments" element={<AdminInvestmentsPage />} />
                <Route path="/connected-devices" element={<ConnectedDevicesPage />} />
                <Route path="/investments/acoes" element={<StockInvestmentsPage />} />
                <Route
                    path="/admin/dashboard"
                    element={
                        <AdminRoute>
                            <AdminDashboardPage />
                        </AdminRoute>
                    }
                />
                <Route path="/agencias" element={<NearbyAgenciesPage />} />
                <Route path="/virtual-card" element={<VirtualCardCreationPage />} />
                <Route path="/investments/criptomoeda" element={<CryptoInvestmentsPage />} />

            </Routes>
        </AppTheme>
    );
}

export default App;