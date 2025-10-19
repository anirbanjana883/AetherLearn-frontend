import React from 'react';
import { useSelector } from 'react-redux';
import StudentHeatmap from '../component/StudentHeatmap'; // We will create this component next
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';

function StudentDashboard() {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate()

  return (
    <div className="w-full min-h-screen relative bg-[#030712] text-white p-6 md:p-8">
      {/* Background Gradient */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_farthest-corner,rgba(37,99,235,0.1)_0%,rgba(3,7,18,0)_60%)]"></div>

      
      
      <div className="relative z-10 w-full max-w-7xl mx-auto">
        <FaArrowLeftLong className="text-xl text-blue-400 w-10 h-10 cursor-pointer" 
      onClick={() => navigate("/")}/>
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-300 mb-12">
          Welcome, {userData?.name || "Student"}
        </h1>
        
        <div className="flex flex-col gap-8">
          {/* The heatmap component will go here */}
          <StudentHeatmap />
          
          {/* You can add more student-specific components here in the future, like "My Certificates" or "Course Progress" */}
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;