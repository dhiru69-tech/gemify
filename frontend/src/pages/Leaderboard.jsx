import { useEffect, useState } from 'react'
import api from '../api/client'

const MEDALS = { 1: '🥇', 2: '🥈', 3: '🥉' }
const MEDAL_COLORS = { 1: '#f59e0b', 2: '#94a3b8', 3: '#b45309' }

export default function Leaderboard() {
  const [board, setBoard] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/leaderboard/').then(r => setBoard(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <div className="container page-enter">
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ marginBottom: 6 }}>Global Rankings</h1>
        <p style={{ fontSize: 13, color: 'var(--text-3)', fontFamily: 'var(--mono)' }}>
          // updated in real time · {board.length} players
        </p>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        {/* Header */}
        <div style={{
          display: 'grid', gridTemplateColumns: '52px 1fr 80px 100px',
          gap: 12, padding: '12px 20px',
          borderBottom: '1px solid var(--border)',
          fontSize: 10, color: 'var(--text-4)',
          textTransform: 'uppercase', letterSpacing: 1.2,
        }}>
          <span>Rank</span>
          <span>Player</span>
          <span style={{ textAlign: 'center' }}>Level</span>
          <span style={{ textAlign: 'right' }}>Total XP</span>
        </div>

        {loading ? (
          <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-3)', fontFamily: 'var(--mono)' }}>
            Loading rankings...
          </div>
        ) : board.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-3)' }}>
            No players yet. Be the first!
          </div>
        ) : board.map((entry, i) => (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '52px 1fr 80px 100px',
            gap: 12, padding: '14px 20px',
            borderBottom: i < board.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
            background: entry.is_me ? 'rgba(124,58,237,0.06)' : 'transparent',
            borderLeft: entry.is_me ? '3px solid var(--purple)' : '3px solid transparent',
            alignItems: 'center',
            transition: 'background 0.15s',
          }}
            onMouseEnter={e => { if (!entry.is_me) e.currentTarget.style.background = 'rgba(255,255,255,0.02)' }}
            onMouseLeave={e => { e.currentTarget.style.background = entry.is_me ? 'rgba(124,58,237,0.06)' : 'transparent' }}
          >
            {/* Rank */}
            <div style={{
              fontWeight: 800, fontSize: entry.rank <= 3 ? 20 : 13,
              color: MEDAL_COLORS[entry.rank] || 'var(--text-3)',
              fontFamily: 'var(--mono)',
            }}>
              {MEDALS[entry.rank] || `#${entry.rank}`}
            </div>

            {/* Player */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                background: entry.is_me ? 'rgba(124,58,237,0.3)' : 'var(--bg-4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700,
                color: entry.is_me ? 'var(--purple-light)' : 'var(--text-2)',
              }}>
                {entry.username.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: entry.is_me ? 'var(--text-1)' : 'var(--text-2)' }}>
                  {entry.username}
                  {entry.is_me && <span style={{ fontSize: 10, color: 'var(--purple-light)', marginLeft: 6 }}>YOU</span>}
                </div>
                {entry.streak > 0 && (
                  <div style={{ fontSize: 10, color: 'var(--text-4)', fontFamily: 'var(--mono)' }}>
                    🔥 {entry.streak}-day streak
                  </div>
                )}
              </div>
            </div>

            {/* Level */}
            <div style={{ textAlign: 'center' }}>
              <span style={{
                padding: '3px 10px', borderRadius: 'var(--r-full)',
                background: 'var(--purple-dim)', color: 'var(--purple-light)',
                fontSize: 11, fontWeight: 700, fontFamily: 'var(--mono)',
              }}>
                LVL {entry.level}
              </span>
            </div>

            {/* XP */}
            <div style={{ textAlign: 'right', fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 13, color: 'var(--orange)' }}>
              {entry.total_xp.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
