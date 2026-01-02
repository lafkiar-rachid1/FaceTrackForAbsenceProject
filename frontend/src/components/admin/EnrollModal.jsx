import React from 'react';

const EnrollModal = ({ show, onClose, enrollForm, setEnrollForm, students, courses, onSubmit }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Inscrire un étudiant</h2>
        <form onSubmit={onSubmit}>
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
              onClick={onClose}
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
  );
};

export default EnrollModal;
