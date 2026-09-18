import { useSelector, useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { toggleTheme } from '../store/slices/themeSlice'
import { useState, useEffect } from 'react'
import { logout } from '../store/slices/authSlice'

const PAGE_META = {
  '/dashboard':       { title: 'Dashboard',       emoji: '▦' },
  '/jobs':            { title: 'Job Listings',     emoji: '💼' },
  '/browse-jobs':     { title: 'Browse Jobs',      emoji: '🔍' },
  '/candidates':      { title: 'Candidates',       emoji: '👤' },
  '/interviews':      { title: 'Interviews',       emoji: '🎯' },
  '/users':           { title: 'Users',            emoji: '👥' },
  '/my-applications': { title: 'My Applications',  emoji: '📋' },
  '/my-interviews':   { title: 'My Interviews',    emoji: '📅' },
  '/ai-interviews':   { title: 'Mock Ai Interview',    emoji: '🤖' },
}


const ROLE_STYLE = {
  ADMIN:     { color: '#f43f5e', bg: 'rgba(244,63,94,0.12)',  border: 'rgba(244,63,94,0.3)' },
  RECURITER:        { color: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)' },
  CANDIDATE: { color: '#818cf8', bg: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.3)' },
}



const Navbar = ({ onMenuToggle }) => {
  const { user } = useSelector(s => s.auth)
  const { mode } = useSelector(s => s.theme)
  const dispatch = useDispatch()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const meta = PAGE_META[pathname] || { title: 'recruitEdge', emoji: '✦' }
  const isLight = mode === 'light'
  const rs = ROLE_STYLE[user?.role] || ROLE_STYLE.CANDIDATE
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode)
  }, [mode])

  return (
    <header className="navbar">
      {/* Left */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Hamburger */}
        <button
          className="hamburger"
          onClick={onMenuToggle}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(99,102,241,0.12)', border: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0 }}>
            {meta.emoji}
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', lineHeight: 1 }}>{meta.title}</div>
          </div>
        </div>
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Browse Jobs CTA for candidate */}
        {user?.role === 'CANDIDATE' && pathname !== '/browse-jobs' && (
          <button
            onClick={() => navigate('/browse-jobs')}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <span>🔍</span>
            <span className="hide-xs">Browse Jobs</span>
          </button>
        )}

        {/* Theme toggle */}
        <button
          onClick={() => dispatch(toggleTheme())}
          title={isLight ? 'Switch to Dark' : 'Switch to Light'}
          style={{
            width: 38, height: 38, borderRadius: 10,
            background: 'var(--bg-hover)',
            border: '1px solid var(--border-subtle)',
            cursor: 'pointer', fontSize: 17,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'var(--transition)', flexShrink: 0,
          }}
        >
          {isLight ? '🌙' : '☀️'}
        </button>

        {/* Divider */}
        <div style={{ width: 1, height: 22, background: 'var(--border-subtle)', flexShrink: 0 }} />

        {/* User chip */}
        <div
          onClick={() => setShowLogoutModal(true)}
          title="Click to sign out"
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '5px 10px', borderRadius: 10,
            background: 'rgba(99,102,241,0.06)',
            cursor: 'pointer',
            border: '1px solid var(--border-subtle)',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.14)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.06)' }}
        >
          <div style={{
            width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 700, color: 'white',
          }}>{user?.name?.charAt(0) || 'U'}</div>
          <div className="hide-sm">
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2, whiteSpace: 'nowrap' }}>{user?.name}</div>
            <div style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{user?.role}</div>
          </div>
        </div>
      </div>

      {/* Logout confirmation modal */}
      {showLogoutModal && (
        <div className="modal-overlay" onClick={() => setShowLogoutModal(false)}>
          <div
            className="modal-box"
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: 360, textAlign: 'center', padding: '26px 22px' }}
          >
            <div style={{
              width: 48, height: 48, borderRadius: '50%',
              background: 'rgba(244,63,94,0.12)', border: '1px solid rgba(244,63,94,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, margin: '0 auto 12px',
            }}>
              🚪
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
              Sign Out?
            </h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 22, fontSize: 13, lineHeight: 1.5 }}>
              Are you sure you want to sign out of <strong>{user?.name || 'your account'}</strong>?
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowLogoutModal(false)}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => {
                  setShowLogoutModal(false)
                  dispatch(logout())
                  navigate('/login')
                }}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width:640px) { .hide-sm { display:none!important; } }
        @media (max-width:400px) { .hide-xs { display:none!important; } }
      `}</style>
    </header>
  )
}

export default Navbar
