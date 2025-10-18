import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import img from "../../assets/empty.jpg";
import axios from "axios";
import { serverUrl } from "../../App";
import { setCreatorCourseData } from "../../redux/courseSlice";

function Courses() {
  const navigate = useNavigate();
  const { creatorCourseData } = useSelector((state) => state.course);
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    const creatorCourses = async () => {
      try {
        const result = await axios.get(serverUrl + "/api/course/getcreator", {
          withCredentials: true,
        });
        dispatch(setCreatorCourseData(result.data));
      } catch (error) {
        console.log(error);
      }
    };
    creatorCourses();
  }, [userData]);

  return (
    <div className="flex min-h-screen bg-[#030712] text-white">
      <div className="w-full min-h-screen p-4 sm:p-6 bg-[#030712]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
          <div className="flex items-center gap-3">
            <FaArrowLeftLong
              className="top-[5%] left-[5%] w-[27px] h-[27px] cursor-pointer text-blue-400 hover:text-blue-300 transition-all duration-300"
              onClick={() => navigate("/dashboard")}
            />
            <h1 className="text-2xl font-semibold text-blue-400 drop-shadow-[0_0_8px_rgba(37,99,235,0.8)]">
              All Your Courses
            </h1>
          </div>
          <button
            className="bg-black border border-blue-500 text-blue-400 px-4 py-2 rounded hover:bg-blue-900 hover:text-white transition-all duration-300"
            onClick={() => navigate("/createcourse")}
          >
            Create Course
          </button>
        </div>

        {/* Table for large screens */}
        <div className="hidden md:block bg-[#0A0F1C] rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.4)] p-4 overflow-auto border border-blue-500/40 hover:shadow-[0_0_40px_rgba(37,99,235,0.7)] transition-all duration-500">
          <table className="min-w-full text-sm text-white">
            <thead className="border-b border-blue-500 bg-[#07111F]">
              <tr>
                <th className="text-left py-3 px-4">Courses</th>
                <th className="text-left py-3 px-4">Price</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Edit Course</th>
              </tr>
            </thead>

            <tbody>
              {creatorCourseData?.map((course, index) => (
                <tr
                  key={index}
                  className="border-b border-blue-500 hover:bg-[#0B1A33] transition duration-200"
                >
                  <td className="py-3 px-4 flex items-center gap-4">
                    {course?.thumbnail ? (
                      <img
                        src={course?.thumbnail}
                        className="w-25 h-14 object-cover rounded-md border border-blue-500"
                        alt=""
                      />
                    ) : (
                      <img
                        src={img}
                        className="w-25 h-14 object-cover rounded-md border border-blue-500"
                        alt=""
                      />
                    )}
                    <span>{course?.title}</span>
                  </td>

                  <td className="px-4 py-3">{course?.price ? `₹ ${course.price}` : "₹ NA"}</td>

                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        course?.isPublished
                          ? "bg-green-900 text-green-400"
                          : "bg-red-900 text-red-400"
                      }`}
                    >
                      {course?.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>

                  <td className="px-6 py-3">
                    <FaEdit
                      className="h-7 w-7 text-blue-400 hover:text-blue-300 cursor-pointer transition-all duration-300"
                      onClick={() => navigate(`/editcourse/${course?._id}`)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-center text-sm text-gray-400 mt-6">
            List of your created courses
          </p>
        </div>

        {/* Small screen cards */}
        <div className="md:hidden space-y-4">
          {creatorCourseData?.map((course, index) => (
            <div
              key={index}
              className="bg-[#0A0F1C] rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.4)] p-4 flex flex-col gap-3 border border-blue-500/40 hover:shadow-[0_0_40px_rgba(37,99,235,0.7)] transition-all duration-500"
            >
              <div className="flex gap-4 items-center">
                {course?.thumbnail ? (
                  <img
                    src={course?.thumbnail}
                    alt=""
                    className="w-16 h-16 rounded-md object-cover border border-blue-500"
                  />
                ) : (
                  <img
                    src={img}
                    alt=""
                    className="w-16 h-16 rounded-md object-cover border border-blue-500"
                  />
                )}
                <div className="flex-1">
                  <h2 className="font-medium text-sm text-blue-300">{course?.title}</h2>
                  <p className="text-gray-400 text-xs mt-1">{course?.price ? `₹ ${course.price}` : "₹ NA"}</p>
                </div>

                <div className="px-6 py-3">
                  <FaEdit
                    className="h-7 w-7 text-blue-400 hover:text-blue-300 cursor-pointer transition-all duration-300"
                    onClick={() => navigate(`/editcourse/${course?._id}`)}
                  />
                </div>
              </div>
              <span
                className={`w-fit px-3 py-1 text-xs rounded-full ${
                  course?.isPublished
                    ? "bg-green-900 text-green-400"
                    : "bg-red-900 text-red-400"
                }`}
              >
                {course?.isPublished ? "Published" : "Draft"}
              </span>
            </div>
          ))}
          <p className="text-center text-sm text-gray-400 mt-4">
            List of your created courses
          </p>
        </div>
      </div>
    </div>
  );
}

export default Courses;
