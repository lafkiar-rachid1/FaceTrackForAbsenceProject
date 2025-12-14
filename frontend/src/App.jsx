import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import FaceRegistration from './pages/FaceRegistration'
import Attendance from './pages/Attendance'
import AttendanceHistory from './pages/AttendanceHistory'
import Users from './pages/Users'
import { useAuthStore } from './store/authStore'

function App() {
  const { isAuthenticated } = useAuthStore()

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
        
        <Route path="/" element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="face-registration" element={<FaceRegistration />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="attendance-history" element={<AttendanceHistory />} />
          <Route path="users" element={<Users />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
