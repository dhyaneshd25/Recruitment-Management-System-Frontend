import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
// candidateSlice imports removed — no job grid on landing page
import { toggleTheme } from '../store/slices/themeSlice'
import ThreeBackground from '../components/ThreeBackground'

const CANDIDATE_FEATURES = [
  { icon: '🔍', title: 'Browse Curated Jobs',      desc: 'Explore hand-picked roles from top companies across domains — filtered by location, salary, and experience level.',  color: '#6366f1' },
  { icon: '⚡', title: 'One-Click Apply',           desc: 'Submit your resume and cover note in seconds. No lengthy forms, no friction — just apply and move on.',              color: '#8b5cf6' },
  { icon: '📊', title: 'Real-Time Tracking',        desc: 'See exactly where your application stands at every stage — from review to offer — with live status updates.',        color: '#22d3ee' },
  { icon: '🔔', title: 'Instant Notifications',     desc: 'Get notified the moment a recruiter views or updates your application. Never miss an important update.',             color: '#6366f1' },
  { icon: '📁', title: 'Application History',       desc: 'All your applications in one organised dashboard. Filter, sort, and revisit any submission at any time.',            color: '#8b5cf6' },
  { icon: '🎯', title: 'Role Recommendations',      desc: 'Get matched to roles that fit your skills and experience — so you spend time on applications that matter.',          color: '#22d3ee' },
]

const RECRUITER_FEATURES = [
  { icon: '📋', title: 'Post Jobs Instantly',     desc: 'Create detailed job listings in minutes. Reach thousands of qualified candidates actively looking for roles.',           color: '#6366f1' },
  { icon: '🔍', title: 'Smart Candidate Search',  desc: 'Filter applicants by skills, experience, and location. Find the perfect fit faster with intelligent matching.',         color: '#8b5cf6' },
  { icon: '📊', title: 'Pipeline Management',      desc: 'Track every applicant through your hiring funnel — from application to offer — in one streamlined dashboard.',          color: '#22d3ee' },
  { icon: '📩', title: 'Bulk Communication',       desc: 'Schedule interviews, send updates, and collaborate with your team without leaving recruitEdge.',                        color: '#10b981' },
  { icon: '📈', title: 'Hiring Analytics',         desc: 'Measure time-to-hire, source quality, and team performance with real-time reports and actionable insights.',            color: '#f59e0b' },
  { icon: '🤝', title: 'Team Collaboration',       desc: 'Invite hiring managers, share scorecards, and make decisions together — async or in real time.',                        color: '#f43f5e' },
]

const CANDIDATE_STEPS = [
  { icon: '👤', step: '01', title: 'Create Account',   desc: 'Sign up free in 60 seconds. No credit card needed.' },
  { icon: '🔍', step: '02', title: 'Browse & Apply',   desc: 'Filter by role, salary, and location. Apply with one click.' },
  { icon: '🎯', step: '03', title: 'Track Progress',   desc: 'Watch your application move through the hiring pipeline live.' },
]

const RECRUITER_STEPS = [
  { icon: '🏢', step: '01', title: 'Set Up Company',   desc: 'Register your organisation and customise your hiring brand.' },
  { icon: '📋', step: '02', title: 'Post a Job',       desc: 'Create a role in minutes — skills, salary, requirements.' },
  { icon: '🚀', step: '03', title: 'Hire Faster',      desc: 'Review, shortlist, and reach out to top candidates instantly.' },
]

