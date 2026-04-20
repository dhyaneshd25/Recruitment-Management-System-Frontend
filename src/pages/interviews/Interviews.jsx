import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchInterviews, createInterview, updateInterview, deleteInterview } from '../../store/slices/interviewSlice'
import { fetchCandidates } from '../../store/slices/candidateSlice'
import { toast } from 'react-toastify'
import Pagination from '../../components/Pagination'

const STATUSES = ['MARKED','SCHEDULED', 'COMPLETED', 'CANCELLED']
const MODES = ['VIDEO', 'IN_PERSON', 'PHONE']
const EMPTY = { candidateId: '', candidateName: '', interviewerId: '', interviewerName: '', interviewDate: '', interviewTime: '', duration: 60, mode: 'VIDEO', meetingLink: '', feedback: '', status: 'SCHEDULED' }

const statusBadge = { SCHEDULED: 'badge-amber', COMPLETED: 'badge-green', CANCELLED: 'badge-red' }
const modeBadge = { VIDEO: 'badge-blue', IN_PERSON: 'badge-purple', PHONE: 'badge-cyan' }

const InterviewModal = ({ initial, candidates, onClose, onSave, user }) => {
  const [form, setForm] = useState(initial || EMPTY)
  const [saving, setSaving] = useState(false)
  const set = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleCandidateChange = (e) => {
    const candidate = candidates.find(c => c.id === e.target.value)
    setForm(p => ({ ...p, candidateId: candidate.id, candidateName: candidate?.name || '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true)
    await onSave({...form, interviewerId:user.id, interviewerName:user.name}); setSaving(false); onClose()
  }

  console.log(initial)
  console.log(candidates)
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>{initial ? 'Edit Interview' : 'Schedule Interview'}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 20 }}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Candidate</label>
            <select className="form-control" value={form.candidateId} onChange={handleCandidateChange} required>
              <option value="">Select candidate...</option>
              {candidates.map(c => <option key={c.id} value={c.id}>{c.name} — {c.jobTitle}</option>)}
            </select>
          </div>
          {/* <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Interviewer ID</label>
              <input name="interviewerId" className="form-control" value={form.interviewerId} onChange={set} placeholder="Interviewer ID" required />
            </div>
            <div className="form-group">
              <label className="form-label">Interviewer Name</label>
              <input name="interviewerName" className="form-control" value={form.interviewerName} onChange={set} placeholder="Interviewer name" required />
            </div>
          </div> */}
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Date</label>
              <input name="interviewDate" type="date" className="form-control" value={form.interviewDate} onChange={set} required />
            </div>
            <div className="form-group">
              <label className="form-label">Time</label>
              <input name="interviewTime" type="time" className="form-control" value={form.interviewTime} onChange={set} required />
            </div>
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Duration (minutes)</label>
              <input name="duration" type="number" className="form-control" value={form.duration} onChange={set} min={15} max={240} required />
            </div>
            <div className="form-group">
              <label className="form-label">Mode</label>
              <select name="mode" className="form-control" value={form.mode} onChange={set}>
                {MODES.map(m => <option key={m} value={m}>{m.replace('_', ' ')}</option>)}
              </select>
            </div>
          </div>
          {form.mode === 'VIDEO' && (
            <div className="form-group">
              <label className="form-label">Meeting Link</label>
              <input name="meetingLink" className="form-control" value={form.meetingLink} onChange={set} placeholder="https://meet.google.com/..." />
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Feedback <span style={{ color: 'var(--text-muted)', fontWeight: 400, textTransform: 'none' }}>(optional)</span></label>
            <textarea name="feedback" className="form-control" value={form.feedback} onChange={set} rows={3} placeholder="Interview notes and feedback..." style={{ resize: 'vertical' }} />
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select name="status" className="form-control" value={form.status} onChange={set}>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} disabled={saving}>
              {saving ? <><span className="spinner" /> Saving...</> : initial ? 'Update Interview' : 'Schedule Interview'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

const Interviews = () => {
  const dispatch = useDispatch()
  const { user } = useSelector(s => s.auth)
  const { items ,totalElements, totalPages, loading } = useSelector(s => s.interviews)
  const { items: candidates } = useSelector(s => s.candidates)
  const [modal, setModal] = useState(null)
  const [editItem, setEditItem] = useState(null)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [deleteId, setDeleteId] = useState(null)
  const [currentPage,  setCurrentPage]  = useState(1)
  const [pageSize,     setPageSize]     = useState(5)
 
  useEffect(() => { dispatch(fetchInterviews({page:currentPage,size:pageSize, candidateCreatedBy:user.id })); dispatch(fetchCandidates({ page:0, size:10, jobCreatedBy:user.id })) }, [])

  useEffect(() => { dispatch(fetchInterviews({page:currentPage,size:pageSize, candidateCreatedBy:user.id })); }, [currentPage, pageSize])
  const handlePageChange = p => setCurrentPage(p)   // ← no clamping, Pagination only emits valid pages
  const handlePageSizeChange = n => {
    setPageSize(n)
    setCurrentPage(1)           // triggers the effect above with new size
  }

  const handleSave = async (form) => {
    if (editItem) await dispatch(updateInterview({ id: editItem.id, data: form }))
    else await dispatch(createInterview(form))
    dispatch(fetchInterviews({ page:1, size:5, candidateCreatedBy:user.id }))
    setCurrentPage(1)    
    setPageSize(5)
  }
  const handleSearchChange = (value) => {
    dispatch(fetchInterviews({ page: 1 , size: 5, search:value, candidateCreatedBy:user.id }))
    setCurrentPage(1)    
    setPageSize(5)
  } 
  const handleDelete = async id => {
    const result = await dispatch(deleteInterview(id))
     if (deleteInterview.fulfilled.match(result)){
          toast.success("Interview Deleted sucessfully")
     }else{
          toast.error("Failed to delete the interview")
     }
    setDeleteId(null)
  
    dispatch(fetchInterviews({ page:1, size:5, candidateCreatedBy:user.id }))
    setCurrentPage(1)
    setPageSize(5)
  }

  const from = totalElements === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const to   = Math.min(currentPage * pageSize, totalElements)
 
  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Interviews</div>
          <div className="page-subtitle">{items?.length} total · {items?.filter(i => i.status === 'SCHEDULED')?.length} scheduled</div>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditItem(null); setModal('create') }}>+ Schedule Interview</button>
      </div>

      <div className="filter-bar">
        <div className="search-input-wrap">
          <span className="search-icon">🔍</span>
          <input className="form-control search-input" placeholder="Search interviews..." value={search} onChange={e => { setSearch(e.target.value); handleSearchChange(e.target.value) }} />
        </div>
        {/* <select className="form-control" style={{ width: 160 }} value={filterStatus} onChange={e => { setFilterStatus(e.target.value)}}>
          <option value="ALL">All Status</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select> */}
      </div>

      <div className="glass-card" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 60, textAlign: 'center' }}><span className="spinner" /></div>
        ) : items?.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon">🎯</div><div className="empty-state-text">No interviews found</div></div>
        ) : (
          <>
          <div style={{ overflowX:"auto" }}><table className="data-table">
            <thead>
              <tr><th>Candidate</th><th>Applied Job</th><th>Interviewer</th><th>Date & Time</th><th>Duration</th><th>Mode</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {items?.map(iv => (
                <tr key={iv.id}>
                  <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{iv.candidateName}</td>
                  <td>{iv?.jobTitle}</td>
                  <td>{iv.interviewerName}</td>
                  <td>
                    <div style={{ fontSize: 13 }}>📅 {iv.interviewDate}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>🕐 {iv.interviewTime}</div>
                  </td>
                  <td>{iv.duration} min</td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <span className={`badge ${modeBadge[iv.mode] || 'badge-blue'}`}>{iv.mode?.replace('_', ' ')}</span>
                      {iv.meetingLink && <a href={iv.meetingLink} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: 'var(--accent-blue)', textDecoration: 'none' }}>Join →</a>}
                    </div>
                  </td>
                  <td><span className={`badge ${statusBadge[iv.status] || 'badge-blue'}`}>{iv.status}</span></td>
                  <td>
                    <div className="actions-cell">
                      <button className="btn btn-secondary btn-sm" onClick={() => { setEditItem(iv); setModal('edit') }}>✏️</button>
                      <button className="btn btn-danger btn-sm" onClick={() => setDeleteId(iv.id)}>🗑️</button>
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
        <InterviewModal initial={modal === 'edit' ? editItem : null} candidates={candidates} onClose={() => setModal(null)} onSave={handleSave} user={user} />
      )}

      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 400, textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>Cancel Interview?</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 24, fontSize: 14 }}>This will permanently remove the interview record.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button className="btn btn-danger" onClick={() => { dispatch(deleteInterview(deleteId)); setDeleteId(null); dispatch(fetchInterviews({ page:1, size:5, candidateCreatedBy:user.id })); setCurrentPage(1); setPageSize(5) }}>Delete</button>
              <button className="btn btn-secondary" onClick={() => setDeleteId(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Interviews
