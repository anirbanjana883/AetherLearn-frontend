import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import {Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts"

function Dashboard() {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {creatorCourseData} = useSelector((state) => state.course);

  const CourseProgressData =creatorCourseData?.map((course)=>({
    name : course?.title?.slice(0,10) + "...",
    lectures : course?.lectures?.length || 0
  })) || []

  const EnrollData =creatorCourseData?.map((course)=>({
    name : course?.title?.slice(0,10) + "...",
    enrolled : course?.enrolledStudent?.length || 0
  })) || []


  // payment calculation

  const totalEarning = creatorCourseData?.reduce((sum,course)=>{
    const sudentCount = course.enrolledStudent?.length || 0
    const courseRevenue = course.price ? course.price * sudentCount : 0

    return sum + courseRevenue
  }, 0) || 0

  return (
    <div className="flex min-h-screen bg-gray-100">
      <FaArrowLeftLong
        className="absolute top-[10%] left-[10%] w-[27px] h-[27px] cursor-pointer"
        onClick={() => navigate("/")}
      />

      <div className="w-full px-6 py-10 bg-gray-50 space-y-10">
        {/* main part */}
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row items-center gap-6">
          <img
            src={userData?.photoUrl || userData?.name.slice(0, 1).toUpperCase()}
            alt="Educator"
            className="w-28 h-28 rounded-full object-cover border-4 border-black shadow-md"
          />

          <div className="text-center md:text-left space-y-1">
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome , {userData?.name || "Educator"} 👋
            </h1>

            <h1 className="text-xl font-semibold text-gray-800">
              Total Earning : ₹ {totalEarning.toLocaleString()}
            </h1>

            <p className="text-gray-600 text-md">
              {userData?.description ||
                "Start creating courses for your students"}
            </p>

            <h1
              className="px-[10px] text-center py-[10px] border-2 bg-black border-black text-white
             rounded-[10px] font-light flex items-center justify-center cursor-pointer"
              onClick={() => navigate("/courses")}
            >
              Create Courses
            </h1>
          </div>
        </div>

        {/* analytics */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* course analytics */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4 px-27">
                  COURSE PROGRESS ( LECTURES )
                </h2>

                {/* garph */}

                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={CourseProgressData}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="name"/>
                    <YAxis />
                    <Tooltip/>
                    <Bar dataKey="lectures" fill="black" radius={[5,5,0,0]}/>
                  </BarChart>
                </ResponsiveContainer>
            </div>

            {/* enrollment analytics */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4 px-35">
                  STUDENT ENROLLMENT
                </h2>

                {/* garph */}

                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={EnrollData}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="name"/>
                    <YAxis />
                    <Tooltip/>
                    <Bar dataKey="enrolled" fill="black" radius={[5,5,0,0]}/>
                  </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