// ── Apply Modal ───────────────────────────────────────────────────────────────
const ApplyModal = ({ job, onClose, navigate, isLoggedIn, user }) => {
  const dispatch = useDispatch()
  const { applyLoading } = useSelector(s => s.candidates)
  const [form, setForm] = useState({ resumeUrl: '', coverNote: '' })
  const [done, setDone] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isLoggedIn) { navigate('/register'); return }
    const result = await dispatch(createCandidate({ job, user, resumeUrl: form.resumeUrl, coverNote: form.coverNote }))
    if (createCandidate.fulfilled.match(result)) setDone(true)
  }

  if (done) return (
    <div className="modal-overlay">
      <div className="modal-box" style={{ textAlign: 'center', padding: '48px 28px' }}>
        <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'linear-gradient(135deg,#10b981,#22d3ee)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', fontSize: 30 }}>✓</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 10 }}>Application Sent! 🎉</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>Applied for <strong>{job.jobTitle}</strong>. Track status in My Applications.</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => { navigate('/my-applications'); onClose() }}>View Applications</button>
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )

  if (!isLoggedIn) return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 22 }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 19, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>Apply for {job.jobTitle}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>You need a free account to apply</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 22 }}>✕</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button className="btn btn-primary btn-lg w-full" style={{ justifyContent: 'center' }} onClick={() => { navigate('/login'); onClose() }}>🔑 Sign In to Apply</button>
          <button className="btn btn-secondary btn-lg w-full" style={{ justifyContent: 'center' }} onClick={() => { navigate('/register'); onClose() }}>✨ Create Free Account</button>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', marginTop: 4 }}>Track all your applications in one place.</p>
        </div>
      </div>
    </div>
  )

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 22 }}>
          <div>
            <div style={{ fontSize: 11, color: job.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>{job.tag}</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>{job.jobTitle}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 3 }}>📍 {job.location} · 💰 {job.salaryRange}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 22, flexShrink: 0 }}>✕</button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'rgba(99,102,241,0.06)', border: '1px solid var(--border-subtle)', borderRadius: 10, marginBottom: 18 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white', fontSize: 13, flexShrink: 0 }}>{user?.name?.charAt(0)}</div>
          <div><div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{user?.name}</div><div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{user?.email}</div></div>
          <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 700, color: '#10b981', padding: '2px 8px', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 10, background: 'rgba(16,185,129,0.1)' }}>✓ Signed In</span>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Resume / Portfolio Link *</label>
            <input className="form-control" placeholder="https://drive.google.com/your-resume" value={form.resumeUrl} onChange={e => setForm(p => ({ ...p, resumeUrl: e.target.value }))} required />
          </div>
          <div className="form-group">
            <label className="form-label">Cover Note <span style={{ fontWeight: 400, textTransform: 'none', fontSize: 10 }}>(optional)</span></label>
            <textarea className="form-control" rows={3} placeholder="Why are you a great fit?" value={form.coverNote} onChange={e => setForm(p => ({ ...p, coverNote: e.target.value }))} />
          </div>
          <button type="submit" className="btn btn-primary btn-lg w-full" style={{ justifyContent: 'center' }} disabled={applyLoading}>
            {applyLoading ? <><span className="spinner" /> Submitting...</> : 'Submit Application 🚀'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ── Main Landing ──────────────────────────────────────────────────────────────
const LandingPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isAuthenticated, user } = useSelector(s => s.auth)
  const { mode } = useSelector(s => s.theme)
  const isLight = mode === 'light'
  const [howTab, setHowTab] = useState('candidate')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode)
  }, [mode])

  const STATS = [
    { n: '200+', label: 'Open Positions' },
    { n: '50+',  label: 'Top Companies' },
    { n: '10K+', label: 'Placed Candidates' },
    { n: '98%',  label: 'Satisfaction Rate' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', overflowX: 'hidden', transition: 'background 0.3s' }}>
      <ThreeBackground />

      {/* ── Navbar ── */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200, background: 'var(--bg-navbar)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 62, padding: '0 clamp(16px,4vw,40px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{ width: 34, height: 34, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'white', fontSize: 15, boxShadow: '0 4px 14px rgba(99,102,241,0.4)' }}>rE</div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: 'var(--text-primary)' }}>recruitEdge</span>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button onClick={() => dispatch(toggleTheme())} style={{ width: 38, height: 38, borderRadius: 9, background: 'var(--bg-hover)', border: '1px solid var(--border-subtle)', cursor: 'pointer', fontSize: 17, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {isLight ? '🌙' : '☀️'}
          </button>
          {isAuthenticated ? (
            <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>Dashboard →</button>
          ) : (
            <>
              <button className="btn btn-secondary" onClick={() => navigate('/login')}>Sign In</button>
              <button className="btn btn-primary" onClick={() => navigate('/register')}>Get Started →</button>
            </>
          )}
        </div>
      </nav>

      {/* ══════════════════════════════════════════════
          1. HERO — speaks to both roles
      ══════════════════════════════════════════════ */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', overflow: 'hidden', paddingTop: 62 }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.08) 0%, transparent 65%)', pointerEvents: 'none', zIndex: 1 }} />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 760, padding: '0 20px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.28)', borderRadius: 20, padding: '5px 14px', marginBottom: 24, fontSize: 13, color: 'var(--accent-blue)' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block', animation: 'pulse 2s infinite' }} />
            200+ roles actively hiring
          </div>
          <h1 className="landing-hero-title" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.08, marginBottom: 20 }}>
            Where Great Talent{' '}
            <span style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6,#22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Meets Great Teams</span>
          </h1>
          <p style={{ fontSize: 'clamp(14px,2.5vw,18px)', color: 'var(--text-secondary)', maxWidth: 540, margin: '0 auto 36px', lineHeight: 1.65 }}>
            Whether you're looking for your next opportunity or searching for the perfect hire — recruitEdge powers both sides of the table.
          </p>

          {/* Dual CTA */}
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <button className="btn btn-primary btn-lg" style={{ minWidth: 190, justifyContent: 'center' }} onClick={() => document.getElementById('candidate-section').scrollIntoView({ behavior: 'smooth' })}>
                🎓 I'm a Candidate
              </button>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Browse & apply to jobs</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <button className="btn btn-secondary btn-lg" style={{ minWidth: 190, justifyContent: 'center' }} onClick={() => document.getElementById('recruiter-section').scrollIntoView({ behavior: 'smooth' })}>
                🏢 I'm a Recruiter
              </button>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Post jobs & hire talent</span>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 11 }}>
          <span>Scroll</span>
          <div style={{ width: 18, height: 30, border: '1px solid rgba(99,102,241,0.35)', borderRadius: 9, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '4px' }}>
            <div style={{ width: 3, height: 8, background: 'var(--accent-blue)', borderRadius: 2, animation: 'scrollBob 1.5s ease-in-out infinite' }} />
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{ padding: 'clamp(32px,5vw,56px) 24px', background: 'rgba(99,102,241,0.03)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div className="landing-stats-grid">
            {STATS.map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,5vw,42px)', fontWeight: 800, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: 5 }}>{s.n}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          2. CANDIDATE SECTION
      ══════════════════════════════════════════════ */}
      <section id="candidate-section" style={{ padding: 'clamp(56px,7vw,96px) clamp(16px,4vw,40px)', borderTop: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>

          {/* Section header */}
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 20, padding: '5px 16px', marginBottom: 14, fontSize: 12, color: '#6366f1', fontWeight: 700 }}>
              🎓 FOR CANDIDATES
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px,4vw,40px)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 12 }}>
              Find Your{' '}
              <span style={{ background: 'linear-gradient(135deg,#6366f1,#22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Dream Career</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 15, maxWidth: 480, margin: '0 auto' }}>
              Browse verified roles, apply in seconds, and track every stage of your journey — all in one place.
            </p>
          </div>

          {/* Feature grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 48 }}>
            {CANDIDATE_FEATURES.map(f => (
              <div key={f.title} className="glass-card" style={{ padding: 24, display: 'flex', gap: 16, alignItems: 'flex-start', transition: 'all 0.2s ease', position: 'relative', overflow: 'hidden' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 12px 40px rgba(0,0,0,0.3), 0 0 0 1px ${f.color}30` }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${f.color},${f.color}55)` }} />
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${f.color}18`, border: `1px solid ${f.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{f.icon}</div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>{f.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Candidate CTA */}
          <div style={{ textAlign: 'center', padding: 'clamp(28px,4vw,44px) clamp(20px,4vw,48px)', background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.06))', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 20 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(18px,3vw,26px)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 10 }}>
              Ready to land your next role?
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24, maxWidth: 400, margin: '0 auto 24px' }}>
              Join 10,000+ candidates who found their dream job through recruitEdge.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/register')} style={{ justifyContent: 'center', fontSize: 14, padding: '12px 32px' }}>
                Start Job Search Free →
              </button>
              <button className="btn btn-secondary btn-lg" onClick={() => navigate('/login')} style={{ fontSize: 14, padding: '12px 28px' }}>
                Sign In as Candidate
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          3. RECRUITER SECTION
      ══════════════════════════════════════════════ */}
      <section id="recruiter-section" style={{ padding: 'clamp(56px,7vw,96px) clamp(16px,4vw,40px)', background: 'rgba(16,185,129,0.02)', borderTop: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>

          {/* Section header */}
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 20, padding: '5px 16px', marginBottom: 14, fontSize: 12, color: '#10b981', fontWeight: 700 }}>
              🏢 FOR RECRUITERS
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px,4vw,40px)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 12 }}>
              Hire Smarter,{' '}
              <span style={{ background: 'linear-gradient(135deg,#10b981,#22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Hire Faster</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 15, maxWidth: 480, margin: '0 auto' }}>
              Everything your team needs to source, evaluate, and onboard top talent — without the chaos.
            </p>
          </div>

          {/* Feature grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 48 }}>
            {RECRUITER_FEATURES.map(f => (
              <div key={f.title} className="glass-card" style={{ padding: 24, display: 'flex', gap: 16, alignItems: 'flex-start', transition: 'all 0.2s ease', position: 'relative', overflow: 'hidden' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 12px 40px rgba(0,0,0,0.3), 0 0 0 1px ${f.color}30` }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${f.color},${f.color}55)` }} />
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${f.color}18`, border: `1px solid ${f.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{f.icon}</div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>{f.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Recruiter CTA */}
          <div style={{ textAlign: 'center', padding: 'clamp(28px,4vw,44px) clamp(20px,4vw,48px)', background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(34,211,238,0.06))', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 20 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(18px,3vw,26px)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 10 }}>
              Ready to build your dream team?
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24, maxWidth: 400, margin: '0 auto 24px' }}>
              Join 50+ companies already using recruitEdge to find and hire top talent.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn btn-lg" onClick={() => navigate('/register')} style={{ justifyContent: 'center', background: 'linear-gradient(135deg,#10b981,#22d3ee)', color: 'white', border: 'none', fontSize: 14, padding: '12px 32px', boxShadow: '0 4px 20px rgba(16,185,129,0.35)' }}>
                Start Hiring Free →
              </button>
              <button className="btn btn-secondary btn-lg" onClick={() => navigate('/login')} style={{ fontSize: 14, padding: '12px 28px' }}>
                Sign In as Recruiter
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          4. HOW IT WORKS — tabbed for both roles
      ══════════════════════════════════════════════ */}
      <section style={{ padding: 'clamp(56px,6vw,80px) clamp(16px,4vw,40px)', borderTop: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px,4vw,36px)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 10 }}>How It Works</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 28, fontSize: 14 }}>A simple process, for everyone on the platform</p>

          {/* Tab switcher */}
          <div style={{ display: 'inline-flex', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: 4, marginBottom: 36 }}>
            {[
              { key: 'candidate', label: '🎓 For Candidates' },
              { key: 'recruiter', label: '🏢 For Recruiters' },
            ].map(tab => (
              <button key={tab.key} onClick={() => setHowTab(tab.key)} style={{
                padding: '8px 22px', borderRadius: 9, cursor: 'pointer', border: 'none',
                background: howTab === tab.key ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'transparent',
                color: howTab === tab.key ? 'white' : 'var(--text-muted)',
                fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13,
                transition: 'all 0.18s',
                boxShadow: howTab === tab.key ? '0 4px 14px rgba(99,102,241,0.3)' : 'none',
              }}>{tab.label}</button>
            ))}
          </div>

          <div className="landing-how-grid">
            {(howTab === 'candidate' ? CANDIDATE_STEPS : RECRUITER_STEPS).map(item => (
              <div key={item.step} className="glass-card" style={{ padding: 'clamp(20px,3vw,28px)', textAlign: 'center' }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--accent-blue)', letterSpacing: '2px', marginBottom: 12, opacity: 0.5 }}>{item.step}</div>
                <div style={{ fontSize: 32, marginBottom: 14 }}>{item.icon}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>{item.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          5. DUAL CTA BANNER
      ══════════════════════════════════════════════ */}
      <section style={{ padding: 'clamp(48px,6vw,72px) clamp(16px,4vw,40px)', borderTop: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>

          {/* Candidate CTA card */}
          <div className="glass-card" style={{ padding: 'clamp(28px,4vw,40px)', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg,#6366f1,#8b5cf6)' }} />
            <div style={{ fontSize: 40, marginBottom: 16 }}>🎓</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(18px,2.5vw,22px)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 10 }}>Looking for a Job?</h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 24 }}>
              Browse hundreds of verified openings, apply with one click, and track every stage of your application.
            </p>
            <button className="btn btn-primary btn-lg w-full" style={{ justifyContent: 'center' }} onClick={() => navigate('/register')}>
              Join as Candidate →
            </button>
          </div>

          {/* Recruiter CTA card */}
          <div className="glass-card" style={{ padding: 'clamp(28px,4vw,40px)', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg,#10b981,#22d3ee)' }} />
            <div style={{ fontSize: 40, marginBottom: 16 }}>🏢</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(18px,2.5vw,22px)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 10 }}>Hiring Talent?</h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 24 }}>
              Post roles, filter top applicants, manage your pipeline, and make great hires — all in one place.
            </p>
            <button className="btn btn-lg w-full" style={{ justifyContent: 'center', background: 'linear-gradient(135deg,#10b981,#22d3ee)', color: 'white', border: 'none', boxShadow: '0 4px 20px rgba(16,185,129,0.3)' }} onClick={() => navigate('/register')}>
              Join as Recruiter →
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid var(--border-subtle)', padding: 'clamp(16px,3vw,24px) clamp(16px,4vw,40px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <div style={{ width: 26, height: 26, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'white', fontSize: 12 }}>rE</div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-secondary)', fontSize: 13 }}>recruitEdge</span>
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>© 2024 recruitEdge. All rights reserved.</div>
        <div style={{ display: 'flex', gap: 16 }}>
          {['Privacy', 'Terms', 'Contact'].map(l => <a key={l} href="#" style={{ fontSize: 12, color: 'var(--text-muted)', textDecoration: 'none' }}>{l}</a>)}
        </div>
      </footer>


      <style>{`
        @keyframes pulse    { 0%,100%{opacity:1}      50%{opacity:0.4} }
        @keyframes scrollBob{ 0%,100%{transform:translateY(0)} 50%{transform:translateY(8px)} }
      `}</style>
    </div>
  )
}

