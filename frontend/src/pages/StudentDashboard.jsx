import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store';
import { attendanceService, studentService } from '../services';
import { LoadingSpinner } from '../components';
import HeaderStudent from '../components/student/HeaderStudent';
import SideBarStudent from '../components/student/SideBarStudent';
import StatsCardsStudent from '../components/student/StatsCardsStudent';
import AttendanceTab from '../components/student/AttendanceTab';
import ProfileTab from '../components/student/ProfileTab';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [attendances, setAttendances] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMarkAttendance, setShowMarkAttendance] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <HeaderStudent 
        user={user} 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen}
        onLogout={handleLogout} 
      />

      <div className="flex">
        <SideBarStudent 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          sidebarOpen={sidebarOpen} 
        />

        <main className={`flex-1 transition-all duration-500 ${sidebarOpen ? 'ml-72' : 'ml-0'}`}>
          <div className="p-8">
            {activeTab === 'overview' && (
              <StatsCardsStudent 
                stats={stats} 
                user={user}
                showMarkAttendance={showMarkAttendance}
                setShowMarkAttendance={setShowMarkAttendance}
                onAttendanceMarked={handleAttendanceMarked}
              />
            )}

            {activeTab !== 'overview' && (
              <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-lg">
                {activeTab === 'attendance' && (
                  <AttendanceTab attendances={attendances} />
                )}

                {activeTab === 'profile' && (
                  <ProfileTab user={user} profile={profile} />
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
