import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { loginUser, googleLogin, clearError } from '../../store/slices/authSlice'
import { toggleTheme } from '../../store/slices/themeSlice'
import ThreeBackground from '../../components/ThreeBackground'
import { GoogleLogin,useGoogleLogin} from '@react-oauth/google'

const DEMO = [
  { label: 'Admin',     email: 'admin@recruitEdge.com',     password: 'admin123', color: '#f43f5e' },
  { label: 'Recuriter',        email: 'hr@recruitEdge.com',         password: 'hr123',    color: '#10b981' },
  { label: 'Candidate', email: 'candidate@recruitEdge.com', password: 'cand123',  color: '#6366f1' },
]

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' })
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, isAuthenticated } = useSelector(s => s.auth)
  const { mode } = useSelector(s => s.theme)
  const isLight = mode === 'light'

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode)
  }, [mode])

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true })
    return () => dispatch(clearError())
  }, [isAuthenticated])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await dispatch(loginUser(form))
    if (loginUser.fulfilled.match(result)) navigate('/dashboard')
  }

  const handleGoogle =  useGoogleLogin({
    onSuccess: async (credentialResponse) => {
        const token = credentialResponse.access_token
        const result = await dispatch(googleLogin(token))
        if (googleLogin.fulfilled.match(result)) navigate('/dashboard')
    },
    onError: () => console.error('Google Login Failed'),
  })
  
  return (
    <div style={{ position: 'relative', minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: 'var(--bg-primary)', padding: '16px' }}>
      <ThreeBackground />

      {/* Glow overlay */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 1, background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.07) 0%, transparent 65%)', pointerEvents: 'none' }} />

      {/* Theme toggle */}
      <button
        onClick={() => dispatch(toggleTheme())}
        style={{ position: 'fixed', top: 16, right: 16, zIndex: 10, width: 40, height: 40, borderRadius: 10, background: 'var(--bg-card)', border: '1px solid var(--border-glass)', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(12px)' }}
      >
        {isLight ? '🌙' : '☀️'}
      </button>

      <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: 420 }}>
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 52, height: 52, margin: '0 auto 14px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24, color: 'white', boxShadow: '0 8px 32px rgba(99,102,241,0.4)' }}>R</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px,5vw,30px)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>Welcome Back</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Sign in to your recruitEdge account</p>
        </div>

        {/* Card */}
        <div className="glass-card auth-card" style={{ padding: 28 }}>
          {error && <div className="alert alert-error">⚠️{' '} {error}</div>}

          {/* Demo quick fill */}
          <div style={{ marginBottom: 22 }}>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', textAlign: 'center', marginBottom: 9, textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700 }}>Quick Demo</div>
            <div className="auth-demo-btns" style={{ display: 'flex', gap: 8 }}>
              {DEMO.map(d => (
                <button
                  key={d.label}
                  onClick={() => setForm({ email: d.email, password: d.password })}
                  style={{
                    flex: 1, padding: '7px 6px', borderRadius: 8, cursor: 'pointer',
                    background: `${d.color}14`, border: `1px solid ${d.color}40`,
                    color: d.color, fontSize: 12, fontWeight: 700,
                    fontFamily: 'var(--font-body)', transition: 'all 0.15s',
                  }}
                >{d.label}</button>
              ))}
            </div>
          </div>

          <div className="divider" />

          <form onSubmit={handleSubmit} style={{ marginTop: 18 }}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input name="email" type="email" className="form-control" placeholder="you@example.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required autoComplete="email" />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input name="password" type="password" className="form-control" placeholder="••••••••" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required autoComplete="current-password" />
            </div>
            <button type="submit" className="btn btn-primary btn-lg w-full" style={{ justifyContent: 'center' }} disabled={loading}>
              {loading ? <><span className="spinner" /> Signing in...</> : 'Sign In →'}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '18px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>or</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
          </div>

          <button onClick={handleGoogle} className="btn w-full" style={{ justifyContent: 'center', background: 'var(--bg-hover)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', fontSize: 14 }} disabled={loading}>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div style={{ textAlign: 'center', marginTop: 18, fontSize: 13, color: 'var(--text-muted)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--accent-blue)', fontWeight: 600, textDecoration: 'none' }}>Create one →</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
