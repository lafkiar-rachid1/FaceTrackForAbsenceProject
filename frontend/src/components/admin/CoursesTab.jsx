import React from 'react';

const CoursesTab = ({ courses, onAddCourse, onDeleteCourse }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Cours</h2>
        <button
          onClick={onAddCourse}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 font-medium transition-colors flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Créer un cours</span>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses && courses.map((course) => (
          <div key={course.course_id} className="border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all bg-gradient-to-br from-white to-gray-50">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{course.course_name}</h3>
                <p className="text-sm text-gray-500">Code: {course.course_code}</p>
                <p className="text-sm text-gray-600 mt-2">{course.description}</p>
                <p className="text-sm text-gray-500 mt-1">Crédits: {course.credits}</p>
              </div>
              <button
                onClick={() => onDeleteCourse(course.course_id)}
                className="text-red-600 hover:text-red-800"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
