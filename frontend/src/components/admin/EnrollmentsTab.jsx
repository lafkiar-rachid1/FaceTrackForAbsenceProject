import React from 'react';

const EnrollmentsTab = ({ onEnrollStudent }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Inscriptions</h2>
        <button
          onClick={onEnrollStudent}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 font-medium transition-colors flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          <span>Inscrire un étudiant</span>
        </button>
      </div>
      <div className="text-center py-12 text-gray-600 bg-gray-50 rounded-lg">
        <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
        <p className="text-lg font-medium">Gestion des inscriptions</p>
        <p className="mt-2">Cliquez sur "Inscrire un étudiant" pour ajouter des étudiants aux cours.</p>
      </div>
    </div>
  );
};

export default EnrollmentsTab;
