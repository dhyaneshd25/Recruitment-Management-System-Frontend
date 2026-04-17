import React from "react";

const PAGE_SIZE_OPTIONS = [5, 10, 20]

const Pagination = ({ currentPage, totalPages, pageSize, onPageChange, onPageSizeChange, totalElements, from, to }) => {
  const pages = []
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    pages.push(1)
    if (currentPage > 3) pages.push('...')
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i)
    if (currentPage < totalPages - 2) pages.push('...')
    pages.push(totalPages)
  }

  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 20px', flexWrap:'wrap', gap:12, borderTop:'1px solid var(--border-subtle)' }}>
      <span style={{ fontSize:13, color:'var(--text-muted)' }}>
        Showing <strong style={{ color:'var(--text-secondary)' }}>{from}–{to}</strong> of{' '}
        <strong style={{ color:'var(--text-secondary)' }}>{totalElements}</strong> jobs
      </span>

      <div style={{ display:'flex', gap:4, alignItems:'center' }}>
        <button className="btn btn-secondary btn-sm" onClick={() => onPageChange(currentPage-1)}
          disabled={currentPage === 1} style={{ padding:'4px 10px', opacity: currentPage === 1 ? 0.4 : 1 }}>‹</button>

        {pages.map((p, i) =>
          p === '...'
            ? <span key={`el-${i}`} style={{ padding:'0 6px', color:'var(--text-muted)', fontSize:14 }}>…</span>
            : <button key={p}
                className={p === currentPage ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
                onClick={() => onPageChange(p)}
                style={{ padding:'4px 10px', minWidth:34 }}
              >{p}</button>
        )}

        <button className="btn btn-secondary btn-sm" onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages} style={{ padding:'4px 10px', opacity: currentPage === totalPages ? 0.4 : 1 }}>›</button>
      </div>

      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        <span style={{ fontSize:13, color:'var(--text-muted)' }}>Rows per page</span>
        <select className="form-control" value={pageSize} onChange={e => onPageSizeChange(Number(e.target.value))}
          style={{ width:68, padding:'4px 8px', fontSize:13 }}>
          {PAGE_SIZE_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>
    </div>
  )
}

export default Pagination;
