import React from 'react';
import MarkAttendance from '../MarkAttendance';

const StatsCardsStudent = ({ stats, user, showMarkAttendance, setShowMarkAttendance, onAttendanceMarked }) => {
  if (!stats) return null;

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Bonjour, {user?.full_name} 👋</h2>
          <p className="text-gray-600 mt-1">Bienvenue sur votre tableau de bord</p>
        </div>
        <button
          onClick={() => setShowMarkAttendance(!showMarkAttendance)}
          className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all shadow-lg hover:shadow-xl"
        >
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>{showMarkAttendance ? 'Masquer' : 'Marquer ma Présence'}</span>
          </div>
        </button>
      </div>

      {showMarkAttendance && (
        <div className="mb-8">
          <MarkAttendance onSuccess={onAttendanceMarked} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-600 rounded-xl p-4 shadow-md">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="ml-6">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Total Sessions</p>
              <p className="text-4xl font-bold text-gray-900 my-2">{stats.total_sessions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-600 rounded-xl p-4 shadow-md">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-6">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Présent</p>
              <p className="text-4xl font-bold text-gray-900 my-2">{stats.present_count}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-red-600 rounded-xl p-4 shadow-md">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-6">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Absent</p>
              <p className="text-4xl font-bold text-gray-900 my-2">{stats.absent_count}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-purple-600 rounded-xl p-4 shadow-md">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-6">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Taux de présence</p>
              <p className="text-4xl font-bold text-gray-900 my-2">{stats.attendance_percentage}%</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StatsCardsStudent;
