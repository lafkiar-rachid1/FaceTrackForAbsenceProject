import React from 'react';

const StatsCardsProfessor = ({ stats }) => {
  if (!stats) return null;

  return (
    <>
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Vue d'ensemble</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-indigo-600 rounded-xl p-4 shadow-md">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="ml-6">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Mes Cours</p>
              <p className="text-4xl font-bold text-gray-900 my-2">{stats.total_courses}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-600 rounded-xl p-4 shadow-md">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-6">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Sessions Totales</p>
              <p className="text-4xl font-bold text-gray-900 my-2">{stats.total_sessions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-600 rounded-xl p-4 shadow-md">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-6">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">À Venir</p>
              <p className="text-4xl font-bold text-gray-900 my-2">{stats.upcoming_sessions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-purple-600 rounded-xl p-4 shadow-md">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div className="ml-6">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Étudiants</p>
              <p className="text-4xl font-bold text-gray-900 my-2">{stats.students_enrolled}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StatsCardsProfessor;
