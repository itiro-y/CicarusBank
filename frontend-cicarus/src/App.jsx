// Em: src/App.jsx
import { Routes, Route } from 'react-router-dom';
import SignInPage from './pages/SignIn.jsx';
import DashboardPage from './pages/DashboardPage.jsx'; // Importa a nova página de Dashboard
import AppTheme from './theme/AppTheme.jsx';

function App() {
    return (
        <AppTheme>
            <Routes>
                <Route path="/" element={<SignInPage />} />
                <Route path="/login" element={<SignInPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
            </Routes>
        </AppTheme>
    );
}

export default App;