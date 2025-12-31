import api from './api';

/**
 * Service de gestion des étudiants
 */
const studentService = {
  /**
   * Capturer les images faciales d'un étudiant
   */
  captureFaces: async (studentId, imagesBase64) => {
    try {
      const response = await api.post('/students/capture-faces', {
        student_id: studentId,
        images_base64: imagesBase64,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Erreur lors de la capture des images' };
    }
  },

  /**
   * Obtenir tous les étudiants
   */
  getAllStudents: async (skip = 0, limit = 100) => {
    try {
      const response = await api.get('/students/', {
        params: { skip, limit },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Erreur lors de la récupération des étudiants' };
    }
  },

  /**
   * Obtenir un étudiant par ID
   */
  getStudentById: async (studentId) => {
    try {
      const response = await api.get(`/students/${studentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: "Erreur lors de la récupération de l'étudiant" };
    }
  },

  /**
   * Créer un étudiant (admin seulement)
   */
  createStudent: async (studentData) => {
    try {
      const response = await api.post('/students/', studentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: "Erreur lors de la création de l'étudiant" };
    }
  },

  /**
   * Mettre à jour un étudiant
   */
  updateStudent: async (studentId, studentData) => {
    try {
      const response = await api.put(`/students/${studentId}`, studentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: "Erreur lors de la mise à jour de l'étudiant" };
    }
  },

  /**
   * Supprimer un étudiant
   */
  deleteStudent: async (studentId) => {
    try {
      const response = await api.delete(`/students/${studentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: "Erreur lors de la suppression de l'étudiant" };
    }
  },

  /**
   * Obtenir les images d'un étudiant
   */
  getStudentImages: async (studentId) => {
    try {
      const response = await api.get(`/students/${studentId}/images`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Erreur lors de la récupération des images' };
    }
  },

  /**
   * Supprimer les images d'un étudiant
   */
  deleteStudentImages: async (studentId) => {
    try {
      const response = await api.delete(`/students/${studentId}/images`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Erreur lors de la suppression des images' };
    }
  },

  /**
   * Réentraîner le modèle
   */
  retrainModel: async () => {
    try {
      const response = await api.post('/students/retrain-model');
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Erreur lors du réentraînement du modèle' };
    }
  },

  /**
   * Obtenir le profil de l'étudiant connecté
   */
  getMyProfile: async () => {
    try {
      const response = await api.get('/students/me/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Erreur lors de la récupération du profil' };
    }
  },
};

export default studentService;
