import React from 'react';

const CourseModal = ({ show, onClose, courseForm, setCourseForm, professors, onSubmit }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="relative backdrop-blur-2xl bg-white/95 rounded-3xl p-8 w-full max-w-md shadow-2xl shadow-purple-500/30 border border-gray-200/50 animate-slideUp">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
        <div className="relative">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-2xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Créer un cours</h2>
          </div>
          <form onSubmit={onSubmit}>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nom du cours"
                value={courseForm.course_name}
                onChange={(e) => setCourseForm({...courseForm, course_name: e.target.value})}
                className="w-full px-5 py-3 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all outline-none font-medium"
                required
              />
              <input
                type="text"
                placeholder="Code du cours"
                value={courseForm.course_code}
                onChange={(e) => setCourseForm({...courseForm, course_code: e.target.value})}
                className="w-full px-5 py-3 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all outline-none font-medium"
              />
              <select
                value={courseForm.prof_id}
                onChange={(e) => setCourseForm({...courseForm, prof_id: e.target.value})}
                className="w-full px-5 py-3 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all outline-none font-medium"
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
                className="w-full px-5 py-3 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all outline-none font-medium"
                rows="3"
              />
              <input
                type="number"
                placeholder="Crédits"
                value={courseForm.credits}
                onChange={(e) => setCourseForm({...courseForm, credits: e.target.value})}
                className="w-full px-5 py-3 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all outline-none font-medium"
                min="1"
                max="10"
              />
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
                className="group relative px-6 py-3 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 text-white font-bold transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-105 overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <span className="relative">Créer</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CourseModal;
