import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './components/LoginPage';
import { DashboardPage } from './components/DashboardPage';

const AppContent = () => {
  const { token, logout } = useAuth();
  const [showDashboard, setShowDashboard] = useState(!!token);

  if (!showDashboard || !token) {
    return <LoginPage onSuccess={() => setShowDashboard(true)} />;
  }

  return (
    <>
      <button onClick={() => { logout(); setShowDashboard(false); }} style={{ position: 'absolute', top: '20px', right: '20px', padding: '8px 16px' }}>
        Logout
      </button>
      <DashboardPage />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;