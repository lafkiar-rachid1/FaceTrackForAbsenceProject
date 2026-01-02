import React from 'react';

const ProfessorModal = ({ show, onClose, profForm, setProfForm, onSubmit }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="relative backdrop-blur-2xl bg-white/95 rounded-3xl p-8 w-full max-w-md shadow-2xl shadow-indigo-500/30 border border-gray-200/50 animate-slideUp">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="relative">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Créer un professeur</h2>
          </div>
          <form onSubmit={onSubmit}>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nom complet"
                value={profForm.full_name}
                onChange={(e) => setProfForm({...profForm, full_name: e.target.value})}
                className="w-full px-5 py-3 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all outline-none font-medium"
                required
              />
              <input
                type="text"
                placeholder="Username"
                value={profForm.username}
                onChange={(e) => setProfForm({...profForm, username: e.target.value})}
                className="w-full px-5 py-3 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all outline-none font-medium"
                required
              />
              <input
                type="password"
                placeholder="Mot de passe"
                value={profForm.password}
                onChange={(e) => setProfForm({...profForm, password: e.target.value})}
                className="w-full px-5 py-3 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all outline-none font-medium"
                required
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
                className="group relative px-6 py-3 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white font-bold transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/50 hover:scale-105 overflow-hidden"
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

export default ProfessorModal;
