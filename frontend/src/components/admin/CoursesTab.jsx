import React from 'react';

const CoursesTab = ({ courses, onAddCourse, onDeleteCourse }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Cours</h2>
        <button
          onClick={onAddCourse}
          className="group relative px-6 py-3 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 text-white font-bold transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-105 overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          <div className="relative flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Créer un cours</span>
          </div>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses && courses.map((course) => (
          <div key={course.course_id} className="group relative overflow-hidden backdrop-blur-xl bg-white/80 border border-gray-200/50 rounded-3xl p-6 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse"></div>
                  <h3 className="font-black text-xl text-gray-900">{course.course_name}</h3>
                </div>
                <div className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 mb-3">
                  <p className="text-sm font-bold text-purple-700">Code: {course.course_code}</p>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">{course.description}</p>
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  <p className="text-sm font-semibold text-purple-600">{course.credits} crédits</p>
                </div>
              </div>
              <button
                onClick={() => onDeleteCourse(course.course_id)}
                className="group/btn p-2.5 rounded-xl bg-red-50 hover:bg-red-100 transition-all duration-300 hover:scale-110"
              >
                <svg className="h-5 w-5 text-red-600 group-hover/btn:text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursesTab;
