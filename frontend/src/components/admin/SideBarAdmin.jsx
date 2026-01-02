import React from 'react';

const SideBarAdmin = ({ activeTab, setActiveTab, sidebarOpen }) => {
  const menuItems = [
    { id: 'overview', label: "Vue d'ensemble", icon: '📊' },
    { id: 'professors', label: 'Professeurs', icon: '👨‍🏫' },
    { id: 'courses', label: 'Cours', icon: '📚' },
    { id: 'enrollments', label: 'Inscriptions', icon: '✍️' }
  ];

  return (
    <aside
      className={`fixed left-0 top-[73px] h-[calc(100vh-73px)] bg-white shadow-xl transition-all duration-300 z-20 ${
        sidebarOpen ? 'w-64' : 'w-0'
      } overflow-hidden`}
    >
      <div className="p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-6">Navigation</h2>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === item.id
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default SideBarAdmin;
