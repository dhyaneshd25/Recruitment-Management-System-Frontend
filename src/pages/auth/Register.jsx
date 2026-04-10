import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { registerUser, clearError } from '../../store/slices/authSlice'
import { toggleTheme } from '../../store/slices/themeSlice'
import ThreeBackground from '../../components/ThreeBackground'

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'CANDIDATE' })
  const [formError, setFormError] = useState('')
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
    if (form.password !== form.confirmPassword) { setFormError('Passwords do not match'); return }
    if (form.password.length < 6) { setFormError('Password must be at least 6 characters'); return }
    setFormError('')
    const { confirmPassword, ...submitData } = form
    const result = await dispatch(registerUser(submitData))
    if (registerUser.fulfilled.match(result)) navigate('/dashboard')
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh', minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: 'var(--bg-primary)', padding: '16px' }}>
      <ThreeBackground />
      <div style={{ position: 'fixed', inset: 0, zIndex: 1, background: 'radial-gradient(ellipse at 75% 50%, rgba(139,92,246,0.06) 0%, transparent 60%)', pointerEvents: 'none' }} />

      {/* Theme toggle */}
      <button
        onClick={() => dispatch(toggleTheme())}
        style={{ position: 'fixed', top: 16, right: 16, zIndex: 10, width: 40, height: 40, borderRadius: 10, background: 'var(--bg-card)', border: '1px solid var(--border-glass)', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(12px)' }}
      >
        {isLight ? '🌙' : '☀️'}
      </button>

      <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: 460 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ width: 48, height: 48, margin: '0 auto 12px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, color: 'white', boxShadow: '0 8px 32px rgba(99,102,241,0.4)' }}>R</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(20px,5vw,28px)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 5 }}>Create Account</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Join recruitEdge and start hiring smarter</p>
        </div>

        <div className="glass-card auth-card" style={{ padding: 28 }}>
          {(error || formError) && <div className="alert alert-error">⚠️ {error || formError}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-control" placeholder="Your full name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-control" placeholder="you@example.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Password</label>
                <input type="password" className="form-control" placeholder="Min 6 chars" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm</label>
                <input type="password" className="form-control" placeholder="Repeat" value={form.confirmPassword} onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">I am a…</label>
              <select className="form-control" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}>
                <option value="CANDIDATE">Job Seeker / Candidate</option>
                <option value="HR">HR Manager</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary btn-lg w-full" style={{ justifyContent: 'center' }} disabled={loading}>
              {loading ? <><span className="spinner" /> Creating account...</> : 'Create Account →'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 18, fontSize: 13, color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent-blue)', fontWeight: 600, textDecoration: 'none' }}>Sign in →</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
