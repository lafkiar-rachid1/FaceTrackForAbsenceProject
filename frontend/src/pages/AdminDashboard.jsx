import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import adminService from '../services/adminService';
import studentService from '../services/studentService';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [professors, setProfessors] = useState([]);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  // Modals
  const [showProfModal, setShowProfModal] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showEnrollModal, setShowEnrollModal] = useState(false);

  // Forms
  const [profForm, setProfForm] = useState({ username: '', password: '', full_name: '' });
  const [courseForm, setCourseForm] = useState({ 
    course_name: '', course_code: '', prof_id: '', description: '', credits: 3 
  });
  const [enrollForm, setEnrollForm] = useState({ student_id: '', course_id: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsRes, profsRes, coursesRes, studentsData] = await Promise.all([
        adminService.getStats(),
        adminService.getAllProfessors(),
        adminService.getAllCourses(),
        studentService.getAllStudents(),
      ]);
      console.log('Students data:', studentsData);
      setStats(statsRes.data);
      setProfessors(profsRes.data);
      setCourses(coursesRes.data);
      setStudents(studentsData); // studentService retourne déjà .data
      console.log('Students state set:', studentsData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProfessor = async (e) => {
    e.preventDefault();
    try {
      await adminService.createProfessor({ ...profForm, role_id: 2 });
      toast.success('Professeur créé avec succès');
      setShowProfModal(false);
      setProfForm({ username: '', password: '', full_name: '' });
      loadData();
    } catch (error) {
      toast.error(error.detail || 'Erreur lors de la création');
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      await adminService.createCourse({
        ...courseForm,
        prof_id: parseInt(courseForm.prof_id),
        credits: parseInt(courseForm.credits)
      });
      toast.success('Cours créé avec succès');
      setShowCourseModal(false);
      setCourseForm({ course_name: '', course_code: '', prof_id: '', description: '', credits: 3 });
      loadData();
    } catch (error) {
      toast.error(error.detail || 'Erreur lors de la création');
    }
  };

  const handleEnrollStudent = async (e) => {
    e.preventDefault();
    try {
      await adminService.enrollStudent({
        student_id: parseInt(enrollForm.student_id),
        course_id: parseInt(enrollForm.course_id)
      });
      toast.success('Étudiant inscrit avec succès');
      setShowEnrollModal(false);
      setEnrollForm({ student_id: '', course_id: '' });
    } catch (error) {
      toast.error(error.detail || 'Erreur lors de l\'inscription');
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce cours?')) {
      try {
        await adminService.deleteCourse(courseId);
        toast.success('Cours supprimé');
        loadData();
      } catch (error) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard Administrateur</h1>

        {/* Stats Cards */}
        {activeTab === 'overview' && stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500">Étudiants</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.total_students}</p>
                  <p className="text-xs text-green-600">{stats.active_students} actifs</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500">Professeurs</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.total_professors}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500">Cours</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.total_courses}</p>
                  <p className="text-xs text-green-600">{stats.active_courses} actifs</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
              {['overview', 'professors', 'courses', 'enrollments'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`${
                    activeTab === tab
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
                >
                  {tab === 'overview' ? 'Vue d\'ensemble' : 
                   tab === 'professors' ? 'Professeurs' :
                   tab === 'courses' ? 'Cours' : 'Inscriptions'}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Professors Tab */}
            {activeTab === 'professors' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Professeurs</h2>
                  <button
                    onClick={() => setShowProfModal(true)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                  >
                    Ajouter un professeur
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom complet</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date création</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {professors && professors.map((prof) => (
                        <tr key={prof.user_id}>
                          <td className="px-6 py-4 text-sm text-gray-900">{prof.user_id}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{prof.full_name}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{prof.username}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {new Date(prof.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Courses Tab */}
            {activeTab === 'courses' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Cours</h2>
                  <button
                    onClick={() => setShowCourseModal(true)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                  >
                    Créer un cours
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {courses && courses.map((course) => (
                    <div key={course.course_id} className="border rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{course.course_name}</h3>
                          <p className="text-sm text-gray-500">Code: {course.course_code}</p>
                          <p className="text-sm text-gray-600 mt-2">{course.description}</p>
                          <p className="text-sm text-gray-500 mt-1">Crédits: {course.credits}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteCourse(course.course_id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Enrollments Tab */}
            {activeTab === 'enrollments' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Inscriptions</h2>
                  <button
                    onClick={() => setShowEnrollModal(true)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                  >
                    Inscrire un étudiant
                  </button>
                </div>
                <div className="text-gray-600">
                  Sélectionnez "Inscrire un étudiant" pour ajouter des étudiants aux cours.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Professor Modal */}
      {showProfModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Créer un professeur</h2>
            <form onSubmit={handleCreateProfessor}>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Nom complet"
                  value={profForm.full_name}
                  onChange={(e) => setProfForm({...profForm, full_name: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
                <input
                  type="text"
                  placeholder="Username"
                  value={profForm.username}
                  onChange={(e) => setProfForm({...profForm, username: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
                <input
                  type="password"
                  placeholder="Mot de passe"
                  value={profForm.password}
                  onChange={(e) => setProfForm({...profForm, password: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowProfModal(false)}
                  className="px-4 py-2 border rounded-md hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Créer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Course Modal */}
      {showCourseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Créer un cours</h2>
            <form onSubmit={handleCreateCourse}>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Nom du cours"
                  value={courseForm.course_name}
                  onChange={(e) => setCourseForm({...courseForm, course_name: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
                <input
                  type="text"
                  placeholder="Code du cours"
                  value={courseForm.course_code}
                  onChange={(e) => setCourseForm({...courseForm, course_code: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                />
                <select
                  value={courseForm.prof_id}
                  onChange={(e) => setCourseForm({...courseForm, prof_id: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                >
                  <option value="">Sélectionner un professeur</option>
                  {professors && professors.map((prof) => (
                    <option key={prof.user_id} value={prof.user_id}>
                      {prof.full_name}
                    </option>
                  ))}
                </select>
                <textarea
                  placeholder="Description"
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({...courseForm, description: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                  rows="3"
                />
                <input
                  type="number"
                  placeholder="Crédits"
                  value={courseForm.credits}
                  onChange={(e) => setCourseForm({...courseForm, credits: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                  min="1"
                  max="10"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCourseModal(false)}
                  className="px-4 py-2 border rounded-md hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Créer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Enroll Modal */}
      {showEnrollModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Inscrire un étudiant</h2>
            <form onSubmit={handleEnrollStudent}>
              <div className="space-y-4">
                <select
                  value={enrollForm.student_id}
                  onChange={(e) => setEnrollForm({...enrollForm, student_id: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                >
                  <option value="">Sélectionner un étudiant</option>
                  {students && students.map((student) => (
                    <option key={student.student_id} value={student.student_id}>
                      {student.full_name} ({student.enrollment_number})
                    </option>
                  ))}
                </select>
                <select
                  value={enrollForm.course_id}
                  onChange={(e) => setEnrollForm({...enrollForm, course_id: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                >
                  <option value="">Sélectionner un cours</option>
                  {courses && courses.map((course) => (
                    <option key={course.course_id} value={course.course_id}>
                      {course.course_name} ({course.course_code})
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEnrollModal(false)}
                  className="px-4 py-2 border rounded-md hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Inscrire
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
