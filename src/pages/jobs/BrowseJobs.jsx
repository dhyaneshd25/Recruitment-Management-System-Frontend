import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCandidatesByUserId, createCandidate } from '../../store/slices/candidateSlice'
import { fetchJobType, fetchJobsWOF } from '../../store/slices/jobSlice'

const JOBS = [
  { id:'1', jobTitle:'Senior React Developer',  description:'Build cutting-edge web apps using React, Redux, GraphQL. Strong hooks knowledge required. Work with a dynamic product team.',                     location:'Bangalore', experience:3, salaryRange:'15–25 LPA', createdBy:'TechCorp',   tag:'Frontend',   color:'#6366f1' },
  { id:'2', jobTitle:'Backend Java Engineer',    description:'Spring Boot microservices, Kafka, MongoDB. Build robust, scalable backend systems for fintech applications at scale.',                           location:'Mumbai',    experience:5, salaryRange:'20–35 LPA', createdBy:'FinEdge',    tag:'Backend',    color:'#8b5cf6' },
  { id:'3', jobTitle:'UI/UX Designer',           description:'Figma, Adobe XD, strong portfolio required. Own end-to-end design for web and mobile products in a fast-paced environment.',                   location:'Remote',    experience:2, salaryRange:'8–15 LPA',  createdBy:'DesignLab',  tag:'Design',     color:'#22d3ee' },
  { id:'4', jobTitle:'DevOps Engineer',          description:'AWS, Docker, Kubernetes, Terraform. Manage CI/CD pipelines and ensure 99.9% production uptime across global infrastructure.',                 location:'Hyderabad', experience:4, salaryRange:'18–28 LPA', createdBy:'CloudBase',  tag:'DevOps',     color:'#10b981' },
  { id:'5', jobTitle:'Data Scientist',           description:'Python, TensorFlow, PyTorch. Build predictive ML models and deploy them to production. Kaggle or research background preferred.',             location:'Pune',      experience:2, salaryRange:'12–20 LPA', createdBy:'DataMind',   tag:'ML/AI',      color:'#f59e0b' },
  { id:'6', jobTitle:'Product Manager',          description:'Lead product roadmap for our SaaS platform. Agile, JIRA, cross-functional team leadership experience required. MBA preferred.',               location:'Delhi',     experience:6, salaryRange:'25–40 LPA', createdBy:'GrowthCo',   tag:'Product',    color:'#f43f5e' },
  { id:'7', jobTitle:'Flutter Developer',        description:'Cross-platform mobile apps with Flutter & Dart. Published apps on Play Store or App Store strongly preferred. BLoC/Riverpod knowledge a plus.',location:'Remote',    experience:2, salaryRange:'10–18 LPA', createdBy:'MobileFirst',tag:'Mobile',     color:'#6366f1' },
  { id:'8', jobTitle:'QA Automation Engineer',   description:'Selenium, Cypress, Jest, Postman. Shift-left testing champion. Ensure quality across the SDLC in an agile, fast-moving team.',               location:'Chennai',   experience:3, salaryRange:'10–16 LPA', createdBy:'QualityHub', tag:'QA',         color:'#8b5cf6' },
  { id:'9', jobTitle:'Full Stack Node.js Dev',   description:'Node.js, Express, React, PostgreSQL, Redis. Build scalable microservices. Experience with Docker and AWS preferred.',                         location:'Bangalore', experience:3, salaryRange:'14–22 LPA', createdBy:'StartupXYZ', tag:'Full Stack', color:'#22d3ee' },
]

const TAGS = ['All','Frontend','Backend','Full Stack','Design','DevOps','ML/AI','Product','Mobile','QA']

