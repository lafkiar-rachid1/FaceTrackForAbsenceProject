import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    const initAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const storedType = authService.getUserType();
          setUserType(storedType);
          
          // Recharger les données utilisateur avec le rôle
          if (storedType === 'student') {
            const studentData = await authService.getCurrentStudent();
            setUser({...studentData, role: 'student'});
          } else {
            const userData = await authService.getCurrentUser();
            setUser({...userData, role: userData.role});
          }
          
          // Vérifier le token
          const isValid = await authService.verifyToken();
          if (!isValid) {
            authService.logout();
            setUser(null);
            setUserType(null);
          }
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error);
        authService.logout();
        setUser(null);
        setUserType(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (username, password, type = 'user') => {
    try {
      let response;
      
      if (type === 'student') {
        response = await authService.loginStudent(username, password);
        const studentData = await authService.getCurrentStudent();
        setUser({...studentData, role: 'student'});
        setUserType('student');
      } else {
        response = await authService.loginUser(username, password);
        const userData = await authService.getCurrentUser();
        // Le backend retourne déjà le role (admin ou prof)
        setUser({...userData, role: userData.role});
        setUserType('user');
      }
      
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.detail || 'Erreur de connexion' };
    }
  };

  const register = async (studentData) => {
    try {
      const response = await authService.registerStudent(studentData);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.detail || "Erreur lors de l'inscription" };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setUserType(null);
  };

  const refreshUser = async () => {
    try {
      if (userType === 'student') {
        const studentData = await authService.getCurrentStudent();
        setUser(studentData);
      } else {
        const userData = await authService.getCurrentUser();
        setUser(userData);
      }
    } catch (error) {
      console.error('Erreur lors du rafraîchissement:', error);
    }
  };

  const value = {
    user,
    userType,
    loading,
    login,
    register,
    logout,
    refreshUser,
    isAuthenticated: authService.isAuthenticated(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
