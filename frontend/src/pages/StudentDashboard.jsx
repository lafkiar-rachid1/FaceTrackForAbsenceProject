import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store';
import { attendanceService, studentService } from '../services';
import { LoadingSpinner } from '../components';
import MarkAttendance from '../components/MarkAttendance';
import HeaderStudent from '../components/student/HeaderStudent';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user, refreshUser, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [attendances, setAttendances] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMarkAttendance, setShowMarkAttendance] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Charger les statistiques
      const statsData = await attendanceService.getMyStats();
      setStats(statsData);

      // Charger les présences
      const attendancesData = await attendanceService.getMyAttendance();
      setAttendances(attendancesData);

      // Charger le profil complet
      const profileData = await studentService.getMyProfile();
      setProfile(profileData);

    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceMarked = () => {
    setShowMarkAttendance(false);
    loadDashboardData();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <HeaderStudent user={user} onLogout={handleLogout} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Bonjour, {user?.full_name} 👋
              </h1>
              <p className="text-gray-600">Bienvenue sur votre tableau de bord</p>
            </div>
            <button
              onClick={() => setShowMarkAttendance(!showMarkAttendance)}
              className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 font-medium"
            >
              {showMarkAttendance ? 'Masquer' : 'Marquer ma Présence'}
            </button>
          </div>
        </div>

        {/* Mark Attendance Component */}
        {showMarkAttendance && (
          <div className="mb-6">
            <MarkAttendance onSuccess={handleAttendanceMarked} />
          </div>
        )}

        {/* Profile Info */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 text-blue-600 p-3 rounded-full mr-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold">{user?.email || 'Non renseigné'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-green-100 text-green-600 p-3 rounded-full mr-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Téléphone</p>
                <p className="font-semibold">{user?.phone || 'Non renseigné'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 text-purple-600 p-3 rounded-full mr-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">N° Inscription</p>
                <p className="font-semibold">{user?.enrollment_number || 'Non renseigné'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid md:grid-cols-4 gap-6 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Sessions</p>
                  <p className="text-4xl font-bold">{stats.total_sessions}</p>
                </div>
                <svg className="w-12 h-12 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Présent</p>
                  <p className="text-4xl font-bold">{stats.present_count}</p>
                </div>
                <svg className="w-12 h-12 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm">Absent</p>
                  <p className="text-4xl font-bold">{stats.absent_count}</p>
                </div>
                <svg className="w-12 h-12 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Taux de présence</p>
                  <p className="text-4xl font-bold">{stats.attendance_percentage}%</p>
                </div>
                <svg className="w-12 h-12 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Images Info */}
        {profile && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">📸 Reconnaissance Faciale</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-2">
                  Statut: {profile.has_images ? (
                    <span className="text-green-600 font-semibold">✓ Activé</span>
                  ) : (
                    <span className="text-red-600 font-semibold">✗ Désactivé</span>
                  )}
                </p>
                <p className="text-gray-600">
                  Images enregistrées: <span className="font-semibold">{profile.image_count}</span>
                </p>
              </div>
              {!profile.has_images && (
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
                  Ajouter des images
                </button>
              )}
            </div>
          </div>
        )}

        {/* Recent Attendances */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Présences récentes</h2>
          
          {attendances.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Aucune présence enregistrée pour le moment</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Cours</th>
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-left py-3 px-4">Heure</th>
                    <th className="text-left py-3 px-4">Statut</th>
                    <th className="text-left py-3 px-4">Confiance</th>
                  </tr>
                </thead>
                <tbody>
                  {attendances.slice(0, 10).map((attendance) => (
                    <tr key={attendance.attendance_id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{attendance.course_name || 'N/A'}</td>
                      <td className="py-3 px-4">
                        {new Date(attendance.session_date).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="py-3 px-4">
                        {new Date(attendance.detected_at).toLocaleTimeString('fr-FR')}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            attendance.status === 'Présent'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {attendance.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {attendance.confidence ? 
                          `${(attendance.confidence * 100).toFixed(0)}%` : 
                          '-'
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
