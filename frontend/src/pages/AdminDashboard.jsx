import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store';
import adminService from '../services/adminService';
import studentService from '../services/studentService';
import {
  HeaderAdmin,
  SideBarAdmin,
  StatsCards,
  ProfessorsTab,
  CoursesTab,
  EnrollmentsTab,
  ProfessorModal,
  CourseModal,
  EnrollModal
} from '../components/admin';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [stats, setStats] = useState(null);
  const [professors, setProfessors] = useState([]);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
      setStats(statsRes.data);
      setProfessors(profsRes.data);
      setCourses(coursesRes.data);
      setStudents(studentsData);
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
        toast.success('Cours supprimé avec succès');
        loadData();
      } catch (error) {
        toast.error(error.detail || 'Erreur lors de la suppression');
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
      <HeaderAdmin 
        user={user} 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        onLogout={handleLogout} 
      />

      <div className="flex">
        <SideBarAdmin 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          sidebarOpen={sidebarOpen} 
        />

        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
          <div className="p-6">
            {activeTab === 'overview' && <StatsCards stats={stats} />}

            <div className="bg-white shadow-lg rounded-xl p-6">
              {activeTab === 'professors' && (
                <ProfessorsTab 
                  professors={professors} 
                  onAddProfessor={() => setShowProfModal(true)} 
                />
              )}

              {activeTab === 'courses' && (
                <CoursesTab 
                  courses={courses} 
                  onAddCourse={() => setShowCourseModal(true)} 
                  onDeleteCourse={handleDeleteCourse} 
                />
              )}

              {activeTab === 'enrollments' && (
                <EnrollmentsTab onEnrollStudent={() => setShowEnrollModal(true)} />
              )}
            </div>
          </div>
        </main>
      </div>

      <ProfessorModal
        show={showProfModal}
        onClose={() => setShowProfModal(false)}
        profForm={profForm}
        setProfForm={setProfForm}
        onSubmit={handleCreateProfessor}
      />

      <CourseModal
        show={showCourseModal}
        onClose={() => setShowCourseModal(false)}
        courseForm={courseForm}
        setCourseForm={setCourseForm}
        professors={professors}
        onSubmit={handleCreateCourse}
      />

      <EnrollModal
        show={showEnrollModal}
        onClose={() => setShowEnrollModal(false)}
        enrollForm={enrollForm}
        setEnrollForm={setEnrollForm}
        students={students}
        courses={courses}
        onSubmit={handleEnrollStudent}
      />
    </div>
  );
};

export default AdminDashboard;