export default LandingPage



// import { useState, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { useSelector, useDispatch } from 'react-redux'
// import { createCandidate, fetchCandidates } from '../store/slices/candidateSlice'
// import { toggleTheme } from '../store/slices/themeSlice'
// import ThreeBackground from '../components/ThreeBackground'

// const PUBLIC_JOBS = [
//   { id: '1', jobTitle: 'Senior React Developer', description: 'Build cutting-edge web applications using React, Redux, and GraphQL. Strong hooks and REST/GraphQL API knowledge required.', location: 'Bangalore', experience: 3, salaryRange: '15–25 LPA', createdBy: 'TechCorp',    tag: 'Frontend',  color: '#6366f1' },
//   { id: '2', jobTitle: 'Backend Java Engineer',  description: 'Spring Boot microservices, Kafka, MongoDB. Build robust, scalable backend systems for fintech applications.',               location: 'Mumbai',    experience: 5, salaryRange: '20–35 LPA', createdBy: 'FinEdge',     tag: 'Backend',   color: '#8b5cf6' },
//   { id: '3', jobTitle: 'UI/UX Designer',          description: 'Figma, Adobe XD, strong portfolio required. Own end-to-end design for web and mobile products.',                          location: 'Remote',    experience: 2, salaryRange: '8–15 LPA',  createdBy: 'DesignLab',   tag: 'Design',    color: '#22d3ee' },
//   { id: '4', jobTitle: 'DevOps Engineer',         description: 'AWS, Docker, Kubernetes, Terraform. Manage CI/CD pipelines and ensure 99.9% production uptime.',                          location: 'Hyderabad', experience: 4, salaryRange: '18–28 LPA', createdBy: 'CloudBase',   tag: 'DevOps',    color: '#10b981' },
//   { id: '5', jobTitle: 'Data Scientist',          description: 'Python, TensorFlow, PyTorch. Build ML models and deploy them to production at scale.',                                    location: 'Pune',      experience: 2, salaryRange: '12–20 LPA', createdBy: 'DataMind',    tag: 'ML/AI',     color: '#f59e0b' },
//   { id: '6', jobTitle: 'Product Manager',         description: 'Lead product roadmap for our SaaS platform. Agile, JIRA, cross-functional team experience needed.',                       location: 'Delhi',     experience: 6, salaryRange: '25–40 LPA', createdBy: 'GrowthCo',    tag: 'Product',   color: '#f43f5e' },
// ]

// const TAGS = ['All', 'Frontend', 'Backend', 'Design', 'DevOps', 'ML/AI', 'Product', 'Mobile', 'QA']

// const RECRUITER_FEATURES = [
//   { icon: '📋', title: 'Post Jobs Instantly',     desc: 'Create detailed job listings in minutes. Reach thousands of qualified candidates actively looking for roles.',           color: '#6366f1' },
//   { icon: '🔍', title: 'Smart Candidate Search',  desc: 'Filter applicants by skills, experience, and location. Find the perfect fit faster with intelligent matching.',         color: '#8b5cf6' },
//   { icon: '📊', title: 'Pipeline Management',      desc: 'Track every applicant through your hiring funnel — from application to offer — in one streamlined dashboard.',          color: '#22d3ee' },
//   { icon: '📩', title: 'Bulk Communication',       desc: 'Schedule interviews, send updates, and collaborate with your team without leaving recruitEdge.',                        color: '#10b981' },
//   { icon: '📈', title: 'Hiring Analytics',         desc: 'Measure time-to-hire, source quality, and team performance with real-time reports and actionable insights.',            color: '#f59e0b' },
//   { icon: '🤝', title: 'Team Collaboration',       desc: 'Invite hiring managers, share scorecards, and make decisions together — async or in real time.',                        color: '#f43f5e' },
// ]

// const CANDIDATE_STEPS = [
//   { icon: '👤', step: '01', title: 'Create Account',   desc: 'Sign up free in 60 seconds. No credit card needed.' },
//   { icon: '🔍', step: '02', title: 'Browse & Apply',   desc: 'Filter by role, salary, and location. Apply with one click.' },
//   { icon: '🎯', step: '03', title: 'Track Progress',   desc: 'Watch your application move through the hiring pipeline live.' },
// ]

// const RECRUITER_STEPS = [
//   { icon: '🏢', step: '01', title: 'Set Up Company',   desc: 'Register your organisation and customise your hiring brand.' },
//   { icon: '📋', step: '02', title: 'Post a Job',       desc: 'Create a role in minutes — skills, salary, requirements.' },
//   { icon: '🚀', step: '03', title: 'Hire Faster',      desc: 'Review, shortlist, and reach out to top candidates instantly.' },
// ]

// // ── Apply Modal ───────────────────────────────────────────────────────────────
// const ApplyModal = ({ job, onClose, navigate, isLoggedIn, user }) => {
//   const dispatch = useDispatch()
//   const { applyLoading } = useSelector(s => s.candidates)
//   const [form, setForm] = useState({ resumeUrl: '', coverNote: '' })
//   const [done, setDone] = useState(false)

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     if (!isLoggedIn) { navigate('/register'); return }
//     const result = await dispatch(createCandidate({ job, user, resumeUrl: form.resumeUrl, coverNote: form.coverNote }))
//     if (createCandidate.fulfilled.match(result)) setDone(true)
//   }

//   if (done) return (
//     <div className="modal-overlay">
//       <div className="modal-box" style={{ textAlign: 'center', padding: '48px 28px' }}>
//         <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'linear-gradient(135deg,#10b981,#22d3ee)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', fontSize: 30 }}>✓</div>
//         <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 10 }}>Application Sent! 🎉</h2>
//         <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>Applied for <strong>{job.jobTitle}</strong>. Track status in My Applications.</p>
//         <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
//           <button className="btn btn-primary" onClick={() => { navigate('/my-applications'); onClose() }}>View Applications</button>
//           <button className="btn btn-secondary" onClick={onClose}>Close</button>
//         </div>
//       </div>
//     </div>
//   )

//   if (!isLoggedIn) return (
//     <div className="modal-overlay" onClick={onClose}>
//       <div className="modal-box" onClick={e => e.stopPropagation()}>
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 22 }}>
//           <div>
//             <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 19, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>Apply for {job.jobTitle}</h2>
//             <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>You need a free account to apply</p>
//           </div>
//           <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 22 }}>✕</button>
//         </div>
//         <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
//           <button className="btn btn-primary btn-lg w-full" style={{ justifyContent: 'center' }} onClick={() => { navigate('/login'); onClose() }}>🔑 Sign In to Apply</button>
//           <button className="btn btn-secondary btn-lg w-full" style={{ justifyContent: 'center' }} onClick={() => { navigate('/register'); onClose() }}>✨ Create Free Account</button>
//           <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', marginTop: 4 }}>Track all your applications in one place.</p>
//         </div>
//       </div>
//     </div>
//   )

