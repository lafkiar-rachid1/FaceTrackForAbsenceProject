import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import professorService from '../services/professorService';

const ProfessorDashboard = () => {
  const [stats, setStats] = useState(null);
  const [courses, setCourses] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [sessionForm, setSessionForm] = useState({
    course_id: '',
    session_date: '',
    start_time: '',
    end_time: '',
    location: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsRes, coursesRes, sessionsRes] = await Promise.all([
        professorService.getStats(),
        professorService.getMyCourses(),
        professorService.getMySessions(),
      ]);
      setStats(statsRes.data);
      setCourses(coursesRes.data);
      setSessions(sessionsRes.data);
    } catch (error) {
      toast.error('Erreur lors du chargement');
    }
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();
    try {
      await professorService.createSession(sessionForm);
      toast.success('Session créée avec succès');
      setShowSessionModal(false);
      setSessionForm({ course_id: '', session_date: '', start_time: '', end_time: '', location: '' });
      loadData();
    } catch (error) {
      toast.error(error.detail || 'Erreur lors de la création');
    }
  };

  const handleCompleteSession = async (sessionId) => {
    if (window.confirm('Marquer cette session comme terminée et enregistrer les absents?')) {
      try {
        await professorService.completeSession(sessionId);
        toast.success('Session terminée');
        loadData();
      } catch (error) {
        toast.error('Erreur');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard Professeur</h1>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-sm text-gray-500">Mes Cours</p>
              <p className="text-2xl font-bold">{stats.total_courses}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-sm text-gray-500">Sessions Totales</p>
              <p className="text-2xl font-bold">{stats.total_sessions}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-sm text-gray-500">Sessions à Venir</p>
              <p className="text-2xl font-bold">{stats.upcoming_sessions}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-sm text-gray-500">Étudiants Inscrits</p>
              <p className="text-2xl font-bold">{stats.students_enrolled}</p>
            </div>
          </div>
        )}

        {/* Create Session Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowSessionModal(true)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 font-medium"
          >
            Créer une Session
          </button>
        </div>

        {/* Courses */}
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <h2 className="text-xl font-semibold mb-4">Mes Cours</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map((course) => (
              <div key={course.course_id} className="border rounded-lg p-4">
                <h3 className="font-semibold">{course.course_name}</h3>
                <p className="text-sm text-gray-500">Code: {course.course_code}</p>
                <p className="text-sm text-gray-600 mt-2">{course.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sessions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Mes Sessions</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Heure</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lieu</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sessions.map((session) => (
                  <tr key={session.session_id}>
                    <td className="px-6 py-4 text-sm">{new Date(session.session_date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm">{session.start_time} - {session.end_time}</td>
                    <td className="px-6 py-4 text-sm">{session.location}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        session.is_completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {session.is_completed ? 'Terminée' : 'En cours'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {!session.is_completed && (
                        <button
                          onClick={() => handleCompleteSession(session.session_id)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Terminer
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Session Modal */}
      {showSessionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Créer une Session</h2>
            <form onSubmit={handleCreateSession}>
              <div className="space-y-4">
                <select
                  value={sessionForm.course_id}
                  onChange={(e) => setSessionForm({...sessionForm, course_id: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                >
                  <option value="">Sélectionner un cours</option>
                  {courses.map((course) => (
                    <option key={course.course_id} value={course.course_id}>
                      {course.course_name}
                    </option>
                  ))}
                </select>
                <input
                  type="date"
                  value={sessionForm.session_date}
                  onChange={(e) => setSessionForm({...sessionForm, session_date: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
                <input
                  type="time"
                  placeholder="Heure de début"
                  value={sessionForm.start_time}
                  onChange={(e) => setSessionForm({...sessionForm, start_time: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
                <input
                  type="time"
                  placeholder="Heure de fin"
                  value={sessionForm.end_time}
                  onChange={(e) => setSessionForm({...sessionForm, end_time: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
                <input
                  type="text"
                  placeholder="Lieu"
                  value={sessionForm.location}
                  onChange={(e) => setSessionForm({...sessionForm, location: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowSessionModal(false)}
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
    </div>
  );
};

export default ProfessorDashboard;
