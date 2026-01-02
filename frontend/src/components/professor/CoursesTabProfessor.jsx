import React, { useState, useEffect } from 'react';
import professorService from '../../services/professorService';
import { toast } from 'react-hot-toast';

const CoursesTabProfessor = ({ courses }) => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadCourseStudents = async (courseId) => {
    setLoading(true);
    try {
      const response = await professorService.getCourseStudents(courseId);
      setStudents(response.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des étudiants');
    } finally {
      setLoading(false);
    }
  };

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
    loadCourseStudents(course.course_id);
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Mes Cours</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des cours */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Liste des cours</h3>
            <div className="space-y-2">
              {courses && courses.map((course) => (
                <button
                  key={course.course_id}
                  onClick={() => handleCourseClick(course)}
                  className={`w-full text-left p-4 rounded-xl transition-all ${
                    selectedCourse?.course_id === course.course_id
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <p className={`font-semibold ${selectedCourse?.course_id === course.course_id ? 'text-white' : 'text-gray-800'}`}>
                    {course.course_name}
                  </p>
                  <p className={`text-sm ${selectedCourse?.course_id === course.course_id ? 'text-white/80' : 'text-gray-500'}`}>
                    {course.course_code}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Détails du cours et étudiants */}
        <div className="lg:col-span-2">
          {selectedCourse ? (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-800">{selectedCourse.course_name}</h3>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="px-3 py-1 rounded-lg bg-indigo-100 text-indigo-700 text-sm font-semibold">
                    {selectedCourse.course_code}
                  </span>
                  <span className="text-sm text-gray-600">{selectedCourse.credits} crédits</span>
                </div>
                {selectedCourse.description && (
                  <p className="text-gray-600 mt-3">{selectedCourse.description}</p>
                )}
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">
                  Étudiants inscrits ({students.length})
                </h4>
                
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                  </div>
                ) : students.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                            Matricule
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                            Nom complet
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                            Statut
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {students.map((student) => (
                          <tr key={student.student_id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm font-semibold text-indigo-600">
                              {student.enrollment_number}
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                              {student.full_name}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {student.email}
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                student.is_active 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {student.is_active ? 'Actif' : 'Inactif'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <p className="mt-2 text-gray-500">Aucun étudiant inscrit</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <p className="mt-4 text-gray-500 font-medium">Sélectionnez un cours pour voir les détails</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursesTabProfessor;
