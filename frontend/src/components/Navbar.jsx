import { Link, useLocation, useNavigate } from 'react-router-dom'
import useStore from '../store/useStore'
import toast from 'react-hot-toast'

const LANG_ICONS = { python: '🐍', javascript: '⚡', cpp: '⚙️', java: '☕' }

export default function Navbar() {
  const { user, isLoggedIn, logout } = useStore()
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const xpForNext = user ? user.level * 200 + 100 : 300
  const pct = user ? Math.min((user.xp / xpForNext) * 100, 100) : 0

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  return (
    <nav style={{
      background: 'rgba(6,6,16,0.95)',
      borderBottom: '1px solid var(--border)',
      backdropFilter: 'blur(12px)',
      position: 'sticky', top: 0, zIndex: 100,
      height: 60,
      display: 'flex', alignItems: 'center',
      padding: '0 24px',
      justifyContent: 'space-between',
    }}>
      {/* Logo */}
      <Link to={isLoggedIn ? '/dashboard' : '/'} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 30, height: 30, borderRadius: 8,
          background: 'linear-gradient(135deg, var(--purple), var(--orange))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, fontWeight: 800, color: '#fff',
        }}>G</div>
        <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: '-0.3px', color: 'var(--text-1)' }}>
          Gamify
        </span>
      </Link>

      {isLoggedIn && user ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          {/* Nav Links */}
          <div style={{ display: 'flex', gap: 4 }}>
            {[
              { to: '/dashboard', label: 'Dashboard' },
              { to: '/play', label: 'Play' },
              { to: '/leaderboard', label: 'Rankings' },
            ].map(({ to, label }) => (
              <Link key={to} to={to} style={{
                textDecoration: 'none',
                padding: '6px 14px',
                borderRadius: 8,
                fontSize: 13, fontWeight: 600,
                color: pathname.startsWith(to) ? 'var(--purple-light)' : 'var(--text-2)',
                background: pathname.startsWith(to) ? 'var(--purple-dim)' : 'transparent',
                transition: 'all 0.15s',
              }}>
                {label}
              </Link>
            ))}
          </div>

          {/* XP Info + Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'var(--mono)', marginBottom: 4 }}>
                LVL {user.level} · {user.xp} / {xpForNext} XP
              </div>
              <div className="xp-bar-track" style={{ width: 80 }}>
                <div className="xp-bar-fill" style={{ width: `${pct}%` }} />
              </div>
            </div>
            <button onClick={handleLogout} title="Logout" style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--purple), var(--orange))',
              border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: 800, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'transform 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              {user.username.slice(0, 2).toUpperCase()}
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 8 }}>
          <Link to="/login"><button className="btn btn-secondary btn-sm">Sign In</button></Link>
          <Link to="/register"><button className="btn btn-primary btn-sm">Get Started</button></Link>
        </div>
      )}
    </nav>
  )
}