//   return (
//     <div className="modal-overlay" onClick={onClose}>
//       <div className="modal-box" onClick={e => e.stopPropagation()}>
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 22 }}>
//           <div>
//             <div style={{ fontSize: 11, color: job.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>{job.tag}</div>
//             <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>{job.jobTitle}</h2>
//             <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 3 }}>📍 {job.location} · 💰 {job.salaryRange}</p>
//           </div>
//           <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 22, flexShrink: 0 }}>✕</button>
//         </div>
//         <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'rgba(99,102,241,0.06)', border: '1px solid var(--border-subtle)', borderRadius: 10, marginBottom: 18 }}>
//           <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white', fontSize: 13, flexShrink: 0 }}>{user?.name?.charAt(0)}</div>
//           <div><div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{user?.name}</div><div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{user?.email}</div></div>
//           <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 700, color: '#10b981', padding: '2px 8px', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 10, background: 'rgba(16,185,129,0.1)' }}>✓ Signed In</span>
//         </div>
//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label className="form-label">Resume / Portfolio Link *</label>
//             <input className="form-control" placeholder="https://drive.google.com/your-resume" value={form.resumeUrl} onChange={e => setForm(p => ({ ...p, resumeUrl: e.target.value }))} required />
//           </div>
//           <div className="form-group">
//             <label className="form-label">Cover Note <span style={{ fontWeight: 400, textTransform: 'none', fontSize: 10 }}>(optional)</span></label>
//             <textarea className="form-control" rows={3} placeholder="Why are you a great fit?" value={form.coverNote} onChange={e => setForm(p => ({ ...p, coverNote: e.target.value }))} />
//           </div>
//           <button type="submit" className="btn btn-primary btn-lg w-full" style={{ justifyContent: 'center' }} disabled={applyLoading}>
//             {applyLoading ? <><span className="spinner" /> Submitting...</> : 'Submit Application 🚀'}
//           </button>
//         </form>
//       </div>
//     </div>
//   )
// }

// // ── Main Landing ──────────────────────────────────────────────────────────────
// const LandingPage = () => {
//   const navigate = useNavigate()
//   const dispatch = useDispatch()
//   const { isAuthenticated, user } = useSelector(s => s.auth)
//   const { mode } = useSelector(s => s.theme)
//   const isLight = mode === 'light'
//   const [search, setSearch] = useState('')
//   const [tag, setTag] = useState('All')
//   const [applyJob, setApplyJob] = useState(null)
//   const [howTab, setHowTab] = useState('candidate') // 'candidate' | 'recruiter'

//   useEffect(() => {
//     document.documentElement.setAttribute('data-theme', mode)
//     if (isAuthenticated) dispatch(fetchCandidates())
//   }, [mode, isAuthenticated])

//   const { items: candidates } = useSelector(s => s.candidates)
//   const appliedIds = new Set(
//     candidates.filter(c => c.userId === user?.id || c.userName === user?.name).map(c => c.jobId)
//   )

//   const filtered = PUBLIC_JOBS.filter(j => {
//     const ms = j.jobTitle.toLowerCase().includes(search.toLowerCase()) || j.location.toLowerCase().includes(search.toLowerCase())
//     const mt = tag === 'All' || j.tag === tag
//     return ms && mt
//   })

//   const STATS = [
//     { n: '200+', label: 'Open Positions' },
//     { n: '50+',  label: 'Top Companies' },
//     { n: '10K+', label: 'Placed Candidates' },
//     { n: '98%',  label: 'Satisfaction Rate' },
//   ]

//   return (
//     <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', overflowX: 'hidden', transition: 'background 0.3s' }}>
//       <ThreeBackground />

//       {/* ── Navbar ── */}
//       <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200, background: 'var(--bg-navbar)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 62, padding: '0 clamp(16px,4vw,40px)' }}>
//         <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
//           <div style={{ width: 34, height: 34, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'white', fontSize: 15, boxShadow: '0 4px 14px rgba(99,102,241,0.4)' }}>rE</div>
//           <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: 'var(--text-primary)' }}>recruitEdge</span>
//         </div>
//         <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
//           <button onClick={() => dispatch(toggleTheme())} style={{ width: 38, height: 38, borderRadius: 9, background: 'var(--bg-hover)', border: '1px solid var(--border-subtle)', cursor: 'pointer', fontSize: 17, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//             {isLight ? '🌙' : '☀️'}
//           </button>
//           {isAuthenticated ? (
//             <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>Dashboard →</button>
//           ) : (
//             <>
//               <button className="btn btn-secondary" onClick={() => navigate('/login')}>Sign In</button>
//               <button className="btn btn-primary" onClick={() => navigate('/register')}>Get Started →</button>
//             </>
//           )}
//         </div>
//       </nav>

//       {/* ══════════════════════════════════════════════
//           1. HERO — speaks to both roles
//       ══════════════════════════════════════════════ */}
//       <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', overflow: 'hidden', paddingTop: 62 }}>
//         <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.08) 0%, transparent 65%)', pointerEvents: 'none', zIndex: 1 }} />
//         <div style={{ position: 'relative', zIndex: 2, maxWidth: 760, padding: '0 20px' }}>
//           <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.28)', borderRadius: 20, padding: '5px 14px', marginBottom: 24, fontSize: 13, color: 'var(--accent-blue)' }}>
//             <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block', animation: 'pulse 2s infinite' }} />
//             {PUBLIC_JOBS.length} roles actively hiring
//           </div>
//           <h1 className="landing-hero-title" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.08, marginBottom: 20 }}>
//             Where Great Talent{' '}
//             <span style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6,#22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Meets Great Teams</span>
//           </h1>
//           <p style={{ fontSize: 'clamp(14px,2.5vw,18px)', color: 'var(--text-secondary)', maxWidth: 540, margin: '0 auto 36px', lineHeight: 1.65 }}>
//             Whether you're looking for your next opportunity or searching for the perfect hire — recruitEdge powers both sides of the table.
//           </p>

//           {/* Dual CTA */}
//           <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
//             <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
//               <button className="btn btn-primary btn-lg" style={{ minWidth: 190, justifyContent: 'center' }} onClick={() => document.getElementById('candidate-section').scrollIntoView({ behavior: 'smooth' })}>
//                 🎓 I'm a Candidate
//               </button>
//               <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Browse & apply to jobs</span>
//             </div>
//             <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
//               <button className="btn btn-secondary btn-lg" style={{ minWidth: 190, justifyContent: 'center' }} onClick={() => document.getElementById('recruiter-section').scrollIntoView({ behavior: 'smooth' })}>
//                 🏢 I'm a Recruiter
//               </button>
//               <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Post jobs & hire talent</span>
//             </div>
//           </div>
//         </div>

//         {/* Scroll indicator */}
//         <div style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 11 }}>
//           <span>Scroll</span>
//           <div style={{ width: 18, height: 30, border: '1px solid rgba(99,102,241,0.35)', borderRadius: 9, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '4px' }}>
//             <div style={{ width: 3, height: 8, background: 'var(--accent-blue)', borderRadius: 2, animation: 'scrollBob 1.5s ease-in-out infinite' }} />
//           </div>
//         </div>
//       </section>

//       {/* ── Stats ── */}
//       <section style={{ padding: 'clamp(32px,5vw,56px) 24px', background: 'rgba(99,102,241,0.03)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
//         <div style={{ maxWidth: 860, margin: '0 auto' }}>
//           <div className="landing-stats-grid">
//             {STATS.map(s => (
//               <div key={s.label} style={{ textAlign: 'center' }}>
//                 <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,5vw,42px)', fontWeight: 800, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: 5 }}>{s.n}</div>
//                 <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{s.label}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ══════════════════════════════════════════════
//           2. CANDIDATE SECTION
//       ══════════════════════════════════════════════ */}
//       <section id="candidate-section" style={{ padding: 'clamp(56px,7vw,96px) clamp(16px,4vw,40px)', maxWidth: 1200, margin: '0 auto' }}>

