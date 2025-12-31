import api from './api';

/**
 * Service d'authentification
 */
const authService = {
  /**
   * Login pour utilisateur (admin/professeur)
   */
  loginUser: async (username, password) => {
    try {
      const response = await api.post('/auth/login/user', {
        username,
        password,
      });
      
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('userType', 'user');
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Erreur de connexion' };
    }
  },

  /**
   * Login pour étudiant
   */
  loginStudent: async (username, password) => {
    try {
      const response = await api.post('/auth/login/student', {
        username,
        password,
      });
      
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('userType', 'student');
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Erreur de connexion' };
    }
  },

  /**
   * Inscription d'un étudiant
   */
  registerStudent: async (studentData) => {
    try {
      const response = await api.post('/auth/register/student', studentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: "Erreur lors de l'inscription" };
    }
  },

  /**
   * Obtenir l'utilisateur actuel (admin/prof)
   */
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me/user');
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Erreur lors de la récupération du profil' };
    }
  },

  /**
   * Obtenir l'étudiant actuel
   */
  getCurrentStudent: async () => {
    try {
      const response = await api.get('/auth/me/student');
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Erreur lors de la récupération du profil' };
    }
  },

  /**
   * Vérifier si le token est valide
   */
  verifyToken: async () => {
    try {
      const response = await api.post('/auth/verify-token');
      return response.data;
    } catch (error) {
      return null;
    }
  },

  /**
   * Déconnexion
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
  },

  /**
   * Vérifier si l'utilisateur est connecté
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  /**
   * Obtenir le type d'utilisateur
   */
  getUserType: () => {
    return localStorage.getItem('userType');
  },

  /**
   * Obtenir l'utilisateur stocké
   */
  getStoredUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

export default authService;
