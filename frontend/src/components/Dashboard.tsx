import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ReferenceLine, Area, AreaChart, Legend
} from 'recharts';
import { AlertTriangle, Award, CheckCircle, RefreshCw, Star, Zap, TrendingUp, Activity, Target, ExternalLink } from 'lucide-react';

// ─── Rating → Color (Codeforces convention) ───────────────────────────────────
const getRatingColor = (rating: number): string => {
  if (rating >= 3000) return '#ff0000';   // Legendary Grandmaster
  if (rating >= 2600) return '#ff3333';   // International Grandmaster
  if (rating >= 2400) return '#ff7777';   // Grandmaster
  if (rating >= 2300) return '#ffbb55';   // International Master
  if (rating >= 2100) return '#ffcc88';   // Master
  if (rating >= 1900) return '#ff88ff';   // Candidate Master
  if (rating >= 1600) return '#aaaaff';   // Expert
  if (rating >= 1400) return '#77ddbb';   // Specialist
  if (rating >= 1200) return '#77ff77';   // Pupil
  return '#cccccc';                       // Newbie
};

const getRatingBandColor = (rating: number): string => {
  if (rating >= 2400) return 'rgba(255,0,0,0.06)';
  if (rating >= 1900) return 'rgba(170,0,170,0.06)';
  if (rating >= 1600) return 'rgba(102,102,255,0.06)';
  if (rating >= 1400) return 'rgba(0,180,130,0.06)';
  if (rating >= 1200) return 'rgba(0,220,0,0.06)';
  return 'rgba(150,150,150,0.06)';
};