//         {/* Section header */}
//         <div style={{ textAlign: 'center', marginBottom: 48 }}>
//           <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 20, padding: '5px 16px', marginBottom: 14, fontSize: 12, color: '#6366f1', fontWeight: 700 }}>
//             🎓 FOR CANDIDATES
//           </div>
//           <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px,4vw,40px)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 12 }}>
//             Find Your{' '}
//             <span style={{ background: 'linear-gradient(135deg,#6366f1,#22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Dream Career</span>
//           </h2>
//           <p style={{ color: 'var(--text-secondary)', fontSize: 15, maxWidth: 460, margin: '0 auto' }}>
//             Browse hand-picked roles from top companies. Apply in seconds and track every update in real time.
//           </p>
//         </div>

//         {/* Search */}
//         <div style={{ maxWidth: 520, margin: '0 auto 18px' }}>
//           <div style={{ position: 'relative' }}>
//             <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: 'var(--text-muted)', pointerEvents: 'none' }}>🔍</span>
//             <input className="form-control" style={{ paddingLeft: 42, height: 46, borderRadius: 12, fontSize: 14 }} placeholder="Search jobs, skills, location…" value={search} onChange={e => setSearch(e.target.value)} />
//           </div>
//         </div>

//         {/* Tags */}
//         <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 32 }}>
//           {TAGS.map(t => (
//             <button key={t} onClick={() => setTag(t)} style={{
//               padding: '6px 16px', borderRadius: 20, cursor: 'pointer',
//               fontSize: 12, fontFamily: 'var(--font-body)', fontWeight: 600,
//               background: tag === t ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'var(--bg-card)',
//               color: tag === t ? 'white' : 'var(--text-secondary)',
//               border: tag === t ? 'none' : '1px solid var(--border-subtle)',
//               boxShadow: tag === t ? '0 4px 12px rgba(99,102,241,0.3)' : 'none',
//               transition: 'all 0.15s', backdropFilter: 'blur(10px)',
//             }}>{t}</button>
//           ))}
//         </div>

//         {/* Job Grid */}
//         <div className="landing-jobs-grid">
//           {filtered.map(job => {
//             const applied = appliedIds.has(job.id)
//             return (
//               <div key={job.id} className="glass-card" style={{ padding: 22, cursor: 'pointer', transition: 'all 0.2s ease', position: 'relative', overflow: 'hidden' }}
//                 onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 16px 48px rgba(0,0,0,0.35), 0 0 0 1px ${job.color}30` }}
//                 onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
//                 <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${job.color},${job.color}66)` }} />
//                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 13 }}>
//                   <div style={{ display: 'flex', gap: 11, alignItems: 'center', minWidth: 0 }}>
//                     <div style={{ width: 40, height: 40, borderRadius: 11, background: `${job.color}18`, border: `1px solid ${job.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0 }}>💼</div>
//                     <div style={{ minWidth: 0 }}>
//                       <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: 2 }}>{job.jobTitle}</div>
//                       <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{job.createdBy}</div>
//                     </div>
//                   </div>
//                   <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0, marginLeft: 8 }}>
//                     <span style={{ padding: '2px 9px', borderRadius: 10, fontSize: 10, fontWeight: 700, background: `${job.color}18`, color: job.color, border: `1px solid ${job.color}33` }}>{job.tag}</span>
//                     {applied && <span style={{ padding: '2px 9px', borderRadius: 10, fontSize: 10, fontWeight: 700, background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }}>✓ Applied</span>}
//                   </div>
//                 </div>
//                 <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 13, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{job.description}</p>
//                 <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
//                   {[['📍', job.location], ['💰', job.salaryRange], ['⏱️', `${job.experience}+ yrs`]].map(([ic, val]) => (
//                     <span key={val} style={{ fontSize: 11, color: 'var(--text-secondary)', background: 'rgba(99,102,241,0.06)', border: '1px solid var(--border-subtle)', borderRadius: 6, padding: '3px 8px', display: 'flex', alignItems: 'center', gap: 3 }}>{ic} {val}</span>
//                   ))}
//                 </div>
//                 {applied ? (
//                   <div style={{ textAlign: 'center', padding: '8px 0', fontSize: 13, color: '#10b981', fontWeight: 700, background: 'rgba(16,185,129,0.07)', borderRadius: 8, border: '1px solid rgba(16,185,129,0.2)' }}>✅ Applied</div>
//                 ) : (
//                   <button className="btn btn-primary w-full" style={{ justifyContent: 'center', fontSize: 13, padding: '9px 0' }} onClick={() => setApplyJob(job)}>
//                     Apply Now 🚀
//                   </button>
//                 )}
//               </div>
//             )
//           })}
//         </div>

//         {filtered.length === 0 && (
//           <div className="glass-card" style={{ padding: '50px 20px', textAlign: 'center', marginTop: 20 }}>
//             <div style={{ fontSize: 44, marginBottom: 14 }}>🔍</div>
//             <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>No jobs match</div>
//             <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>Try different keywords or clear the filter</div>
//           </div>
//         )}

//         {/* Candidate CTA */}
//         <div style={{ textAlign: 'center', marginTop: 40 }}>
//           <button className="btn btn-primary btn-lg" onClick={() => navigate('/register')} style={{ fontSize: 15, padding: '13px 36px' }}>
//             Create Free Candidate Account →
//           </button>
//         </div>
//       </section>

//       {/* ══════════════════════════════════════════════
//           3. RECRUITER SECTION
//       ══════════════════════════════════════════════ */}
//       <section id="recruiter-section" style={{ padding: 'clamp(56px,7vw,96px) clamp(16px,4vw,40px)', background: 'rgba(16,185,129,0.02)', borderTop: '1px solid var(--border-subtle)' }}>
//         <div style={{ maxWidth: 1100, margin: '0 auto' }}>

//           {/* Section header */}
//           <div style={{ textAlign: 'center', marginBottom: 52 }}>
//             <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 20, padding: '5px 16px', marginBottom: 14, fontSize: 12, color: '#10b981', fontWeight: 700 }}>
//               🏢 FOR RECRUITERS
//             </div>
//             <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px,4vw,40px)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 12 }}>
//               Hire Smarter,{' '}
//               <span style={{ background: 'linear-gradient(135deg,#10b981,#22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Hire Faster</span>
//             </h2>
//             <p style={{ color: 'var(--text-secondary)', fontSize: 15, maxWidth: 480, margin: '0 auto' }}>
//               Everything your team needs to source, evaluate, and onboard top talent — without the chaos.
//             </p>
//           </div>

//           {/* Feature grid */}
//           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 48 }}>
//             {RECRUITER_FEATURES.map(f => (
//               <div key={f.title} className="glass-card" style={{ padding: 24, display: 'flex', gap: 16, alignItems: 'flex-start', transition: 'all 0.2s ease', position: 'relative', overflow: 'hidden' }}
//                 onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 12px 40px rgba(0,0,0,0.3), 0 0 0 1px ${f.color}30` }}
//                 onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
//                 <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${f.color},${f.color}55)` }} />
//                 <div style={{ width: 44, height: 44, borderRadius: 12, background: `${f.color}18`, border: `1px solid ${f.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{f.icon}</div>
//                 <div>
//                   <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>{f.title}</div>
//                   <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>{f.desc}</div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Recruiter CTA */}
//           <div style={{ textAlign: 'center', padding: 'clamp(28px,4vw,44px) clamp(20px,4vw,48px)', background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(34,211,238,0.06))', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 20 }}>
//             <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(18px,3vw,26px)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 10 }}>
//               Ready to build your dream team?
//             </h3>
//             <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24, maxWidth: 400, margin: '0 auto 24px' }}>
//               Join 50+ companies already using recruitEdge to find and hire top talent.
//             </p>
//             <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
//               <button className="btn btn-lg" onClick={() => navigate('/register')} style={{ justifyContent: 'center', background: 'linear-gradient(135deg,#10b981,#22d3ee)', color: 'white', border: 'none', fontSize: 14, padding: '12px 32px', boxShadow: '0 4px 20px rgba(16,185,129,0.35)' }}>
//                 Start Hiring Free →
//               </button>
//               <button className="btn btn-secondary btn-lg" onClick={() => navigate('/login')} style={{ fontSize: 14, padding: '12px 28px' }}>
//                 Sign In as Recruiter
//               </button>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ══════════════════════════════════════════════
//           4. HOW IT WORKS — tabbed for both roles
//       ══════════════════════════════════════════════ */}
//       <section style={{ padding: 'clamp(56px,6vw,80px) clamp(16px,4vw,40px)', borderTop: '1px solid var(--border-subtle)' }}>
//         <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
//           <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px,4vw,36px)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 10 }}>How It Works</h2>
//           <p style={{ color: 'var(--text-secondary)', marginBottom: 28, fontSize: 14 }}>A simple process, for everyone on the platform</p>

