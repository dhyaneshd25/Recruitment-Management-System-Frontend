import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCandidates, createCandidate, updateCandidate, deleteCandidate } from '../../store/slices/candidateSlice'
import { fetchJobs } from '../../store/slices/jobSlice'
import { fetchUsersByRole } from '../../store/slices/userSlice'
import Pagination from '../Pagination'
import { toast } from 'react-toastify'

const STATUSES = ['APPLIED','SCREENING', 'INTERVIEW', 'SELECTED', 'REJECTED']
const EMPTY = { userName: '', userId: '', jobId: '', jobTitle: '', resumeUrl: '', status: 'APPLIED' }
const statusBadge = { APPLIED: 'badge-blue', SCREENING: 'badge-cyan', INTERVIEW: 'badge-purple', SELECTED: 'badge-green', REJECTED: 'badge-red' }

const CandidateModal = ({ initial, jobs, onClose, onSave, users }) => {
  const [form, setForm] = useState(initial || EMPTY)
  const [saving, setSaving] = useState(false)
  const set = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))
  const handleJobChange = (e) => {
    const job = jobs.find(j => j.id === e.target.value)
    setForm(p => ({ ...p, jobId: e.target.value, jobTitle: job?.jobTitle || '' }))
  }
  const handleCandidateChange = (e) => {
    const user = jobs.find(j => j.id === e.target.value)
    setForm(p => ({ ...p, userId: e.target.value, userName: user?.userName || '' }))
  }
  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true)
    await onSave(form); setSaving(false); onClose()
  }
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>{initial ? 'Edit Candidate' : 'Add Candidate'}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 20 }}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Candidate</label>
            <select className="form-control" value={form.userId} onChange={handleCandidateChange} required>
              <option value="">Select candidate...</option>
              {users?.map(j => <option key={j.id} value={j.id}>{j.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Applied For</label>
            <select className="form-control" value={form.jobId} onChange={handleJobChange} required>
              <option value="">Select job...</option>
              {jobs?.map(j => <option key={j.id} value={j.id}>{j.jobTitle}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Resume URL</label>
            <input name="resumeUrl" className="form-control" value={form.resumeUrl} onChange={set} placeholder="https://drive.google.com/..." required />
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select name="status" className="form-control" value={form.status} onChange={set}>
              {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} disabled={saving}>
              {saving ? <><span className="spinner" /> Saving...</> : initial ? 'Update' : 'Add Candidate'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}



const Candidates = () => {
  const dispatch = useDispatch()
  const  {user} = useSelector(s => s.auth)
  const { items, totalElements, totalPages, loading } = useSelector(s => s.candidates)
  const { usersByRole } = useSelector(s => s.users)
  const { items: jobs } = useSelector(s => s.jobs)
  const [modal, setModal] = useState(null)
  const [editItem, setEditItem] = useState(null)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [deleteId, setDeleteId] = useState(null)
  const [currentPage,  setCurrentPage]  = useState(1)
  const [pageSize,     setPageSize]     = useState(5)

  useEffect(() => { dispatch(fetchJobs({page:0, size:10, createdBy:user.id})); dispatch(fetchUsersByRole({role:"CANDIDATE"})) }, [])

  useEffect(() => { dispatch(fetchCandidates({page:currentPage,size:pageSize, jobCreatedBy:user.id })); }, [currentPage, pageSize])
  const handlePageChange = p => setCurrentPage(p)   // ← no clamping, Pagination only emits valid pages
  const handlePageSizeChange = n => {
    setPageSize(n)
    setCurrentPage(1)           // triggers the effect above with new size
  }
  const handleSearchChange = (value) => {
    setSearch(value)
    dispatch(fetchCandidates({ page: 1 , size: 5, search:value, jobCreatedBy:user.id }))
    setCurrentPage(1)    
    setPageSize(5)
  }
  const from = totalElements === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const to   = Math.min(currentPage * pageSize, totalElements)
 
  const handleSave = async (form) => {
    if (editItem) await dispatch(updateCandidate({ id: editItem.id, data: form }))
    else await dispatch(createCandidate(form))
    dispatch(fetchCandidates({page:1, size:5, jobCreatedBy:user.id }))
    setPageSize(5)
    setCurrentPage(1)
  }
  const handleDelete = async id => {
    const result = await dispatch(deleteCandidate(id))
     if (deleteCandidate.fulfilled.match(result)){
          toast.success("Candidate Deleted sucessfully")
     }else{
          toast.error("Failed to delete the candidate")
     }
    setDeleteId(null)
  
    dispatch(fetchCandidates({ page: 1, size: 5, jobCreatedBy:user.id }))
    setCurrentPage(1)
    setPageSize(5)
  }
  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Candidates</div>
          <div className="page-subtitle">{items?.length} total · {items?.filter(c => c.status === 'HIRED')?.length} hired</div>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditItem(null); setModal('create') }}>+ Add Candidate</button>
      </div>

      <div className="filter-bar">
        <div className="search-input-wrap">
          <span className="search-icon">🔍</span>
          <input className="form-control search-input" placeholder="Search candidates..." value={search} onChange={(e) => handleSearchChange(e.target.value)} />
        </div>
        {/* <select className="form-control" style={{ width: 190 }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="ALL">All Status</option>
          {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
        </select> */}
      </div>

      <div className="glass-card" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 60, textAlign: 'center' }}><span className="spinner" /></div>
        ) : items?.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon">👤</div><div className="empty-state-text">No candidates found</div></div>
        ) : (
          <>
          <div style={{ overflowX:"auto" }}><table className="data-table">
            <thead>
              <tr><th>Candidate</th><th>Job Applied</th><th>Resume</th><th>Applied On</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {items?.map(c => (
                <tr key={c.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', flexShrink: 0 }}>
                        {c.name?.charAt(0)}
                      </div>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{c.name}</span>
                    </div>
                  </td>
                  <td>{c.jobTitle}</td>
                  <td>
                    {c.resumeUrl ? (
                      <a href={c.resumeUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-blue)', fontSize: 13, textDecoration: 'none' }}>📄 View Resume</a>
                    ) : '—'}
                  </td>
                  <td>{c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-IN') : '—'}</td>
                  <td><span className={`badge ${statusBadge[c.status] || 'badge-blue'}`}>{c.status?.replace(/_/g, ' ')}</span></td>
                  <td>
                    <div className="actions-cell">
                      <button className="btn btn-secondary btn-sm" onClick={() => { setEditItem(c); setModal('edit') }}>✏️</button>
                      <button className="btn btn-danger btn-sm" onClick={() => setDeleteId(c.id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table></div>
          
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
        )}
      </div>

      {(modal === 'create' || modal === 'edit') && (
        <CandidateModal initial={modal === 'edit' ? editItem : null} jobs={jobs} onClose={() => setModal(null)} onSave={handleSave} users={usersByRole} />
      )}

      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 400, textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>Remove Candidate?</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 24, fontSize: 14 }}>This will permanently remove the candidate record.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button className="btn btn-danger" onClick={() => { handleDelete(deleteId) }}>Remove</button>
              <button className="btn btn-secondary" onClick={() => setDeleteId(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Candidates
