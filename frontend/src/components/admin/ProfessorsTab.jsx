import React from 'react';

const ProfessorsTab = ({ professors, onAddProfessor }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Professeurs</h2>
        <button
          onClick={onAddProfessor}
          className="group relative px-6 py-3 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white font-bold transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/50 hover:scale-105 overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          <div className="relative flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Ajouter un professeur</span>
          </div>
        </button>
      </div>
      <div className="overflow-hidden rounded-2xl border border-gray-200/50 shadow-xl">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">ID</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Nom complet</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Username</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Date création</th>
            </tr>
          </thead>
          <tbody className="bg-white/80 backdrop-blur-xl divide-y divide-gray-200">
            {professors && professors.map((prof, index) => (
              <tr key={prof.user_id} className="hover:bg-indigo-50/50 transition-colors duration-200">
                <td className="px-6 py-4 text-sm font-bold text-indigo-600">{prof.user_id}</td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">{prof.full_name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{prof.username}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(prof.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProfessorsTab;
