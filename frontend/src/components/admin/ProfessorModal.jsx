import React from 'react';

const ProfessorModal = ({ show, onClose, profForm, setProfForm, onSubmit }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Créer un professeur</h2>
        <form onSubmit={onSubmit}>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Nom complet"
              value={profForm.full_name}
              onChange={(e) => setProfForm({...profForm, full_name: e.target.value})}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
            <input
              type="text"
              placeholder="Username"
              value={profForm.username}
              onChange={(e) => setProfForm({...profForm, username: e.target.value})}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
            <input
              type="password"
              placeholder="Mot de passe"
              value={profForm.password}
              onChange={(e) => setProfForm({...profForm, password: e.target.value})}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Créer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfessorModal;
