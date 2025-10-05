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
    <div className="relative flex flex-col items-center justify-center">
      <h1 className="md:text-[45px] text-[30px] font-semibold text-center mt-[30px] px-[20px]">
        Our Popular Courses
      </h1>

      <span className="lg:w-[50%] md:w-[80%] text-[20px] text-center mt-[30px] mb-[30px] px-[20px]">
        Explore top-rated courses to boost your skills, advance your career, and
        unlock opportunities in tech, AI, business, and beyond.
      </span>

      {/*Horizontal scroll area */}
      <div
        className="w-full flex gap-12 overflow-x-auto overflow-y-hidden px-6 pb-8 scrollbar-hide snap-x snap-mandatory"
      >
        {popularCourses?.map((course, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-[280px] snap-center transition-transform duration-300 hover:scale-105"
          >
            <Card
              thumbnail={course?.thumbnail}
              title={course?.title}
              category={course?.category}
              price={course?.price}
              id={course?._id}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default CardPge;
