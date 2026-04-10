import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../store/slices/authSlice'

const NAV = [
  { to: '/dashboard',       icon: '▦',  label: 'Dashboard',        roles: ['ADMIN','HR','CANDIDATE'] },
  { to: '/jobs',            icon: '💼', label: 'Manage Jobs',       roles: ['ADMIN','HR'] },
  { to: '/candidates',      icon: '👤', label: 'Candidates',        roles: ['ADMIN','HR'] },
  { to: '/interviews',      icon: '🎯', label: 'Interviews',        roles: ['ADMIN','HR'] },
  { to: '/users',           icon: '👥', label: 'Users',             roles: ['ADMIN'] },
  { to: '/browse-jobs',     icon: '🔍', label: 'Browse Jobs',       roles: ['CANDIDATE'] },
  { to: '/my-applications', icon: '📋', label: 'My Applications',   roles: ['CANDIDATE'] },
  { to: '/my-interviews',   icon: '📅', label: 'My Interviews',     roles: ['CANDIDATE'] },
]

const ROLE_STYLE = {
  ADMIN:     { color: '#f43f5e', bg: 'rgba(244,63,94,0.12)',  border: 'rgba(244,63,94,0.3)' },
  HR:        { color: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)' },
  CANDIDATE: { color: '#818cf8', bg: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.3)' },
}

const Sidebar = ({ onClose }) => {
  const { user } = useSelector(s => s.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const rs = ROLE_STYLE[user?.role] || ROLE_STYLE.CANDIDATE
  const myNav = NAV.filter(n => !n.roles || n.roles.includes(user?.role))

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
    onClose?.()
  }

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div style={{ padding: '20px 18px 16px', borderBottom: '1px solid var(--border-subtle)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, color: 'white',
            boxShadow: '0 4px 16px rgba(99,102,241,0.4)',
          }}>R</div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17, color: 'var(--text-primary)', lineHeight: 1 }}>recruitEdge</div>
            <div style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '1.2px', marginTop: 2, textTransform: 'uppercase' }}>Smart Hiring</div>
          </div>
          {/* Close button (mobile only) */}
          <button
            onClick={onClose}
            style={{
              marginLeft: 'auto', display: 'none', background: 'none', border: 'none',
              color: 'var(--text-muted)', cursor: 'pointer', fontSize: 20, padding: 4,
            }}
            className="sidebar-close-btn"
          >✕</button>
        </div>
      </div>

      {/* User card */}
      <div style={{ padding: '12px 12px 0', flexShrink: 0 }}>
        <div style={{ padding: '12px', borderRadius: 12, background: 'rgba(99,102,241,0.06)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, color: 'white', fontSize: 14,
              boxShadow: '0 0 0 2px rgba(99,102,241,0.25)',
            }}>{user?.name?.charAt(0) || 'U'}</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 148 }}>{user?.name || 'User'}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 148 }}>{user?.email}</div>
            </div>
          </div>
          <div style={{ marginTop: 8 }}>
            <span style={{ padding: '2px 10px', borderRadius: 20, fontSize: 10, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', background: rs.bg, color: rs.color, border: `1px solid ${rs.border}` }}>
              {user?.role}
            </span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '10px 8px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
        <div style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '1px', padding: '4px 10px 8px', textTransform: 'uppercase' }}>Navigation</div>
        {myNav.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClose}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', borderRadius: 10,
              textDecoration: 'none',
              fontSize: 13, fontWeight: isActive ? 700 : 400,
              color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
              background: isActive ? 'linear-gradient(135deg,rgba(99,102,241,0.18),rgba(139,92,246,0.1))' : 'transparent',
              borderLeft: isActive ? '2px solid #6366f1' : '2px solid transparent',
              transition: 'all 0.15s',
            })}
          >
            <span style={{ fontSize: 15, flexShrink: 0, width: 20, textAlign: 'center' }}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: '10px 10px 14px', borderTop: '1px solid var(--border-subtle)', flexShrink: 0 }}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px', borderRadius: 10,
            border: '1px solid rgba(244,63,94,0.2)',
            background: 'rgba(244,63,94,0.05)',
            color: '#f87171', cursor: 'pointer',
            fontSize: 13, fontFamily: 'var(--font-body)', fontWeight: 500,
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(244,63,94,0.12)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(244,63,94,0.05)' }}
        >
          <span style={{ fontSize: 15 }}>🚪</span> Sign Out
        </button>
      </div>

      <style>{`
        @media (max-width:1024px) {
          .sidebar-close-btn { display:flex !important; }
        }
      `}</style>
    </aside>
  )
}

export default Sidebar
