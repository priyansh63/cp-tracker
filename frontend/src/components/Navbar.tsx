import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Award, BookOpen, LogOut, TrendingUp, Users } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();

  const getRankClass = (rank: string) => {
    const r = rank?.toLowerCase() || '';
    if (r.includes('grandmaster')) return 'rank-grandmaster';
    if (r.includes('master')) return 'rank-master';
    if (r.includes('candidate master')) return 'rank-candidate-master';
    if (r.includes('expert')) return 'rank-expert';
    if (r.includes('specialist')) return 'rank-specialist';
    if (r.includes('pupil')) return 'rank-pupil';
    return 'rank-newbie';
  };

  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: TrendingUp },
    { id: 'leaderboard', name: 'Leaderboard', icon: Users },
    { id: 'ladder', name: 'Practice Ladder', icon: Award },
    { id: 'resources', name: 'Resources', icon: BookOpen },
  ];

  return (
    <nav style={{
      background: 'rgba(10, 11, 18, 0.75)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '16px 0'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => setActiveTab('dashboard')}>
          <div style={{
            background: 'var(--primary-gradient)',
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#000',
            fontWeight: 'bold',
            fontSize: '1.2rem',
            boxShadow: '0 0 15px rgba(0, 242, 254, 0.3)'
          }}>
            CP
          </div>
          <span style={{
            fontSize: '1.3rem',
            fontWeight: 800,
            background: 'linear-gradient(90deg, #fff 0%, #a5b4fc 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '0.02em'
          }}>
            TRACKER
          </span>
        </div>

        {/* Nav tabs */}
        {user && (
          <div style={{ display: 'flex', gap: '8px' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  style={{
                    background: isActive ? 'rgba(79, 172, 254, 0.1)' : 'transparent',
                    border: 'none',
                    borderRadius: isActive ? '8px 8px 0 0' : '8px',
                    padding: '8px 16px',
                    color: isActive ? 'var(--primary)' : '#94a3b8',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    borderBottom: isActive ? '2px solid var(--primary)' : '2px solid transparent'
                  }}
                >
                  <Icon size={18} />
                  {item.name}
                </button>
              );
            })}
          </div>
        )}

        {/* User profile dropdown & logout */}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {user.cfAvatar ? (
                <img
                  src={user.cfAvatar}
                  alt={user.cfHandle}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  {user.cfHandle[0].toUpperCase()}
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span className={getRankClass(user.cfRank)} style={{ fontSize: '0.9rem', fontWeight: 700 }}>
                  {user.cfHandle}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Rating: {user.cfRating} ({user.cfRank})
                </span>
              </div>
            </div>
            <button
              onClick={logout}
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: '8px',
                padding: '8px 12px',
                color: '#ef4444',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.85rem',
                fontWeight: 600
              }}
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        ) : (
          <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Welcome, Guest</span>
        )}
      </div>
    </nav>
  );
};
