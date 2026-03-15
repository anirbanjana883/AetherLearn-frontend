import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong, FaFire } from "react-icons/fa6";
import API from "../api/axios.js";
import ClipLoader from "react-spinners/ClipLoader";

// Import Components
import StudentHeatmap from "../component/StudentHeatmap";
import StatsBar from "../component/StatsBar";
import MyCoursesPanel from "../component/MyCoursesPanel";
import CourseProgressChart from "../component/CourseProgressChart";
import AchievementsPanel from "../component/AchievementsPanel";

function StudentDashboard() {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();

  // Dashboard States
  const [heatmapData, setHeatmapData] = useState([]);
  const [studentStats, setStudentStats] = useState({
    currentStreak: 0,
    enrolledCount: 0,
    lecturesCompleted: 0,
  });
  const [loading, setLoading] = useState(true);
  const [courseProgress, setCourseProgress] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [heatmapRes, statsRes, progressRes] = await Promise.all([
          API.get("/progress/heatmap/data"),
          API.get("/stats/student"),
          API.get("/stats/course-progress"), 
        ]);

        setHeatmapData(heatmapRes.data.data);
        setStudentStats(statsRes.data.data);
        setCourseProgress(progressRes.data.data); 
      } catch (error) {
        console.error("Dashboard Sync Failed", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030712]">
        <ClipLoader color="#3B82F6" size={50} />
      </div>
    );

  return (
    <div className="w-full min-h-screen relative bg-[#030712] text-white p-4 md:p-8 overflow-x-hidden font-inter">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.15),transparent_50%)]"></div>

      <div className="relative z-10 w-full max-w-7xl mx-auto">
        {/* --- Header Section --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate("/")}
              className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/50 transition-all hover:bg-blue-500/10 group"
            >
              <FaArrowLeftLong className="text-lg text-blue-400 group-hover:-translate-x-1 transition-transform" />
            </button>
            <div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-white via-blue-100 to-blue-400 bg-clip-text text-transparent">
                Welcome back, {userData?.name?.split(" ")[0] || "Scholar"}
              </h1>
              <p className="text-slate-400 mt-1 font-medium">
                Keep up the momentum. You're doing great!
              </p>
            </div>
          </div>

          {/* Streak Badge (Uses live backend data) */}
          <div className="flex items-center gap-4 bg-orange-500/10 border border-orange-500/30 px-6 py-3 rounded-2xl shadow-[0_0_20px_rgba(249,115,22,0.1)]">
            <FaFire className="text-orange-500 text-2xl animate-pulse" />
            <div>
              <p className="text-xs font-bold text-orange-500 uppercase tracking-widest">
                Current Streak
              </p>
              <p className="text-xl font-black">
                {studentStats.currentStreak} Days
              </p>
            </div>
          </div>
        </div>

        {/* --- Dashboard Grid --- */}
        <div className="space-y-8">
          {/* 1. Global Stats Row */}
          <StatsBar stats={studentStats} />

          {/* 2. Activity & Enrolled Courses Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 bg-slate-900/40 backdrop-blur-md border border-blue-500/40 shadow-[0_0_30px_rgba(37,99,235,0.3)] transition-all duration-500 hover:shadow-[0_0_45px_rgba(37,99,235,0.6)] rounded-3xl p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-blue-300">
                <span className="w-2 h-6 bg-cyan-400 rounded-full"></span>{" "}
                Learning Activity
              </h2>
              <StudentHeatmap data={heatmapData} />
            </div>

            <div className="lg:col-span-4 h-full">
              {/* Using your exact provided component */}
              <MyCoursesPanel />
            </div>
          </div>

          {/* 3. Deep Analytics Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Using your exact provided component */}
            <CourseProgressChart data={courseProgress} />

            <div className="bg-slate-900/40 backdrop-blur-md border border-blue-500/40 shadow-[0_0_30px_rgba(37,99,235,0.3)] transition-all duration-500 hover:shadow-[0_0_45px_rgba(37,99,235,0.6)] rounded-3xl p-6">
              <AchievementsPanel />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
