import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Award, RefreshCw, Search } from 'lucide-react';
const API_URL = import.meta.env.VITE_API_URL;

export const Leaderboard: React.FC = () => {
  const { token, user: currentUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/cf/leaderboard`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch leaderboard.');
      }
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchLeaderboard();
    }
  }, [token]);

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

  const filteredUsers = users.filter((u: any) =>
    u.cfHandle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px', gap: '12px' }}>
        <RefreshCw className="animate-spin" size={24} style={{ animation: 'spin 1.5s infinite linear' }} />
        <span>Loading leaderboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card" style={{ maxWidth: '600px', margin: '40px auto', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', color: '#ef4444' }}>Error</h3>
        <p style={{ color: '#64748b', marginBottom: '20px' }}>{error}</p>
        <button className="btn-primary" onClick={fetchLeaderboard}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '60px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, background: 'linear-gradient(90deg, #fff 0%, #a5b4fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Rating Leaderboard
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Compare your standing against other platform members
          </p>
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', width: '300px' }}>
          <span style={{ position: 'absolute', left: '12px', top: '11px', color: '#64748b' }}>
            <Search size={16} />
          </span>
          <input
            type="text"
            className="form-input"
            placeholder="Search handle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '38px', paddingRight: '12px', height: '38px' }}
          />
        </div>
      </div>

      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container">
          <table className="table-leaderboard">
            <thead>
              <tr>
                <th style={{ width: '80px', textAlign: 'center' }}>Rank</th>
                <th>User Handle</th>
                <th>Codeforces Rank</th>
                <th style={{ textAlign: 'right' }}>Rating</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u: any, index: number) => {
                  const isSelf = currentUser && currentUser.cfHandle.toLowerCase() === u.cfHandle.toLowerCase();
                  return (
                    <tr 
                      key={u._id} 
                      style={{ 
                        background: isSelf ? 'rgba(79, 172, 254, 0.08)' : 'transparent',
                        borderLeft: isSelf ? '4px solid var(--primary)' : 'none'
                      }}
                    >
                      <td style={{ textAlign: 'center', fontWeight: 'bold', color: index < 3 ? 'var(--primary)' : '#64748b' }}>
                        {index < 3 ? <Award size={18} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} /> : null}
                        {index + 1}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {u.cfAvatar ? (
                            <img
                              src={u.cfAvatar}
                              alt={u.cfHandle}
                              style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                          ) : (
                            <div style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              background: 'rgba(255,255,255,0.05)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.8rem',
                              fontWeight: 'bold'
                            }}>
                              {u.cfHandle[0].toUpperCase()}
                            </div>
                          )}
                          <a
                            href={`https://codeforces.com/profile/${u.cfHandle}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={getRankClass(u.cfRank)}
                            style={{ textDecoration: 'none', fontWeight: 700 }}
                          >
                            {u.cfHandle} {isSelf && <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--primary)', opacity: 0.8 }}>(You)</span>}
                          </a>
                        </div>
                      </td>
                      <td style={{ textTransform: 'capitalize', color: '#94a3b8', fontSize: '0.9rem' }}>
                        {u.cfRank || 'unrated'}
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 800 }} className={getRankClass(u.cfRank)}>
                        {u.cfRating}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                    No users found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
