import React, { useEffect, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaStar, FaPlayCircle, FaChevronDown, FaTrash } from "react-icons/fa"; // 🚨 Imported FaTrash
import { IoIosLock } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedCourse } from "../redux/courseSlice";
import { addEnrolledCourse } from "../redux/userSlice";
import API from "../api/axios.js"; 
import Card from "../component/Card";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";
import img from "../assets/empty.jpg";

function ViewCourse() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { courseData, selectedCourse } = useSelector((state) => state.course);
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [selectedLecture, setSelectedLecture] = useState(null);
  const [creatorData, setCreatorData] = useState(null);
  const [creatorCourses, setCreatorCourses] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [progressData, setProgressData] = useState(null); 
  
  // Review States
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState({ avgRating: 0, reviewCount: 0 });
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [existingReviewId, setExistingReviewId] = useState(null);
  
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  useEffect(() => {
    const pingCourseView = async () => {
      try {
        await API.post(`/analytics/${courseId}/views`);
      } catch (error) {}
    };
    if (courseId) pingCourseView();
  }, [courseId]);

  useEffect(() => {
    const loadCourseData = async () => {
      try {
        setLoading(true);
        const [courseRes, reviewsRes] = await Promise.all([
            API.get(`/course/${courseId}`),
            API.get(`/review/course/${courseId}`)
        ]); 
        
        const fetchedCourse = courseRes.data.data;
        dispatch(setSelectedCourse(fetchedCourse));
        
        const fetchedReviews = reviewsRes.data.data.reviews || [];
        setReviews(fetchedReviews);
        setReviewStats(reviewsRes.data.data.stats || { avgRating: 0, reviewCount: 0 });
        
        if (userData?._id) {
          const myReview = fetchedReviews.find(rev => (rev.user?._id || rev.user) === userData._id);
          if (myReview) {
            setRating(myReview.rating);
            setComment(myReview.comment);
            setExistingReviewId(myReview._id);
          }
        }

        if (fetchedCourse?.sections?.length > 0) {
            const firstSection = fetchedCourse.sections[0];
            setExpandedSections({ [firstSection._id]: true });
            if (firstSection.lectures?.length > 0) {
                setSelectedLecture(firstSection.lectures[0]);
            } else {
                setSelectedLecture(null);
            }
        } else {
            setSelectedLecture(null);
        }
      } catch (error) {
        toast.error("Failed to load course details.");
      } finally {
        setLoading(false);
      }
    };

    loadCourseData();

    if (userData && Array.isArray(userData.enrolledCourses)) {
      const enrolled = userData.enrolledCourses.some(
        (c) => (typeof c === "string" ? c : c._id) === courseId
      );
      setIsEnrolled(enrolled || false);
    }
  }, [courseId, userData, dispatch]);

  useEffect(() => {
    const fetchProgress = async () => {
      if (isEnrolled && courseId) {
        try {
          const res = await API.get(`/progress/${courseId}`);
          setProgressData(res.data.data);
        } catch (error) {}
      }
    };
    fetchProgress();
  }, [isEnrolled, courseId]);

  useEffect(() => {
    const fetchCreator = async () => {
      if (selectedCourse?.creator) {
        try {
          const creatorId = selectedCourse.creator._id || selectedCourse.creator;
          const result = await API.post(`/course/creator`, { userId: creatorId });
          setCreatorData(result.data.data);
        } catch (error) {}
      }
    };
    fetchCreator();
  }, [selectedCourse?.creator]);

  useEffect(() => {
    if (creatorData?._id && courseData?.length > 0) {
      const creatorCourse = courseData.filter(
        (course) => (course?.creator?._id || course?.creator) === creatorData._id && course._id !== courseId
      );
      setCreatorCourses(creatorCourse);
    }
  }, [creatorData, courseData, courseId]);

  const handleEnroll = async (userId, courseId) => {
    try {
      const orderData = await API.post(`/payment/razorpay-order`, { userId, courseId });
      const order = orderData.data.data; 

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount, 
        currency: "INR",
        name: "AETHERLEARN",
        description: "COURSE ENROLLMENT PAYMENT",
        order_id: order.id,  
        handler: async function (response) {
          try {
            const verify = await API.post(`/payment/verifypayment`, { courseId, userId, ...response });
            dispatch(addEnrolledCourse(courseId));
            setIsEnrolled(true);
            toast.success(verify.data.message);
          } catch (error) {
            toast.error(error.response?.data?.message || "Payment verification failed");
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error("Enrollment failed.");
    }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (rating === 0) return toast.warning("Please select a rating");
    if (!comment.trim()) return toast.warning("Please write a comment");
    setLoading(true);
    
    try {
      if (existingReviewId) {
        await API.put(`/review/${existingReviewId}`, { rating, comment });
        toast.success("Review updated successfully!");
      } else {
        await API.post(`/review/course/${courseId}`, { rating, comment });
        toast.success("Review added successfully!");
      }
      
      const reviewsRes = await API.get(`/review/course/${courseId}`);
      const newReviewsList = reviewsRes.data.data.reviews || [];
      
      setReviews(newReviewsList);
      setReviewStats(reviewsRes.data.data.stats || { avgRating: 0, reviewCount: 0 });

      if (userData?._id && !existingReviewId) {
        const myReview = newReviewsList.find(rev => (rev.user?._id || rev.user) === userData._id);
        if (myReview) setExistingReviewId(myReview._id);
      }

    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save review");
    }
    setLoading(false);
  };

  // 🚨 ADDED: Delete Review Handler
  const handleDeleteReview = async (e) => {
    e.preventDefault();
    if (!existingReviewId) return;
    
    // Quick confirmation so they don't accidentally delete it
    if (!window.confirm("Are you sure you want to delete your review?")) return;
    
    setLoading(true);
    try {
      await API.delete(`/review/${existingReviewId}`);
      toast.success("Review deleted!");
      
      // Clear the local state to reset the UI
      setRating(0);
      setComment("");
      setExistingReviewId(null);
      
      // Fetch fresh stats from Redis to update the UI instantly
      const reviewsRes = await API.get(`/review/course/${courseId}`);
      setReviews(reviewsRes.data.data.reviews || []);
      setReviewStats(reviewsRes.data.data.stats || { avgRating: 0, reviewCount: 0 });

    } catch (error) {
      toast.error("Failed to delete review");
    }
    setLoading(false);
  };

  if (loading || !selectedCourse) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030712]">
        <ClipLoader size={50} color="#3B82F6" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen w-full bg-[#030712] text-white font-inter p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Upper Section */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/2 relative bg-[#0A0F1C] rounded-2xl border border-blue-500/40 shadow-[0_0_15px_rgba(37,99,235,0.3)] p-4">
            <FaArrowLeftLong
              className="text-blue-400 w-6 h-6 cursor-pointer hover:scale-110 transition"
              onClick={() => navigate(-1)}
            />
            <img
              src={selectedCourse?.thumbnail || img}
              alt="course"
              className="rounded-xl w-full mt-4 object-cover"
            />
          </div>

          <div className="flex-1 space-y-3 p-6 bg-[#0A0F1C] rounded-2xl border border-blue-500/40 shadow-[0_0_15px_rgba(37,99,235,0.3)]">
            <h2 className="text-3xl font-bold text-blue-400 drop-shadow-[0_0_5px_rgba(37,99,235,0.9)]">{selectedCourse?.title}</h2>
            <p className="text-gray-400 text-lg">{selectedCourse?.subtitle}</p>

            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-2 text-yellow-400 text-lg font-bold">
                <FaStar /> {reviewStats.avgRating}
              </div>
              <span className="text-gray-500">({reviewStats.reviewCount} Reviews)</span>
            </div>

            <div className="mt-4 pb-4 border-b border-blue-500/20">
              <span className="text-3xl font-semibold text-white">₹{selectedCourse?.price}</span>
            </div>

            {!isEnrolled ? (
              <button
                onClick={() => handleEnroll(userData?._id, courseId)}
                className="mt-4 w-full py-3 rounded-xl font-bold text-white transition-all duration-300 bg-blue-600 hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.4)]"
              >
                Enroll Now
              </button>
            ) : (
              <div className="mt-4 p-4 bg-slate-800/50 rounded-xl border border-blue-500/20">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-300">Your Progress</span>
                  <span className="text-emerald-400 font-bold">{progressData?.completionPercentage || 0}%</span>
                </div>
                <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full transition-all duration-1000"
                    style={{ width: `${progressData?.completionPercentage || 0}%` }}
                  ></div>
                </div>
                <button
                  onClick={() => navigate(`/viewlecture/${courseId}`)}
                  className="mt-4 w-full py-3 rounded-xl font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                >
                  {(progressData?.completionPercentage || 0) > 0 ? "Resume Learning" : "Start Course"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Lectures & Video Section */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-2/5 bg-[#0A0F1C] rounded-2xl border border-blue-500/40 shadow-[0_0_15px_rgba(37,99,235,0.3)] p-4">
            <h2 className="text-xl text-blue-400 font-semibold mb-4">Course Curriculum</h2>
            <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600/50 pr-2">
              {selectedCourse?.sections?.length > 0 ? (
                selectedCourse.sections.map((section) => (
                  <div key={section._id} className="bg-[#030712] rounded-xl border border-blue-500/20 overflow-hidden">
                    <button 
                      onClick={() => toggleSection(section._id)}
                      className="w-full flex items-center justify-between p-3 bg-[#111827] hover:bg-blue-900/20 transition-colors"
                    >
                      <span className="font-semibold text-gray-200">{section.sectionTitle}</span>
                      <FaChevronDown className={`text-blue-400 transition-transform duration-300 ${expandedSections[section._id] ? "rotate-180" : ""}`} />
                    </button>
                    {expandedSections[section._id] && (
                      <div className="flex flex-col gap-1 p-2">
                        {section.lectures?.map((lecture) => (
                          <button
                            key={lecture._id}
                            disabled={!lecture.isPreviewFree && !isEnrolled}
                            onClick={() => (lecture.isPreviewFree || isEnrolled) && setSelectedLecture(lecture)}
                            className={`group flex items-center justify-between p-2 rounded-lg text-sm text-left transition-all duration-200
                              ${selectedLecture?._id === lecture._id ? "bg-blue-600/20 border border-blue-500 text-blue-300" : "hover:bg-gray-800 text-gray-400"}`}
                          >
                            <span className="truncate pr-4">{lecture.lectureTitle}</span>
                            {lecture.isPreviewFree || isEnrolled ? (
                              <FaPlayCircle className="text-blue-400 min-w-[16px]" />
                            ) : (
                              <IoIosLock className="text-gray-500 min-w-[16px]" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No curriculum available yet.</p>
              )}
            </div>
          </div>

          <div className="w-full md:w-3/5 bg-[#0A0F1C] rounded-2xl border border-blue-500/40 shadow-[0_0_15px_rgba(37,99,235,0.3)] p-4 flex flex-col">
            {(selectedLecture?.videoUrl || selectedLecture?.rawVideoUrl) ? (
              <>
                <video
                  key={selectedLecture._id} 
                  src={selectedLecture.videoUrl || selectedLecture.rawVideoUrl} 
                  controls
                  controlsList={!isEnrolled ? "nodownload" : ""}
                  className="w-full aspect-video rounded-xl object-cover border border-blue-600/50 shadow-[0_0_25px_rgba(37,99,235,0.2)] bg-black"
                />
                <h3 className="text-xl font-semibold text-white mt-4">{selectedLecture.lectureTitle}</h3>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-gray-500 border-2 border-dashed border-gray-700 rounded-xl">
                <IoIosLock className="text-4xl mb-2 text-gray-600" />
                <p>Select a free preview lecture to watch</p>
              </div>
            )}
          </div>
        </div>

        {/* REVIEWS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Write / Edit / Delete Review Block */}
          {isEnrolled && (
            <div className="bg-[#0A0F1C] p-6 rounded-2xl border border-blue-500/30 shadow-[0_0_15px_rgba(37,99,235,0.3)] flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-semibold text-blue-400 mb-4">
                  {existingReviewId ? "Edit Your Review" : "Write a Review"}
                </h2>
                <div className="flex gap-1 mb-4 text-xl">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`transition-colors duration-200 ${star <= rating ? "text-yellow-400 cursor-pointer drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]" : "text-gray-600 cursor-pointer hover:text-yellow-400/50"}`}
                      onClick={() => setRating(star)}
                    />
                  ))}
                </div>
                <textarea
                  className="w-full p-3 rounded-xl bg-[#030712] text-white border border-blue-500/30 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all custom-scrollbar"
                  placeholder="How was your learning experience?"
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
              
              {/* 🚨 ADDED: Dynamic Buttons based on existingReviewId */}
              <div className="flex gap-4 mt-4">
                <button
                  type="button"
                  onClick={handleReview}
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl font-bold bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600 hover:text-white transition-all shadow-[0_0_10px_rgba(37,99,235,0.2)]"
                >
                  {loading ? <ClipLoader size={20} color="currentColor" /> : (existingReviewId ? "Update Feedback" : "Submit Feedback")}
                </button>
                
                {/* 🚨 DELETE BUTTON */}
                {existingReviewId && (
                  <button
                    type="button"
                    onClick={handleDeleteReview}
                    disabled={loading}
                    className="px-4 py-2.5 rounded-xl bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500 hover:text-white transition-all shadow-[0_0_10px_rgba(239,68,68,0.2)]"
                    title="Delete Review"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Student Reviews List */}
          <div className="bg-[#0A0F1C] p-6 rounded-2xl border border-blue-500/30 shadow-[0_0_15px_rgba(37,99,235,0.3)] h-[300px] flex flex-col">
            <h2 className="text-xl font-semibold text-blue-400 mb-4 flex justify-between items-center">
              Student Reviews
              <span className="text-sm text-slate-400 font-normal">{reviews.length} Recent</span>
            </h2>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
              {reviews.length > 0 ? (
                reviews.map((rev) => (
                  <div key={rev._id} className={`p-4 rounded-xl border ${existingReviewId === rev._id ? "bg-blue-900/10 border-blue-500/50" : "bg-[#030712] border-white/5"}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <img 
                          src={rev.user?.photoUrl || img} 
                          alt="Student" 
                          className="w-8 h-8 rounded-full object-cover border border-blue-500/30"
                        />
                        <div>
                          <p className="text-sm font-bold text-slate-200">
                            {rev.user?.name || "Student"}
                            {existingReviewId === rev._id && <span className="ml-2 text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">You</span>}
                          </p>
                          <div className="flex gap-0.5 text-xs text-yellow-400 mt-0.5">
                            {[...Array(5)].map((_, i) => (
                              <FaStar key={i} className={i < rev.rating ? "text-yellow-400" : "text-gray-700"} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-500">{new Date(rev.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-slate-400 mt-3 italic">"{rev.comment}"</p>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-500">
                  <FaStar className="text-3xl mb-2 opacity-20" />
                  <p>No reviews yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Creator Section */}
        {creatorData && (
          <div className="mt-6 flex flex-col gap-3">
            <div className="flex items-center gap-4 border-t border-blue-500/30 pt-6">
              <img
                src={creatorData.photoUrl || img}
                alt="Educator"
                className="w-16 h-16 rounded-full object-cover border-2 border-blue-500/50 shadow-[0_0_15px_rgba(37,99,235,0.7)]"
              />
              <div>
                <h2 className="text-lg font-semibold text-white">{creatorData.name}</h2>
                <p className="text-sm text-gray-400 line-clamp-2">{creatorData.description}</p>
                <p className="text-sm text-gray-500 italic">{creatorData.email}</p>
              </div>
            </div>

            <p className="text-xl font-semibold text-blue-400 mt-6">Other Published Courses by the Creator</p>
            <div className="flex gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-blue-600/50 hover:scrollbar-thumb-blue-500/80 pb-4">
              {creatorCourses?.map((course, index) => (
                <div key={index} className="inline-block flex-shrink-0">
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
        )}
      </div>
    </div>
  );
}

export default ViewCourse;