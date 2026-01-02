import React from 'react';

const StatsCards = ({ stats }) => {
  if (!stats) return null;

  return (
    <>
      <h2 className="text-3xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-8">Vue d'ensemble</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="group relative overflow-hidden backdrop-blur-xl bg-white/80 rounded-3xl shadow-xl shadow-indigo-500/20 p-8 border border-gray-200/50 hover:shadow-2xl hover:shadow-indigo-500/30 transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative flex items-center">
            <div className="flex-shrink-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-4 shadow-lg shadow-indigo-500/50 group-hover:scale-110 transition-transform duration-300">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div className="ml-6">
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Étudiants</p>
              <p className="text-4xl font-black text-gray-900 my-2">{stats.total_students}</p>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <p className="text-sm font-semibold text-green-600">{stats.active_students} actifs</p>
              </div>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden backdrop-blur-xl bg-white/80 rounded-3xl shadow-xl shadow-green-500/20 p-8 border border-gray-200/50 hover:shadow-2xl hover:shadow-green-500/30 transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative flex items-center">
            <div className="flex-shrink-0 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-4 shadow-lg shadow-green-500/50 group-hover:scale-110 transition-transform duration-300">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-6">
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Professeurs</p>
              <p className="text-4xl font-black text-gray-900 my-2">{stats.total_professors}</p>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden backdrop-blur-xl bg-white/80 rounded-3xl shadow-xl shadow-blue-500/20 p-8 border border-gray-200/50 hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative flex items-center">
            <div className="flex-shrink-0 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-4 shadow-lg shadow-blue-500/50 group-hover:scale-110 transition-transform duration-300">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="ml-6">
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Cours</p>
              <p className="text-4xl font-black text-gray-900 my-2">{stats.total_courses}</p>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <p className="text-sm font-semibold text-green-600">{stats.active_courses} actifs</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StatsCards;
