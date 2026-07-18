import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Dashboard } from './components/Dashboard';
import { Leaderboard } from './components/Leaderboard';
import { Resources } from './components/Resources';
import { Ladder } from './components/Ladder';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [authView, setAuthView] = useState<'login' | 'register'>('login');

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#07080c',
        color: '#e2e8f0',
        fontFamily: 'Outfit, sans-serif'
      }}>
        <div style={{
          border: '4px solid rgba(255,255,255,0.05)',
          borderTop: '4px solid var(--primary)',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          animation: 'spin 1s infinite linear',
          marginBottom: '16px'
        }}></div>
        <p style={{ fontWeight: 600, letterSpacing: '0.02em' }}>INITIALIZING SESSION...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Render Auth screen if not logged in
  if (!user) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '24px'
      }}>
        {authView === 'login' ? (
          <Login onSwitchToRegister={() => setAuthView('register')} />
        ) : (
          <Register onSwitchToLogin={() => setAuthView('login')} />
        )}
      </div>
    );
  }

  // Render Logged in Layout
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="container" style={{ flex: 1, paddingTop: '32px' }}>
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'leaderboard' && <Leaderboard />}
        {activeTab === 'resources' && <Resources />}
        {activeTab === 'ladder' && <Ladder />}
      </main>

      <footer style={{
        textAlign: 'center',
        padding: '30px 0',
        color: '#475569',
        fontSize: '0.85rem',
        borderTop: '1px solid rgba(255,255,255,0.02)',
        marginTop: 'auto'
      }}>
        <div className="container">
          <p>© {new Date().getFullYear()} CP-Tracker. Built with React, Express and MongoDB.</p>
        </div>
      </footer>
    </div>
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
