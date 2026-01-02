import React from 'react';

const HeaderAdmin = ({ user, sidebarOpen, setSidebarOpen, onLogout }) => {
  return (
    <header className="backdrop-blur-xl bg-white/80 border-b border-gray-200/50 sticky top-0 z-30 shadow-lg shadow-indigo-500/5">
      <div className="flex items-center justify-between px-8 py-5">
        <div className="flex items-center space-x-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="group p-3 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 transition-all duration-300 hover:scale-110 hover:shadow-lg"
          >
            <svg className="w-6 h-6 text-indigo-600 group-hover:text-indigo-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center space-x-3">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white p-3 rounded-2xl shadow-xl">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">FaceTrack</h1>
              <p className="text-xs text-gray-500 font-medium">Admin Portal</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-5">
          <div className="px-5 py-2.5 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200/50">
            <p className="text-sm font-bold text-gray-800">Administrateur Système</p>
            <p className="text-xs text-gray-500 font-medium">{user?.full_name || 'Administrateur'}</p>
          </div>
          <button
            onClick={onLogout}
            className="group relative px-6 py-3 rounded-2xl bg-gradient-to-br from-red-500 to-pink-600 text-white font-bold transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/50 hover:scale-105 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <div className="relative flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Déconnexion</span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default HeaderAdmin;
