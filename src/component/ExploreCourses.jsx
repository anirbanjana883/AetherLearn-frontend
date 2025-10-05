import React from "react";
import { SiViaplay } from "react-icons/si";
import { FaAppStoreIos } from "react-icons/fa";
import { FaFigma, FaReact, FaBrain, FaDatabase } from "react-icons/fa";
import { MdOutlineSecurity } from "react-icons/md";
import { GiArtificialIntelligence } from "react-icons/gi";
import { SiBlockchaindotcom } from "react-icons/si";
import { BsBarChartLine } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

function ExploreCourses() {
  const naviagate = useNavigate()
  const courses = [
    {
      title: "Web Development",
      icon: <FaReact className="w-10 h-10 text-[#0A7EA4]" />,
      bg: "bg-[#E0F7FA]",
    },
    {
      title: "UI/UX Designing",
      icon: <FaFigma className="w-10 h-10 text-[#F24E1E]" />,
      bg: "bg-[#FFEDE6]",
    },
    {
      title: "App Development",
      icon: <FaAppStoreIos className="w-10 h-10 text-[#6d6d6c]" />,
      bg: "bg-[#FFF5E1]",
    },
    {
      title: "Blockchain",
      icon: <SiBlockchaindotcom className="w-10 h-10 text-[#1C75BC]" />,
      bg: "bg-[#E6F0FF]",
    },
    {
      title: "AI / ML",
      icon: <GiArtificialIntelligence className="w-10 h-10 text-[#8B5CF6]" />,
      bg: "bg-[#F3E8FF]",
    },
    {
      title: "Data Science",
      icon: <FaDatabase className="w-10 h-10 text-[#16A34A]" />,
      bg: "bg-[#E8F5E9]",
    },
    {
      title: "Data Analytics",
      icon: <BsBarChartLine className="w-10 h-10 text-[#F59E0B]" />,
      bg: "bg-[#FFF7E6]",
    },
    {
      title: "Ethical Hacking",
      icon: <MdOutlineSecurity className="w-10 h-10 text-[#DC2626]" />,
      bg: "bg-[#FEE2E2]",
    },
  ];

  return (
    <div className="w-[100vw] min-h-[60vh] lg:h-[60vh] flex flex-col lg:flex-row items-center justify-center gap-6 px-6 py-10">
      {/* Left Section */}
      <div className="w-full lg:w-[350px] h-auto flex flex-col items-start justify-center gap-3 md:px-6 px-2">
        <span className="text-[35px] font-semibold">Explore</span>
        <span className="text-[35px] font-semibold">Our Courses</span>
        <p className="text-[16px] text-gray-600 leading-relaxed">
          Discover a variety of career-oriented courses designed to help you
          build modern skills in technology, design, and innovation. From coding
          to AI, we’ve got you covered.
        </p>
        <button className="px-5 py-3 bg-black text-white rounded-lg text-[16px] font-medium flex gap-2 mt-6 hover:bg-gray-800 transition cursor-pointer"
          onClick={()=>{naviagate("/allcourses")}}
        >
          Explore Courses
          <SiViaplay className="w-6 h-6" />
        </button>
      </div>

      {/* Right Section */}
      <div className="w-[720px] max-w-[95%] grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 lg:gap-10 mb-8 lg:mb-0">
        {courses.map((course, i) => (
          <div
            key={i}
            className="w-full h-[140px] flex flex-col items-center justify-center gap-3 text-center cursor-pointer group"
          >
            <div
              className={`${course.bg} w-[100px] h-[90px] rounded-xl flex items-center justify-center group-hover:scale-105 transition`}
            >
              {course.icon}
            </div>
            <span className="text-[14px] font-medium text-gray-700 group-hover:text-black">
              {course.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExploreCourses;
