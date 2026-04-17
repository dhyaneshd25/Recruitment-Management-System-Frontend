import { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from "react-toastify";
import { fetchJobs, createJob, updateJob, deleteJob, fetchJobType } from '../../store/slices/jobSlice'
import Pagination from '../../components/Pagination';


const EMPTY = { jobTitle:'', description:'', location:'', experience:'', salaryRange:'', status:'Open' }
const SB    = { Open:'badge-green', Closed:'badge-red', Draft:'badge-amber' }

/* ─── Modal (unchanged) ─────────────────────────────────────────── */
const JobModal = ({ initial, onClose, onSave, jobTypes }) => {
  const [form, setForm]     = useState(initial || EMPTY)
  const [saving, setSaving] = useState(false)
  const set = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))
  const handleSubmit = async e => { 
    e.preventDefault(); 
    setSaving(true); 
    await onSave({...form, jobTitle:`${form.jobTitle}----${form.companyName}`}); 
    setSaving(false); onClose(); }
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:22 }}>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:19, fontWeight:800, color:'var(--text-primary)' }}>{initial ? 'Edit Job' : 'Post New Job'}</h2>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'var(--text-muted)', cursor:'pointer', fontSize:22 }}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group"><label className="form-label">Job Title</label><input name="jobTitle" className="form-control" value={form.jobTitle} onChange={set} placeholder="e.g. Senior React Developer" required /></div>
          <div className="form-group"><label className="form-label">Description</label><textarea name="description" className="form-control" value={form.description} onChange={set} rows={4} placeholder="Describe the role..." required /></div>
          <div className="grid-2">
            <div className="form-group"><label className="form-label">Location</label><input name="location" className="form-control" value={form.location} onChange={set} placeholder="e.g. Bangalore / Remote" required /></div>
            <div className="form-group"><label className="form-label">Experience (yrs)</label><input name="experience" type="number" className="form-control" value={form.experience} onChange={set} placeholder="3" required min={0} /></div>
          </div>
          <div className="grid-2">
            <div className="form-group"><label className="form-label">Salary Range</label><input name="salaryRange" className="form-control" value={form.salaryRange} onChange={set} placeholder="15–25 LPA" required /></div>
            <div className="form-group"><label className="form-label">Status</label>
              <select name="status" className="form-control" value={form.status} onChange={set}>
                <option value="Open">Open</option><option value="Closed">Closed</option>
              </select>
            </div>
          </div>
           <div className="grid-2">
            <div className="form-group"><label className="form-label">Company Name</label><input name="companyName" className="form-control" value={form.companyName} onChange={set} placeholder="XYZ LTD." required /></div>
            <div className="form-group"><label className="form-label">Job Role</label>
              <select name="jobType" className="form-control" value={form.jobType} onChange={set}>
                {
                 jobTypes.length>0 && jobTypes?.map((val,i)=> <option key={i} value={val}>{val}</option>)
                }
              </select>
            </div>
          </div>
          <div style={{ display:'flex', gap:10, marginTop:4 }}>
            <button type="submit" className="btn btn-primary" style={{ flex:1, justifyContent:'center' }} disabled={saving}>{saving ? <><span className="spinner"/>Saving...</> : initial ? 'Update Job' : 'Post Job'}</button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}


