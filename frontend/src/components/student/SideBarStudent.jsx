import React from 'react';

const SideBarStudent = ({ activeTab, setActiveTab, sidebarOpen }) => {
  const menuItems = [
    { 
      id: 'overview', 
      label: "Vue d'ensemble", 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    { 
      id: 'attendance', 
      label: 'Mes Présences', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      )
    },
    { 
      id: 'profile', 
      label: 'Mon Profil', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    }
  ];

  return (
    <aside
      className={`fixed left-0 top-[89px] h-[calc(100vh-89px)] bg-white border-r border-gray-200 transition-all duration-500 ease-in-out z-20 ${
        sidebarOpen ? 'w-72 shadow-lg' : 'w-0'
      } overflow-hidden`}
    >
      <div className="p-6 h-full flex flex-col">
        <div className="mb-8">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Menu</h2>
          <div className="h-1 w-12 bg-blue-600 rounded-full"></div>
        </div>
        
        <nav className="space-y-3 flex-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-4 px-5 py-4 rounded-xl transition-all ${
                activeTab === item.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'hover:bg-gray-100'
              }`}
            >
              <div className={`p-2.5 rounded-lg ${
                activeTab === item.id 
                  ? 'bg-white/20 text-white' 
                  : 'bg-blue-100 text-blue-600'
              }`}>
                {item.icon}
              </div>
              <span className={`font-semibold text-base ${
                activeTab === item.id 
                  ? 'text-white' 
                  : 'text-gray-700'
              }`}>
                {item.label}
              </span>
            </button>
          ))}
        </nav>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-2 text-gray-400">
            <div className="w-2 h-2 rounded-full bg-blue-600"></div>
            <span className="text-xs font-medium">Student Panel</span>
            <div className="w-2 h-2 rounded-full bg-blue-600"></div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SideBarStudent;
