import React from "react";
import { FaStar } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

function Card({ thumbnail, title, category, price, id, reviews }) {
  const navigate = useNavigate();

  const calculateAvgReview = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const avgRating = calculateAvgReview(reviews);

  return (
    <div
      className="group relative bg-[#0A0F1C] rounded-2xl overflow-hidden shadow-[0_0_15px_rgba(37,99,235,0.3)] 
      hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] transition-all duration-300 border border-blue-500/40 
      hover:-translate-y-2 cursor-pointer w-[280px] sm:w-[300px]"
      onClick={() => navigate(`/viewcourse/${id}`)}
    >
      {/* Image Section */}
      <div className="relative w-full h-52 bg-gradient-to-br from-[#111827] to-[#1f2937] flex items-center justify-center overflow-hidden rounded-t-2xl">
        <img
          src={thumbnail}
          alt={title}
          className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
      </div>

      {/* Course Details */}
      <div className="p-5 space-y-3">
        <h2
          className="text-lg font-semibold text-blue-400 leading-tight line-clamp-2 drop-shadow-[0_0_5px_rgba(37,99,235,0.9)]"
          title={title}
        >
          {title}
        </h2>

        <span
          className="inline-block px-3 py-1 bg-[#111827] text-blue-300 rounded-full text-sm font-medium 
          border border-blue-500/50 shadow-[0_0_5px_rgba(37,99,235,0.4)]"
        >
          {category}
        </span>

        <div className="flex justify-between items-center mt-3 px-1">
          <span className="font-semibold text-white text-[17px] drop-shadow-[0_0_5px_rgba(37,99,235,0.9)]">
            ₹ {price}
          </span>
          <span className="flex items-center gap-1 text-[15px] text-yellow-400">
            <FaStar className="text-yellow-400 drop-shadow-[0_0_5px_rgba(255,215,0,0.8)]" />
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
