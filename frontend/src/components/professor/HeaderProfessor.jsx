import React from 'react';

const HeaderProfessor = ({ user, onLogout }) => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-30">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo et Titre */}
        <div className="flex items-center space-x-4">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-2 rounded-lg">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">FaceTrack</h1>
            <p className="text-xs text-gray-500">Espace Professeur</p>
          </div>
        </div>

        {/* User Info et Déconnexion */}
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-800">{user?.full_name}</p>
            <p className="text-xs text-gray-500">Professeur</p>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Déconnexion</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default HeaderProfessor;