// ── Apply Modal ───────────────────────────────────────────────────────────────
const ApplyModal = ({ job, onClose, userI }) => {
  const dispatch = useDispatch()
  const { user } = useSelector(s=>s.auth)
  const { applyLoading } = useSelector(s=>s.candidates)
  const [form, setForm] = useState({ resumeUrl:'', coverNote:'' })
  const [done, setDone] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    const result = await dispatch(createCandidate({ jobId:job.id, userId:userI.id, resumeUrl:form.resumeUrl, coverNote:form.coverNote }))
    if (createCandidate.fulfilled.match(result)) setDone(true)
    dispatch(fetchJobsWOF()); dispatch(fetchCandidatesByUserId({ userId : userI.id}))  
  }

  if (done) return (
    <div className="modal-overlay">
      <div className="modal-box" style={{ textAlign:'center', padding:'44px 28px' }}>
        <div style={{ width:64, height:64, borderRadius:'50%', background:'linear-gradient(135deg,#10b981,#22d3ee)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', fontSize:28 }}>✓</div>
        <h2 style={{ fontFamily:'var(--font-display)', fontSize:21, fontWeight:800, color:'var(--text-primary)', marginBottom:8 }}>Application Sent! 🎉</h2>
        <p style={{ color:'var(--text-secondary)', fontSize:13, marginBottom:22 }}>Applied for <strong>{job.jobTitle}</strong>. Check My Applications to track progress.</p>
        <button className="btn btn-primary" onClick={onClose}>Back to Jobs</button>
      </div>
    </div>
  )

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e=>e.stopPropagation()}>
        <div style={{ display:'flex', gap:12, alignItems:'flex-start', marginBottom:20 }}>
          <div style={{ width:44, height:44, borderRadius:12, background:`${job.color}18`, border:`1px solid ${job.color}33`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>💼</div>
          <div style={{ flex:1, minWidth:0 }}>
            <h2 style={{ fontFamily:'var(--font-display)', fontSize:17, fontWeight:800, color:'var(--text-primary)', marginBottom:3 }}>{job.jobTitle}</h2>
            <div style={{ fontSize:12, color:'var(--text-muted)' }}>📍 {job.location} · 💰 {job.salaryRange}</div>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'var(--text-muted)', cursor:'pointer', fontSize:22, flexShrink:0 }}>✕</button>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', background:'rgba(99,102,241,0.06)', border:'1px solid var(--border-subtle)', borderRadius:10, marginBottom:18 }}>
          <div style={{ width:30, height:30, borderRadius:'50%', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, color:'white', fontSize:12, flexShrink:0 }}>{user?.name?.charAt(0)}</div>
          <div style={{ minWidth:0 }}><div style={{ fontSize:12, fontWeight:600, color:'var(--text-primary)' }}>{user?.name}</div><div style={{ fontSize:11, color:'var(--text-muted)' }}>{user?.email}</div></div>
          <span style={{ marginLeft:'auto', fontSize:10, fontWeight:700, color:'#10b981', padding:'2px 8px', border:'1px solid rgba(16,185,129,0.3)', borderRadius:10, background:'rgba(16,185,129,0.1)', flexShrink:0 }}>✓ Signed In</span>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group"><label className="form-label">Resume / Portfolio Link *</label><input className="form-control" placeholder="https://drive.google.com/your-resume" value={form.resumeUrl} onChange={e=>setForm(p=>({...p,resumeUrl:e.target.value}))} required /></div>
          <div className="form-group"><label className="form-label">Cover Note <span style={{ fontWeight:400, textTransform:'none', fontSize:10 }}>(optional)</span></label><textarea className="form-control" rows={3} placeholder="Why are you a great fit?" value={form.coverNote} onChange={e=>setForm(p=>({...p,coverNote:e.target.value}))} /></div>
          <button type="submit" className="btn btn-primary btn-lg w-full" style={{ justifyContent:'center' }} disabled={applyLoading}>
            {applyLoading?<><span className="spinner"/>Submitting...</>:'Submit Application 🚀'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ── Job Detail Side Panel ─────────────────────────────────────────────────────
const JobDetail = ({ job, applied, onApply, onClose }) => (
  <div style={{ position:'fixed', top:0, right:0, bottom:0, width:'min(420px,100vw)', background:'var(--bg-modal)', borderLeft:'1px solid var(--border-glass)', zIndex:300, display:'flex', flexDirection:'column', boxShadow:'-20px 0 60px rgba(0,0,0,0.5)', animation:'slideInRight 0.2s ease' }}>
    <style>{`@keyframes slideInRight{from{transform:translateX(30px);opacity:0}to{transform:none;opacity:1}}`}</style>
    <div style={{ height:3, background:`linear-gradient(90deg,${job.color},#8b5cf6)`, flexShrink:0 }} />
    <div style={{ padding:'20px 20px 0', display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexShrink:0 }}>
      <div style={{ display:'flex', gap:12, alignItems:'center', minWidth:0 }}>
        <div style={{ width:48, height:48, borderRadius:14, background:'rgba(99,102,241,0.15)', border:'1px solid rgba(99,102,241,0.25)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>💼</div>
        <div style={{ minWidth:0 }}>
          <div style={{ fontSize:10, color:job.color, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:3 }}>{job.tag}</div>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:16, fontWeight:800, color:'var(--text-primary)', lineHeight:1.3 }}>{job.jobTitle}</h2>
          <div style={{ fontSize:11, color:'var(--text-muted)' }}>{job.createdBy}</div>
        </div>
      </div>
      <button onClick={onClose} style={{ background:'rgba(255,255,255,0.06)', border:'1px solid var(--border-subtle)', borderRadius:8, color:'var(--text-secondary)', cursor:'pointer', fontSize:17, width:32, height:32, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>✕</button>
    </div>
    <div style={{ display:'flex', gap:8, flexWrap:'wrap', padding:'14px 20px 0', flexShrink:0 }}>
      {[['📍',job.location],['💰',job.salaryRange],['⏱️',`${job.experience}+ yrs`]].map(([ic,val])=>(
        <span key={val} style={{ padding:'4px 10px', borderRadius:20, background:'rgba(99,102,241,0.1)', border:'1px solid rgba(99,102,241,0.18)', fontSize:11, color:'var(--text-secondary)', display:'flex', alignItems:'center', gap:4 }}>{ic} {val}</span>
      ))}
    </div>
    <div style={{ flex:1, overflowY:'auto', padding:'18px 20px' }}>
      <div style={{ fontSize:11, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.7px', marginBottom:10 }}>About the Role</div>
      <p style={{ fontSize:13, color:'var(--text-secondary)', lineHeight:1.75 }}>{job.description}</p>
      <div className="divider" />
      <div style={{ fontSize:11, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.7px', marginBottom:12 }}>Requirements</div>
      {[`${job.experience}+ years of relevant experience`,'Strong communication skills','Team collaboration mindset','Problem-solving attitude'].map(item=>(
        <div key={item} style={{ display:'flex', alignItems:'flex-start', gap:9, marginBottom:9 }}>
          <div style={{ width:16, height:16, borderRadius:'50%', background:'rgba(99,102,241,0.2)', border:'1px solid rgba(99,102,241,0.4)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, color:'var(--accent-blue)', flexShrink:0, marginTop:1 }}>✓</div>
          <span style={{ fontSize:12, color:'var(--text-secondary)', lineHeight:1.5 }}>{item}</span>
        </div>
      ))}
    </div>
    <div style={{ padding:16, borderTop:'1px solid var(--border-subtle)', flexShrink:0 }}>
      {applied
        ? <div style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 14px', background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.2)', borderRadius:12 }}>
            <span style={{ fontSize:18 }}>✅</span>
            <div><div style={{ fontSize:13, fontWeight:700, color:'#10b981' }}>Already Applied</div><div style={{ fontSize:11, color:'var(--text-muted)' }}>Track in My Applications</div></div>
          </div>
        : <button className="btn btn-primary btn-lg w-full" style={{ justifyContent:'center' }} onClick={()=>onApply(job)}>Apply for this Role 🚀</button>
      }
    </div>
  </div>
)

// ── Main ──────────────────────────────────────────────────────────────────────
const BrowseJobs = () => {
  const dispatch = useDispatch()
  const { user } = useSelector(s=>s.auth)
  const { items: candidates, totalElements, totalPages } = useSelector(s=>s.candidates)
  const { items:jobs, jobTypeData }  = useSelector(s => s.jobs)
  const [search, setSearch] = useState('')
  const [tag, setTag] = useState('All')
  const [selectedJob, setSelectedJob] = useState(null)
  const [applyingJob, setApplyingJob] = useState(null)

  useEffect(()=>{ dispatch(fetchJobsWOF()); dispatch(fetchJobType()); dispatch(fetchCandidatesByUserId({ userId : user.id})) },[])

  const appliedIds = new Set(candidates.map(c=>c.jobId))
  const filtered = jobs?.filter(j=>{
    const ms=j.jobTitle.toLowerCase().includes(search.toLowerCase())||j.location.toLowerCase().includes(search.toLowerCase())||j.tag.toLowerCase().includes(search.toLowerCase())
    const mt=tag==='All'||j.tag===tag
    return ms&&mt
  })

  const handleApply = job => { setSelectedJob(null); setApplyingJob(job) }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Browse Jobs</div>
          <div className="page-subtitle">{jobs?.length} open positions · {appliedIds.size} applied</div>
        </div>
        {appliedIds.size>0&&<div style={{ display:'flex', alignItems:'center', gap:8, padding:'7px 14px', background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.25)', borderRadius:10 }}>
          <span style={{ width:7, height:7, borderRadius:'50%', background:'#10b981', display:'inline-block' }} />
          <span style={{ fontSize:12, color:'#10b981', fontWeight:700 }}>{appliedIds.size} Applied</span>
        </div>}
      </div>

      {/* Search */}
      <div style={{ position:'relative', marginBottom:14 }}>
        <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', fontSize:15, color:'var(--text-muted)', pointerEvents:'none' }}>🔍</span>
        <input className="form-control" style={{ paddingLeft:42, height:44, borderRadius:12 }} placeholder="Search by title, skill, location..." value={search} onChange={e=>setSearch(e.target.value)} />
      </div>

      {/* Tags */}
      <div style={{ display:'flex', gap:7, flexWrap:'wrap', marginBottom:20 }}>
        {jobTypeData?.map(t=>(
          <button key={t} onClick={()=>setTag(t)} style={{ padding:'5px 14px', borderRadius:20, cursor:'pointer', fontSize:11, fontFamily:'var(--font-body)', fontWeight:600, background:tag===t?'linear-gradient(135deg,#6366f1,#8b5cf6)':'var(--bg-hover)', color:tag===t?'white':'var(--text-secondary)', border:tag===t?'none':'1px solid var(--border-subtle)', boxShadow:tag===t?'0 4px 12px rgba(99,102,241,0.3)':'none', transition:'all 0.15s' }}>
            {t}
          </button>
        ))}
      </div>

      <div style={{ fontSize:12, color:'var(--text-muted)', marginBottom:14 }}>
        Showing <strong style={{ color:'var(--text-primary)' }}>{filtered.length}</strong> jobs{tag!=='All'&&<> in <strong style={{ color:'var(--accent-blue)' }}>{tag}</strong></>}
      </div>

      {/* Grid — shrinks when detail panel is open */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:14, paddingRight:selectedJob?'min(440px,100vw)':0, transition:'padding 0.2s' }}>
        {jobs?.map(job=>{
          const applied=appliedIds.has(job.id)
          const isSel=selectedJob?.id===job.id
          return (
            <div key={job.id} className="glass-card" onClick={()=>setSelectedJob(isSel?null:job)}
              style={{ padding:20, cursor:'pointer', transition:'all 0.18s', position:'relative', overflow:'hidden', borderColor:isSel?'rgba(99,102,241,0.5)':applied?'rgba(16,185,129,0.25)':undefined, boxShadow:isSel?'0 0 0 2px rgba(99,102,241,0.4), 0 16px 48px rgba(0,0,0,0.35)':undefined }}
              onMouseEnter={e=>{if(!isSel){e.currentTarget.style.transform='translateY(-3px)'}}}
              onMouseLeave={e=>{e.currentTarget.style.transform=''}}>
              <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,${job.color},${job.color}66)` }} />
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
                <div style={{ display:'flex', gap:10, alignItems:'center', minWidth:0 }}>
                  <div style={{ width:38, height:38, borderRadius:10, background:`${job.color}18`, border:`1px solid ${job.color}33`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>💼</div>
                  <div style={{ minWidth:0 }}>
                    <div style={{ fontFamily:'var(--font-display)', fontSize:13, fontWeight:700, color:'var(--text-primary)', lineHeight:1.3, marginBottom:2 }}>{job.jobTitle}</div>
                    <div style={{ fontSize:10, color:'var(--text-muted)' }}>{job.createdBy}</div>
                  </div>
                </div>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:4, flexShrink:0, marginLeft:8 }}>
                  <span style={{ padding:'2px 8px', borderRadius:9, fontSize:9, fontWeight:700, background:`${job.color}18`, color:job.color, border:`1px solid ${job.color || 'blue'}` }}>{job.jobType}</span>
                  {applied&&<span style={{ padding:'2px 8px', borderRadius:9, fontSize:9, fontWeight:700, background:'rgba(16,185,129,0.15)', color:'#10b981', border:'1px solid rgba(16,185,129,0.3)' }}>✓</span>}
                </div>
              </div>
              <p style={{ fontSize:12, color:'var(--text-muted)', lineHeight:1.55, marginBottom:12, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{job.description}</p>
              <div style={{ display:'flex', gap:7, flexWrap:'wrap', marginBottom:14 }}>
                {[['📍',job.location],['💰',job.salaryRange],['⏱️',`${job.experience}+ yrs`]].map(([ic,val])=>(
                  <span key={val} style={{ fontSize:10, color:'var(--text-secondary)', background:'rgba(99,102,241,0.06)', border:'1px solid var(--border-subtle)', borderRadius:5, padding:'3px 7px', display:'flex', alignItems:'center', gap:2 }}>{ic} {val}</span>
                ))}
              </div>
              <div style={{ display:'flex', gap:8 }}>
                {applied
                  ? <div style={{ flex:1, padding:'7px 0', textAlign:'center', fontSize:12, color:'#10b981', fontWeight:700, background:'rgba(16,185,129,0.07)', borderRadius:7, border:'1px solid rgba(16,185,129,0.2)' }}>✅ Applied</div>
                  : <button className="btn btn-primary btn-sm" style={{ flex:1, justifyContent:'center', fontSize:12 }} onClick={e=>{e.stopPropagation();handleApply(job)}}>Apply Now</button>
                }
                <button className="btn btn-secondary btn-sm" style={{ fontSize:11 }} onClick={e=>{e.stopPropagation();setSelectedJob(isSel?null:job)}}>{isSel?'Close':'Details'}</button>
              </div>
            </div>
          )
        })}
      </div>

      {filtered.length===0&&(
        <div className="glass-card" style={{ padding:'50px 20px', textAlign:'center', marginTop:16 }}>
          <div style={{ fontSize:40, marginBottom:12 }}>🔍</div>
          <div style={{ fontFamily:'var(--font-display)', fontSize:16, fontWeight:700, color:'var(--text-primary)', marginBottom:6 }}>No jobs found</div>
          <div style={{ color:'var(--text-muted)', fontSize:13 }}>Try different keywords or clear the filter.</div>
        </div>
      )}

      {selectedJob&&(
        <>
          <div style={{ position:'fixed', inset:0, zIndex:200 }} onClick={()=>setSelectedJob(null)} />
          <JobDetail job={selectedJob} applied={appliedIds.has(selectedJob.id)} onApply={handleApply} onClose={()=>setSelectedJob(null)} />
        </>
      )}
      {applyingJob&&<ApplyModal job={applyingJob} onClose={()=>setApplyingJob(null)} userI={user}/>}
    </div>
  )
}

export default BrowseJobs
