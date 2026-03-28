import { useEffect, useState } from 'react'

export default function XPBar({ user }) {
  const xpForNext = user.level * 200 + 100
  const pct = Math.min((user.xp / xpForNext) * 100, 100)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 150)
    return () => clearTimeout(t)
  }, [pct])

  const tierLabel = user.level < 5 ? 'Beginner' : user.level < 10 ? 'Intermediate' : user.level < 15 ? 'Advanced' : user.level < 20 ? 'Expert' : 'Legend'
  const tierColor = user.level < 5 ? '#10b981' : user.level < 10 ? '#3b82f6' : user.level < 15 ? '#a78bfa' : user.level < 20 ? '#f59e0b' : '#ec4899'

  return (
    <div className="card" style={{ padding: '20px 24px', marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            padding: '4px 14px', borderRadius: 'var(--r-full)',
            background: `${tierColor}20`, border: `1px solid ${tierColor}50`,
            fontSize: 12, fontWeight: 700, color: tierColor, fontFamily: 'var(--mono)',
          }}>
            LVL {user.level}
          </div>
          <span style={{ fontSize: 13, color: 'var(--text-2)', fontWeight: 500 }}>{tierLabel}</span>
        </div>
        <span style={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text-3)' }}>
          <span style={{ color: 'var(--orange)', fontWeight: 700 }}>{user.xp.toLocaleString()}</span>
          {' '}/ {xpForNext.toLocaleString()} XP
        </span>
      </div>
      <div className="xp-bar-track" style={{ height: 8 }}>
        <div className="xp-bar-fill" style={{ width: `${width}%` }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
        <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--mono)' }}>
          {user.streak_days > 0 && (
            <span>
              🔥 {user.streak_days}-day streak
              {user.streak_days >= 5 && <span style={{ color: 'var(--orange)', marginLeft: 6 }}>· 1.5× XP active!</span>}
            </span>
          )}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--mono)' }}>
          {(xpForNext - user.xp).toLocaleString()} XP to Level {user.level + 1}
        </div>
      </div>
    </div>
  )
}