// ─── Custom Tooltip for Rating Chart ─────────────────────────────────────────
const RatingTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    const delta = d.ratingChange;
    return (
      <div style={{
        background: 'rgba(10,13,25,0.97)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '10px',
        padding: '12px 16px',
        fontSize: '0.82rem',
        minWidth: '220px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
      }}>
        <p style={{ fontWeight: 700, color: '#fff', marginBottom: '6px', lineHeight: 1.3 }}>{d.contestName}</p>
        <p style={{ color: '#94a3b8', marginBottom: '4px' }}>📅 {d.dateStr}</p>
        <p style={{ color: '#94a3b8', marginBottom: '4px' }}>🏅 Rank: <span style={{ color: '#fff', fontWeight: 600 }}>#{d.rank}</span></p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
          <span style={{ color: getRatingColor(d.newRating), fontWeight: 800, fontSize: '1.1rem' }}>{d.newRating}</span>
          <span style={{
            color: delta >= 0 ? '#4ade80' : '#f87171',
            fontWeight: 700,
            fontSize: '0.9rem'
          }}>
            {delta >= 0 ? `+${delta}` : delta}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

// ─── Custom Dot for Rating Chart ──────────────────────────────────────────────
const CustomDot = (props: any) => {
  const { cx, cy, payload } = props;
  const color = getRatingColor(payload.newRating);
  return (
    <circle
      cx={cx} cy={cy} r={4}
      fill={color}
      stroke="rgba(255,255,255,0.3)"
      strokeWidth={1.5}
    />
  );
};

// ─── Active Dot ───────────────────────────────────────────────────────────────
const ActiveDot = (props: any) => {
  const { cx, cy, payload } = props;
  const color = getRatingColor(payload.newRating);
  return (
    <circle
      cx={cx} cy={cy} r={7}
      fill={color}
      stroke="rgba(255,255,255,0.6)"
      strokeWidth={2}
    />
  );
};

// ─── CF Rating Band References ────────────────────────────────────────────────
const CF_BANDS = [
  { y: 1200, color: '#77ff77', label: 'Pupil' },
  { y: 1400, color: '#77ddbb', label: 'Specialist' },
  { y: 1600, color: '#aaaaff', label: 'Expert' },
  { y: 1900, color: '#ff88ff', label: 'Cand. Master' },
  { y: 2100, color: '#ffcc88', label: 'Master' },
  { y: 2400, color: '#ff7777', label: 'Grandmaster' },
];

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, sub, color }: { label: string; value: any; sub?: string; color?: string }) => (
  <div style={{
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '12px',
    padding: '14px 18px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  }}>
    <span style={{ fontSize: '0.78rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
    <span style={{ fontSize: '1.5rem', fontWeight: 800, color: color || '#fff', lineHeight: 1 }}>{value}</span>
    {sub && <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{sub}</span>}
  </div>
);

// ─── Main Dashboard Component ─────────────────────────────────────────────────
export const Dashboard: React.FC = () => {
  const { token } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  const fetchDashboardData = useCallback(async (force: boolean = false) => {
    if (force) setSyncing(true);
    else setLoading(true);

    try {
      const url = force
        ? 'http://localhost:5000/api/cf/sync'
        : 'http://localhost:5000/api/cf/dashboard';

      const res = await fetch(url, {
        method: force ? 'POST' : 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();

      if (!res.ok) throw new Error(result.message || 'Failed to fetch dashboard data.');

      setData(result);
      setLastSyncTime(new Date());
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchDashboardData();
  }, [token, fetchDashboardData]);

  // Auto-refresh every 10 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (token) fetchDashboardData(false);
    }, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [token, fetchDashboardData]);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '400px', gap: '16px' }}>
        <div style={{ position: 'relative', width: '60px', height: '60px' }}>
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            border: '3px solid rgba(79,172,254,0.15)',
            borderTopColor: 'var(--primary)',
            animation: 'spin 1s linear infinite'
          }} />
        </div>
        <span style={{ color: '#94a3b8', fontSize: '0.95rem' }}>Syncing your Codeforces analytics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card" style={{ maxWidth: '600px', margin: '40px auto', textAlign: 'center', padding: '40px' }}>
        <AlertTriangle size={48} style={{ color: '#ef4444', marginBottom: '16px' }} />
        <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Analytics Fetch Failed</h3>
        <p style={{ color: '#64748b', marginBottom: '20px', lineHeight: 1.6 }}>{error}</p>
        <button className="btn-primary" onClick={() => fetchDashboardData()}>Try Again</button>
      </div>
    );
  }

  const { profile, ratingHistory, analytics } = data;

  // ── Build rating chart data with proper timestamps ──────────────────────────
  const ratingChartData = (ratingHistory || []).map((h: any) => {
    const d = new Date(h.ratingUpdateTimeSeconds * 1000);
    return {
      contestName: h.contestName,
      dateStr: d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' }),
      timestamp: h.ratingUpdateTimeSeconds,
      newRating: h.newRating,
      oldRating: h.oldRating,
      rank: h.rank,
      ratingChange: h.newRating - h.oldRating,
    };
  });

  // Determine y-axis domain based on actual data
  const ratings = ratingChartData.map((d: any) => d.newRating);
  const minRating = ratings.length ? Math.max(0, Math.min(...ratings) - 150) : 0;
  const maxRating = ratings.length ? Math.max(...ratings) + 150 : 2000;

  // ── Rank color for profile ──────────────────────────────────────────────────
  const rankColor = getRatingColor(profile?.rating || 0);

  // ── Total solved ────────────────────────────────────────────────────────────
  const totalSolved = analytics?.dailyProgress?.reduce((sum: number, d: any) => sum + d.solvedCount, 0) || 0;
  const contestCount = ratingHistory?.length || 0;

  // ── Best rank ───────────────────────────────────────────────────────────────
  const bestRank = ratingChartData.length
    ? Math.min(...ratingChartData.map((d: any) => d.rank))
    : 'N/A';

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '60px' }}>

      {/* ── Sync Status Bar ── */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'rgba(79,172,254,0.04)',
        border: '1px solid rgba(79,172,254,0.12)',
        borderRadius: '12px', padding: '10px 20px',
        marginBottom: '24px', fontSize: '0.88rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#94a3b8' }}>
          <div style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: data?.fromCache ? '#f59e0b' : '#4ade80',
            boxShadow: data?.fromCache ? '0 0 6px #f59e0b' : '0 0 6px #4ade80'
          }} />
          <span>
            {data?.fromCache
              ? `Cached data · Last synced ${lastSyncTime ? lastSyncTime.toLocaleTimeString() : 'recently'}`
              : `Live data synced at ${lastSyncTime ? lastSyncTime.toLocaleTimeString() : 'now'}`}
          </span>
        </div>
        <button
          onClick={() => fetchDashboardData(true)}
          disabled={syncing}
          style={{
            background: syncing ? 'rgba(79,172,254,0.1)' : 'rgba(79,172,254,0.15)',
            border: '1px solid rgba(79,172,254,0.3)',
            color: 'var(--primary)', cursor: 'pointer', fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '6px 14px', borderRadius: '8px', fontSize: '0.85rem',
            transition: 'all 0.2s ease'
          }}
        >
          <RefreshCw size={13} style={{ animation: syncing ? 'spin 1s linear infinite' : 'none' }} />
          {syncing ? 'Syncing...' : '⚡ Force Sync'}
        </button>
      </div>

      <div className="dashboard-grid">
        {/* ════════════════════════════════════════════════
            LEFT COLUMN: Profile + Stats + Failed Topics
           ════════════════════════════════════════════════ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Profile Card */}
          <div className="glass-card" style={{ textAlign: 'center' }}>
            {profile?.titlePhoto && (
              <div style={{ position: 'relative', display: 'inline-block', marginBottom: '16px' }}>
                <img
                  src={profile.titlePhoto}
                  alt={profile.handle}
                  style={{
                    width: '100px', height: '100px', borderRadius: '50%',
                    border: `3px solid ${rankColor}`,
                    boxShadow: `0 0 24px ${rankColor}55`,
                    objectFit: 'cover'
                  }}
                />
                <div style={{
                  position: 'absolute', bottom: 0, right: 0,
                  width: '22px', height: '22px', borderRadius: '50%',
                  background: '#4ade80', border: '2px solid #0a0d19'
                }} />
              </div>
            )}
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: rankColor, marginBottom: '4px' }}>
              {profile?.handle}
            </h2>
            <p style={{ textTransform: 'capitalize', color: '#94a3b8', fontSize: '0.9rem', marginBottom: '4px' }}>
              {profile?.rank || 'Unrated'}
            </p>
            <a
              href={`https://codeforces.com/profile/${profile?.handle}`}
              target="_blank" rel="noopener noreferrer"
              style={{ fontSize: '0.8rem', color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none', marginBottom: '20px' }}
            >
              View on Codeforces <ExternalLink size={11} />
            </a>

            {/* Stat Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <StatCard label="Current Rating" value={profile?.rating || 0} color={rankColor} />
              <StatCard label="Max Rating" value={profile?.maxRating || 0} color={getRatingColor(profile?.maxRating || 0)} sub={profile?.maxRank} />
              <StatCard label="Contests" value={contestCount} sub="participated" />
              <StatCard label="Best Rank" value={bestRank === 'N/A' ? 'N/A' : `#${bestRank}`} sub="in contest" color="#f59e0b" />
            </div>

            {(profile?.organization || profile?.country) && (
              <div style={{ marginTop: '16px', fontSize: '0.82rem', color: '#64748b', textAlign: 'left', background: 'rgba(0,0,0,0.15)', borderRadius: '8px', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {profile?.organization && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>🏢 Organization</span>
                    <span style={{ color: '#fff', fontWeight: 500 }}>{profile.organization}</span>
                  </div>
                )}
                {profile?.country && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>🌏 Country</span>
                    <span style={{ color: '#fff', fontWeight: 500 }}>{profile.country}</span>
                  </div>
                )}
                {profile?.friendOfCount !== undefined && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>👥 Followed by</span>
                    <span style={{ color: '#fff', fontWeight: 500 }}>{profile.friendOfCount} users</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Failed Contest Topics */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <AlertTriangle size={16} style={{ color: '#f59e0b' }} />
              Weak Areas (Failed Contest Topics)
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '14px', lineHeight: '1.5' }}>
              Topics from recent contests where you couldn't solve problems:
            </p>

            {analytics?.failedTopics?.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {analytics.failedTopics.slice(0, 6).map((topic: any, idx: number) => (
                  <div key={idx} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    background: 'rgba(245,158,11,0.05)',
                    border: '1px solid rgba(245,158,11,0.12)',
                    padding: '8px 12px', borderRadius: '8px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f59e0b' }} />
                      <span style={{ fontSize: '0.84rem', fontWeight: 600, textTransform: 'capitalize' }}>{topic.topic}</span>
                    </div>
                    <span style={{
                      fontSize: '0.75rem', background: 'rgba(245,158,11,0.15)',
                      color: '#f59e0b', padding: '2px 8px', borderRadius: '10px', fontWeight: 700
                    }}>
                      {topic.failureCount}× missed
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0', color: '#64748b', fontSize: '0.9rem' }}>
                <CheckCircle size={28} style={{ color: '#4ade80', marginBottom: '8px' }} />
                <p>Great! No failed topics in recent contests.</p>
              </div>
            )}

            {analytics?.recentFailedProblems?.length > 0 && (
              <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <h4 style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '10px' }}>Re-solve These:</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {analytics.recentFailedProblems.map((prob: any, idx: number) => (
                    <a
                      key={idx}
                      href={`https://codeforces.com/contest/${prob.contestId}/problem/${prob.index}`}
                      target="_blank" rel="noopener noreferrer"
                      style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        textDecoration: 'none', color: '#fff', fontSize: '0.8rem',
                        padding: '6px 10px',
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        borderRadius: '6px', transition: 'all 0.2s'
                      }}
                    >
                      <span style={{ fontWeight: 600 }}>{prob.contestId}{prob.index} · {prob.name}</span>
                      {prob.rating && (
                        <span style={{ color: getRatingColor(prob.rating), fontWeight: 700, fontSize: '0.78rem' }}>
                          {prob.rating}
                        </span>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ════════════════════════════════════════════════
            RIGHT COLUMN: Charts
           ════════════════════════════════════════════════ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* ── Codeforces Rating History Chart ─────────────────────────── */}
          <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <TrendingUp size={18} style={{ color: 'var(--primary)' }} />
                  Rating History
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '3px' }}>
                  {contestCount} contests · Real-time from Codeforces API
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: rankColor, lineHeight: 1 }}>
                  {profile?.rating || 0}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'capitalize' }}>
                  {profile?.rank || 'unrated'}
                </div>
              </div>
            </div>

            {ratingChartData.length > 0 ? (
              <div style={{ width: '100%', height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={ratingChartData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                    <defs>
                      <linearGradient id="ratingAreaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={rankColor} stopOpacity={0.25} />
                        <stop offset="100%" stopColor={rankColor} stopOpacity={0.01} />
                      </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />

                    {/* Rating band reference lines */}
                    {CF_BANDS.filter(b => b.y > minRating && b.y < maxRating).map(band => (
                      <ReferenceLine
                        key={band.y}
                        y={band.y}
                        stroke={band.color}
                        strokeOpacity={0.25}
                        strokeDasharray="4 4"
                        label={{ value: band.label, position: 'insideTopRight', fontSize: 9, fill: band.color, opacity: 0.6 }}
                      />
                    ))}

                    <XAxis
                      dataKey="dateStr"
                      stroke="#3f4960"
                      fontSize={9}
                      tickLine={false}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      stroke="#3f4960"
                      fontSize={10}
                      domain={[minRating, maxRating]}
                      tickLine={false}
                      tickCount={6}
                    />
                    <Tooltip content={<RatingTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="newRating"
                      stroke={rankColor}
                      strokeWidth={2.5}
                      fill="url(#ratingAreaGrad)"
                      dot={<CustomDot />}
                      activeDot={<ActiveDot />}
                      connectNulls
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div style={{ display: 'flex', height: '280px', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '12px', color: '#64748b' }}>
                <Activity size={32} />
                <p style={{ fontSize: '0.9rem' }}>No contest history found for this handle.</p>
              </div>
            )}

            {/* Recent contest history mini-table */}
            {ratingChartData.length > 0 && (
              <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '8px' }}>Last {Math.min(5, ratingChartData.length)} contests:</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {[...ratingChartData].slice(-5).reverse().map((c: any, i: number) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', padding: '4px 0' }}>
                      <span style={{ color: '#94a3b8', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                        {c.contestName}
                      </span>
                      <span style={{ color: '#64748b', marginLeft: '8px' }}>#{c.rank}</span>
                      <span style={{ color: getRatingColor(c.newRating), fontWeight: 700, marginLeft: '12px', minWidth: '40px', textAlign: 'right' }}>
                        {c.newRating}
                      </span>
                      <span style={{ color: c.ratingChange >= 0 ? '#4ade80' : '#f87171', marginLeft: '8px', fontWeight: 700, minWidth: '40px', textAlign: 'right' }}>
                        {c.ratingChange >= 0 ? `+${c.ratingChange}` : c.ratingChange}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Bottom Charts Grid ─────────────────────────────────────── */}
          <div className="main-charts-grid">
            {/* Daily Solved Progress */}
            <div className="glass-card">
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={15} style={{ color: '#4ade80' }} />
                Daily Progress
                <span style={{ marginLeft: 'auto', fontSize: '0.78rem', color: '#64748b', fontWeight: 400 }}>Last 30 days</span>
              </h3>
              <div style={{ width: '100%', height: '200px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics?.dailyProgress || []} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                    <XAxis
                      dataKey="date"
                      stroke="#3f4960"
                      fontSize={8}
                      tickFormatter={(tick) => tick.substring(5)}
                      tickLine={false}
                      interval={4}
                    />
                    <YAxis stroke="#3f4960" fontSize={10} allowDecimals={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ background: 'rgba(10,13,25,0.97)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '0.82rem' }}
                      labelFormatter={(label) => `📅 ${label}`}
                      formatter={(val: any) => [`${val} solved`, 'Problems']}
                    />
                    <Bar dataKey="solvedCount" fill="var(--primary)" radius={[3, 3, 0, 0]} maxBarSize={16} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748b' }}>
                <span>Total (30d): <strong style={{ color: '#fff' }}>{totalSolved}</strong></span>
                <span>Avg/day: <strong style={{ color: 'var(--primary)' }}>{(totalSolved / 30).toFixed(1)}</strong></span>
              </div>
            </div>

            {/* Topic Distribution Radar */}
            <div className="glass-card">
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Star size={15} style={{ color: '#f59e0b' }} />
                Topic Distribution
                <span style={{ marginLeft: 'auto', fontSize: '0.78rem', color: '#64748b', fontWeight: 400 }}>Top 6 tags</span>
              </h3>
              <div style={{ width: '100%', height: '200px' }}>
                {analytics?.topicDistribution?.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={analytics.topicDistribution.slice(0, 6)}>
                      <PolarGrid stroke="rgba(255,255,255,0.06)" />
                      <PolarAngleAxis dataKey="topic" stroke="#64748b" fontSize={9} />
                      <PolarRadiusAxis stroke="#3f4960" fontSize={8} angle={30} tickCount={3} />
                      <Radar
                        name="Solved"
                        dataKey="count"
                        stroke="#f59e0b"
                        fill="#f59e0b"
                        fillOpacity={0.2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '0.9rem' }}>
                    No topic data yet.
                  </div>
                )}
              </div>
              {analytics?.topicDistribution?.slice(0, 3).map((t: any, i: number) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#94a3b8', marginTop: i === 0 ? '10px' : '3px' }}>
                  <span>#{i + 1} {t.topic}</span>
                  <span style={{ color: '#f59e0b', fontWeight: 700 }}>{t.count} solved</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
