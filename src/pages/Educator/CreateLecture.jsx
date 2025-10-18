import React, { useEffect, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../../App";
import ClipLoader from "react-spinners/ClipLoader";
import { setLectureData } from "../../redux/lectureSlice";
import { toast } from "react-toastify";

function CreateLecture() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [lectureTitle, setLectureTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { lectureData } = useSelector((state) => state.lecture);

  const handleCreateLecture = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        serverUrl + `/api/course/createlecture/${courseId}`,
        { lectureTitle },
        { withCredentials: true }
      );
      dispatch(setLectureData([...lectureData, result.data.lecture]));
      setLoading(false);
      toast.success("Lecture created successfully");
      setLectureTitle("");
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    const getCourseLecture = async () => {
      try {
        const result = await axios.get(
          serverUrl + `/api/course/courselecture/${courseId}`,
          { withCredentials: true }
        );
        dispatch(setLectureData(result?.data.lectures));
      } catch (error) {
        console.log(error);
      }
    };
    getCourseLecture();
  }, []);

  return (
    <div className="min-h-screen bg-[#030712] text-white flex items-center justify-center p-4">
      <div className="bg-[#0A0F1C] w-full max-w-2xl rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.4)] border border-blue-500/40 p-6 hover:shadow-[0_0_35px_rgba(37,99,235,0.7)] transition-all duration-500">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <FaArrowLeftLong
            className="w-6 h-6 text-blue-400 hover:text-blue-300 cursor-pointer transition-all duration-300"
            onClick={() => navigate(`/editcourse/${courseId}`)}
          />
          <div>
            <h1 className="text-2xl font-semibold text-blue-400 drop-shadow-[0_0_8px_rgba(37,99,235,0.8)]">
              Add a New Lecture
            </h1>
            <p className="text-sm text-gray-400">
              Enter a title and add lectures to enhance your course content.
            </p>
          </div>
        </div>

        {/* Input */}
        <input
          type="text"
          placeholder="e.g Introduction to AI"
          className="w-full bg-[#0A0F1C] border border-blue-500/40 text-blue-300 rounded-xl px-4 py-3 mb-4 focus:outline-none focus:border-blue-400 hover:border-blue-400 transition-all duration-300 placeholder-gray-500"
          value={lectureTitle}
          onChange={(e) => setLectureTitle(e.target.value)}
        />

        {/* Buttons */}
        <div className="flex gap-4 mb-6">
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-500/40 text-blue-400 hover:bg-blue-900 hover:text-white transition-all duration-300"
            onClick={() => navigate(`/editcourse/${courseId}`)}
          >
            <FaArrowLeftLong />
            Back to course
          </button>

          <button
            className="px-5 py-2 rounded-lg bg-blue-900 text-white hover:bg-blue-800 transition-all duration-300 shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_rgba(37,99,235,0.8)]"
            onClick={handleCreateLecture}
            disabled={loading || !lectureTitle.trim()}
          >
            {loading ? <ClipLoader color="white" size={30} /> : "+ Add Lecture"}
          </button>
        </div>

        {/* Lecture List */}
        <div className="space-y-2">
          {lectureData?.map((lecture, index) => (
            <div
              key={index}
              className="bg-[#0B1324] rounded-xl flex justify-between items-center p-3 text-sm border border-blue-500/30 hover:shadow-[0_0_20px_rgba(37,99,235,0.6)] transition-all duration-300"
            >
              <span className="text-blue-300">
                {index + 1} : {lecture?.lectureTitle}
              </span>
              <FaEdit
                className="text-blue-400 hover:text-blue-300 cursor-pointer transition-all duration-300"
                onClick={() =>
                  navigate(`/editlecture/${courseId}/${lecture._id}`)
                }
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CreateLecture;
