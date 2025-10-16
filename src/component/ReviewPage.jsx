import React, { useEffect, useState } from 'react'
import ReviewCard from './ReviewCard'
import { useSelector } from "react-redux";
import { FaRegCommentDots } from "react-icons/fa6";

function ReviewPage() {
  const { reviewData } = useSelector(state => state.review)
  const [latestReview, setLatestReview] = useState([])

  useEffect(() => {
    setLatestReview(reviewData?.slice(0, 6))
  }, [reviewData])

  return (
    <div className='flex items-center justify-center flex-col'>
      <h1 className='md:text-[45px] text-[30px] font-semibold text-center mt-[30px] px-[20px]'>
        Real Reviews for Real Courses
      </h1>
      <span className='lg:w-[50%] md:w-[80%] text-[15px] text-center mt-[30px] mb-[30px] px-[20px]'>
        Discover how Aetherlean is transforming learning experiences through real feedback from students and professionals worldwide
      </span>

      <div className='w-full flex items-center justify-center flex-wrap gap-[50px] lg:p-[50px] md:p-[30px] p-[10px] mb-[40px]'>
        {latestReview?.length > 0 ? (
          latestReview.map((review, index) => (
            <ReviewCard
              key={index}
              comment={review?.comment}
              rating={review?.rating}
              photoUrl={review?.user?.photoUrl}
              name={review?.user?.name}
              description={review?.user?.description}
              courseTitle={review?.course?.title}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center text-center mt-10">
            <FaRegCommentDots className="text-gray-400 text-6xl mb-4" />
            <h2 className="text-gray-700 font-semibold text-lg">
              No reviews yet
            </h2>
            <p className="text-gray-500 text-sm">
              Be the first to share your thoughts about this course!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReviewPage
