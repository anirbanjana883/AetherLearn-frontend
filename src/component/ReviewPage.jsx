import React, { useEffect, useState } from 'react'
import ReviewCard from './ReviewCard'
import { useSelector } from "react-redux";
import { FaRegCommentDots } from "react-icons/fa6";

function ReviewPage() {
  const { reviewData } = useSelector(state => state.review)
  const [latestReview, setLatestReview] = useState([])

  useEffect(() => {
    // Ensure reviewData is an array before slicing
    if (Array.isArray(reviewData)) {
      setLatestReview(reviewData.slice(0, 6))
    }
  }, [reviewData])

  return (
    <div className='w-full relative bg-[#030712] text-white flex flex-col items-center py-16 md:py-24 overflow-hidden'>
      {/* Background Gradient */}
      <div className="absolute w-[150%] h-[150%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle_farthest-corner,rgba(37,99,235,0.1)_0%,rgba(3,7,18,0)_60%)]"></div>

      {/* Header Section */}
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-300 drop-shadow-[0_0_15px_rgba(37,99,235,0.5)]">
          Real Reviews for Real Courses
        </h1>
        <p className="mt-4 max-w-2xl text-base md:text-lg text-slate-300 leading-relaxed">
          Discover how Aetherlearn is transforming learning experiences through real feedback from students and professionals worldwide.
        </p>
      </div>

      {/* Container for Cards */}
      <div className='relative w-full max-w-7xl mt-12'>
        {latestReview?.length > 0 ? (
          <>
            {/* Left Fade */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#030712] to-transparent z-10 pointer-events-none hidden md:block"></div>
            {/* Right Fade */}
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#030712] to-transparent z-10 pointer-events-none hidden md:block"></div>

            {/* Horizontal Scroll Area */}
            <div
              className="w-full flex gap-6 lg:gap-8 overflow-x-auto overflow-y-hidden px-6 lg:px-12 py-8 
                         snap-x snap-mandatory 
                         scrollbar-thin scrollbar-thumb-blue-600/50 hover:scrollbar-thumb-blue-500/80 scrollbar-track-transparent"
            >
              {latestReview.map((review, index) => (
                <div key={index} className="flex-shrink-0 w-[320px] sm:w-[350px] snap-center">
                  <ReviewCard
                    comment={review?.comment}
                    rating={review?.rating}
                    photoUrl={review?.user?.photoUrl}
                    name={review?.user?.name}
                    description={review?.user?.description}
                    courseTitle={review?.course?.title}
                  />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-16">
            <FaRegCommentDots className="text-cyan-500/50 text-7xl mb-4" />
            <h2 className="text-slate-300 font-semibold text-xl">
              No Reviews Yet
            </h2>
            <p className="text-slate-400 text-base mt-2">
              Be the first to share your thoughts on our courses!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReviewPage