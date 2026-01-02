import React from 'react';

const CourseModal = ({ show, onClose, courseForm, setCourseForm, professors, onSubmit }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Créer un cours</h2>
        <form onSubmit={onSubmit}>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Nom du cours"
              value={courseForm.course_name}
              onChange={(e) => setCourseForm({...courseForm, course_name: e.target.value})}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
            <input
              type="text"
              placeholder="Code du cours"
              value={courseForm.course_code}
              onChange={(e) => setCourseForm({...courseForm, course_code: e.target.value})}
              className="w-full px-3 py-2 border rounded-md"
            />
            <select
              value={courseForm.prof_id}
              onChange={(e) => setCourseForm({...courseForm, prof_id: e.target.value})}
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              <option value="">Sélectionner un professeur</option>
              {professors && professors.map((prof) => (
                <option key={prof.user_id} value={prof.user_id}>
                  {prof.full_name}
                </option>
              ))}
            </select>
            <textarea
              placeholder="Description"
              value={courseForm.description}
              onChange={(e) => setCourseForm({...courseForm, description: e.target.value})}
              className="w-full px-3 py-2 border rounded-md"
              rows="3"
            />
            <input
              type="number"
              placeholder="Crédits"
              value={courseForm.credits}
              onChange={(e) => setCourseForm({...courseForm, credits: e.target.value})}
              className="w-full px-3 py-2 border rounded-md"
              min="1"
              max="10"
            />
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
              Créer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseModal;
