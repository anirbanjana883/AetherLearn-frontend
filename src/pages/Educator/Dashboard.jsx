import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

function Dashboard() {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { creatorCourseData } = useSelector((state) => state.course);

  const CourseProgressData =
    creatorCourseData?.map((course) => ({
      name: course?.title?.slice(0, 10) + "...",
      lectures: course?.lectures?.length || 0,
    })) || [];

  const EnrollData =
    creatorCourseData?.map((course) => ({
      name: course?.title?.slice(0, 10) + "...",
      enrolled: course?.enrolledStudent?.length || 0,
    })) || [];

  const totalEarning =
    creatorCourseData?.reduce((sum, course) => {
      const studentCount = course.enrolledStudent?.length || 0;
      const courseRevenue = course.price ? course.price * studentCount : 0;
      return sum + courseRevenue;
    }, 0) || 0;

  return (
    <div className="flex min-h-screen bg-[#030712] text-white">
      <FaArrowLeftLong
        className="absolute top-[10%] left-[10%] w-[27px] h-[27px] cursor-pointer text-blue-400 hover:text-blue-300 transition-all duration-300"
        onClick={() => navigate("/")}
      />

      <div className="w-full px-6 py-10 space-y-10">
        {/* main part */}
        <div className="max-w-5xl mx-auto bg-[#0A0F1C] rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.4)] p-6 flex flex-col md:flex-row items-center gap-6 border border-blue-500/40 hover:shadow-[0_0_40px_rgba(37,99,235,0.7)] transition-all duration-500">
          {userData?.photoUrl ? (
              <img src={userData.photoUrl} alt="profile" className="w-30 h-30 rounded-full object-cover border-2 border-blue-500/50 transition-all duration-300 hover:border-cyan-400"/>
            ) : userData ? (
              <div className="w-30 h-30 rounded-full text-white flex items-center justify-center text-5xl font-bold border-2 border-blue-500/50 bg-gray-900 transition-all duration-300 hover:border-cyan-400">
                {userData.name.slice(0, 1).toUpperCase()}
              </div>
            ) : (
              <IoPersonCircleSharp className="w-14 h-14 text-slate-400 transition-colors duration-300 hover:text-cyan-400"/>
            )}

          <div className="text-center md:text-left space-y-2">
            <h1 className="text-2xl font-bold text-blue-400 drop-shadow-[0_0_10px_rgba(37,99,235,0.8)]">
              Welcome , {userData?.name || "Educator"} 👋
            </h1>

            <h1 className="text-xl font-semibold text-white drop-shadow-[0_0_5px_rgba(37,99,235,0.9)]">
              Total Earning : ₹ {totalEarning.toLocaleString()}
            </h1>

            <p className="text-gray-400 text-md">
              {userData?.description || "Start creating courses for your students"}
            </p>

            <h1
              className="px-[10px] py-[10px] border-2 bg-black border-blue-400 text-white rounded-[10px] font-light flex items-center justify-center cursor-pointer hover:shadow-[0_0_20px_rgba(37,99,235,0.7)] transition-all duration-300"
              onClick={() => navigate("/courses")}
            >
              Create Courses
            </h1>
          </div>
        </div>

        {/* analytics */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* course analytics */}
          <div className="bg-[#0A0F1C] rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.4)] p-6 border border-blue-500/30 hover:shadow-[0_0_40px_rgba(37,99,235,0.7)] transition-all duration-500">
            <h2 className="text-lg font-semibold mb-4 text-blue-400 drop-shadow-[0_0_5px_rgba(37,99,235,0.9)]">
              COURSE PROGRESS (LECTURES)
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={CourseProgressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="name" stroke="#60a5fa" />
                <YAxis stroke="#60a5fa" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#111827", borderRadius: "8px", border: "1px solid #2563eb" }}
                  itemStyle={{ color: "#fff" }}
                />
                <Bar dataKey="lectures" fill="#2563eb" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* enrollment analytics */}
          <div className="bg-[#0A0F1C] rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.4)] p-6 border border-blue-500/30 hover:shadow-[0_0_40px_rgba(37,99,235,0.7)] transition-all duration-500">
            <h2 className="text-lg font-semibold mb-4 text-blue-400 drop-shadow-[0_0_5px_rgba(37,99,235,0.9)]">
              STUDENT ENROLLMENT
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={EnrollData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="name" stroke="#60a5fa" />
                <YAxis stroke="#60a5fa" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#111827", borderRadius: "8px", border: "1px solid #2563eb" }}
                  itemStyle={{ color: "#fff" }}
                />
                <Bar dataKey="enrolled" fill="#2563eb" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
