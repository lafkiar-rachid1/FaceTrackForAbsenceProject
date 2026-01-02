import React from 'react';

const ProfessorsTab = ({ professors, onAddProfessor }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Professeurs</h2>
        <button
          onClick={onAddProfessor}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 font-medium transition-colors flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Ajouter un professeur</span>
        </button>
      </div>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom complet</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date création</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {professors && professors.map((prof) => (
              <tr key={prof.user_id}>
                <td className="px-6 py-4 text-sm text-gray-900">{prof.user_id}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{prof.full_name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{prof.username}</td>
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
