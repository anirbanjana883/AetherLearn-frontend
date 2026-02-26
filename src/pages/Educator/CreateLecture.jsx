import React, { useEffect, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import API, { serverUrl } from "../../api/axios.js";
import ClipLoader from "react-spinners/ClipLoader";
import { setLectureData } from "../../redux/lectureSlice";
import { toast } from "react-toastify";

function CreateLecture() {
  const navigate = useNavigate();
  // Destructure BOTH courseId and sectionId from the URL
  const { courseId, sectionId } = useParams(); 

  const [currentSectionName, setCurrentSectionName] = useState("");
  
  const [lectureTitle, setLectureTitle] = useState("");
  const [loading, setLoading] = useState(false);
  
  const dispatch = useDispatch();
  const { lectureData } = useSelector((state) => state.lecture);

  // --- HANDLERS ---

  const handleCreateLecture = async () => {
    if (!lectureTitle.trim()) return toast.error("Title is required");
    
    setLoading(true);
    try {
      // Updated URL to include sectionId as per your backend router
      const result = await API.post(`/course/${sectionId}/lecture`,
        { lectureTitle }
      );
      
      // Accessing the new lecture from your backend response structure
      const newLecture = result.data.data;
      
      const currentLectures = Array.isArray(lectureData) ? lectureData : [];
      dispatch(setLectureData([...currentLectures, newLecture]));
      
      toast.success("Lecture created! Now upload the video.");
      setLectureTitle("");
      
      // Optional: Auto-navigate to the edit page to upload video immediately
      // navigate(`/editlecture/${courseId}/${newLecture._id}`);
      
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to create lecture");
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  const getCourseLectures = async () => {
    try {
      const result = await API.get(`/course/${courseId}/lectures`);
      
      const sections = result.data.data.sections; 
      
      if (sections) {
        const currentSection = sections.find(s => s._id === sectionId);

        setCurrentSectionName(currentSection.sectionTitle);
        // Only set the lectures that belong to THIS section
        dispatch(setLectureData(currentSection?.lectures || []));
      } else {
        // Fallback if backend structure is different
        dispatch(setLectureData(result.data.data.lectures || []));
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };
  
  if (courseId && sectionId) getCourseLectures();
}, [courseId, sectionId, dispatch]);

  return (
    <div className="min-h-screen bg-[#030712] text-white flex items-center justify-center p-4">
      <div className="bg-[#0A0F1C] w-full max-w-2xl rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.4)] border border-blue-500/40 p-8 hover:shadow-[0_0_35px_rgba(37,99,235,0.7)] transition-all duration-500">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <FaArrowLeftLong
            className="w-6 h-6 text-blue-400 hover:text-blue-300 cursor-pointer transition-all"
            onClick={() => navigate(`/editcourse/${courseId}`)}
          />
          <div>
            <h1 className="text-2xl font-bold text-blue-400 uppercase tracking-tight">
              Manage Lectures
            </h1>
            <p className="text-xs text-blue-500 mt-1 uppercase tracking-widest">
              Section ID: {sectionId?.slice(-6)}
              
            </p>
            <p className="text-xs text-blue-500 mt-1 uppercase tracking-widest">
              Section NAME: {currentSectionName}
              
            </p>
          </div>
        </div>

        {/* Create Input Area */}
        <div className="space-y-4 mb-10">
          <div className="relative">
            <input
              type="text"
              placeholder="e.g. 01. Introduction to the course"
              className="w-full bg-[#030712] border border-blue-500/20 text-blue-100 rounded-xl px-5 py-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-600"
              value={lectureTitle}
              onChange={(e) => setLectureTitle(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreateLecture()}
            />
          </div>

          <button
            className="w-full py-4 rounded-xl bg-blue-900/40 border border-blue-500/50 text-blue-100 font-bold text-sm hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            onClick={handleCreateLecture}
            disabled={loading || !lectureTitle.trim()}
          >
            {loading ? <ClipLoader color="white" size={20} /> : "INITIALIZE NEW LECTURE"}
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="h-[1px] flex-1 bg-blue-900/30"></div>
          <span className="text-[10px] font-bold text-blue-800 uppercase tracking-[0.3em]">Existing Curriculum</span>
          <div className="h-[1px] flex-1 bg-blue-900/30"></div>
        </div>

        {/* Lecture List */}
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {Array.isArray(lectureData) && lectureData.length > 0 ? (
            lectureData.map((lecture, index) => (
              <div
                key={lecture._id}
                className="group bg-[#0B1324]/50 rounded-xl flex justify-between items-center p-4 border border-blue-900/30 hover:border-blue-500/50 hover:bg-[#0B1324] transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-900/20 flex items-center justify-center text-blue-500 font-mono text-xs border border-blue-800/30">
                    {index + 1}
                  </div>
                  <span className="text-sm text-gray-300 group-hover:text-blue-200 transition-colors">
                    {lecture?.lectureTitle}
                  </span>
                </div>
                
                <button
                  onClick={() => navigate(`/editlecture/${courseId}/${lecture._id}`)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-900/20 text-blue-400 text-xs font-bold hover:bg-blue-600 hover:text-white transition-all"
                >
                  <FaEdit /> EDIT / UPLOAD
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-600 italic text-sm">No lectures found in this section.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreateLecture;