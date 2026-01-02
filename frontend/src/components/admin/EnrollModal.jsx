import React from 'react';

const EnrollModal = ({ show, onClose, enrollForm, setEnrollForm, students, courses, onSubmit }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl border border-gray-200">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 rounded-xl bg-indigo-100">
            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Inscrire un étudiant</h2>
        </div>
        <form onSubmit={onSubmit}>
          <div className="space-y-4">
            <select
              value={enrollForm.student_id}
              onChange={(e) => setEnrollForm({...enrollForm, student_id: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none font-medium"
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
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none font-medium"
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
              className="px-6 py-2.5 border-2 border-gray-300 rounded-xl hover:bg-gray-50 font-semibold text-gray-700 transition-all"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all shadow-lg hover:shadow-xl"
            >
              Inscrire
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnrollModal;