//           {/* Tab switcher */}
//           <div style={{ display: 'inline-flex', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: 4, marginBottom: 36 }}>
//             {[
//               { key: 'candidate', label: '🎓 For Candidates' },
//               { key: 'recruiter', label: '🏢 For Recruiters' },
//             ].map(tab => (
//               <button key={tab.key} onClick={() => setHowTab(tab.key)} style={{
//                 padding: '8px 22px', borderRadius: 9, cursor: 'pointer', border: 'none',
//                 background: howTab === tab.key ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'transparent',
//                 color: howTab === tab.key ? 'white' : 'var(--text-muted)',
//                 fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13,
//                 transition: 'all 0.18s',
//                 boxShadow: howTab === tab.key ? '0 4px 14px rgba(99,102,241,0.3)' : 'none',
//               }}>{tab.label}</button>
//             ))}
//           </div>

//           <div className="landing-how-grid">
//             {(howTab === 'candidate' ? CANDIDATE_STEPS : RECRUITER_STEPS).map(item => (
//               <div key={item.step} className="glass-card" style={{ padding: 'clamp(20px,3vw,28px)', textAlign: 'center' }}>
//                 <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--accent-blue)', letterSpacing: '2px', marginBottom: 12, opacity: 0.5 }}>{item.step}</div>
//                 <div style={{ fontSize: 32, marginBottom: 14 }}>{item.icon}</div>
//                 <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>{item.title}</h3>
//                 <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{item.desc}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ══════════════════════════════════════════════
//           5. DUAL CTA BANNER
//       ══════════════════════════════════════════════ */}
//       <section style={{ padding: 'clamp(48px,6vw,72px) clamp(16px,4vw,40px)', borderTop: '1px solid var(--border-subtle)' }}>
//         <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>

//           {/* Candidate CTA card */}
//           <div className="glass-card" style={{ padding: 'clamp(28px,4vw,40px)', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
//             <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg,#6366f1,#8b5cf6)' }} />
//             <div style={{ fontSize: 40, marginBottom: 16 }}>🎓</div>
//             <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(18px,2.5vw,22px)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 10 }}>Looking for a Job?</h3>
//             <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 24 }}>
//               Browse hundreds of verified openings, apply with one click, and track every stage of your application.
//             </p>
//             <button className="btn btn-primary btn-lg w-full" style={{ justifyContent: 'center' }} onClick={() => navigate('/register')}>
//               Join as Candidate →
//             </button>
//           </div>

//           {/* Recruiter CTA card */}
//           <div className="glass-card" style={{ padding: 'clamp(28px,4vw,40px)', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
//             <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg,#10b981,#22d3ee)' }} />
//             <div style={{ fontSize: 40, marginBottom: 16 }}>🏢</div>
//             <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(18px,2.5vw,22px)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 10 }}>Hiring Talent?</h3>
//             <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 24 }}>
//               Post roles, filter top applicants, manage your pipeline, and make great hires — all in one place.
//             </p>
//             <button className="btn btn-lg w-full" style={{ justifyContent: 'center', background: 'linear-gradient(135deg,#10b981,#22d3ee)', color: 'white', border: 'none', boxShadow: '0 4px 20px rgba(16,185,129,0.3)' }} onClick={() => navigate('/register')}>
//               Join as Recruiter →
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* ── Footer ── */}
//       <footer style={{ borderTop: '1px solid var(--border-subtle)', padding: 'clamp(16px,3vw,24px) clamp(16px,4vw,40px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
//         <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
//           <div style={{ width: 26, height: 26, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'white', fontSize: 12 }}>rE</div>
//           <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-secondary)', fontSize: 13 }}>recruitEdge</span>
//         </div>
//         <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>© 2024 recruitEdge. All rights reserved.</div>
//         <div style={{ display: 'flex', gap: 16 }}>
//           {['Privacy', 'Terms', 'Contact'].map(l => <a key={l} href="#" style={{ fontSize: 12, color: 'var(--text-muted)', textDecoration: 'none' }}>{l}</a>)}
//         </div>
//       </footer>

//       {applyJob && (
//         <ApplyModal job={applyJob} onClose={() => setApplyJob(null)} navigate={navigate} isLoggedIn={isAuthenticated} user={user} />
//       )}

//       <style>{`
//         @keyframes pulse    { 0%,100%{opacity:1}      50%{opacity:0.4} }
//         @keyframes scrollBob{ 0%,100%{transform:translateY(0)} 50%{transform:translateY(8px)} }
//       `}</style>
//     </div>
//   )
// }

// export default LandingPage




// import { useState, useEffect, useRef } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { useSelector, useDispatch } from 'react-redux'
// import { createCandidate, fetchCandidates } from '../store/slices/candidateSlice'
// import { toggleTheme } from '../store/slices/themeSlice'
// import ThreeBackground from '../components/ThreeBackground'

// const PUBLIC_JOBS = [
//   { id: '1', jobTitle: 'Senior React Developer', description: 'Build cutting-edge web applications using React, Redux, and GraphQL. Strong hooks and REST/GraphQL API knowledge required.', location: 'Bangalore', experience: 3, salaryRange: '15–25 LPA', createdBy: 'TechCorp',   tag: 'Frontend',   color: '#6366f1' },
//   { id: '2', jobTitle: 'Backend Java Engineer',  description: 'Spring Boot microservices, Kafka, MongoDB. Build robust, scalable backend systems for fintech applications.', location: 'Mumbai',     experience: 5, salaryRange: '20–35 LPA', createdBy: 'FinEdge',    tag: 'Backend',    color: '#8b5cf6' },
//   { id: '3', jobTitle: 'UI/UX Designer',          description: 'Figma, Adobe XD, strong portfolio required. Own end-to-end design for web and mobile products.', location: 'Remote',     experience: 2, salaryRange: '8–15 LPA',  createdBy: 'DesignLab',  tag: 'Design',     color: '#22d3ee' },
//   { id: '4', jobTitle: 'DevOps Engineer',         description: 'AWS, Docker, Kubernetes, Terraform. Manage CI/CD pipelines and ensure 99.9% production uptime.', location: 'Hyderabad', experience: 4, salaryRange: '18–28 LPA', createdBy: 'CloudBase',  tag: 'DevOps',     color: '#10b981' },
//   { id: '5', jobTitle: 'Data Scientist',          description: 'Python, TensorFlow, PyTorch. Build ML models and deploy them to production at scale.', location: 'Pune',       experience: 2, salaryRange: '12–20 LPA', createdBy: 'DataMind',   tag: 'ML/AI',      color: '#f59e0b' },
//   { id: '6', jobTitle: 'Product Manager',         description: 'Lead product roadmap for our SaaS platform. Agile, JIRA, cross-functional team experience needed.', location: 'Delhi',      experience: 6, salaryRange: '25–40 LPA', createdBy: 'GrowthCo',   tag: 'Product',    color: '#f43f5e' },
//   { id: '7', jobTitle: 'Flutter Developer',       description: 'Cross-platform mobile apps with Flutter & Dart. Published apps on Play Store or App Store preferred.', location: 'Remote',     experience: 2, salaryRange: '10–18 LPA', createdBy: 'MobileFirst',tag: 'Mobile',     color: '#6366f1' },
//   { id: '8', jobTitle: 'QA Automation Engineer',  description: 'Selenium, Cypress, Jest, Postman. Shift-left testing culture, champion quality across the SDLC.', location: 'Chennai',    experience: 3, salaryRange: '10–16 LPA', createdBy: 'QualityHub', tag: 'QA',         color: '#8b5cf6' },
// ]

// const TAGS = ['All', 'Frontend', 'Backend', 'Design', 'DevOps', 'ML/AI', 'Product', 'Mobile', 'QA']

// // ── Apply Modal ───────────────────────────────────────────────────────────────
// const ApplyModal = ({ job, onClose, navigate, isLoggedIn, user }) => {
//   const dispatch = useDispatch()
//   const { applyLoading } = useSelector(s => s.candidates)
//   const [form, setForm] = useState({ resumeUrl: '', coverNote: '' })
//   const [done, setDone] = useState(false)

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     if (!isLoggedIn) { navigate('/register'); return }
//     const result = await dispatch(createCandidate({ job, user, resumeUrl: form.resumeUrl, coverNote: form.coverNote }))
//     if (createCandidate.fulfilled.match(result)) setDone(true)
//   }

