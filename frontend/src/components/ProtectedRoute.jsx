import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../store';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children, allowedTypes = ['user', 'student'] }) => {
  const { isAuthenticated, userType, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedTypes.includes(userType)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
