import React from 'react'
import { MdOutlineCastForEducation } from "react-icons/md";
import { FaChalkboardTeacher, FaUsers, FaCertificate, FaGlobeAmericas } from "react-icons/fa";

function Logos() {
  // Data array for easier mapping and management
  const stats = [
    {
      icon: <MdOutlineCastForEducation />,
      text: "20k+ Online Courses"
    },
    {
      icon: <FaChalkboardTeacher />,
      text: "10k+ Expert Instructors"
    },
    {
      icon: <FaCertificate />,
      text: "100+ Certifications"
    },
    {
      icon: <FaUsers />,
      text: "50k+ Students Enrolled"
    },
    {
      icon: <FaGlobeAmericas />,
      text: "Global Learning Community"
    }
  ];

  return (
    <div className='w-full bg-black/20 py-12 md:py-16'>
      <div className='w-full max-w-7xl mx-auto flex flex-wrap items-center justify-center gap- md:gap-8 px-4'>
        {stats.map((stat, index) => (
          <div
            key={index}
            className='
              flex items-center justify-center gap-4 px-6 py-4 rounded-xl 
              bg-slate-900/40 backdrop-blur-md border border-blue-500/30 
              text-slate-300 font-semibold text-base md:text-lg 
              transition-all duration-300 cursor-pointer
              hover:bg-slate-800/60 hover:border-cyan-400 hover:-translate-y-1
              hover:shadow-[0_0_25px_rgba(34,211,238,0.4)]
              w-full sm:w-auto sm:flex-grow md:flex-grow-0
            '
          >
            {/* Clones the icon to apply new styles */}
            {React.cloneElement(stat.icon, { className: "text-cyan-400 text-3xl md:text-4xl" })}
            <span>{stat.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Logos