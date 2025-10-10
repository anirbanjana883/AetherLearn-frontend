import React, { useEffect, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCourseData, setSelectedCourse } from "../redux/courseSlice";
import img from "../assets/empty.jpg";
import { FaStar } from "react-icons/fa6";
import { FaPlayCircle } from "react-icons/fa";
import { IoIosLock } from "react-icons/io";
import axios from "axios";
import { serverUrl } from "../App";
import Card from "../component/Card";

function ViewCourse() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { courseData } = useSelector((state) => state.course);
  const { selectedCourse } = useSelector((state) => state.course);
  const dispatch = useDispatch();
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [creatorData, setCreatorData] = useState(null);
  const [creatorCourses, setCreatorCourses] = useState(null);

  const fetchCourseData = async () => {
    courseData.map((course) => {
      if (course._id === courseId) {
        dispatch(setSelectedCourse(course));
        console.log(selectedCourse);
        return null;
      }
    });
  };

  useEffect(() => {
    const handleCreator = async () => {
      if (selectedCourse?.creator) {
        try {
          const result = await axios.post(
            serverUrl + "/api/course/creator",
            { userId: selectedCourse?.creator },
            { withCredentials: true }
          );
          console.log(result.data);
          setCreatorData(result.data);
        } catch (error) {
          console.log(error);
        }
      }
    };
    handleCreator();
  }, [selectedCourse?.creator]);

  useEffect(() => {
    fetchCourseData();
  }, [courseData, courseId]);

  useEffect(() => {
    if (creatorData?._id && courseData?.length > 0) {
      const creatorCourse = courseData.filter(
        (course) =>
          course?.creator._id === courseData?._id && course._id !== courseId
      );
      setCreatorCourses(creatorCourse);
    }
  }, [creatorData, courseData]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-xl p-6 space-y-6 relative">
        {/* upper section  */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* course thumbnail */}
          <div className="w-full md:w-1/2">
            <FaArrowLeftLong
              className="text-[black] w-[25px] h-[25px] cursor-pointer"
              onClick={() => navigate("/")}
            />

            {selectedCourse?.thumbnail ? (
              <img
                src={selectedCourse?.thumbnail}
                alt=""
                className="rounded-xl w-2xl object-cover"
              />
            ) : (
              <img
                src={img}
                alt=""
                className="rounded-xl w-full object-cover"
              />
            )}
          </div>

          {/* course details */}

          <div className="flex-1 space-y-2 mt-[20px]">
            <h2 className="text-2xl font-bold">{selectedCourse?.title}</h2>
            <p className="text-gray-600">{selectedCourse?.subtitle}</p>

            <div className="flex items-start flex-col justify-between ">
              <div className="text-yellow-500 font-medium flex gap-2">
                <span className="flex items-center justify-start gap-1">
                  <FaStar />5
                </span>
                <span className="text-gray-400">(1,200 Reviews)</span>
              </div>

              <div>
                <span className="text-xl font-semibold text-black">
                  ₹ {selectedCourse?.price}
                </span>{" "}
                <span className="line-through text-sm text-gray-500">
                  ₹ 999
                </span>
              </div>

              <div>
                <ul className="text-sm text-gray-700 space-y-1 pt-2">
                  <li>✅ 10+ hours of HD video content</li>
                  <li>✅ Lifetime access to materials</li>
                  <li>✅ Downloadable resources & assignments</li>
                  <li>✅ Certificate of completion</li>
                  <li>✅ Real-world projects and case studies</li>
                </ul>
              </div>

              <button className="bg-[black] text-white px-6 py-2 rounded hover:bg-gray-800 mt-4 self-start cursor-pointer">
                Enroll Now
              </button>
            </div>
          </div>
        </div>

        {/* lower section */}
        <div>
          <h2 className="text-xl font-semibold mb-2">What You'll Learn</h2>
          <ul className="list-disc pl-6 text-gray-600 space-y-1">
            <li>Learn {selectedCourse?.category} from Beginning</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold-semibold mb-2">
            Who This Course is For
          </h2>
          <p className="text-gray-600">
            Beginners, aspiring developers, and professionals looking to upgrade
            skills
          </p>
        </div>

        {/* lectiure area */}

        <div className="flex flex-col md:flex-row gap-6">
          {/* left part */}

          <div className="bg-white w-full md:w-2/5 p-6 rounded-2xl shadow-lg border border-gray-200">
            <h2 className="text-xl font-bold mb-1 text-gray-800">
              Course Curriculum
            </h2>

            <p className="text-sm text-gray-500 mb-4">
              {selectedCourse?.lectures?.length} Lectures
            </p>

            <div className="flex flex-col gap-3">
              {selectedCourse?.lectures?.map((lecture, index) => (
                <button
                  disabled={!lecture.isPreviewFree}
                  onClick={() => {
                    if (lecture.isPreviewFree) {
                      setSelectedLecture(lecture);
                    }
                  }}
                  key={index}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all
                 duration-200 text-left 
                  ${
                    lecture?.isPreviewFree
                      ? " hover:bg-gray-100 cursor-pointer border-gray-400"
                      : "border-gray-300 cursor-not-allowed opacity-60"
                  }
                  ${
                    selectedCourse?.lectureTitle === lecture?.lectureTitle
                      ? "bg-gray-100 border-gray-100"
                      : ""
                  }`}
                >
                  <span className="text-lg text-gray-700">
                    {lecture?.isPreviewFree ? <FaPlayCircle /> : <IoIosLock />}
                  </span>
                  <span className="text-sm font-medium text-gray-800">
                    {lecture?.lectureTitle}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* video preview */}

          <div className="bg-white w-full md:w-3/5 p-6 rounded-2xl shadow-lg border border-gray-200">
            <div
              className="aspect-video w-full rounded-lg overflow-hidden mb-4 bg-black
               flex items-center justify-center"
            >
              {selectedLecture?.videoUrl ? (
                <video
                  className="w-full h-full object-cover"
                  src={selectedLecture?.videoUrl}
                  controls
                />
              ) : (
                <span>Select a preview lecture to watch</span>
              )}
            </div>
          </div>
        </div>
        {/* rating  */}
        <div className="mt-8 border-t pt-6">
          <h2 className="text-xl font-semibold mb-2">Write a Review</h2>

          <div className="mb-4">
            <div className="flex gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar key={star} className="fill-gray-300" />
              ))}
            </div>
            <textarea
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder=" write your review here..."
              rows={3}
            />

            <button className="bg-black text-white mt-3 px-4 py-2 rounded hover:bg-gray-800 cursor-pointer">
              Submit Review
            </button>
          </div>
        </div>
        {/* courses of same creator  */}
        <div className="flex items-center gap-4 pt-4 border-t">
          {creatorData?.photoUrl ? (
            <img
              src={creatorData?.photoUrl}
              alt=""
              className="w-16 h-16 rounded-full object-cover border-1 border-gray-200"
            />
          ) : (
            <img
              src={img}
              alt=""
              className="w-16 h-16 rounded-full object-cover border-1 border-gray-200"
            />
          )}

          <div>
            <h2 className="text-lg font-semibold">{creatorData?.name}</h2>
            <p className="md:text-sm text-gray-600 text-[10px]">
              {creatorData?.description}
            </p>
            <p className="md:text-sm text-gray-600 text-[10px]">
              {creatorData?.email}
            </p>
          </div>
        </div>

        <div>
          <p className="text-xl font-semibold mb-2">
            Other Published Courses by the creator
          </p>
        </div>

        {/* maping all the courses by same ceator */}
        <div
          className="w-full transition-all duration-300 py-[20px] flex items-start justify-start gap-6 lg:px-[80px] 
  overflow-x-auto whitespace-nowrap scroll-smooth scrollbar-hide"
        >
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
    </div>
  );
}

export default ViewCourse;
