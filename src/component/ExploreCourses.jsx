import React from "react";
import { SiViaplay } from "react-icons/si";
import { FaAppStoreIos } from "react-icons/fa";
import { FaFigma, FaReact, FaDatabase } from "react-icons/fa";
import { MdOutlineSecurity } from "react-icons/md";
import { GiArtificialIntelligence } from "react-icons/gi";
import { SiBlockchaindotcom } from "react-icons/si";
import { BsBarChartLine } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

function ExploreCourses() {
  const navigate = useNavigate();
  // Updated courses array to include theme-specific colors for borders and shadows
    const courses = [
    {
      title: "Web Development",
      icon: <FaReact className="w-12 h-12 text-cyan-400" />,
      borderColor: "border-cyan-500",
      shadowColor: "hover:shadow-[0_0_30px_rgba(34,211,238,0.6)]",
    },
    {
      title: "UI/UX Designing",
      icon: <FaFigma className="w-12 h-12 text-orange-500" />,
      borderColor: "border-orange-500",
      shadowColor: "hover:shadow-[0_0_30px_rgba(249,115,22,0.6)]",
    },
    {
      title: "App Development",
      icon: <FaAppStoreIos className="w-12 h-12 text-sky-400" />,
      borderColor: "border-sky-500",
      shadowColor: "hover:shadow-[0_0_30px_rgba(56,189,248,0.6)]",
    },
    {
      title: "Blockchain",
      icon: <SiBlockchaindotcom className="w-12 h-12 text-blue-500" />,
      borderColor: "border-white-500", 
      shadowColor: "hover:shadow-[0_0_30px_rgba(59,130,246,0.6)]",
    },
    {
      title: "AI / ML",
      icon: <GiArtificialIntelligence className="w-12 h-12 text-purple-500" />,
      borderColor: "border-purple-500",
      shadowColor: "hover:shadow-[0_0_30px_rgba(168,85,247,0.6)]",
    },
    {
      title: "Data Science",
      icon: <FaDatabase className="w-12 h-12 text-green-500" />,
      borderColor: "border-green-500",
      shadowColor: "hover:shadow-[0_0_30px_rgba(34,197,94,0.6)]",
    },
    {
      title: "Data Analytics",
      icon: <BsBarChartLine className="w-12 h-12 text-yellow-500" />,
      borderColor: "border-yellow-500",
      shadowColor: "hover:shadow-[0_0_30px_rgba(234,179,8,0.6)]",
    },
    {
      title: "Ethical Hacking",
      icon: <MdOutlineSecurity className="w-12 h-12 text-red-500" />,
      borderColor: "border-red-500",
      shadowColor: "hover:shadow-[0_0_30px_rgba(239,68,68,0.6)]",
    },
  ];


  return (
    <div className="w-full min-h-[60vh] relative bg-[#030712] text-white flex flex-col lg:flex-row items-center justify-center gap-12 px-6 py-16 md:py-24 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute w-[150%] h-[150%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle_farthest-corner,rgba(37,99,235,0.1)_0%,rgba(3,7,18,0)_60%)]"></div>

      {/* Left Section */}
      <div className="relative z-10 w-full lg:w-[400px] flex flex-col items-center lg:items-start text-center lg:text-left justify-center gap-3">
        <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-300 drop-shadow-[0_0_15px_rgba(37,99,235,0.5)]">
          Explore Our Courses
        </h2>
        <p className="text-base text-slate-300 leading-relaxed max-w-sm mt-2">
          Discover a variety of career-oriented courses designed to help you
          build modern skills in technology, design, and innovation. From coding
          to AI, we’ve got you covered.
        </p>
        <button
          className="group relative flex items-center justify-center gap-3 px-6 py-3 mt-6 rounded-lg text-lg font-semibold bg-blue-600 border-2 border-blue-600 text-white
                     transition-all duration-300 hover:bg-blue-700 hover:shadow-[0_0_25px_rgba(37,99,235,0.8)] focus:outline-none focus:ring-4 focus:ring-blue-500/50"
          onClick={() => { navigate("/allcourses") }}
        >
          Explore All
          <SiViaplay className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
        </button>
      </div>

      {/* Right Section */}
      <div className="relative z-10 w-full max-w-3xl grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
        {courses.map((course, i) => (
          <div
            key={i}
            className={`
              group relative flex flex-col items-center justify-center gap-4 p-4 rounded-2xl cursor-pointer
              bg-slate-900/50 backdrop-blur-md border ${course.borderColor}/30 
              transition-all duration-300
              hover:scale-105 hover:-translate-y-2 hover:bg-slate-900/80 hover:shadow-[0_0_30px_-5px_rgba(0,0,0,0.4)]
              ${course.shadowColor}
            `}
            // A simple navigation handler can be added here if needed
            // onClick={() => navigate(`/courses/${course.title.toLowerCase().replace(' ', '-')}`)}
          >
            <div className="transition-transform duration-300 group-hover:scale-110">
              {course.icon}
            </div>
            <span className="text-sm font-semibold text-center text-slate-200 transition-colors group-hover:text-white">
              {course.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExploreCourses;