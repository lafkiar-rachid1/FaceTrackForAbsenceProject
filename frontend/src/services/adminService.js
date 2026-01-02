import api from './api';

const adminService = {
  // Statistiques
  getStats: () => api.get('/admin/stats'),

  // Gestion des professeurs
  getAllProfessors: () => api.get('/admin/professors'),
  createProfessor: (data) => api.post('/admin/professors', data),
  updateProfessor: (professorId, data) => api.put(`/admin/professors/${professorId}`, data),
  deleteProfessor: (professorId) => api.delete(`/admin/professors/${professorId}`),

  // Gestion des cours
  getAllCourses: () => api.get('/admin/courses'),
  createCourse: (data) => api.post('/admin/courses', data),
  updateCourse: (courseId, data) => api.put(`/admin/courses/${courseId}`, data),
  deleteCourse: (courseId) => api.delete(`/admin/courses/${courseId}`),

  // Gestion des inscriptions
  enrollStudent: (data) => api.post('/admin/enrollments', data),
  removeEnrollment: (enrollmentId) => api.delete(`/admin/enrollments/${enrollmentId}`),
  getCourseStudents: (courseId) => api.get(`/admin/courses/${courseId}/students`),
  getAllEnrollments: () => api.get('/admin/enrollments'),
};

export default adminService;
