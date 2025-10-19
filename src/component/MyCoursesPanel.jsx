import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function MyCoursesPanel() {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const displayedCourses = userData?.enrolledCourses?.slice(0, 4) || [];

  return (
    <div className="bg-slate-900/40 backdrop-blur-md border  rounded-2xl p-6 h-full flex flex-col  border-blue-500/40 shadow-[0_0_30px_rgba(37,99,235,0.3)]  transition-all duration-500 hover:shadow-[0_0_45px_rgba(37,99,235,0.6)]">
      <h3 className="text-xl font-bold text-blue-300 mb-4">My Courses</h3>
      <div className="flex flex-col gap-4 flex-grow">
        {displayedCourses.length > 0 ? (
          displayedCourses.map(course => (
            <div
              key={course._id}
              onClick={() => navigate(`/viewlecture/${course._id}`)}
              className="flex items-center gap-4 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-700/70 transition-colors cursor-pointer"
            >
              <img src={course.thumbnail} alt={course.title} className="w-16 h-10 object-cover rounded-md" />
              <div className="flex-grow overflow-hidden">
                <p className="font-semibold text-white truncate">{course.title}</p>
                <p className="text-xs text-slate-400">{course.category}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-slate-400 text-sm">You haven't enrolled in any courses yet.</p>
        )}
      </div>
      <button
        onClick={() => navigate('/mycourses')}
        className="w-full mt-4 text-center text-cyan-400 font-semibold text-sm hover:underline"
      >
        View All Enrolled Courses
      </button>
    </div>
  );
}

export default MyCoursesPanel;