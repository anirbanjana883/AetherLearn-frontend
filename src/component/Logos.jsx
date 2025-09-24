import React from 'react'
import { MdOutlineCastForEducation } from "react-icons/md";
import { FaChalkboardTeacher, FaUsers, FaCertificate, FaGlobeAmericas } from "react-icons/fa";
import { BiTimeFive } from "react-icons/bi";

function Logos() {
  return (
    <div className='w-[100vw] min-h-[90px] flex flex-wrap items-center justify-center gap-4 md:mb-[50px] px-4'>

      <div className='flex items-center justify-center gap-2 px-5 py-3 rounded-3xl bg-gray-200 cursor-pointer text-[#03394b] 
                      w-full sm:w-[45%] md:w-auto'>
        <MdOutlineCastForEducation className='w-[35px] h-[35px] fill-[#03394b]' />
        20k+ Online Courses
      </div>

      <div className='flex items-center justify-center gap-2 px-5 py-3 rounded-3xl bg-gray-200 cursor-pointer text-[#03394b] 
                      w-full sm:w-[45%] md:w-auto'>
        <FaChalkboardTeacher className='w-[35px] h-[35px] fill-[#03394b]' />
        10k+ Expert Instructors
      </div>

      {/* <div className='flex items-center justify-center gap-2 px-5 py-3 rounded-3xl bg-gray-200 cursor-pointer text-[#03394b] 
                      w-full sm:w-[45%] md:w-auto'>
        <BiTimeFive className='w-[35px] h-[35px] fill-[#03394b]' />
        5k+ Hours of Content
      </div> */}

      <div className='flex items-center justify-center gap-2 px-5 py-3 rounded-3xl bg-gray-200 cursor-pointer text-[#03394b] 
                      w-full sm:w-[45%] md:w-auto'>
        <FaCertificate className='w-[35px] h-[35px] fill-[#03394b]' />
        100+ Certifications
      </div>

      <div className='flex items-center justify-center gap-2 px-5 py-3 rounded-3xl bg-gray-200 cursor-pointer text-[#03394b] 
                      w-full sm:w-[45%] md:w-auto'>
        <FaUsers className='w-[35px] h-[35px] fill-[#03394b]' />
        50k+ Students Enrolled
      </div>

      <div className='flex items-center justify-center gap-2 px-5 py-3 rounded-3xl bg-gray-200 cursor-pointer text-[#03394b] 
                      w-full sm:w-[45%] md:w-auto'>
        <FaGlobeAmericas className='w-[35px] h-[35px] fill-[#03394b]' />
        Global Learning Community
      </div>

    </div>
  )
}

export default Logos
