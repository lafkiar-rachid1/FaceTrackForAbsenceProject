import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store';
import professorService from '../services/professorService';
import HeaderProfessor from '../components/professor/HeaderProfessor';
import SideBarProfessor from '../components/professor/SideBarProfessor';
import StatsCardsProfessor from '../components/professor/StatsCardsProfessor';
import CoursesTabProfessor from '../components/professor/CoursesTabProfessor';
import SessionsTab from '../components/professor/SessionsTab';

const ProfessorDashboard = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [stats, setStats] = useState(null);
  const [courses, setCourses] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
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
      setLoading(true);
      const [statsRes, coursesRes, sessionsRes] = await Promise.all([
        professorService.getStats(),
        professorService.getMyCourses(),
        professorService.getMySessions(),
      ]);
      setStats(statsRes.data);
      setCourses(coursesRes.data);
      setSessions(sessionsRes.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();
    
    // Validation côté client
    if (sessionForm.end_time <= sessionForm.start_time) {
      toast.error("L'heure de fin doit être après l'heure de début");
      return;
    }
    
    try {
      await professorService.createSession(sessionForm);
      toast.success('Session créée avec succès');
      setShowSessionModal(false);
      setSessionForm({ course_id: '', session_date: '', start_time: '', end_time: '', location: '' });
      loadData();
    } catch (error) {
      // Meilleure gestion des erreurs du backend
      const errorMessage = error.response?.data?.detail || error.message || 'Erreur lors de la création';
      toast.error(errorMessage);
      console.error('Erreur création session:', error);
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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <HeaderProfessor 
        user={user} 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen}
        onLogout={handleLogout} 
      />

      <div className="flex">
        <SideBarProfessor 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          sidebarOpen={sidebarOpen} 
        />

        <main className={`flex-1 transition-all duration-500 ${sidebarOpen ? 'ml-72' : 'ml-0'}`}>
          <div className="p-8">
            {activeTab === 'overview' && <StatsCardsProfessor stats={stats} />}

            {activeTab !== 'overview' && (
              <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-lg">
                {activeTab === 'courses' && (
                  <CoursesTabProfessor courses={courses} />
                )}

                {activeTab === 'sessions' && (
                  <SessionsTab 
                    sessions={sessions}
                    courses={courses}
                    onCreateSession={() => setShowSessionModal(true)}
                    onCompleteSession={handleCompleteSession}
                  />
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Session Modal */}
      {showSessionModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl border border-gray-200">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 rounded-xl bg-indigo-100">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Créer une Session</h2>
            </div>
            <form onSubmit={handleCreateSession}>
              <div className="space-y-4">
                <select
                  value={sessionForm.course_id}
                  onChange={(e) => setSessionForm({...sessionForm, course_id: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none font-medium"
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
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none font-medium"
                  required
                />
                <input
                  type="time"
                  placeholder="Heure de début"
                  value={sessionForm.start_time}
                  onChange={(e) => setSessionForm({...sessionForm, start_time: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none font-medium"
                  required
                />
                <input
                  type="time"
                  placeholder="Heure de fin"
                  value={sessionForm.end_time}
                  onChange={(e) => setSessionForm({...sessionForm, end_time: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none font-medium"
                  required
                />
                <input
                  type="text"
                  placeholder="Lieu"
                  value={sessionForm.location}
                  onChange={(e) => setSessionForm({...sessionForm, location: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none font-medium"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-8">
                <button
                  type="button"
                  onClick={() => setShowSessionModal(false)}
                  className="px-6 py-2.5 border-2 border-gray-300 rounded-xl hover:bg-gray-50 font-semibold text-gray-700 transition-all"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all shadow-lg hover:shadow-xl"
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
