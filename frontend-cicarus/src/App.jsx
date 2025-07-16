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
import PixPage from './pages/PixPage.jsx';
import MobileRechargePage from './pages/MobileRechargePage.jsx';
import BenefitsPage from './pages/BenefitsPage.jsx';
import UserInvestmentsPage from "./pages/UserInvestmentsPage.jsx";
import AdminInvestmentsPage from "./pages/AdminInvestmentsPage.jsx";
// import InvestmentsPage from './pages/InvestmentsPage.jsx';
import VirtualCardCreationPage from './pages/VirtualCardCreationPage.jsx';
import ConnectedDevicesPage from "./pages/ConnectedDevicesPage.jsx";
import BillPaymentPage from "./pages/BillPaymentPage.jsx";
import CryptoInvestmentsPage from "./pages/CryptoInvestmentsPage.jsx";
import CardLimitPage from "./pages/CardLimitPage.jsx";

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
                {/*<Route path="/investments" element={<InvestmentsPage />} />*/}
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