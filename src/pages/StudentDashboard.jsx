import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeftLong } from "react-icons/fa6";
import StudentHeatmap from '../component/StudentHeatmap';
import StatsBar from '../component/StatsBar';
import MyCoursesPanel from '../component/MyCoursesPanel';
import CourseProgressChart from '../component/CourseProgressChart';
import AchievementsPanel from '../component/AchievementsPanel';


function StudentDashboard() {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen relative bg-[#030712] text-white p-6 md:p-8">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_farthest-corner,rgba(37,99,235,0.1)_0%,rgba(3,7,18,0)_60%)]"></div>
      
      <div className="relative z-10 w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-6 mb-8">
            <button
                onClick={() => navigate("/")}
                className="p-3 rounded-full bg-black/30 border border-blue-500/40 
                           transition-all duration-300 hover:shadow-[0_0_15px_rgba(37,99,235,0.8)] hover:scale-105"
            >
                <FaArrowLeftLong className="text-lg text-blue-400" />
            </button>
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-300">
              Welcome, {userData?.name || "Student"}
            </h1>
        </div>

        {/* --- Main Dashboard Layout --- */}
        <div className="flex flex-col gap-8">
          {/* Top Stats Bar */}
          <StatsBar />

          {/* Main Content: Heatmap and Courses Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <StudentHeatmap />
            </div>
            <div className="lg:col-span-1">
              <MyCoursesPanel />
            </div>
          </div>
          
          {/* Course Progress Graph */}
          <div>
            <CourseProgressChart />
            <AchievementsPanel />
          </div>

        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;