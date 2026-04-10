import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchInterviews } from '../../store/slices/interviewSlice'

const statusBadge = { SCHEDULED: 'badge-amber', COMPLETED: 'badge-green', CANCELLED: 'badge-red' }
const modeIcon = { VIDEO: '📹', IN_PERSON: '🏢', PHONE: '📞' }

const MyInterviews = () => {
  const dispatch = useDispatch()
  const { items, loading } = useSelector(s => s.interviews)
  const { user } = useSelector(s => s.auth)

  useEffect(() => { dispatch(fetchInterviews()) }, [])

  const myInterviews = items.filter(i => i.candidateId === user?.id || i.candidateName === user?.name)
  const upcoming = myInterviews.filter(i => i.status === 'SCHEDULED')
  const past = myInterviews.filter(i => i.status !== 'SCHEDULED')

  const Section = ({ title, list }) => (
    <div style={{ marginBottom: 28 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 14 }}>{title} ({list.length})</div>
      {list.length === 0 ? (
        <div className="glass-card" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>No {title.toLowerCase()}</div>
      ) : list.map(iv => (
        <div key={iv.id} className="glass-card" style={{ padding: 24, marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                {modeIcon[iv.mode] || '🎯'}
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Interview with {iv.interviewerName}</div>
                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>📅 {iv.interviewDate}</span>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>🕐 {iv.interviewTime}</span>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>⏱️ {iv.duration} min</span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
              <span className={`badge ${statusBadge[iv.status]}`}>{iv.status}</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{iv.mode?.replace('_', ' ')}</span>
            </div>
          </div>

          {iv.meetingLink && iv.status === 'SCHEDULED' && (
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(99,102,241,0.08)' }}>
              <a href={iv.meetingLink} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>
                📹 Join Video Meeting
              </a>
            </div>
          )}

          {iv.feedback && (
            <div style={{ marginTop: 16, padding: '14px 16px', background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.12)', borderRadius: 10 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>Interviewer Feedback</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{iv.feedback}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  )

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">My Interviews</div>
          <div className="page-subtitle">{upcoming.length} upcoming · {past.length} completed</div>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: 60, textAlign: 'center' }}><span className="spinner" /></div>
      ) : myInterviews.length === 0 ? (
        <div className="glass-card" style={{ padding: 60, textAlign: 'center' }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>📅</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>No Interviews Yet</div>
          <div style={{ color: 'var(--text-muted)', fontSize: 14 }}>When you're shortlisted, your interviews will appear here.</div>
        </div>
      ) : (
        <>
          <Section title="Upcoming" list={upcoming} />
          <Section title="Past Interviews" list={past} />
        </>
      )}
    </div>
  )
}

export default MyInterviews
