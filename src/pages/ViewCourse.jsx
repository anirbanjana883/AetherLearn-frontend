import React, { useEffect, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaStar, FaPlayCircle } from "react-icons/fa";
import { IoIosLock } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedCourse } from "../redux/courseSlice";
import { addEnrolledCourse } from "../redux/userSlice";
import axios from "axios";
import { serverUrl } from "../App";
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
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const course = courseData.find((c) => c._id === courseId);
    if (course) {
      dispatch(setSelectedCourse(course));
      setSelectedLecture(course.lectures?.[0] || null);
    }
    const enrolled = userData?.enrolledCourses?.some(
      (c) => (typeof c === "string" ? c : c._id) === courseId
    );
    setIsEnrolled(enrolled || false);
  }, [courseData, courseId, userData]);

  useEffect(() => {
    const fetchCreator = async () => {
      if (selectedCourse?.creator) {
        try {
          const result = await axios.post(
            `${serverUrl}/api/course/creator`,
            { userId: selectedCourse.creator },
            { withCredentials: true }
          );
          setCreatorData(result.data);
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchCreator();
  }, [selectedCourse?.creator]);

  useEffect(() => {
    if (creatorData?._id && courseData?.length > 0) {
      const creatorCourse = courseData.filter(
        (course) =>
          course?.creator._id === courseData?._id && course._id !== courseId
      );
      setCreatorCourses(creatorCourse);
    }
  }, [creatorData, courseData]);

  const calculateAvgReview = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return (total / reviews.length).toFixed(1);
  };
  const avgRating = calculateAvgReview(selectedCourse?.reviews);

  const handleEnroll = async (userId, courseId) => {
    try {
      const orderData = await axios.post(
        `${serverUrl}/api/order/razorpay-order`,
        { userId, courseId },
        { withCredentials: true }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.data.amount,
        currency: "INR",
        name: "AETHERLEARN",
        description: "COURSE ENROLLMENT PAYMENT",
        order_id: orderData.data.id,
        handler: async function (response) {
          try {
            const verify = await axios.post(
              `${serverUrl}/api/order/verifypayment`,
              { courseId, userId, ...response },
              { withCredentials: true }
            );
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

  const handleReview = async () => {
    setLoading(true);
    try {
      await axios.post(
        `${serverUrl}/api/review/createreview`,
        { rating, comment, courseId },
        { withCredentials: true }
      );
      setRating(0);
      setComment("");
      toast.success("Review added successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full bg-[#030712] text-white font-inter p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Upper Section */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/2 relative bg-[#0A0F1C] rounded-2xl border border-blue-500/40 shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] p-4 transition-all duration-500">
            <FaArrowLeftLong
              className="text-blue-400 w-6 h-6 cursor-pointer hover:scale-110 transition"
              onClick={() => navigate("/")}
            />
            <img
              src={selectedCourse?.thumbnail || img}
              alt="course"
              className="rounded-xl w-full mt-4 object-cover"
            />
          </div>

          <div className="flex-1 space-y-3 p-4 bg-[#0A0F1C] rounded-2xl border border-blue-500/40 shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] transition-all duration-500">
            <h2 className="text-2xl font-bold text-blue-400 drop-shadow-[0_0_5px_rgba(37,99,235,0.9)]">{selectedCourse?.title}</h2>
            <p className="text-gray-400">{selectedCourse?.subtitle}</p>

            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-2 text-yellow-400">
                <FaStar /> {avgRating}
              </div>
              <span className="text-gray-500">(1,200 Reviews)</span>
            </div>

            <div className="mt-2">
              <span className="text-xl font-semibold text-white">₹ {selectedCourse?.price}</span>
              <span className="line-through text-gray-500 ml-2">₹ {selectedCourse?.price + 500}</span>
            </div>

            <ul className="text-gray-400 text-sm mt-3 space-y-1">
              <li>✅ 10+ hours of HD video content</li>
              <li>✅ Lifetime access to materials</li>
              <li>✅ Downloadable resources & assignments</li>
              <li>✅ Certificate of completion</li>
              <li>✅ Real-world projects</li>
            </ul>

            <button
              onClick={() => (!isEnrolled ? handleEnroll(userData._id, courseId) : navigate(`/viewlecture/${courseId}`))}
              className={`mt-4 px-6 py-2 rounded-md font-medium text-white transition-all duration-300 ${
                !isEnrolled ? "bg-black hover:shadow-[0_0_15px_rgba(37,99,235,0.7)]" : "bg-green-600 hover:shadow-[0_0_15px_rgba(37,99,235,0.7)]"
              }`}
            >
              {!isEnrolled ? "Enroll Now" : "Explore Course"}
            </button>
          </div>
        </div>

        {/* Lectures Section */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-2/5 bg-[#0A0F1C] rounded-2xl border border-blue-500/40 shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] p-4 transition-all duration-500">
            <h2 className="text-xl text-blue-400 font-semibold mb-3">Course Curriculum</h2>
            <p className="text-gray-400 text-sm mb-3">{selectedCourse?.lectures?.length} Lectures</p>

            <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600/50 hover:scrollbar-thumb-blue-500/80">
              {selectedCourse?.lectures?.map((lecture, idx) => (
                <button
                  key={idx}
                  disabled={!lecture.isPreviewFree}
                  onClick={() => lecture.isPreviewFree && setSelectedLecture(lecture)}
                  className={`group flex items-center justify-between p-2 rounded-xl text-left transition-all duration-300
                    ${selectedLecture?._id === lecture._id
                      ? "bg-black border-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.6)]"
                      : "bg-[#111827] border border-blue-500/20 hover:bg-black hover:shadow-[0_0_10px_rgba(37,99,235,0.3)]"
                    }`}
                >
                  <span className="text-gray-200">{lecture.lectureTitle}</span>
                  {lecture.isPreviewFree ? (
                    <FaPlayCircle className="text-blue-400 group-hover:text-blue-300 transition-all duration-300" />
                  ) : (
                    <IoIosLock className="text-gray-400" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full md:w-3/5 bg-[#0A0F1C] rounded-2xl border border-blue-500/40 shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] p-4 transition-all duration-500">
            {selectedLecture?.videoUrl ? (
              <video
                src={selectedLecture.videoUrl}
                controls
                className="w-full aspect-video rounded-xl object-cover border border-blue-600 shadow-[0_0_25px_rgba(37,99,235,0.5)]"
              />
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-400">Select a preview lecture to watch</div>
            )}
          </div>
        </div>

        {/* Review Section */}
        <div className="mt-6 bg-[#0A0F1C] p-4 rounded-2xl border border-blue-500/30 shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] transition-all duration-500">
          <h2 className="text-xl font-semibold text-blue-400 mb-2">Write a Review</h2>
          <div className="flex gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className={star <= rating ? "text-yellow-400" : "text-gray-400"}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
          <textarea
            className="w-full p-2 rounded-lg bg-[#030712] text-white border border-blue-500/40"
            placeholder="Write your review here..."
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            onClick={handleReview}
            disabled={loading}
            className="mt-2 px-4 py-2 rounded-md bg-black hover:shadow-[0_0_15px_rgba(37,99,235,0.7)] transition-all duration-300 text-white"
          >
            {loading ? <ClipLoader size={24} color="white" /> : "Submit Review"}
          </button>
        </div>

        {/* Creator Section */}
        {creatorData && (
          <div className="mt-6 flex flex-col gap-3">
            <div className="flex items-center gap-4 border-t border-blue-500/30 pt-4">
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

            <p className="text-xl font-semibold text-blue-400 mt-4">Other Published Courses by the Creator</p>
            <div className="flex gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-blue-600/50 hover:scrollbar-thumb-blue-500/80">
              {creatorCourses?.map((course, index) => (
            <div key={index} className="inline-block">
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
