import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../api/client'
import useStore from '../store/useStore'

function AuthPage({ mode }) {
  const navigate = useNavigate()
  const { setUser } = useStore()
  const isLogin = mode === 'login'
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const update = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const validate = () => {
    const e = {}
    if (!form.username.trim()) e.username = 'Username is required'
    if (!isLogin && !form.email.trim()) e.email = 'Email is required'
    if (!form.password) e.password = 'Password is required'
    if (!isLogin && form.password.length < 8) e.password = 'Minimum 8 characters required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = async () => {
    if (!validate()) return
    setLoading(true)
    try {
      if (isLogin) {
        const { data } = await api.post('/auth/login', { username: form.username, password: form.password })
        localStorage.setItem('g_access', data.access_token)
        localStorage.setItem('g_refresh', data.refresh_token)
        const { data: me } = await api.get('/progress/me')
        setUser(me)
        toast.success(`Welcome back, ${me.username}!`)
        navigate('/dashboard')
      } else {
        await api.post('/auth/register', form)
        toast.success('Account created! Sign in to begin.')
        navigate('/login')
      }
    } catch (err) {
      const msg = err.response?.data?.detail
      if (typeof msg === 'string') toast.error(msg)
      else toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, background: 'var(--bg-0)',
    }}>
      {/* Background glow */}
      <div style={{
        position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)',
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: 420, animation: 'fadeInUp 0.4s ease' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14, margin: '0 auto 16px',
            background: 'linear-gradient(135deg, var(--purple), var(--orange))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, fontWeight: 800, color: '#fff',
          }}>G</div>
          <h1 style={{ fontSize: 26, marginBottom: 6 }}>
            {isLogin ? 'Welcome back' : 'Join Gamify'}
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-3)' }}>
            {isLogin ? 'Sign in to continue your journey' : 'Start your coding adventure today'}
          </p>
        </div>

        <div className="card" style={{ padding: '28px 28px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Username */}
            <div>
              <label style={{ fontSize: 12, color: 'var(--text-2)', display: 'block', marginBottom: 8, fontWeight: 600 }}>
                USERNAME
              </label>
              <input
                value={form.username} onChange={update('username')}
                onKeyDown={e => e.key === 'Enter' && submit()}
                placeholder="your_username"
                autoComplete="username"
                style={errors.username ? { borderColor: 'var(--red)' } : {}}
              />
              {errors.username && <div style={{ fontSize: 11, color: 'var(--red)', marginTop: 5 }}>{errors.username}</div>}
            </div>

            {/* Email (register only) */}
            {!isLogin && (
              <div>
                <label style={{ fontSize: 12, color: 'var(--text-2)', display: 'block', marginBottom: 8, fontWeight: 600 }}>
                  EMAIL
                </label>
                <input
                  type="email" value={form.email} onChange={update('email')}
                  onKeyDown={e => e.key === 'Enter' && submit()}
                  placeholder="you@example.com"
                  autoComplete="email"
                  style={errors.email ? { borderColor: 'var(--red)' } : {}}
                />
                {errors.email && <div style={{ fontSize: 11, color: 'var(--red)', marginTop: 5 }}>{errors.email}</div>}
              </div>
            )}

            {/* Password */}
            <div>
              <label style={{ fontSize: 12, color: 'var(--text-2)', display: 'block', marginBottom: 8, fontWeight: 600 }}>
                PASSWORD
              </label>
              <input
                type="password" value={form.password} onChange={update('password')}
                onKeyDown={e => e.key === 'Enter' && submit()}
                placeholder={isLogin ? '••••••••' : 'Min 8 chars · 1 uppercase · 1 number'}
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                style={errors.password ? { borderColor: 'var(--red)' } : {}}
              />
              {errors.password && <div style={{ fontSize: 11, color: 'var(--red)', marginTop: 5 }}>{errors.password}</div>}
            </div>

            <button
              className="btn btn-primary" style={{ width: '100%', padding: '13px', fontSize: 15, marginTop: 4, borderRadius: 12 }}
              onClick={submit} disabled={loading}
            >
              {loading ? 'Please wait...' : isLogin ? 'Sign In →' : 'Create Account →'}
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: 22, fontSize: 13, color: 'var(--text-3)' }}>
            {isLogin ? (
              <>No account? <Link to="/register" style={{ color: 'var(--purple-light)', textDecoration: 'none', fontWeight: 600 }}>Sign up free</Link></>
            ) : (
              <>Already have an account? <Link to="/login" style={{ color: 'var(--purple-light)', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link></>
            )}
          </div>
        </div>

        {!isLogin && (
          <p style={{ textAlign: 'center', marginTop: 16, fontSize: 11, color: 'var(--text-4)' }}>
            Free forever. No credit card required.
          </p>
        )}
      </div>
    </div>
  )
}

export const LoginPage = () => <AuthPage mode="login" />
export const RegisterPage = () => <AuthPage mode="register" />
