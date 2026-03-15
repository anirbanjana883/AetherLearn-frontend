import React, { useEffect } from "react"; 
import { useSelector, useDispatch } from "react-redux"; 
import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong, FaChartLine } from "react-icons/fa6";
import { IoPersonCircleSharp } from "react-icons/io5";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import img from "../../assets/empty.jpg";
import API from "../../api/axios.js"; 
import { setCreatorCourseData } from "../../redux/courseSlice"; 

function EducatorDashboard() {
  const { userData } = useSelector((state) => state.user);
  const { creatorCourseData } = useSelector((state) => state.course);
  const navigate = useNavigate();
  const dispatch = useDispatch(); 

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await API.get("/course/creator");
        dispatch(setCreatorCourseData(res.data.data));
      } catch (error) {
        console.error("Failed to fetch courses on dashboard load", error);
      }
    };
    
    fetchCourses();
  }, [dispatch]); 

  const safeCourseData = Array.isArray(creatorCourseData) ? creatorCourseData : [];

  const CourseProgressData = safeCourseData.map((course) => {
      const lectureCount = course.sections?.reduce((acc, section) => acc + (section?.lectures?.length || 0), 0) || 0;
      return {
          name: course?.title?.slice(0, 15) + "...",
          lectures: lectureCount,
      };
  });

  const EnrollData = safeCourseData.map((course) => {
      // Safely grab the enrolledCount directly as a Number
      const studentCount = Number(course?.enrolledCount) || 0;
      
      return {
          name: course?.title?.slice(0, 15) + "...",
          enrolled: studentCount,
      };
  });

  // 💰 REVENUE CALCULATION
  const totalEarning = safeCourseData.reduce((sum, course) => {
      const studentCount = Number(course?.enrolledCount) || 0;
      const coursePrice = Number(course?.price) || 0;
      
      return sum + (coursePrice * studentCount);
  }, 0);
  
  return (
    <div className="flex flex-col min-h-screen bg-[#030712] text-white font-inter p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-10 w-full">
        
        {/* Navigation & Header */}
        <div className="flex items-center gap-4">
          <FaArrowLeftLong
            className="w-6 h-6 cursor-pointer text-blue-400 hover:text-blue-300 transition-all"
            onClick={() => navigate("/")}
          />
          <h1 className="text-2xl md:text-3xl font-black text-white">Global Workspace</h1>
        </div>

        {/* --- Hero Profile & Earnings --- */}
        <div className="bg-[#0A0F1C] rounded-3xl shadow-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 border border-blue-500/30 hover:border-blue-500/50 transition-all">
          {userData?.photoUrl ? (
              <img src={userData.photoUrl} alt="profile" className="w-28 h-28 rounded-full object-cover border-4 border-blue-500/50" />
            ) : userData ? (
              <div className="w-28 h-28 rounded-full text-white flex items-center justify-center text-4xl font-bold border-4 border-blue-500/50 bg-gray-900">
                {userData.name?.slice(0, 1).toUpperCase()}
              </div>
            ) : (
              <IoPersonCircleSharp className="w-28 h-28 text-slate-400" />
          )}

          <div className="text-center md:text-left space-y-2 flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-white">Welcome, {userData?.name || "Educator"} 👋</h1>
            <h2 className="text-xl font-bold text-emerald-400 bg-emerald-500/10 w-fit mx-auto md:mx-0 px-4 py-1 rounded-full border border-emerald-500/20">
              Total Earnings: ₹{totalEarning.toLocaleString()}
            </h2>
            <p className="text-gray-400 text-sm">{userData?.description || "Manage your curriculum and insights."}</p>
          </div>

          <button
            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)]"
            onClick={() => navigate("/courses")}
          >
            Create / Edit Courses
          </button>
        </div>

        {/* --- Charts --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#0A0F1C] rounded-2xl p-6 border border-blue-500/20 shadow-lg">
            <h2 className="text-sm font-bold mb-4 text-slate-400 uppercase tracking-widest">Lectures per Course</h2>
            {CourseProgressData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={CourseProgressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                  <XAxis dataKey="name" stroke="#60a5fa" fontSize={11} />
                  <YAxis stroke="#60a5fa" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: "#111827", borderRadius: "8px", border: "1px solid #2563eb" }} />
                  <Bar dataKey="lectures" fill="#2563eb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <p className="text-center text-gray-500 py-10">No courses yet.</p>}
          </div>

          <div className="bg-[#0A0F1C] rounded-2xl p-6 border border-emerald-500/20 shadow-lg">
            <h2 className="text-sm font-bold mb-4 text-slate-400 uppercase tracking-widest">Student Enrollment</h2>
            {EnrollData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={EnrollData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                  <XAxis dataKey="name" stroke="#10B981" fontSize={11} />
                  <YAxis stroke="#10B981" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: "#111827", borderRadius: "8px", border: "1px solid #10B981" }} />
                  <Bar dataKey="enrolled" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <p className="text-center text-gray-500 py-10">No enrollments yet.</p>}
          </div>
        </div>

        {/* --- Course List with Deep Dive Links --- */}
        <div className="bg-[#0A0F1C] rounded-3xl border border-blue-500/20 p-6">
          <h2 className="text-xl font-bold mb-6 text-white">Select Course for Deep Analytics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {safeCourseData.map((course) => (
              <div key={course._id} className="bg-[#030712] p-4 rounded-xl border border-white/5 flex flex-col gap-4">
                <div className="flex gap-4 items-center">
                  <img src={course?.thumbnail || img} alt="thumb" className="w-16 h-12 object-cover rounded-md" />
                  <div>
                    <h3 className="text-sm font-bold text-white truncate">{course.title}</h3>
                    <p className="text-xs text-emerald-400 font-mono">₹{course.price || "Free"}</p>
                  </div>
                </div>
                <button 
                  onClick={() => navigate(`/analytics/${course._id}`)}
                  className="w-full flex items-center justify-center gap-2 py-2 bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white border border-blue-600/30 rounded-lg text-xs font-bold transition-all"
                >
                  <FaChartLine /> View Telemetry & Funnel
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default EducatorDashboard;