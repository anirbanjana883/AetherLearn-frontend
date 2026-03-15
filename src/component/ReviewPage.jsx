import React, { useEffect, useState } from 'react';
import ReviewCard from './ReviewCard';
import { FaRegCommentDots } from "react-icons/fa6";
import API from '../api/axios.js'; 
import ClipLoader from "react-spinners/ClipLoader";

function ReviewPage() {
  // 🚨 Replaced Redux with localized paginated state
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch reviews whenever the 'page' state changes
  useEffect(() => {
    const fetchAllReviews = async () => {
      try {
        if (page === 1) setLoading(true);
        else setFetchingMore(true);

        // Hits the global GET /review endpoint we built
        const res = await API.get(`/review?page=${page}&limit=9`);
        const newReviews = res.data.data.reviews || [];

        // Append new reviews to existing ones if loading more
        if (page === 1) {
          setReviews(newReviews);
        } else {
          setReviews(prev => [...prev, ...newReviews]);
        }
        
        setTotalPages(res.data.data.totalPages || 1);
      } catch (error) {
        console.error("Failed to fetch global reviews:", error);
      } finally {
        setLoading(false);
        setFetchingMore(false);
      }
    };

    fetchAllReviews();
  }, [page]);

  const handleLoadMore = () => {
    if (page < totalPages) {
      setPage(prevPage => prevPage + 1);
    }
  };

  return (
    <div className='w-full min-h-screen relative bg-[#030712] text-white flex flex-col items-center py-16 md:py-24 overflow-hidden'>
      {/* Background Gradient */}
      <div className="absolute w-[150%] h-[150%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle_farthest-corner,rgba(37,99,235,0.1)_0%,rgba(3,7,18,0)_60%)] pointer-events-none"></div>

      {/* Header Section */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-300 drop-shadow-[0_0_15px_rgba(37,99,235,0.5)]">
          Real Reviews for Real Courses
        </h1>
        <p className="mt-4 max-w-2xl text-base md:text-lg text-slate-300 leading-relaxed">
          Discover how RANBHOOMI is transforming learning experiences through real feedback from students and professionals worldwide.
        </p>
      </div>

      {/* Container for Cards */}
      <div className='relative z-10 w-full max-w-7xl px-6 lg:px-12'>
        {loading ? (
          <div className="flex justify-center items-center py-20">
             <ClipLoader color="#3B82F6" size={50} />
          </div>
        ) : reviews.length > 0 ? (
          <>
            {/* 🚨 Switched from flex row to a responsive CSS Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {reviews.map((review) => (
                <div key={review._id} className="w-full flex justify-center hover:-translate-y-1 transition-transform duration-300">
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

            {/* Pagination / Load More Button */}
            {page < totalPages && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={handleLoadMore}
                  disabled={fetchingMore}
                  className="px-8 py-3 rounded-xl font-bold bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600 hover:text-white transition-all shadow-[0_0_15px_rgba(37,99,235,0.2)] flex items-center gap-2"
                >
                  {fetchingMore ? <ClipLoader size={20} color="currentColor" /> : "Load More Reviews"}
                </button>
              </div>
            )}
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

export default ReviewPage;