/* ─── Jobs Page ─────────────────────────────────────────────────── */
const Jobs = () => {
  const dispatch = useDispatch()
  const { items, totalElements, totalPages, loading, jobTypeData } = useSelector(s => s.jobs)
  const { user } = useSelector(s => s.auth)

  const [modal,        setModal]        = useState(null)
  const [editItem,     setEditItem]     = useState(null)
  const [search,       setSearch]       = useState('')
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [deleteId,     setDeleteId]     = useState(null)
  const [currentPage,  setCurrentPage]  = useState(1)
  const [pageSize,     setPageSize]     = useState(5)


  useEffect(() => {
    dispatch(fetchJobs({ page: currentPage , size: pageSize, createdBy:user.id }))
  }, [currentPage, pageSize])  

  useEffect(() => { dispatch(fetchJobType())  } ,[])

  // ── Handlers ──────────────────────────────────────────────────────
  const handlePageChange = p => setCurrentPage(p)   // ← no clamping, Pagination only emits valid pages

  const handlePageSizeChange = n => {
    setPageSize(n)
    setCurrentPage(1)           // triggers the effect above with new size
  }

  const handleSearchChange = e => {
    setSearch(e.target.value)
    dispatch(fetchJobs({ page: 1 , size: 5, search:e.target.value, createdBy:user.id }))
    setCurrentPage(1)    
    setPageSize(5)
  }

  const handleFilterChange = e => {
    setFilterStatus(e.target.value)
    setCurrentPage(1)
  }

  const handleSave = async form => {
    console.log(form)
    console.log(editItem)
    if (editItem!=null) await dispatch(updateJob({ id: editItem.id, data: form }))
    else          await dispatch(createJob({...form, createdBy:user.id}))
    dispatch(fetchJobs({ page:1,  size: 5, createdBy:user.id }))
    setCurrentPage(1)    
    setPageSize(5)
  }

  const handleDelete = async id => {
    const result = await dispatch(deleteJob(id))
     if (deleteJob.fulfilled.match(result)){
          toast.success("Job Deleted sucessfully")
     }else{
          toast.error("Failed to delete the job")
     }
    setDeleteId(null)
  
    dispatch(fetchJobs({ page: 1, size: 5, createdBy:user.id }))
    setCurrentPage(1)
    setPageSize(5)
  }



  const from = totalElements === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const to   = Math.min(currentPage * pageSize, totalElements)

  const canEdit = ['ADMIN', 'RECURITER'].includes(user?.role)

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Job Listings</div>
          <div style={{ color:'var(--text-primary)', fontWeight:100, fontFamily:'var(--font-display)', whiteSpace:'nowrap' }}>{totalElements} total · {items?.filter(j => j.status === 'Open')?.length} Open</div>
        </div>
        {canEdit && <button className="btn btn-primary" onClick={() => { setEditItem(null); setModal('create') }}>+ Post Job</button>}
      </div>

      <div className="filter-bar">
        <div className="search-input-wrap">
          <span className="search-icon">🔍</span>
          <input className="form-control search-input" placeholder="Search jobs by title, location..." value={search} onChange={handleSearchChange} />
        </div>
        {/* <select className="form-control" style={{ width:140 }} value={filterStatus} onChange={handleFilterChange}>
          <option value="ALL">All Status</option>
          <option value="Open">Open</option>
          <option value="Closed">Closed</option>
        </select> */}
      </div>

      <div className="glass-card" style={{ overflow:'hidden' }}>
        {loading
          ? <div style={{ padding:60, textAlign:'center' }}><span className="spinner" /></div>
          : items?.length === 0
            ? <div className="empty-state"><div className="empty-state-icon">💼</div><div className="empty-state-text">No jobs found</div></div>
            : <>
                <div style={{ overflowX:'auto' }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Job Title</th><th>Location</th><th>Exp</th>
                        <th>Salary</th><th>Status</th><th>Posted By</th>
                        {canEdit && <th>Actions</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {items?.map(job => (
                        <tr key={job.id}>
                          <td style={{ color:'var(--text-primary)', fontWeight:600, fontFamily:'var(--font-display)', whiteSpace:'nowrap' }}>{job.jobTitle}</td>
                          <td style={{ whiteSpace:'nowrap' }}>📍 {job.location}</td>
                          <td style={{ whiteSpace:'nowrap' }}>{job.experience}+ yrs</td>
                          <td style={{ whiteSpace:'nowrap' }}>💰 {job.salaryRange}</td>
                          <td><span className={`badge ${SB[job.status] || 'badge-blue'}`}>{job.status}</span></td>
                          <td style={{ whiteSpace:'nowrap' }}>{job.companyName}</td>
                          {canEdit && (
                            <td><div className="actions-cell">
                              <button className="btn btn-secondary btn-sm" onClick={() => { setEditItem(job); setModal('edit') }}>✏️</button>
                              <button className="btn btn-danger btn-sm" onClick={() => setDeleteId(job.id) }>🗑️</button>
                            </div></td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  pageSize={pageSize}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                  totalElements={totalElements}
                  from={from}
                  to={to}
                />
              </>
        }
      </div>

      {(modal === 'create' || modal === 'edit') && (
        <JobModal initial={modal === 'edit' ? editItem : null} onClose={() => setModal(null)} onSave={handleSave} jobTypes={jobTypeData} />
      )}

      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth:380, textAlign:'center' }}>
            <div style={{ fontSize:44, marginBottom:14 }}>⚠️</div>
            <h3 style={{ fontFamily:'var(--font-display)', fontSize:17, fontWeight:700, color:'var(--text-primary)', marginBottom:8 }}>Delete Job?</h3>
            <p style={{ color:'var(--text-secondary)', marginBottom:22, fontSize:13 }}>This action cannot be undone.</p>
            <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteId)}>Delete</button>
              <button className="btn btn-secondary" onClick={() => setDeleteId(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Jobs




// import { useEffect, useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { fetchJobs, createJob, updateJob, deleteJob } from '../../store/slices/jobSlice'

// const EMPTY = { jobTitle:'', description:'', location:'', experience:'', salaryRange:'', status:'Open' }
// const SB = { Open:'badge-green', Closed:'badge-red', DRAFT:'badge-amber' }

// const JobModal = ({ initial, onClose, onSave }) => {
//   const [form, setForm] = useState(initial || EMPTY)
//   const [saving, setSaving] = useState(false)
//   const set = e => setForm(p=>({...p,[e.target.name]:e.target.value}))
//   const handleSubmit = async e => { e.preventDefault(); setSaving(true); await onSave(form); setSaving(false); onClose() }
//   return (
//     <div className="modal-overlay" onClick={onClose}>
//       <div className="modal-box" onClick={e=>e.stopPropagation()}>
//         <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:22 }}>
//           <h2 style={{ fontFamily:'var(--font-display)', fontSize:19, fontWeight:800, color:'var(--text-primary)' }}>{initial?'Edit Job':'Post New Job'}</h2>
//           <button onClick={onClose} style={{ background:'none', border:'none', color:'var(--text-muted)', cursor:'pointer', fontSize:22 }}>✕</button>
//         </div>
//         <form onSubmit={handleSubmit}>
//           <div className="form-group"><label className="form-label">Job Title</label><input name="jobTitle" className="form-control" value={form.jobTitle} onChange={set} placeholder="e.g. Senior React Developer" required /></div>
//           <div className="form-group"><label className="form-label">Description</label><textarea name="description" className="form-control" value={form.description} onChange={set} rows={4} placeholder="Describe the role..." required /></div>
//           <div className="grid-2">
//             <div className="form-group"><label className="form-label">Location</label><input name="location" className="form-control" value={form.location} onChange={set} placeholder="e.g. Bangalore / Remote" required /></div>
//             <div className="form-group"><label className="form-label">Experience (yrs)</label><input name="experience" type="number" className="form-control" value={form.experience} onChange={set} placeholder="3" required min={0} /></div>
//           </div>
//           <div className="grid-2">
//             <div className="form-group"><label className="form-label">Salary Range</label><input name="salaryRange" className="form-control" value={form.salaryRange} onChange={set} placeholder="15–25 LPA" required /></div>
//             <div className="form-group"><label className="form-label">Status</label>
//               <select name="status" className="form-control" value={form.status} onChange={set}>
//                 <option value="Open">Open</option><option value="Closed">Closed</option><option value="DRAFT">Draft</option>
//               </select>
//             </div>
//           </div>
//           <div style={{ display:'flex', gap:10, marginTop:4 }}>
//             <button type="submit" className="btn btn-primary" style={{ flex:1, justifyContent:'center' }} disabled={saving}>{saving?<><span className="spinner"/>Saving...</>:initial?'Update Job':'Post Job'}</button>
//             <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }

// const Jobs = () => {
//   const dispatch = useDispatch()
//   const { items, loading } = useSelector(s=>s.jobs)
//   const { user } = useSelector(s=>s.auth)
//   const [modal, setModal] = useState(null)
//   const [editItem, setEditItem] = useState(null)
//   const [search, setSearch] = useState('')
//   const [filterStatus, setFilterStatus] = useState('ALL')
//   const [deleteId, setDeleteId] = useState(null)

//   useEffect(()=>{ dispatch(fetchJobs()) }, [])

//   const filtered = items?.filter(j=>{
//     const ms = j.jobTitle?.toLowerCase().includes(search.toLowerCase()) || j.location?.toLowerCase().includes(search.toLowerCase())
//     return ms && (filterStatus==='ALL' || j.status===filterStatus)
//   })

//   const handleSave = async form => {
//     if (editItem) await dispatch(updateJob({id:editItem.id, data:form}))
//     else await dispatch(createJob(form))
//   }

//   const canEdit = ['ADMIN','RECURITER'].includes(user?.role)

//   return (
//     <div>
//       <div className="page-header">
//         <div>
//           <div className="page-title">Job Listings</div>
//           <div className="page-subtitle">{items.length} total · {items.filter(j=>j.status==='Open').length} Open</div>
//         </div>
//         {canEdit && <button className="btn btn-primary" onClick={()=>{setEditItem(null);setModal('create')}}>+ Post Job</button>}
//       </div>

//       <div className="filter-bar">
//         <div className="search-input-wrap">
//           <span className="search-icon">🔍</span>
//           <input className="form-control search-input" placeholder="Search jobs..." value={search} onChange={e=>setSearch(e.target.value)} />
//         </div>
//         <select className="form-control" style={{ width:140 }} value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
//           <option value="ALL">All Status</option><option value="Open">Open</option><option value="Closed">Closed</option><option value="DRAFT">Draft</option>
//         </select>
//       </div>

//       <div className="glass-card" style={{ overflow:'hidden' }}>
//         {loading
//           ? <div style={{ padding:60, textAlign:'center' }}><span className="spinner" /></div>
//           : filtered.length===0
//             ? <div className="empty-state"><div className="empty-state-icon">💼</div><div className="empty-state-text">No jobs found</div></div>
//             : <div style={{ overflowX:'auto' }}>
//                 <table className="data-table">
//                   <thead><tr><th>Job Title</th><th>Location</th><th>Exp</th><th>Salary</th><th>Status</th><th>Posted By</th>{canEdit&&<th>Actions</th>}</tr></thead>
//                   <tbody>
//                     {filtered?.map(job=>(
//                       <tr key={job.id}>
//                         <td style={{ color:'var(--text-primary)', fontWeight:600, fontFamily:'var(--font-display)', whiteSpace:'nowrap' }}>{job.jobTitle}</td>
//                         <td style={{ whiteSpace:'nowrap' }}>📍 {job.location}</td>
//                         <td style={{ whiteSpace:'nowrap' }}>{job.experience}+ yrs</td>
//                         <td style={{ whiteSpace:'nowrap' }}>💰 {job.salaryRange}</td>
//                         <td><span className={`badge ${SB[job.status]||'badge-blue'}`}>{job.status}</span></td>
//                         <td style={{ whiteSpace:'nowrap' }}>{job.companyName}</td>
//                         {canEdit&&<td><div className="actions-cell">
//                           <button className="btn btn-secondary btn-sm" onClick={()=>{setEditItem(job);setModal('edit')}}>✏️</button>
//                           <button className="btn btn-danger btn-sm" onClick={()=>setDeleteId(job.id)}>🗑️</button>
//                         </div></td>}
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//         }
//       </div>

//       {(modal==='create'||modal==='edit')&&<JobModal initial={modal==='edit'?editItem:null} onClose={()=>setModal(null)} onSave={handleSave}/>}

//       {deleteId&&(
//         <div className="modal-overlay" onClick={()=>setDeleteId(null)}>
//           <div className="modal-box" onClick={e=>e.stopPropagation()} style={{ maxWidth:380, textAlign:'center' }}>
//             <div style={{ fontSize:44, marginBottom:14 }}>⚠️</div>
//             <h3 style={{ fontFamily:'var(--font-display)', fontSize:17, fontWeight:700, color:'var(--text-primary)', marginBottom:8 }}>Delete Job?</h3>
//             <p style={{ color:'var(--text-secondary)', marginBottom:22, fontSize:13 }}>This action cannot be undone.</p>
//             <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
//               <button className="btn btn-danger" onClick={()=>{dispatch(deleteJob(deleteId));setDeleteId(null)}}>Delete</button>
//               <button className="btn btn-secondary" onClick={()=>setDeleteId(null)}>Cancel</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default Jobs