//   if (done) return (
//     <div className="modal-overlay">
//       <div className="modal-box" style={{ textAlign: 'center', padding: '48px 28px' }}>
//         <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'linear-gradient(135deg,#10b981,#22d3ee)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', fontSize: 30 }}>✓</div>
//         <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 10 }}>Application Sent! 🎉</h2>
//         <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>Applied for <strong>{job.jobTitle}</strong>. Track status in My Applications.</p>
//         <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
//           <button className="btn btn-primary" onClick={() => { navigate('/my-applications'); onClose() }}>View Applications</button>
//           <button className="btn btn-secondary" onClick={onClose}>Close</button>
//         </div>
//       </div>
//     </div>
//   )

//   if (!isLoggedIn) return (
//     <div className="modal-overlay" onClick={onClose}>
//       <div className="modal-box" onClick={e => e.stopPropagation()}>
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 22 }}>
//           <div>
//             <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 19, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>Apply for {job.jobTitle}</h2>
//             <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>You need a free account to apply</p>
//           </div>
//           <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 22 }}>✕</button>
//         </div>
//         <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
//           <button className="btn btn-primary btn-lg w-full" style={{ justifyContent: 'center' }} onClick={() => { navigate('/login'); onClose() }}>🔑 Sign In to Apply</button>
//           <button className="btn btn-secondary btn-lg w-full" style={{ justifyContent: 'center' }} onClick={() => { navigate('/register'); onClose() }}>✨ Create Free Account</button>
//           <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', marginTop: 4 }}>Track all your applications in one place.</p>
//         </div>
//       </div>
//     </div>
//   )

//   return (
//     <div className="modal-overlay" onClick={onClose}>
//       <div className="modal-box" onClick={e => e.stopPropagation()}>
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 22 }}>
//           <div>
//             <div style={{ fontSize: 11, color: job.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>{job.tag}</div>
//             <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>{job.jobTitle}</h2>
//             <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 3 }}>📍 {job.location} · 💰 {job.salaryRange}</p>
//           </div>
//           <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 22, flexShrink: 0 }}>✕</button>
//         </div>
//         <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'rgba(99,102,241,0.06)', border: '1px solid var(--border-subtle)', borderRadius: 10, marginBottom: 18 }}>
//           <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--text-primary)', fontSize: 13, flexShrink: 0 }}>{user?.name?.charAt(0)}</div>
//           <div><div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{user?.name}</div><div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{user?.email}</div></div>
//           <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 700, color: '#10b981', padding: '2px 8px', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 10, background: 'rgba(16,185,129,0.1)' }}>✓ Signed In</span>
//         </div>
//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label className="form-label">Resume / Portfolio Link *</label>
//             <input className="form-control" placeholder="https://drive.google.com/your-resume" value={form.resumeUrl} onChange={e => setForm(p => ({...p, resumeUrl: e.target.value}))} required />
//           </div>
//           <div className="form-group">
//             <label className="form-label">Cover Note <span style={{ fontWeight: 400, textTransform: 'none', fontSize: 10 }}>(optional)</span></label>
//             <textarea className="form-control" rows={3} placeholder="Why are you a great fit?" value={form.coverNote} onChange={e => setForm(p => ({...p, coverNote: e.target.value}))} />
//           </div>
//           <button type="submit" className="btn btn-primary btn-lg w-full" style={{ justifyContent: 'center' }} disabled={applyLoading}>
//             {applyLoading ? <><span className="spinner" /> Submitting...</> : 'Submit Application 🚀'}
//           </button>
//         </form>
//       </div>
//     </div>
//   )
// }

// // ── Main Landing ──────────────────────────────────────────────────────────────
// const LandingPage = () => {
//   const navigate = useNavigate()
//   const dispatch = useDispatch()
//   const { isAuthenticated, user } = useSelector(s => s.auth)
//   const { mode } = useSelector(s => s.theme)
//   const isLight = mode === 'light'
//   const [search, setSearch] = useState('')
//   const [tag, setTag] = useState('All')
//   const [applyJob, setApplyJob] = useState(null)
//   const [mobileMenu, setMobileMenu] = useState(false)

//   useEffect(() => {
//     document.documentElement.setAttribute('data-theme', mode)
//     if (isAuthenticated) dispatch(fetchCandidates())
//   }, [mode, isAuthenticated])

//   const { items: candidates } = useSelector(s => s.candidates)
//   const appliedIds = new Set(
//     candidates.filter(c => c.userId === user?.id || c.userName === user?.name).map(c => c.jobId)
//   )

//   const filtered = PUBLIC_JOBS.filter(j => {
//     const ms = j.jobTitle.toLowerCase().includes(search.toLowerCase()) || j.location.toLowerCase().includes(search.toLowerCase())
//     const mt = tag === 'All' || j.tag === tag
//     return ms && mt
//   })

//   const STATS = [
//     { n: '200+', label: 'Open Positions' },
//     { n: '50+',  label: 'Top Companies' },
//     { n: '10K+', label: 'Placed Candidates' },
//     { n: '98%',  label: 'Satisfaction Rate' },
//   ]

//   return (
//     <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', overflowX: 'hidden', transition: 'background 0.3s' }}>
//       <ThreeBackground />

//       {/* ── Navbar ── */}
//       <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200, background: 'var(--bg-navbar)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 62 }} className="landing-nav">
//         <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
//           <div style={{ width: 34, height: 34, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--text-primary)', fontSize: 15, boxShadow: '0 4px 14px rgba(99,102,241,0.4)' }}>rE</div>
//           <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: 'var(--text-primary)' }}>recruitEdge</span>
//         </div>

//         {/* Desktop actions */}
//         <div className="landing-nav-actions" style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
//           <button onClick={() => dispatch(toggleTheme())} style={{ width: 38, height: 38, borderRadius: 9, background: 'var(--bg-hover)', border: '1px solid var(--border-subtle)', cursor: 'pointer', fontSize: 17, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//             {isLight ? '🌙' : '☀️'}
//           </button>
//           {isAuthenticated ? (
//             <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>Dashboard →</button>
//           ) : (
//             <>
//               <button className="btn btn-secondary" onClick={() => navigate('/login')}>Sign In</button>
//               <button className="btn btn-primary" onClick={() => navigate('/register')}>Get Started →</button>
//             </>
//           )}
//         </div>
//       </nav>

//       {/* ── Hero ── */}
//       <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', overflow: 'hidden', paddingTop: 62 }}>
//         <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.08) 0%, transparent 65%)', pointerEvents: 'none', zIndex: 1 }} />
//         <div style={{ position: 'relative', zIndex: 2, maxWidth: 720, padding: '0 20px' }}>
//           <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.28)', borderRadius: 20, padding: '5px 14px', marginBottom: 24, fontSize: 13, color: 'var(--accent-blue)' }}>
//             <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block', animation: 'pulse 2s infinite' }} />
//             {PUBLIC_JOBS.length} jobs actively hiring
//           </div>
//           <h1 className="landing-hero-title" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.08, marginBottom: 20 }}>
//             Find Your{' '}
//             <span style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6,#22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Dream Career</span>
//             <br />with{' '} 
//             <span style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6,#22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>recruitEdge</span>
//           </h1>
//           <p style={{ fontSize: 'clamp(14px,2.5vw,18px)', color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto 36px', lineHeight: 1.65 }}>
//             Connect with top companies, track your applications in real time, and land your next opportunity — all in one platform.
//           </p>
//           <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
//             <button className="btn btn-primary btn-lg" onClick={() => document.getElementById('jobs-section').scrollIntoView({ behavior: 'smooth' })}>Browse Jobs ↓</button>
//             <button className="btn btn-secondary btn-lg" onClick={() => navigate('/register')}>Create Free Account</button>
//           </div>
//         </div>
//         {/* Scroll indicator */}
//         <div style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 11 }}>
//           <span>Scroll</span>
//           <div style={{ width: 18, height: 30, border: '1px solid rgba(99,102,241,0.35)', borderRadius: 9, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '4px' }}>
//             <div style={{ width: 3, height: 8, background: 'var(--accent-blue)', borderRadius: 2, animation: 'scrollBob 1.5s ease-in-out infinite' }} />
//           </div>
//         </div>
//       </section>

