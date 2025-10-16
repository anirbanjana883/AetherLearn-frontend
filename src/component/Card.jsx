import React from "react";
import { FaStar } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

function Card({ thumbnail, title, category, price, id , reviews}) {
  const navigate = useNavigate()

  const calculateAvgReview = (reviews) =>{
    if(!reviews || reviews.length === 0) {
      return 0;
    }
    const total = reviews.reduce((sum , review) => sum + review.rating , 0)

    return (total / reviews.length).toFixed(1)
  }

  const avgRating = calculateAvgReview(reviews)

  return (
    <div
      className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl 
      transition-all duration-300 border border-gray-200 hover:-translate-y-2 cursor-pointer 
      w-[280px] sm:w-[300px]"
      onClick={()=>navigate(`/viewcourse/${id}`)}
    >
      {/* Image Section */}
      <div className="relative w-full h-52 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
        <img
          src={thumbnail}
          alt={title}
          className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
      </div>

      {/* Course Details */}
      <div className="p-5 space-y-3">
        <h2
          className="text-lg font-semibold text-gray-900 leading-tight line-clamp-2"
          title={title}
        >
          {title}
        </h2>

        <span
          className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium 
          border border-gray-300"
        >
          {category}
        </span>

        <div className="flex justify-between items-center mt-3 px-1">
          <span className="font-semibold text-gray-900 text-[17px]">
            ₹ {price}
          </span>
          <span className="flex items-center gap-1 text-[15px] text-gray-700">
            <FaStar className="text-yellow-500" />
            {avgRating}
          </span>
        </div>
      </div>

      {/* Hover Accent */}
      <div
        className="absolute inset-x-0 bottom-0 h-[5px] bg-gradient-to-r from-indigo-500 via-purple-500 
        to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      ></div>
    </div>
  );
}

export default Card;
