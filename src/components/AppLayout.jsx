import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import ThreeBackground from './ThreeBackground'

const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1024)

  useEffect(() => {
    const onResize = () => {
      const desktop = window.innerWidth > 1024
      setIsDesktop(desktop)
      if (desktop) setSidebarOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (!isDesktop && sidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [sidebarOpen, isDesktop])

  const closeSidebar = () => setSidebarOpen(false)

  return (
    <div className="app-layout">
      {/* ── 3D Background behind everything ── */}
      <ThreeBackground />

      {/* ── Subtle gradient overlay for readability ── */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.05) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(139,92,246,0.04) 0%, transparent 50%)',
      }} />

      {/* ── Sidebar ── */}
      <div className={`sidebar ${(!isDesktop && !sidebarOpen) ? '' : (isDesktop ? 'visible' : sidebarOpen ? 'visible' : '')}`}
        style={isDesktop ? { transform: 'none' } : {}}
      >
        <Sidebar onClose={closeSidebar} />
      </div>

      {/* Mobile overlay */}
      {!isDesktop && sidebarOpen && (
        <div
          className="sidebar-overlay show"
          onClick={closeSidebar}
        />
      )}

      {/* ── Main content ── */}
      <div className={`main-content ${!isDesktop ? 'sidebar-collapsed' : ''}`}>
        <Navbar onMenuToggle={() => setSidebarOpen(v => !v)} />
        <div className="page-content">
          {children}
        </div>
      </div>
    </div>
  )
}

export default AppLayout
