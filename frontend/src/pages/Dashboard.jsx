import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useStore from '../store/useStore'
import api from '../api/client'
import XPBar from '../components/XPBar'

const LANG_TRACKS = [
  { key: 'python',     icon: '🐍', name: 'Python',     color: '#3b82f6' },
  { key: 'javascript', icon: '⚡', name: 'JavaScript', color: '#f59e0b' },
  { key: 'cpp',        icon: '⚙️', name: 'C++',        color: '#a78bfa' },
  { key: 'java',       icon: '☕', name: 'Java',       color: '#f97316' },
]

export default function Dashboard() {
  const { user } = useStore()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/progress/stats')
      .then(r => setStats(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (!user) return null

  const STAT_CARDS = [
    { label: 'Challenges Solved', value: loading ? '—' : (stats?.completed ?? 0), sub: 'total completed' },
    { label: 'Accuracy Rate',     value: loading ? '—' : `${stats?.accuracy ?? 0}%`, sub: 'correct submissions' },
    { label: 'Total XP Earned',   value: loading ? '—' : (user.total_xp || 0).toLocaleString(), sub: 'all time' },
    { label: 'Current Streak',    value: loading ? '—' : `${user.streak_days}d`, sub: user.streak_days >= 5 ? '🔥 Bonus active' : 'Keep going!' },
  ]

  return (
    <div className="container page-enter">
      {/* Greeting */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ marginBottom: 6 }}>
          Welcome back, <span style={{ color: 'var(--purple-light)' }}>{user.username}</span> 👋
        </h1>
        <p style={{ fontSize: 13, color: 'var(--text-3)', fontFamily: 'var(--mono)' }}>
          // {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* XP Bar */}
      <XPBar user={user} />

      {/* Stat Cards */}
      <div className="grid-2" style={{ marginBottom: 28 }}>
        {STAT_CARDS.map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Language Tracks — real data from API */}
      <div style={{ marginBottom: 28 }}>
        <div className="section-label">Language Tracks</div>
        <div className="grid-4">
          {LANG_TRACKS.map(lang => {
            const langData = stats?.lang_stats?.[lang.key]
            const pct     = langData ? langData.pct : 0
            const done    = langData ? langData.completed : 0
            const total   = langData ? langData.total : 0

            return (
              <div key={lang.key} className="card" style={{ padding: '18px', textAlign: 'center', cursor: 'pointer' }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{lang.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 13, color: lang.color, marginBottom: 4 }}>{lang.name}</div>
                <div style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'var(--mono)', marginBottom: 10 }}>
                  {loading ? '...' : `${done} / ${total} solved`}
                </div>
                <div className="xp-bar-track">
                  <div style={{
                    height: '100%',
                    width: loading ? '0%' : `${pct}%`,
                    background: lang.color,
                    borderRadius: 3,
                    transition: 'width 1s ease',
                  }} />
                </div>
                <div style={{ fontSize: 9, color: 'var(--text-4)', marginTop: 6, fontFamily: 'var(--mono)' }}>
                  {loading ? '' : `${pct}%`}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 12 }}>
        <Link to="/play" style={{ flex: 1 }}>
          <button className="btn btn-primary" style={{ width: '100%', padding: '14px', fontSize: 15 }}>
            ▶ Play Now
          </button>
        </Link>
        <Link to="/leaderboard" style={{ flex: 1 }}>
          <button className="btn btn-secondary" style={{ width: '100%', padding: '14px', fontSize: 15 }}>
            🏆 View Rankings
          </button>
        </Link>
      </div>
    </div>
  )
}
