import React from 'react';

const EnrollModal = ({ show, onClose, enrollForm, setEnrollForm, students, courses, onSubmit }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="relative backdrop-blur-2xl bg-white/95 rounded-3xl p-8 w-full max-w-md shadow-2xl shadow-pink-500/30 border border-gray-200/50 animate-slideUp">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-400/20 to-rose-400/20 rounded-full blur-3xl"></div>
        <div className="relative">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-pink-600 to-rose-600 shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h2 className="text-2xl font-black bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">Inscrire un étudiant</h2>
          </div>
          <form onSubmit={onSubmit}>
            <div className="space-y-4">
              <select
                value={enrollForm.student_id}
                onChange={(e) => setEnrollForm({...enrollForm, student_id: e.target.value})}
                className="w-full px-5 py-3 border-2 border-gray-200 rounded-2xl focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20 transition-all outline-none font-medium"
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
                className="w-full px-5 py-3 border-2 border-gray-200 rounded-2xl focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20 transition-all outline-none font-medium"
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
            <div className="flex justify-end space-x-3 mt-8">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border-2 border-gray-300 rounded-2xl hover:bg-gray-50 font-bold text-gray-700 transition-all hover:scale-105"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="group relative px-6 py-3 rounded-2xl bg-gradient-to-br from-pink-600 to-rose-600 text-white font-bold transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/50 hover:scale-105 overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <span className="relative">Inscrire</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EnrollModal;
