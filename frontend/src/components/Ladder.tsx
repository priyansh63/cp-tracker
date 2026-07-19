import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, Clock, ExternalLink, RefreshCw } from 'lucide-react';
const API_URL = import.meta.env.VITE_API_URL;

export const Ladder: React.FC = () => {
  const { token } = useAuth();
  const [problems, setProblems] = useState<any[]>([]);
  const [selectedRating, setSelectedRating] = useState<number>(1200);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  const fetchLadderProblems = async (ratingVal: number) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/practice/ladder?rating=${ratingVal}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch ladder.');
      }
      setProblems(data.problems);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const forceSyncCF = async () => {
    setSyncing(true);
    try {
      const res = await fetch(`${API_URL}/cf/sync`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Sync failed.');
      }
      // Reload problems to update solved indicators
      await fetchLadderProblems(selectedRating);
    } catch (err: any) {
      alert(`Sync failed: ${err.message}`);
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchLadderProblems(selectedRating);
    }
  }, [token, selectedRating]);

  const solvedCount = problems.filter(p => p.solved).length;
  const totalCount = problems.length;
  const progressPercent = totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0;

  const ratingLevels = [800, 1000, 1200, 1400, 1600, 1800, 2000];

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '60px' }}>
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, background: 'linear-gradient(90deg, #fff 0%, #a5b4fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Practice Ladder
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Personalized checklists that sync with your Codeforces submission history
          </p>
        </div>

        {/* Sync Button */}
        <button
          onClick={forceSyncCF}
          disabled={syncing}
          className="btn-secondary"
          style={{ height: '42px', padding: '0 16px', fontSize: '0.9rem' }}
        >
          <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} style={{ animation: syncing ? 'spin 1.5s infinite linear' : '' }} />
          {syncing ? 'Checking submissions...' : 'Check Solved Status'}
        </button>
      </div>

      {/* Selector and Progress Header */}
      <div className="glass-card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', marginBottom: '6px', fontWeight: 600, textTransform: 'uppercase' }}>Select Ladder Difficulty</span>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {ratingLevels.map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSelectedRating(lvl)}
                  style={{
                    background: selectedRating === lvl ? 'var(--primary-gradient)' : 'rgba(255, 255, 255, 0.02)',
                    color: selectedRating === lvl ? '#000' : '#94a3b8',
                    border: '1px solid',
                    borderColor: selectedRating === lvl ? 'transparent' : 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                    padding: '8px 14px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '0.85rem'
                  }}
                >
                  {lvl} Rating
                </button>
              ))}
            </div>
          </div>

          <div style={{ minWidth: '220px', flex: 1, maxWidth: '400px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600 }}>
              <span style={{ color: '#94a3b8' }}>Ladder Progress:</span>
              <span style={{ color: 'var(--primary)' }}>{solvedCount} / {totalCount} Solved ({progressPercent}%)</span>
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Problems List */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px', gap: '12px' }}>
          <RefreshCw className="animate-spin" size={24} style={{ animation: 'spin 1.5s infinite linear' }} />
          <span>Loading ladder problems...</span>
        </div>
      ) : error ? (
        <div className="glass-card" style={{ textAlign: 'center', color: 'var(--error)' }}>
          <p>{error}</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {problems.map((problem) => (
            <div 
              key={problem._id} 
              className="glass-card"
              style={{
                borderLeft: problem.solved 
                  ? '4px solid var(--success)' 
                  : '4px solid rgba(255, 255, 255, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '20px'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', background: 'rgba(79, 172, 254, 0.08)', padding: '2px 8px', borderRadius: '4px' }}>
                    {problem.contestId}{problem.index}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8' }}>
                    Rating: {problem.rating}
                  </span>
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>
                  {problem.name}
                </h3>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '16px' }}>
                  {problem.tags.map((tag: string, idx: number) => (
                    <span 
                      key={idx} 
                      style={{ 
                        fontSize: '0.7rem', 
                        background: 'rgba(255,255,255,0.03)', 
                        border: '1px solid rgba(255,255,255,0.05)',
                        color: '#64748b', 
                        padding: '1px 6px', 
                        borderRadius: '4px' 
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {problem.solved ? (
                    <>
                      <CheckCircle size={16} style={{ color: 'var(--success)' }} />
                      <span style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: 600 }}>Solved</span>
                    </>
                  ) : (
                    <>
                      <Clock size={16} style={{ color: '#64748b' }} />
                      <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>Unsolved</span>
                    </>
                  )}
                </div>
                <a
                  href={`https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.8rem',
                    color: 'var(--primary)',
                    textDecoration: 'none',
                    fontWeight: 600
                  }}
                >
                  Solve <ExternalLink size={12} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
