import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Card from "./Card";

function CardPge() {
  const { courseData } = useSelector((state) => state.course);
  const [popularCourses, setPopularCourses] = useState([]);

  useEffect(() => {
    if (Array.isArray(courseData) && courseData.length > 0) {
      setPopularCourses(courseData.slice(0, 6));
    } else {
      setPopularCourses([]);
    }
  }, [courseData]);

  return (
    <div className="w-full relative bg-[#030712] text-white flex flex-col items-center py-16 md:py-24 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute w-[150%] h-[150%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle_farthest-corner,rgba(37,99,235,0.1)_0%,rgba(3,7,18,0)_60%)]"></div>

      {/* Header Section */}
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-300 drop-shadow-[0_0_15px_rgba(37,99,235,0.5)]">
          Our Popular Courses
        </h1>
        <p className="mt-4 max-w-2xl text-base md:text-lg text-slate-300 leading-relaxed">
          Explore top-rated courses to boost your skills, advance your career, and
          unlock opportunities in tech, AI, business, and beyond.
        </p>
      </div>

      {/* Horizontal Scroll Container with Fading Edges */}
      <div className="relative w-full max-w-7xl mt-12">
        {/* Left Fade */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#030712] to-transparent z-10 pointer-events-none hidden md:block"></div>
        {/* Right Fade */}
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#030712] to-transparent z-10 pointer-events-none hidden md:block"></div>

        <div
          className="w-full flex gap-6 lg:gap-8 overflow-x-auto overflow-y-hidden px-6 lg:px-12 py-8 
                     snap-x snap-mandatory 
                     scrollbar-thin scrollbar-thumb-blue-600/50 hover:scrollbar-thumb-blue-500/80 scrollbar-track-transparent"
        >
          {popularCourses?.map((course, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-[280px] sm:w-[300px] snap-center transition-transform duration-300 hover:-translate-y-2"
            >
              <Card
                thumbnail={course?.thumbnail}
                title={course?.title}
                category={course?.category}
                price={course?.price}
                id={course?._id}
                reviews={course?.reviews}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CardPge;