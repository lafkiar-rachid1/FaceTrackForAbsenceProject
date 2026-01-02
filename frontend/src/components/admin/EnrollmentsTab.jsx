import React from 'react';

const EnrollmentsTab = ({ onEnrollStudent }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">Inscriptions</h2>
        <button
          onClick={onEnrollStudent}
          className="group relative px-6 py-3 rounded-2xl bg-gradient-to-br from-pink-600 to-rose-600 text-white font-bold transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/50 hover:scale-105 overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          <div className="relative flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            <span>Inscrire un étudiant</span>
          </div>
        </button>
      </div>
      <div className="relative overflow-hidden backdrop-blur-xl bg-gradient-to-br from-pink-50 to-rose-50 rounded-3xl p-12 text-center border border-pink-200/50">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-pink-400/20 to-rose-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-rose-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
        <div className="relative">
          <div className="inline-block p-6 rounded-3xl bg-gradient-to-br from-pink-500 to-rose-600 shadow-2xl shadow-pink-500/50 mb-6">
            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h3 className="text-2xl font-black text-gray-900 mb-3">Gestion des inscriptions</h3>
          <p className="text-gray-600 font-medium">Cliquez sur "Inscrire un étudiant" pour ajouter des étudiants aux cours.</p>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentsTab;
