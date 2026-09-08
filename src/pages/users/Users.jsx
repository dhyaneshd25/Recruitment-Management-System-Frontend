import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { fetchUsers, createUser, updateUser, deleteUser, roleUserCount } from '../../store/slices/userSlice'
import Pagination from '../../components/Pagination'

const ROLES = ['ADMIN', 'CANDIDATE', 'RECURITER','INTERVIEWER']
const EMPTY = { name: '', email: '', password: '', role: 'CANDIDATE' }
const roleBadge = { ADMIN: 'badge-red', RECURITER: 'badge-green', CANDIDATE: 'badge-blue', INTERVIEWer: 'badge-orange' }
const icons = ['👑', '👤', '🤝','👨‍💼']
const colors = ['#f43f5e', '#10b981', '#6366f1','#f19063']

const UserModal = ({ initial, onClose, onSave }) => {
  const [form, setForm] = useState(initial ? { ...initial, password: '' } : EMPTY)
  const [saving, setSaving] = useState(false)
  const set = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))
  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true)
    await onSave(form); setSaving(false); onClose()
  }
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>{initial ? 'Edit User' : 'Add User'}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 20 }}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input name="name" className="form-control" value={form.name} onChange={set} placeholder="User's full name" required />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input name="email" type="email" className="form-control" value={form.email} onChange={set} placeholder="user@company.com" required />
          </div>
          <div className="grid-2">
            {/* <div className="form-group">
              <label className="form-label">Password {initial && <span style={{ color: 'var(--text-muted)', fontWeight: 400, textTransform: 'none' }}>(leave blank to keep)</span>}</label>
              <input name="password" type="password" className="form-control" value={form.password} onChange={set} placeholder={initial ? '••••••••' : 'Min 6 characters'} required={!initial} />
            </div> */}
            <div className="form-group">
              <label className="form-label">Role</label>
              <select name="role" className="form-control" value={form.role} onChange={set}>
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} disabled={saving}>
              {saving ? <><span className="spinner" /> Saving...</> : initial ? 'Update User' : 'Add User'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

const Users = () => {
  const dispatch = useDispatch()
  const { items, totalElements, totalPages, loading, countArray } = useSelector(s => s.users)
  const { user: currentUser } = useSelector(s => s.auth)

  const [modal, setModal] = useState(null)
  const [editItem, setEditItem] = useState(null)
  const [search, setSearch] = useState('')
  const [filterRole, setFilterRole] = useState('ALL')
  const [deleteId, setDeleteId] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)

  useEffect(() => {
    dispatch(fetchUsers({ page: currentPage, size: pageSize, search }));
    dispatch(roleUserCount())
  }, [currentPage, pageSize])

  const handlePageChange = p => setCurrentPage(p)

  const handlePageSizeChange = n => {
    setPageSize(n)
    setCurrentPage(1)
  }

  const handleSearchChange = e => {
    setSearch(e.target.value)
    dispatch(fetchUsers({ page: 1, size: 5, search: e.target.value }))
    setCurrentPage(1)
    setPageSize(5)
  }

  const handleFilterChange = role => {
    setFilterRole(filterRole === role ? 'ALL' : role)
    setCurrentPage(1)
  }

  const handleSave = async (form) => {
    if (editItem) await dispatch(updateUser({ id: editItem.id, data: form }))
    else await dispatch(createUser(form))
    dispatch(fetchUsers({ page: 1, size: 5, search }))
    setCurrentPage(1)
    setPageSize(5)
  }

  const handleDelete = async (id) => {
    const result = await dispatch(deleteUser(id))
    if (deleteUser.fulfilled.match(result)) {
      toast.success('User deleted successfully')
    } else {
      toast.error('Failed to delete the user')
    }
    setDeleteId(null)
    dispatch(fetchUsers({ page: 1, size: 5, search }))
    setCurrentPage(1)
    setPageSize(5)
  }

  const from = totalElements === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const to = Math.min(currentPage * pageSize, totalElements)

  const canEdit = currentUser?.role === 'ADMIN'
  const filtered = filterRole === 'ALL' ? items : items.filter(u => u.role === filterRole)

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Users</div>
          <div className="page-subtitle">{totalElements} total members</div>
        </div>
        {canEdit && <button className="btn btn-primary" onClick={() => { setEditItem(null); setModal('create') }}>+ Add User</button>}
      </div>

      <div className="stats-grid" style={{ marginBottom: 24 }}>
        {ROLES.map((role, i) => {
  
          return (
            <div key={role} className="glass-card stat-card" style={{ cursor: 'pointer' }} onClick={() => handleFilterChange(role)}>
              <div className="stat-icon" style={{ background: `${colors[i]}18`, color: colors[i] }}>{icons[i]}</div>
              <div className="stat-number" style={{ background: `linear-gradient(135deg, ${colors[i]}, ${colors[i]}aa)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{countArray[role]}</div>
              <div className="stat-label">{role === 'ADMIN' ? 'Admins' : role === 'RECURITER' ? 'Recuriter Managers' : role === 'CANDIDATE' ? 'Candidates' : 'Interviewer'}</div>
            </div>
          )
        })}
      </div>

      <div className="filter-bar">
        <div className="search-input-wrap">
          <span className="search-icon">🔍</span>
          <input className="form-control search-input" placeholder="Search users by name, email..." value={search} onChange={handleSearchChange} />
        </div>
      </div>

      <div className="glass-card" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 60, textAlign: 'center' }}><span className="spinner" /></div>
        ) : filtered?.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon">👥</div><div className="empty-state-text">No users found</div></div>
        ) : (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr><th>User</th><th>Email</th><th>Role</th>{canEdit && <th>Actions</th>}</tr>
                </thead>
                <tbody>
                  {filtered.map(u => (
                    <tr key={u.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{
                            width: 36, height: 36, borderRadius: '50%',
                            background: u.role === 'ADMIN' ? 'linear-gradient(135deg,#f43f5e,#fb923c)' : u.role === 'Recuriter' ? 'linear-gradient(135deg,#10b981,#22d3ee)' : 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', flexShrink: 0,
                          }}>
                            {u.name?.charAt(0)}
                          </div>
                          <div>
                            <div style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{u.name}</div>
                            {u.id === currentUser?.id && <div style={{ fontSize: 10, color: 'var(--accent-green)', fontWeight: 600 }}>YOU</div>}
                          </div>
                        </div>
                      </td>
                      <td>{u.email}</td>
                      <td><span className={`badge ${roleBadge[u.role] || 'badge-blue'}`}>{u.role}</span></td>
                      {canEdit && (
                        <td>
                          <div className="actions-cell">
                            <button className="btn btn-secondary btn-sm" onClick={() => { setEditItem(u); setModal('edit') }}>✏️ Edit</button>
                            {u.id !== currentUser?.id && (
                              <button className="btn btn-danger btn-sm" onClick={() => setDeleteId(u.id)}>🗑️</button>
                            )}
                          </div>
                        </td>
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
        )}
      </div>

      {(modal === 'create' || modal === 'edit') && (
        <UserModal initial={modal === 'edit' ? editItem : null} onClose={() => setModal(null)} onSave={handleSave} />
      )}

      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 400, textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>Delete User?</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 24, fontSize: 14 }}>This will permanently delete the user account.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteId)}>Delete</button>
              <button className="btn btn-secondary" onClick={() => setDeleteId(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Users