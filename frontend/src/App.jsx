import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './store';
import { Navbar, ProtectedRoute } from './components';
import { Home, Login, Register, StudentDashboard } from './pages';
import AdminDashboard from './pages/AdminDashboard';
import ProfessorDashboard from './pages/ProfessorDashboard';

function AppRoutes() {
  const { isAuthenticated, userType, user } = useAuth();

  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} 
        />
        <Route 
          path="/register" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />} 
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              {userType === 'student' ? (
                <StudentDashboard />
              ) : user?.role === 'admin' ? (
                <AdminDashboard />
              ) : user?.role === 'prof' ? (
                <ProfessorDashboard />
              ) : (
                <div className="container mx-auto px-4 py-8">
                  <h1 className="text-2xl font-bold">Dashboard non disponible</h1>
                </div>
              )}
            </ProtectedRoute>
          }
        />

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" />
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
