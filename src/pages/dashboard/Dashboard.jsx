import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchJobs } from '../../store/slices/jobSlice'
import { fetchCandidates } from '../../store/slices/candidateSlice'
import { fetchInterviews } from '../../store/slices/interviewSlice'
import { fetchUsers } from '../../store/slices/userSlice'

const STATUS_BADGE = {
  OPEN:'badge-green', CLOSED:'badge-red', DRAFT:'badge-amber',
  APPLIED:'badge-blue', SHORTLISTED:'badge-cyan', INTERVIEW_SCHEDULED:'badge-purple',
  HIRED:'badge-green', REJECTED:'badge-red', SCHEDULED:'badge-amber',
  COMPLETED:'badge-green', CANCELLED:'badge-red',
}

const StatCard = ({ icon, label, value, color }) => (
  <div className="glass-card stat-card">
    <div className="stat-icon" style={{ background:`${color}18`, color }}>{icon}</div>
    <div className="stat-number" style={{ background:`linear-gradient(135deg,${color},${color}99)`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>{value}</div>
    <div className="stat-label">{label}</div>
  </div>
)

// ── Candidate dashboard ────────────────────────────────────────────────────────
const CandidateDashboard = ({ user, candidates, interviews }) => {
  const navigate = useNavigate()
  const myApps = candidates.filter(c => c.userId===user?.id || c.userName===user?.name)
  const myIvs  = interviews.filter(i => i.candidateId===user?.id || i.candidateName===user?.name)
  const upcoming = myIvs.filter(i => i.status==='SCHEDULED')

  const FEATURED = [
    { id:'1', title:'Senior React Developer', company:'TechCorp',  location:'Bangalore', salary:'15–25 LPA', tag:'Frontend', color:'#6366f1' },
    { id:'2', title:'Backend Java Engineer',  company:'FinEdge',   location:'Mumbai',    salary:'20–35 LPA', tag:'Backend',  color:'#8b5cf6' },
    { id:'4', title:'DevOps Engineer',        company:'CloudBase', location:'Hyderabad', salary:'18–28 LPA', tag:'DevOps',   color:'#10b981' },
    { id:'3', title:'UI/UX Designer',         company:'DesignLab', location:'Remote',    salary:'8–15 LPA',  tag:'Design',   color:'#22d3ee' },
  ]
  const appliedIds = new Set(myApps.map(a=>a.jobId))

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Hey, {user?.name?.split(' ')[0]} 👋</div>
          <div className="page-subtitle">Ready to find your next opportunity?</div>
        </div>
        <button className="btn btn-primary" onClick={()=>navigate('/browse-jobs')}>🔍 Browse Jobs</button>
      </div>

      <div className="stats-grid">
        <StatCard icon="📨" label="Applied"     value={myApps.length}                                                                    color="#6366f1" />
        <StatCard icon="⭐" label="Shortlisted" value={myApps.filter(a=>['SHORTLISTED','INTERVIEW_SCHEDULED','HIRED'].includes(a.status)).length} color="#22d3ee" />
        <StatCard icon="📅" label="Interviews"  value={upcoming.length}                                                                  color="#a78bfa" />
        <StatCard icon="🏆" label="Offers"      value={myApps.filter(a=>a.status==='HIRED').length}                                      color="#10b981" />
      </div>

      <div className="grid-2" style={{ marginBottom:20 }}>
        {/* Recent applications */}
        <div className="glass-card" style={{ padding:20 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
            <div style={{ fontFamily:'var(--font-display)', fontSize:15, fontWeight:700, color:'var(--text-primary)' }}>Recent Applications</div>
            <button onClick={()=>navigate('/my-applications')} style={{ background:'none', border:'none', color:'var(--accent-blue)', fontSize:12, cursor:'pointer', fontFamily:'var(--font-body)', fontWeight:600 }}>View All →</button>
          </div>
          {myApps.length===0 ? (
            <div style={{ textAlign:'center', padding:'24px 0' }}>
              <div style={{ fontSize:28, marginBottom:8 }}>📋</div>
              <div style={{ fontSize:12, color:'var(--text-muted)', marginBottom:12 }}>No applications yet</div>
              <button className="btn btn-primary btn-sm" onClick={()=>navigate('/browse-jobs')}>Apply Now</button>
            </div>
          ) : myApps.slice(0,5).map(app=>{
            const SC={APPLIED:'#6366f1',SHORTLISTED:'#22d3ee',INTERVIEW_SCHEDULED:'#a78bfa',HIRED:'#10b981',REJECTED:'#f43f5e'}
            const color=SC[app.status]||'#6366f1'
            return (
              <div key={app.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 0', borderBottom:'1px solid var(--border-subtle)' }}>
                <div style={{ width:32, height:32, borderRadius:9, background:`${color}18`, border:`1px solid ${color}30`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, flexShrink:0 }}>💼</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:'var(--text-primary)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{app.jobTitle}</div>
                  <div style={{ fontSize:11, color:'var(--text-muted)' }}>{app.createdAt ? new Date(app.createdAt).toLocaleDateString('en-IN') : ''}</div>
                </div>
                <span className={`badge ${STATUS_BADGE[app.status]||'badge-blue'}`} style={{ flexShrink:0, fontSize:9 }}>{app.status?.replace(/_/g,' ')}</span>
              </div>
            )
          })}
        </div>

        {/* Upcoming interviews */}
        <div className="glass-card" style={{ padding:20 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
            <div style={{ fontFamily:'var(--font-display)', fontSize:15, fontWeight:700, color:'var(--text-primary)' }}>Upcoming Interviews</div>
            <button onClick={()=>navigate('/my-interviews')} style={{ background:'none', border:'none', color:'var(--accent-blue)', fontSize:12, cursor:'pointer', fontFamily:'var(--font-body)', fontWeight:600 }}>View All →</button>
          </div>
          {upcoming.length===0 ? (
            <div style={{ textAlign:'center', padding:'24px 0' }}>
              <div style={{ fontSize:28, marginBottom:8 }}>📅</div>
              <div style={{ fontSize:12, color:'var(--text-muted)' }}>No upcoming interviews</div>
            </div>
          ) : upcoming.map(iv=>(
            <div key={iv.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 0', borderBottom:'1px solid var(--border-subtle)' }}>
              <div style={{ width:32, height:32, borderRadius:9, background:'rgba(167,139,250,0.15)', border:'1px solid rgba(167,139,250,0.3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, flexShrink:0 }}>🎯</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13, fontWeight:600, color:'var(--text-primary)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>with {iv.interviewerName}</div>
                <div style={{ fontSize:11, color:'var(--text-muted)' }}>{iv.interviewDate} · {iv.interviewTime}</div>
              </div>
              {iv.meetingLink && <a href={iv.meetingLink} target="_blank" rel="noreferrer" style={{ fontSize:11, color:'var(--accent-blue)', textDecoration:'none', padding:'3px 8px', border:'1px solid rgba(99,102,241,0.3)', borderRadius:6, flexShrink:0 }}>Join</a>}
            </div>
          ))}
        </div>
      </div>

      {/* Featured jobs */}
      <div className="glass-card" style={{ padding:20 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
          <div>
            <div style={{ fontFamily:'var(--font-display)', fontSize:15, fontWeight:700, color:'var(--text-primary)' }}>Featured Openings</div>
            <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:2 }}>Handpicked for you</div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={()=>navigate('/browse-jobs')}>Browse All</button>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:12 }}>
          {FEATURED.map(job=>{
            const applied=appliedIds.has(job.id)
            return (
              <div key={job.id} style={{ padding:14, borderRadius:12, background:'var(--bg-hover)', border:`1px solid ${applied?'rgba(16,185,129,0.25)':'var(--border-subtle)'}`, position:'relative', overflow:'hidden' }}>
                <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,${job.color},${job.color}66)` }} />
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
                  <div>
                    <div style={{ fontSize:12, fontWeight:700, color:'var(--text-primary)', lineHeight:1.3, marginBottom:2 }}>{job.title}</div>
                    <div style={{ fontSize:10, color:'var(--text-muted)' }}>{job.company}</div>
                  </div>
                  <span style={{ padding:'2px 7px', borderRadius:8, fontSize:9, fontWeight:700, background:`${job.color}18`, color:job.color, border:`1px solid ${job.color}30`, flexShrink:0, marginLeft:6 }}>{job.tag}</span>
                </div>
                <div style={{ fontSize:11, color:'var(--text-muted)', marginBottom:10 }}>📍 {job.location} · 💰 {job.salary}</div>
                {applied
                  ? <div style={{ fontSize:11, color:'#10b981', fontWeight:700 }}>✅ Applied</div>
                  : <button className="btn btn-primary btn-sm w-full" style={{ justifyContent:'center', fontSize:11 }} onClick={()=>navigate('/browse-jobs')}>Apply Now</button>
                }
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── Admin/HR dashboard ─────────────────────────────────────────────────────────
const AdminDashboard = ({ user, jobs, candidates, interviews }) => {
  const navigate = useNavigate()
  const PIPELINE = ['APPLIED','SHORTLISTED','INTERVIEW_SCHEDULED','HIRED','REJECTED']
  const maxCnt = Math.max(...PIPELINE.map(s=>candidates.filter(c=>c.status===s).length), 1)
  const recent = [...candidates].sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)).slice(0,6)
  const upcoming = interviews.filter(i=>i.status==='SCHEDULED').slice(0,5)

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Hey, {user?.name?.split(' ')[0]} 👋</div>
          <div className="page-subtitle">Here's your hiring overview for today.</div>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard icon="💼" label="Open Jobs"         value={jobs.filter(j=>j.status==='OPEN').length}         color="#6366f1" />
        <StatCard icon="👤" label="Active Candidates" value={candidates.filter(c=>c.status!=='REJECTED').length} color="#8b5cf6" />
        <StatCard icon="🎯" label="Scheduled"         value={upcoming.length}                                   color="#22d3ee" />
        <StatCard icon="✅" label="Total Hired"       value={candidates.filter(c=>c.status==='HIRED').length}    color="#10b981" />
      </div>

      <div className="grid-2" style={{ marginBottom:20 }}>
        {/* Pipeline bar chart */}
        <div className="glass-card" style={{ padding:20 }}>
          <div style={{ fontFamily:'var(--font-display)', fontSize:15, fontWeight:700, color:'var(--text-primary)', marginBottom:18 }}>Candidate Pipeline</div>
          {PIPELINE.map(s=>{
            const cnt=candidates.filter(c=>c.status===s).length
            const pct=(cnt/maxCnt)*100
            const bar=s==='HIRED'?'#10b981':s==='REJECTED'?'#f43f5e':s==='INTERVIEW_SCHEDULED'?'#a78bfa':s==='SHORTLISTED'?'#22d3ee':'#6366f1'
            return (
              <div key={s} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
                <div style={{ width:130, fontSize:11, color:'var(--text-muted)', textTransform:'capitalize', flexShrink:0 }}>{s.replace(/_/g,' ')}</div>
                <div style={{ flex:1, height:6, background:'rgba(99,102,241,0.08)', borderRadius:3, overflow:'hidden', minWidth:0 }}>
                  <div style={{ width:`${pct}%`, height:'100%', background:bar, borderRadius:3, transition:'width 0.6s ease' }} />
                </div>
                <div style={{ width:20, textAlign:'right', fontSize:13, fontWeight:700, color:'var(--text-primary)', flexShrink:0 }}>{cnt}</div>
              </div>
            )
          })}
        </div>

        {/* Upcoming interviews */}
        <div className="glass-card" style={{ padding:20 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
            <div style={{ fontFamily:'var(--font-display)', fontSize:15, fontWeight:700, color:'var(--text-primary)' }}>Upcoming Interviews</div>
            <button onClick={()=>navigate('/interviews')} style={{ background:'none', border:'none', color:'var(--accent-blue)', fontSize:12, cursor:'pointer', fontFamily:'var(--font-body)', fontWeight:600 }}>Manage →</button>
          </div>
          {upcoming.length===0
            ? <div style={{ textAlign:'center', padding:'30px 0', color:'var(--text-muted)', fontSize:13 }}>No scheduled interviews</div>
            : upcoming.map(iv=>(
              <div key={iv.id} style={{ display:'flex', gap:10, alignItems:'center', padding:'9px 0', borderBottom:'1px solid var(--border-subtle)' }}>
                <div style={{ width:32, height:32, borderRadius:9, background:'rgba(99,102,241,0.12)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, flexShrink:0 }}>🎯</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:12, fontWeight:600, color:'var(--text-primary)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{iv.candidateName}</div>
                  <div style={{ fontSize:11, color:'var(--text-muted)' }}>{iv.interviewDate} · {iv.interviewTime}</div>
                </div>
                <span className="badge badge-amber" style={{ fontSize:9, flexShrink:0 }}>{iv.mode}</span>
              </div>
            ))
          }
        </div>
      </div>

      {/* Recent applicants table */}
      <div className="glass-card" style={{ overflow:'hidden' }}>
        <div style={{ padding:'16px 20px 12px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ fontFamily:'var(--font-display)', fontSize:15, fontWeight:700, color:'var(--text-primary)' }}>Recent Applicants</div>
          <button onClick={()=>navigate('/candidates')} style={{ background:'none', border:'none', color:'var(--accent-blue)', fontSize:12, cursor:'pointer', fontFamily:'var(--font-body)', fontWeight:600 }}>View All →</button>
        </div>
        <div style={{ overflowX:'auto' }}>
          <table className="data-table">
            <thead><tr><th>Candidate</th><th>Job</th><th>Applied</th><th>Status</th></tr></thead>
            <tbody>
              {recent.map(c=>(
                <tr key={c.id}>
                  <td>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <div style={{ width:28, height:28, borderRadius:'50%', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:'white', flexShrink:0 }}>{c.userName?.charAt(0)}</div>
                      <span style={{ color:'var(--text-primary)', fontWeight:500 }}>{c.userName}</span>
                    </div>
                  </td>
                  <td style={{ maxWidth:160, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{c.jobTitle}</td>
                  <td>{c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-IN') : '—'}</td>
                  <td><span className={`badge ${STATUS_BADGE[c.status]||'badge-blue'}`}>{c.status?.replace(/_/g,' ')}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ── Root ──────────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const dispatch = useDispatch()
  const { user } = useSelector(s => s.auth)
  const { items: jobs } = useSelector(s => s.jobs)
  const { items: candidates } = useSelector(s => s.candidates)
  const { items: interviews } = useSelector(s => s.interviews)

  useEffect(() => {
    dispatch(fetchCandidates())
    dispatch(fetchInterviews())
    if (['ADMIN','HR'].includes(user?.role)) {
      dispatch(fetchJobs())
      if (user?.role==='ADMIN') dispatch(fetchUsers())
    }
  }, [])

  return user?.role==='CANDIDATE'
    ? <CandidateDashboard user={user} candidates={candidates} interviews={interviews} />
    : <AdminDashboard user={user} jobs={jobs} candidates={candidates} interviews={interviews} />
}

export default Dashboard
