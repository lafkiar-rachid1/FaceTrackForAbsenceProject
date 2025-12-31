import api from './api';

const professorService = {
  // Statistiques
  getStats: () => api.get('/professor/stats'),

  // Gestion des cours
  getMyCourses: () => api.get('/professor/courses'),
  getCourseStudents: (courseId) => api.get(`/professor/courses/${courseId}/students`),

  // Gestion des sessions
  getMySessions: () => api.get('/professor/sessions'),
  createSession: (data) => api.post('/professor/sessions', data),
  getSessionAttendance: (sessionId) => api.get(`/professor/sessions/${sessionId}/attendance`),
  completeSession: (sessionId) => api.put(`/professor/sessions/${sessionId}/complete`),
};

export default professorService;