//       {/* ── Stats ── */}
//       <section style={{ padding: 'clamp(32px,5vw,56px) 24px', background: 'rgba(99,102,241,0.03)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
//         <div style={{ maxWidth: 860, margin: '0 auto' }}>
//           <div className="landing-stats-grid">
//             {STATS.map(s => (
//               <div key={s.label} style={{ textAlign: 'center' }}>
//                 <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,5vw,42px)', fontWeight: 800, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: 5 }}>{s.n}</div>
//                 <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{s.label}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ── Jobs ── */}
//       <section id="jobs-section" style={{ padding: 'clamp(48px,6vw,80px) clamp(16px,4vw,40px)', maxWidth: 1200, margin: '0 auto' }}>
//         <div style={{ textAlign: 'center', marginBottom: 40 }}>
//           <div style={{ fontSize: 11, color: 'var(--accent-blue)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 10 }}>Open Positions</div>
//           <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px,4vw,40px)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 12 }}>Explore Opportunities</h2>
//           <p style={{ color: 'var(--text-secondary)', fontSize: 15, maxWidth: 440, margin: '0 auto' }}>Hand-picked roles from top companies, updated daily.</p>
//         </div>

//         {/* Search */}
//         <div style={{ maxWidth: 520, margin: '0 auto 18px' }}>
//           <div style={{ position: 'relative' }}>
//             <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: 'var(--text-muted)', pointerEvents: 'none' }}>🔍</span>
//             <input className="form-control" style={{ paddingLeft: 42, height: 46, borderRadius: 12, fontSize: 14 }} placeholder="Search jobs, skills, location..." value={search} onChange={e => setSearch(e.target.value)} />
//           </div>
//         </div>

//         {/* Tags */}
//         <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 28 }}>
//           {TAGS.map(t => (
//             <button key={t} onClick={() => setTag(t)} style={{
//               padding: '6px 16px', borderRadius: 20, cursor: 'pointer',
//               fontSize: 12, fontFamily: 'var(--font-body)', fontWeight: 600,
//               background: tag === t ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'var(--bg-card)',
//               color: tag === t ? 'white' : 'var(--text-secondary)',
//               border: tag === t ? 'none' : '1px solid var(--border-subtle)',
//               boxShadow: tag === t ? '0 4px 12px rgba(99,102,241,0.3)' : 'none',
//               transition: 'all 0.15s', backdropFilter: 'blur(10px)',
//             }}>{t}</button>
//           ))}
//         </div>

//         {/* Grid */}
//         <div className="landing-jobs-grid">
//           {filtered.map(job => {
//             const applied = appliedIds.has(job.id)
//             return (
//               <div key={job.id} className="glass-card" style={{ padding: 22, cursor: 'pointer', transition: 'all 0.2s ease', position: 'relative', overflow: 'hidden' }}
//                 onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 16px 48px rgba(0,0,0,0.35), 0 0 0 1px ${job.color}30` }}
//                 onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
//                 <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${job.color},${job.color}66)` }} />
//                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 13 }}>
//                   <div style={{ display: 'flex', gap: 11, alignItems: 'center', minWidth: 0 }}>
//                     <div style={{ width: 40, height: 40, borderRadius: 11, background: `${job.color}18`, border: `1px solid ${job.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0 }}>💼</div>
//                     <div style={{ minWidth: 0 }}>
//                       <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: 2 }}>{job.jobTitle}</div>
//                       <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{job.createdBy}</div>
//                     </div>
//                   </div>
//                   <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0, marginLeft: 8 }}>
//                     <span style={{ padding: '2px 9px', borderRadius: 10, fontSize: 10, fontWeight: 700, background: `${job.color}18`, color: job.color, border: `1px solid ${job.color}33` }}>{job.tag}</span>
//                     {applied && <span style={{ padding: '2px 9px', borderRadius: 10, fontSize: 10, fontWeight: 700, background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }}>✓ Applied</span>}
//                   </div>
//                 </div>
//                 <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 13, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{job.description}</p>
//                 <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
//                   {[['📍', job.location], ['💰', job.salaryRange], ['⏱️', `${job.experience}+ yrs`]].map(([ic, val]) => (
//                     <span key={val} style={{ fontSize: 11, color: 'var(--text-secondary)', background: 'rgba(99,102,241,0.06)', border: '1px solid var(--border-subtle)', borderRadius: 6, padding: '3px 8px', display: 'flex', alignItems: 'center', gap: 3 }}>{ic} {val}</span>
//                   ))}
//                 </div>
//                 {applied ? (
//                   <div style={{ textAlign: 'center', padding: '8px 0', fontSize: 13, color: '#10b981', fontWeight: 700, background: 'rgba(16,185,129,0.07)', borderRadius: 8, border: '1px solid rgba(16,185,129,0.2)' }}>✅ Applied</div>
//                 ) : (
//                   <button className="btn btn-primary w-full" style={{ justifyContent: 'center', fontSize: 13, padding: '9px 0' }} onClick={() => setApplyJob(job)}>
//                     Apply Now 🚀
//                   </button>
//                 )}
//               </div>
//             )
//           })}
//         </div>

//         {filtered.length === 0 && (
//           <div className="glass-card" style={{ padding: '50px 20px', textAlign: 'center', marginTop: 20 }}>
//             <div style={{ fontSize: 44, marginBottom: 14 }}>🔍</div>
//             <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>No jobs match</div>
//             <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>Try different keywords or clear the filter</div>
//           </div>
//         )}
//       </section>

//       {/* ── How It Works ── */}
//       <section style={{ padding: 'clamp(48px,6vw,72px) clamp(16px,4vw,40px)', background: 'rgba(99,102,241,0.02)', borderTop: '1px solid var(--border-subtle)' }}>
//         <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
//           <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px,4vw,36px)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 10 }}>How It Works</h2>
//           <p style={{ color: 'var(--text-secondary)', marginBottom: 36, fontSize: 14 }}>Land your dream job in 3 steps</p>
//           <div className="landing-how-grid">
//             {[
//               { icon: '👤', step: '01', title: 'Create Account', desc: 'Sign up for free in under 60 seconds. No credit card needed.' },
//               { icon: '🔍', step: '02', title: 'Browse & Apply',  desc: 'Filter by role, location, salary. Apply with one click.' },
//               { icon: '🎯', step: '03', title: 'Track Progress',  desc: 'Watch your application move through the hiring pipeline.' },
//             ].map(item => (
//               <div key={item.step} className="glass-card" style={{ padding: 'clamp(20px,3vw,28px)', textAlign: 'center' }}>
//                 <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--accent-blue)', letterSpacing: '2px', marginBottom: 12, opacity: 0.5 }}>{item.step}</div>
//                 <div style={{ fontSize: 32, marginBottom: 14 }}>{item.icon}</div>
//                 <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>{item.title}</h3>
//                 <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{item.desc}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ── CTA ── */}
//       <section style={{ padding: 'clamp(48px,6vw,72px) 20px', textAlign: 'center' }}>
//         <div style={{ maxWidth: 560, margin: '0 auto' }}>
//           <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px,4vw,38px)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 14 }}>
//             Ready to Find Your{' '}
//             <span style={{ background: 'linear-gradient(135deg,#6366f1,#22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Next Role?</span>
//           </h2>
//           <p style={{ color: 'var(--text-secondary)', fontSize: 15, marginBottom: 28 }}>Join thousands of professionals who found their dream job through recruitEdge.</p>
//           <button className="btn btn-primary btn-lg" onClick={() => navigate('/register')} style={{ fontSize: 15, padding: '14px 36px' }}>Get Started Free →</button>
//         </div>
//       </section>

//       {/* ── Footer ── */}
//       <footer style={{ borderTop: '1px solid var(--border-subtle)', padding: 'clamp(16px,3vw,24px) clamp(16px,4vw,40px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
//         <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
//           <div style={{ width: 26, height: 26, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--text-primary)', fontSize: 12 }}>rE</div>
//           <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-secondary)', fontSize: 13 }}>recruitEdge</span>
//         </div>
//         <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>© 2024 recruitEdge. All rights reserved.</div>
//         <div style={{ display: 'flex', gap: 16 }}>
//           {['Privacy', 'Terms', 'Contact'].map(l => <a key={l} href="#" style={{ fontSize: 12, color: 'var(--text-muted)', textDecoration: 'none' }}>{l}</a>)}
//         </div>
//       </footer>

//       {applyJob && (
//         <ApplyModal job={applyJob} onClose={() => setApplyJob(null)} navigate={navigate} isLoggedIn={isAuthenticated} user={user} />
//       )}

//       <style>{`
//         @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
//         @keyframes scrollBob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(8px)} }
//       `}</style>
//     </div>
//   )
// }

// export default LandingPage
