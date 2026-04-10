import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import AppLayout from './components/AppLayout'
import ProtectedRoute from './components/ProtectedRoute'

import LandingPage from './pages/LandingPage'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/dashboard/Dashboard'
import Jobs from './pages/jobs/Jobs'
import BrowseJobs from './pages/jobs/BrowseJobs'
import Candidates from './pages/candidates/Candidates'
import Interviews from './pages/interviews/Interviews'
import Users from './pages/users/Users'
import MyApplications from './pages/candidates/MyApplications'
import MyInterviews from './pages/interviews/MyInterviews'

const App = () => {
  const { isAuthenticated } = useSelector(s => s.auth)

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login"    element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />} />

        {/* All authenticated users */}
        <Route path="/dashboard" element={
          <ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>
        } />

        {/* Candidate-only */}
        <Route path="/browse-jobs" element={
          <ProtectedRoute allowedRoles={['CANDIDATE']}>
            <AppLayout><BrowseJobs /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/my-applications" element={
          <ProtectedRoute allowedRoles={['CANDIDATE']}>
            <AppLayout><MyApplications /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/my-interviews" element={
          <ProtectedRoute allowedRoles={['CANDIDATE']}>
            <AppLayout><MyInterviews /></AppLayout>
          </ProtectedRoute>
        } />

        {/* Admin + HR */}
        <Route path="/jobs" element={
          <ProtectedRoute allowedRoles={['ADMIN','HR']}>
            <AppLayout><Jobs /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/candidates" element={
          <ProtectedRoute allowedRoles={['ADMIN','HR']}>
            <AppLayout><Candidates /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/interviews" element={
          <ProtectedRoute allowedRoles={['ADMIN','HR']}>
            <AppLayout><Interviews /></AppLayout>
          </ProtectedRoute>
        } />

        {/* Admin-only */}
        <Route path="/users" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AppLayout><Users /></AppLayout>
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
