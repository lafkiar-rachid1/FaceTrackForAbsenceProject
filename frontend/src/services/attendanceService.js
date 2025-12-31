import api from './api';

/**
 * Service de gestion de présence
 */
const attendanceService = {
  /**
   * Marquer une présence manuellement
   */
  markAttendance: async (attendanceData) => {
    try {
      const response = await api.post('/attendance/', attendanceData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Erreur lors du marquage de présence' };
    }
  },

  /**
   * Obtenir les présences d'une session
   */
  getSessionAttendance: async (sessionId) => {
    try {
      const response = await api.get(`/attendance/session/${sessionId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Erreur lors de la récupération des présences' };
    }
  },

  /**
   * Obtenir les présences d'un étudiant
   */
  getStudentAttendance: async (studentId) => {
    try {
      const response = await api.get(`/attendance/student/${studentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Erreur lors de la récupération des présences' };
    }
  },

  /**
   * Obtenir les statistiques d'un étudiant
   */
  getStudentStats: async (studentId) => {
    try {
      const response = await api.get(`/attendance/student/${studentId}/stats`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Erreur lors de la récupération des statistiques' };
    }
  },

  /**
   * Obtenir mes présences (étudiant connecté)
   */
  getMyAttendance: async () => {
    try {
      const response = await api.get('/attendance/me/attendance');
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Erreur lors de la récupération des présences' };
    }
  },

  /**
   * Obtenir mes statistiques (étudiant connecté)
   */
  getMyStats: async () => {
    try {
      const response = await api.get('/attendance/me/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Erreur lors de la récupération des statistiques' };
    }
  },

  /**
   * Supprimer une présence
   */
  deleteAttendance: async (attendanceId) => {
    try {
      const response = await api.delete(`/attendance/${attendanceId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Erreur lors de la suppression de la présence' };
    }
  },
};

export default attendanceService;
