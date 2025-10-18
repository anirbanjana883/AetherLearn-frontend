import React from "react";
import { FaStar } from "react-icons/fa6";
import { FaRegStar } from "react-icons/fa6";

function ReviewCard({
  comment,
  rating,
  photoUrl,
  name,
  description,
  courseTitle,
}) {
  return (
    <div
      className="
        bg-slate-900/40 backdrop-blur-md p-6 rounded-2xl border border-blue-500/30
        transition-all duration-300 w-full h-full flex flex-col justify-between
        hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(37,99,235,0.4)]
      "
    >
      <div>
        {/* Star Rating */}
        <div className="flex items-center mb-4 text-cyan-400 text-lg">
          {[...Array(5)].map((_, i) => (
            <span key={i}>
              {i < rating ? <FaStar /> : <FaRegStar className="text-slate-600" />}
            </span>
          ))}
        </div>

        {/* Comment */}
        <blockquote className="text-slate-200 italic text-base mb-5 border-l-4 border-blue-500/50 pl-4">
          "{comment}"
        </blockquote>
      </div>

      <div>
        {/* Course Title */}
        <p className="text-slate-400 text-sm mb-5">
          Review For: <span className="font-semibold text-blue-300">{courseTitle}</span>
        </p>

        {/* User Info */}
        <div className="flex items-center gap-4 pt-4 border-t border-blue-500/20">
          <img
            src={photoUrl}
            alt={name}
            className="w-12 h-12 rounded-full object-cover border-2 border-blue-500/40"
          />
          <div>
            <h2 className="font-semibold text-white text-base">{name}</h2>
            <p className="text-sm text-slate-400">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewCard;