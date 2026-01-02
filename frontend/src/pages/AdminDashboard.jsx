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
  const [enrollments, setEnrollments] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Modals
  const [showProfModal, setShowProfModal] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [editMode, setEditMode] = useState({ professor: null, course: null });

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
      const [statsRes, profsRes, coursesRes, studentsData, enrollmentsRes] = await Promise.all([
        adminService.getStats(),
        adminService.getAllProfessors(),
        adminService.getAllCourses(),
        studentService.getAllStudents(),
        adminService.getAllEnrollments(),
      ]);
      setStats(statsRes.data);
      setProfessors(profsRes.data);
      setCourses(coursesRes.data);
      setStudents(studentsData);
      setEnrollments(enrollmentsRes.data);
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
      if (editMode.professor) {
        await adminService.updateProfessor(editMode.professor.user_id, { ...profForm, role_id: 2 });
        toast.success('Professeur modifié avec succès');
      } else {
        await adminService.createProfessor({ ...profForm, role_id: 2 });
        toast.success('Professeur créé avec succès');
      }
      setShowProfModal(false);
      setProfForm({ username: '', password: '', full_name: '' });
      setEditMode({ ...editMode, professor: null });
      loadData();
    } catch (error) {
      toast.error(error.detail || 'Erreur lors de l\'opération');
    }
  };

  const handleEditProfessor = (professor) => {
    setProfForm({ 
      username: professor.username, 
      password: '', 
      full_name: professor.full_name 
    });
    setEditMode({ ...editMode, professor });
    setShowProfModal(true);
  };

  const handleDeleteProfessor = async (professorId, professorName) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${professorName}?`)) {
      try {
        await adminService.deleteProfessor(professorId);
        toast.success('Professeur supprimé avec succès');
        loadData();
      } catch (error) {
        toast.error(error.detail || 'Erreur lors de la suppression');
      }
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      const courseData = {
        ...courseForm,
        prof_id: parseInt(courseForm.prof_id),
        credits: parseInt(courseForm.credits)
      };
      if (editMode.course) {
        await adminService.updateCourse(editMode.course.course_id, courseData);
        toast.success('Cours modifié avec succès');
      } else {
        await adminService.createCourse(courseData);
        toast.success('Cours créé avec succès');
      }
      setShowCourseModal(false);
      setCourseForm({ course_name: '', course_code: '', prof_id: '', description: '', credits: 3 });
      setEditMode({ ...editMode, course: null });
      loadData();
    } catch (error) {
      toast.error(error.detail || 'Erreur lors de l\'opération');
    }
  };

  const handleEditCourse = (course) => {
    setCourseForm({
      course_name: course.course_name,
      course_code: course.course_code,
      prof_id: course.prof_id.toString(),
      description: course.description,
      credits: course.credits
    });
    setEditMode({ ...editMode, course });
    setShowCourseModal(true);
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
      loadData();
    } catch (error) {
      toast.error(error.detail || 'Erreur lors de l\'inscription');
    }
  };

  const handleRemoveEnrollment = async (enrollmentId, studentName, courseName) => {
    if (window.confirm(`Êtes-vous sûr de vouloir retirer ${studentName} du cours ${courseName}?`)) {
      try {
        await adminService.removeEnrollment(enrollmentId);
        toast.success('Inscription supprimée avec succès');
        loadData();
      } catch (error) {
        toast.error(error.detail || 'Erreur lors de la suppression');
      }
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

        <main className={`flex-1 transition-all duration-500 ${sidebarOpen ? 'ml-72' : 'ml-0'}`}>
          <div className="p-8">
            {activeTab === 'overview' && <StatsCards stats={stats} />}

            {activeTab !== 'overview' && (
              <div className="backdrop-blur-xl bg-white/90 shadow-2xl shadow-indigo-500/10 rounded-3xl p-8 border border-gray-200/50">
                {activeTab === 'professors' && (
                  <ProfessorsTab 
                    professors={professors} 
                    onAddProfessor={() => {
                      setProfForm({ username: '', password: '', full_name: '' });
                      setEditMode({ ...editMode, professor: null });
                      setShowProfModal(true);
                    }}
                    onEditProfessor={handleEditProfessor}
                    onDeleteProfessor={handleDeleteProfessor}
                  />
                )}

                {activeTab === 'courses' && (
                  <CoursesTab 
                    courses={courses} 
                    onAddCourse={() => {
                      setCourseForm({ course_name: '', course_code: '', prof_id: '', description: '', credits: 3 });
                      setEditMode({ ...editMode, course: null });
                      setShowCourseModal(true);
                    }}
                    onEditCourse={handleEditCourse}
                    onDeleteCourse={handleDeleteCourse} 
                  />
                )}

                {activeTab === 'enrollments' && (
                  <EnrollmentsTab 
                    onEnrollStudent={() => setShowEnrollModal(true)} 
                    enrollments={enrollments}
                    onRemoveEnrollment={handleRemoveEnrollment}
                  />
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      <ProfessorModal
        show={showProfModal}
        onClose={() => {
          setShowProfModal(false);
          setEditMode({ ...editMode, professor: null });
          setProfForm({ username: '', password: '', full_name: '' });
        }}
        profForm={profForm}
        setProfForm={setProfForm}
        onSubmit={handleCreateProfessor}
        editMode={editMode.professor}
      />

      <CourseModal
        show={showCourseModal}
        onClose={() => {
          setShowCourseModal(false);
          setEditMode({ ...editMode, course: null });
          setCourseForm({ course_name: '', course_code: '', prof_id: '', description: '', credits: 3 });
        }}
        courseForm={courseForm}
        setCourseForm={setCourseForm}
        professors={professors}
        onSubmit={handleCreateCourse}
        editMode={editMode.course}
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
