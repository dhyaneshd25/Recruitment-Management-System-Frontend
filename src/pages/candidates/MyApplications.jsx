import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCandidates } from '../../store/slices/candidateSlice'
import { useNavigate } from 'react-router-dom'

const STATUS_STEPS = ['APPLIED', 'SHORTLISTED', 'INTERVIEW_SCHEDULED', 'HIRED']

const STATUS_CONFIG = {
  APPLIED:              { label: 'Applied',             color: '#6366f1', bg: 'rgba(99,102,241,0.15)',   border: 'rgba(99,102,241,0.35)',   icon: '📨' },
  SHORTLISTED:          { label: 'Shortlisted',         color: '#22d3ee', bg: 'rgba(34,211,238,0.15)',   border: 'rgba(34,211,238,0.35)',   icon: '⭐' },
  INTERVIEW_SCHEDULED:  { label: 'Interview Scheduled', color: '#a78bfa', bg: 'rgba(167,139,250,0.15)',  border: 'rgba(167,139,250,0.35)',  icon: '📅' },
  HIRED:                { label: 'Hired! 🎉',           color: '#10b981', bg: 'rgba(16,185,129,0.15)',   border: 'rgba(16,185,129,0.35)',   icon: '🏆' },
  REJECTED:             { label: 'Not Selected',        color: '#f43f5e', bg: 'rgba(244,63,94,0.15)',    border: 'rgba(244,63,94,0.35)',    icon: '😔' },
}

const STEP_LABELS = ['Applied', 'Shortlisted', 'Interview', 'Hired']

const ProgressTracker = ({ status }) => {
  const currentStep = STATUS_STEPS.indexOf(status)
  const isRejected = status === 'REJECTED'

  if (isRejected) return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: 'rgba(244,63,94,0.07)', border: '1px solid rgba(244,63,94,0.2)', borderRadius: 12 }}>
      <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(244,63,94,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>😔</div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#f43f5e' }}>Not Selected This Time</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Keep applying — the right opportunity is around the corner.</div>
      </div>
    </div>
  )

  return (
    <div style={{ padding: '16px 0 4px' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {STEP_LABELS.map((label, i) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', flex: i < STEP_LABELS.length - 1 ? 1 : 'none' }}>
            {/* Step bubble */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                background: i < currentStep
                  ? 'linear-gradient(135deg,#6366f1,#8b5cf6)'
                  : i === currentStep
                    ? 'linear-gradient(135deg,#6366f1,#22d3ee)'
                    : 'rgba(99,102,241,0.1)',
                border: i <= currentStep ? 'none' : '1px solid rgba(99,102,241,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: i < currentStep ? 14 : 12,
                color: i <= currentStep ? 'white' : 'var(--text-muted)',
                boxShadow: i === currentStep ? '0 0 0 4px rgba(99,102,241,0.2)' : 'none',
                transition: 'all 0.3s ease',
              }}>
                {i < currentStep ? '✓' : i + 1}
              </div>
              <div style={{
                fontSize: 11, whiteSpace: 'nowrap',
                color: i === currentStep ? 'var(--accent-blue)' : i < currentStep ? 'var(--text-secondary)' : 'var(--text-muted)',
                fontWeight: i === currentStep ? 700 : 400,
              }}>
                {label}
              </div>
            </div>
            {/* Connector line */}
            {i < STEP_LABELS.length - 1 && (
              <div style={{
                flex: 1, height: 2, marginBottom: 22,
                background: i < currentStep
                  ? 'linear-gradient(90deg,#6366f1,#8b5cf6)'
                  : 'rgba(99,102,241,0.12)',
                margin: '0 6px 22px',
                transition: 'background 0.3s ease',
              }} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

const MyApplications = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items, loading } = useSelector(s => s.candidates)
  const { user } = useSelector(s => s.auth)

  useEffect(() => { dispatch(fetchCandidates()) }, [])

  // Filter only applications by the current user
  const myApps = items.filter(c =>
    c.userId === user?.id || c.userName === user?.name
  ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  const stats = {
    total: myApps.length,
    shortlisted: myApps.filter(a => ['SHORTLISTED', 'INTERVIEW_SCHEDULED', 'HIRED'].includes(a.status)).length,
    interviews: myApps.filter(a => a.status === 'INTERVIEW_SCHEDULED').length,
    hired: myApps.filter(a => a.status === 'HIRED').length,
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">My Applications</div>
          <div className="page-subtitle">Track the status of every job you've applied to</div>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/browse-jobs')}>
          + Apply to More Jobs
        </button>
      </div>

      {/* Stats row */}
      {myApps.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 28 }}>
          {[
            { n: stats.total,       label: 'Applied',     color: '#6366f1', icon: '📨' },
            { n: stats.shortlisted, label: 'Shortlisted', color: '#22d3ee', icon: '⭐' },
            { n: stats.interviews,  label: 'Interviews',  color: '#a78bfa', icon: '📅' },
            { n: stats.hired,       label: 'Offers',      color: '#10b981', icon: '🏆' },
          ].map(s => (
            <div key={s.label} className="glass-card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{s.icon}</div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, color: s.color }}>{s.n}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {loading ? (
        <div style={{ padding: 80, textAlign: 'center' }}><span className="spinner" style={{ width: 32, height: 32 }} /></div>
      ) : myApps.length === 0 ? (
        <div className="glass-card" style={{ padding: '70px 40px', textAlign: 'center' }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>🚀</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 10 }}>No Applications Yet</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: 15, marginBottom: 28, maxWidth: 380, margin: '0 auto 28px' }}>
            Browse open positions and submit your first application. Your dream job is waiting!
          </div>
          <button className="btn btn-primary btn-lg" style={{ margin: 'auto' }} onClick={() => navigate('/browse-jobs')}>
            Browse Open Jobs →
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {myApps.map(app => {
            const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.APPLIED
            return (
              <div key={app.id} className="glass-card" style={{ padding: 24, borderLeft: `3px solid ${cfg.color}` }}>
                {/* Top row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 18 }}>
                  <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <div style={{ width: 48, height: 48, borderRadius: 14, background: `${cfg.color}15`, border: `1px solid ${cfg.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                      {cfg.icon}
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>{app.jobTitle}</div>
                      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                        {app.jobLocation && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>📍 {app.jobLocation}</span>}
                        {app.jobSalary && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>💰 {app.jobSalary}</span>}
                        {app.jobCompany && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>🏢 {app.jobCompany}</span>}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                    <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
                      {cfg.label}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      Applied {app.createdAt ? new Date(app.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                    </span>
                  </div>
                </div>

                {/* Progress tracker */}
                <ProgressTracker status={app.status} />

                {/* Footer - resume & cover note */}
                {(app.resumeUrl || app.coverNote) && (
                  <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(99,102,241,0.08)', display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
                    {app.resumeUrl && (
                      <a href={app.resumeUrl} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: 'var(--accent-blue)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 6, background: 'rgba(99,102,241,0.06)' }}>
                        📄 View Submitted Resume →
                      </a>
                    )}
                    {app.coverNote && (
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic' }}>
                        "{app.coverNote.slice(0, 80)}{app.coverNote.length > 80 ? '…' : ''}"
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default MyApplications
