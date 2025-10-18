import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaGhost } from "react-icons/fa"; // New icon for empty state

function MyEnrolledCourse() {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  return (
    <div className="w-full min-h-screen relative bg-[#030712] text-white flex flex-col items-center py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      {/* Background Gradient */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_farthest-corner,rgba(37,99,235,0.1)_0%,rgba(3,7,18,0)_60%)]"></div>

      {/* Back Button */}
      <button
        onClick={() => navigate(`/`)}
        className="absolute top-6 left-6 z-20 p-3 rounded-full bg-black/30 border border-blue-500/40 
                   transition-all duration-300 hover:shadow-[0_0_15px_rgba(37,99,235,0.8)] hover:scale-105"
      >
        <FaArrowLeftLong className="text-lg text-blue-400" />
      </button>

      {/* Header Section */}
      <div className="relative z-10 flex flex-col items-center text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-300 drop-shadow-[0_0_15px_rgba(37,99,235,0.5)]">
          My Enrolled Courses
        </h1>
      </div>

      {/* Courses Grid */}
      <div className="relative z-10 w-full max-w-7xl">
        {userData?.enrolledCourses?.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16">
            <FaGhost className="text-cyan-500/30 text-8xl mb-6" />
            <h2 className="text-slate-300 font-semibold text-2xl">
              It's quiet in here...
            </h2>
            <p className="text-slate-400 text-base mt-2 max-w-sm">
              You haven't enrolled in any courses yet. Explore our catalog to start learning!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {userData?.enrolledCourses?.map((course, index) => (
              <div
                key={index}
                className="group relative bg-[#0A0F1C] rounded-2xl overflow-hidden shadow-[0_0_15px_rgba(37,99,235,0.3)] 
                           hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] transition-all duration-300 border border-blue-500/40 
                           hover:-translate-y-2 cursor-pointer flex flex-col"
              >
                <img src={course?.thumbnail} alt={course?.title} className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="p-5 flex flex-col flex-grow">
                  <span className="inline-block px-3 py-1 mb-3 bg-[#111827] text-blue-300 rounded-full text-xs font-medium border border-blue-500/50 w-fit">
                    {course?.category}
                  </span>
                  <h2 className="text-lg font-semibold text-blue-400 leading-tight line-clamp-2 h-14" title={course?.title}>
                    {course?.title}
                  </h2>
                  <p className="text-sm text-slate-400 mb-4">{course?.level}</p>
                  
                  {/* Explore Course Button */}
                  <button
                    className="w-full mt-auto px-4 py-3 bg-blue-600 border border-blue-600 text-white rounded-lg text-base font-semibold 
                               transition-all duration-300 hover:bg-blue-700 hover:shadow-[0_0_15px_rgba(59,130,246,0.8)] cursor-pointer"
                    onClick={() => navigate(`/viewlecture/${course._id}`)}
                  >
                    Explore Course
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyEnrolledCourse;