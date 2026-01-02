import React from 'react';

const CoursesTab = ({ courses, onAddCourse, onEditCourse, onDeleteCourse }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Cours</h2>
        <button
          onClick={onAddCourse}
          className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all shadow-lg hover:shadow-xl"
        >
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Créer un cours</span>
          </div>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses && courses.map((course) => (
          <div key={course.course_id} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-bold text-xl text-gray-900 mb-2">{course.course_name}</h3>
                <div className="inline-block px-3 py-1 rounded-lg bg-indigo-100 mb-3">
                  <p className="text-sm font-semibold text-indigo-700">Code: {course.course_code}</p>
                </div>
                <p className="text-sm text-gray-600 mb-3">{course.description}</p>
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  <p className="text-sm font-semibold text-indigo-600">{course.credits} crédits</p>
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => onEditCourse(course)}
                  className="p-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-all"
                  title="Modifier"
                >
                  <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => onDeleteCourse(course.course_id)}
                  className="p-2 rounded-lg bg-red-50 hover:bg-red-100 transition-all"
                  title="Supprimer"
                >
                  <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursesTab;
