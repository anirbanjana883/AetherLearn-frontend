import React, { useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { serverUrl } from "../../App";
import { useDispatch, useSelector } from "react-redux";
import { setLectureData } from "../../redux/lectureSlice";
import ClipLoader from "react-spinners/ClipLoader";

function EditLecture() {
  const { courseId, lectureId } = useParams();
  const { lectureData } = useSelector((state) => state.lecture);
  const selectedLecture = lectureData.find((lecture) => lecture._id === lectureId);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [lectureTitle, setLectureTitle] = useState(selectedLecture?.lectureTitle || "");
  const [videoUrl, setVideoUrl] = useState(null);
  const [isPreviewFree, setIsPreviewFree] = useState(selectedLecture?.isPreviewFree || false);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);

  const handleEditLecture = async () => {
    if (!lectureTitle.trim()) {
      toast.error("Lecture title cannot be empty");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("lectureTitle", lectureTitle);
      if (videoUrl) formData.append("videoUrl", videoUrl);
      formData.append("isPreviewFree", isPreviewFree);

      const result = await axios.post(
        `${serverUrl}/api/course/editlecture/${lectureId}`,
        formData,
        { withCredentials: true }
      );

      const updatedLectures = lectureData.map((lecture) =>
        lecture._id === lectureId ? result.data : lecture
      );
      dispatch(setLectureData(updatedLectures));

      toast.success("Lecture updated successfully!");
      navigate(`/createlecture/${courseId}`);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to update lecture");
    } finally {
      setLoading(false);
    }
  };

  const removeLecture = async () => {
    setLoading1(true);
    try {
      await axios.delete(`${serverUrl}/api/course/removelecture/${lectureId}`, {
        withCredentials: true,
      });
      toast.success("Lecture removed successfully!");
      dispatch(setLectureData(lectureData.filter((l) => l._id !== lectureId)));
      navigate(`/createlecture/${courseId}`);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to remove lecture");
    } finally {
      setLoading1(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#0A0F1C] rounded-2xl p-6 border border-blue-500/40 shadow-[0_0_25px_rgba(37,99,235,0.4)] hover:shadow-[0_0_40px_rgba(37,99,235,0.7)] transition-all duration-500">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <FaArrowLeftLong
            className="w-6 h-6 text-blue-400 hover:text-blue-300 cursor-pointer transition-all duration-300"
            onClick={() => navigate(`/createlecture/${courseId}`)}
          />
          <h2 className="text-2xl font-semibold text-blue-400 drop-shadow-[0_0_8px_rgba(37,99,235,0.8)]">
            Update Course Lecture
          </h2>
        </div>

        {/* Remove Lecture Button */}
        <button
          className="mt-2 mb-4 px-4 py-2 bg-red-900/70 text-red-400 border border-red-600/40 rounded-lg hover:bg-red-800 hover:text-white hover:shadow-[0_0_20px_rgba(220,38,38,0.6)] transition-all duration-300 text-sm"
          disabled={loading1}
          onClick={removeLecture}
        >
          {loading1 ? <ClipLoader size={30} color="white" /> : "Remove Lecture"}
        </button>

        {/* Form Fields */}
        <div className="space-y-5">
          {/* Lecture Title */}
          <div>
            <label className="block text-sm font-medium text-blue-300 mb-1">
              Lecture Title *
            </label>
            <input
              type="text"
              value={lectureTitle}
              onChange={(e) => setLectureTitle(e.target.value)}
              className="w-full bg-[#0B1324] border border-blue-500/40 text-blue-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-400 hover:border-blue-400 transition-all duration-300 placeholder-gray-500"
              placeholder="Enter lecture title..."
              required
            />
          </div>

          {/* Video Upload */}
          <div>
            <label className="block text-sm font-medium text-blue-300 mb-1">
              Video *
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideoUrl(e.target.files[0])}
              className="w-full border border-blue-500/40 rounded-xl p-2 text-sm text-blue-200 bg-[#0B1324] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-blue-900 file:text-white hover:file:bg-blue-800 cursor-pointer transition-all duration-300"
            />
          </div>

          {/* Free Preview Checkbox */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isFree"
              checked={isPreviewFree}
              onChange={() => setIsPreviewFree((prev) => !prev)}
              className="h-4 w-4 accent-blue-600 cursor-pointer"
            />
            <label htmlFor="isFree" className="text-sm text-blue-300">
              Is this lecture FREE?
            </label>
          </div>

          {loading && (
            <p className="text-sm text-gray-400 animate-pulse">
              Uploading Lecture... Please wait
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-6">
          <button
            disabled={loading}
            onClick={handleEditLecture}
            className="w-full py-3 rounded-lg bg-blue-900 text-white hover:bg-blue-800 shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.8)] transition-all duration-300 flex items-center justify-center text-sm font-medium"
          >
            {loading ? <ClipLoader size={30} color="white" /> : "Update Lecture"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditLecture;
