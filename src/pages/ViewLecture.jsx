import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaPlayCircle } from "react-icons/fa";
import ModernVideoPlayer from "../component/ModernVideoPlayer";
import { toast } from "react-toastify";

function ViewLecture() {
  const { courseId } = useParams();
  const { courseData } = useSelector((state) => state.course);
  const selectedCourse = courseData?.find((course) => course._id == courseId);
  const [creatorData, setCreatorData] = useState(null);
  const [selectedLecture, setSelectedLecture] = useState(
    selectedCourse?.lectures?.[0] || null
  );
  const navigate = useNavigate();

  useEffect(() => {
    const handleCreator = async () => {
      if (selectedCourse?.creator) {
        try {
          const result = await axios.post(
            `${serverUrl}/api/course/creator`,
            { userId: selectedCourse?.creator },
            { withCredentials: true }
          );
          setCreatorData(result.data);
        } catch (error) {
          console.log(error);
        }
      }
    };
    handleCreator();
  }, [selectedCourse?.creator]);

  const handleVideoEnd = async () => {
    // Make sure a lecture is selected before proceeding
    if (!selectedLecture) return;

    // console.log("Video has ended! Attempting to mark progress...");

    try {
      // Call the new backend endpoint to mark progress
      const userDate = new Date().toISOString().split("T")[0];
      await axios.post(
        serverUrl + "/api/course/complete",
        { lectureId: selectedLecture._id, date: userDate }, // Send the lecture ID in the body
        { withCredentials: true }
      );
      // const dataToSend = {
      //   lectureId: selectedLecture._id,
      //   date: userDate,
      // };
      // console.log("Sending to backend:", dataToSend);
      // console.log(
      //   `Progress successfully marked for lecture: ${selectedLecture.lectureTitle}`
      // );
      toast.success("Progress Saved!"); // Notify the user
    } catch (error) {
      console.error("Failed to mark progress", error);
      toast.error("Could not save progress.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#030712] text-white flex flex-col md:flex-row gap-6 p-4 md:p-8 font-inter">
      {/* LEFT SECTION */}
      <div className="relative w-full md:w-2/3 bg-[#0A0F1C] rounded-2xl border border-blue-500/40 shadow-[0_0_30px_rgba(37,99,235,0.3)] p-6 transition-all duration-500 hover:shadow-[0_0_45px_rgba(37,99,235,0.6)]">
        {/* Header */}
        <div className="mb-5 flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="p-2 rounded-full bg-black border border-blue-500/40 hover:shadow-[0_0_15px_rgba(37,99,235,0.8)] transition"
          >
            <FaArrowLeftLong className="text-lg text-blue-400" />
          </button>
          <h2 className="text-2xl md:text-3xl font-extrabold text-blue-400 drop-shadow-[0_0_5px_rgba(37,99,235,0.9)]">
            {selectedCourse?.title}
          </h2>
        </div>

        <div className="flex flex-wrap gap-3 text-sm text-gray-400 mb-5">
          <span className="px-3 py-1 bg-black border border-blue-500/50 rounded-full text-blue-300">
            {selectedCourse?.category}
          </span>
          <span className="px-3 py-1 bg-black border border-cyan-500/50 rounded-full text-cyan-300">
            Level: {selectedCourse?.level}
          </span>
        </div>

        {/* Video Player */}
        <div className="aspect-video relative rounded-xl overflow-hidden mb-4 border border-blue-600 shadow-[0_0_25px_rgba(37,99,235,0.5)]">
          {selectedLecture?.videoUrl ? (
            <ModernVideoPlayer
              src={selectedLecture.videoUrl}
              onEnded={handleVideoEnd}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-white text-lg">
              No Content from Instructor
            </div>
          )}
        </div>

        <div className="mt-3">
          <h2 className="text-xl md:text-2xl font-semibold text-blue-300 drop-shadow-[0_0_8px_rgba(37,99,235,0.7)]">
            {selectedLecture?.lectureTitle}
          </h2>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="relative w-full md:w-1/3 bg-[#0A0F1C] rounded-2xl border border-blue-500/40 shadow-[0_0_25px_rgba(37,99,235,0.3)] p-6 transition-all duration-500 hover:shadow-[0_0_35px_rgba(37,99,235,0.6)] h-fit">
        <h2 className="text-xl font-bold mb-6 text-blue-400 drop-shadow-[0_0_8px_rgba(37,99,235,0.8)]">
          All Lectures
        </h2>

        <div className="flex flex-col gap-3 mb-6 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600/50 hover:scrollbar-thumb-blue-500/80">
          {selectedCourse?.lectures?.length > 0 ? (
            selectedCourse?.lectures?.map((lecture, index) => (
              <button
                key={index}
                onClick={() => setSelectedLecture(lecture)}
                className={`group flex items-center justify-between p-3 rounded-xl border text-left transition-all duration-300
                  ${
                    selectedLecture?._id === lecture._id
                      ? "bg-black border-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.6)]"
                      : "bg-[#111827] hover:bg-black border-blue-500/20 hover:shadow-[0_0_10px_rgba(37,99,235,0.3)]"
                  }`}
              >
                <h2 className="text-sm font-semibold text-gray-200 truncate">
                  {lecture.lectureTitle}
                </h2>
                <FaPlayCircle
                  className={`text-lg transition-transform duration-200 ${
                    selectedLecture?._id === lecture._id
                      ? "text-blue-400 scale-110 animate-pulse"
                      : "text-gray-400 group-hover:text-blue-300"
                  }`}
                />
              </button>
            ))
          ) : (
            <p className="text-gray-400">No Lectures available</p>
          )}
        </div>

        {/* Educator Info */}
        {creatorData && (
          <div className="mt-4 border-t border-blue-500/30 pt-4">
            <h3 className="text-md font-semibold text-blue-300 mb-3 tracking-wide">
              Educator
            </h3>

            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={creatorData?.photoUrl}
                  alt="Educator"
                  className="w-14 h-14 rounded-full object-cover border-2 border-blue-500/50 shadow-[0_0_15px_rgba(37,99,235,0.7)]"
                />
              </div>
              <div>
                <h2 className="text-base font-medium text-white">
                  {creatorData?.name}
                </h2>
                <p className="text-sm text-gray-400 line-clamp-2">
                  {creatorData?.description}
                </p>
                <p className="text-sm text-gray-500 italic">
                  {creatorData?.email}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewLecture;
