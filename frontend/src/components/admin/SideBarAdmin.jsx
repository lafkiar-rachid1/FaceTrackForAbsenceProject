import React from 'react';

const SideBarAdmin = ({ activeTab, setActiveTab, sidebarOpen }) => {
  const menuItems = [
    { 
      id: 'overview', 
      label: "Vue d'ensemble", 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      gradient: 'from-blue-500 to-cyan-500'
    },
    { 
      id: 'professors', 
      label: 'Professeurs', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      gradient: 'from-indigo-500 to-purple-500'
    },
    { 
      id: 'courses', 
      label: 'Cours', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      gradient: 'from-purple-500 to-pink-500'
    },
    { 
      id: 'enrollments', 
      label: 'Inscriptions', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      gradient: 'from-pink-500 to-rose-500'
    }
  ];

  return (
    <aside
      className={`fixed left-0 top-[89px] h-[calc(100vh-89px)] backdrop-blur-2xl bg-white/90 border-r border-gray-200/50 transition-all duration-500 ease-in-out z-20 ${
        sidebarOpen ? 'w-72 shadow-2xl shadow-indigo-500/10' : 'w-0'
      } overflow-hidden`}
    >
      <div className="p-6 h-full flex flex-col">
        <div className="mb-8">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Menu</h2>
          <div className="h-1 w-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
        </div>
        
        <nav className="space-y-3 flex-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`group relative w-full flex items-center space-x-4 px-5 py-4 rounded-2xl transition-all duration-300 overflow-hidden ${
                activeTab === item.id
                  ? 'shadow-xl shadow-indigo-500/30'
                  : 'hover:bg-gray-50/80 hover:shadow-lg'
              }`}
            >
              {/* Background gradient pour l'élément actif */}
              {activeTab === item.id && (
                <>
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-100`}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                </>
              )}
              
              {/* Effet hover pour les éléments inactifs */}
              {activeTab !== item.id && (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              )}
              
              {/* Icône */}
              <div className={`relative z-10 p-2.5 rounded-xl transition-all duration-300 ${
                activeTab === item.id 
                  ? 'bg-white/20 text-white shadow-lg' 
                  : `bg-gradient-to-br ${item.gradient} text-white group-hover:scale-110 group-hover:shadow-lg`
              }`}>
                {item.icon}
              </div>
              
              {/* Label */}
              <span className={`relative z-10 font-bold text-base transition-colors ${
                activeTab === item.id 
                  ? 'text-white' 
                  : 'text-gray-700 group-hover:text-gray-900'
              }`}>
                {item.label}
              </span>
              
              {/* Indicateur actif */}
              {activeTab === item.id && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-lg animate-pulse"></div>
              )}
            </button>
          ))}
        </nav>
        
        {/* Footer décoratif */}
        <div className="mt-6 pt-6 border-t border-gray-200/50">
          <div className="flex items-center justify-center space-x-2 text-gray-400">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 animate-pulse"></div>
            <span className="text-xs font-medium">Admin Panel</span>
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse"></div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SideBarAdmin;
