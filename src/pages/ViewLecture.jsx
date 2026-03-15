import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaArrowLeftLong, FaChevronDown, FaCircleCheck } from "react-icons/fa6";
import { FaPlayCircle } from "react-icons/fa";
import { HiOutlineAcademicCap } from "react-icons/hi";
import API from "../api/axios.js";
import ModernVideoPlayer from "../component/ModernVideoPlayer";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";

function ViewLecture() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  // States
  const [course, setCourse] = useState(null);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurriculum = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/course/${courseId}/lectures`);
        const data = res.data.data;
        setCourse(data);

        if (data.sections?.length > 0) {
          setExpandedSections({ [data.sections[0]._id]: true });
          if (data.sections[0].lectures?.length > 0) {
            setSelectedLecture(data.sections[0].lectures[0]);
          }
        }
      } catch (error) {
        toast.error("Access denied or Course not found.");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchCurriculum();
  }, [courseId, navigate]);

  const toggleSection = (id) => {
    setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleVideoEnd = () => {
    console.log("Lecture completed. Handled by ModernVideoPlayer.");
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#030712]">
      <ClipLoader color="#3b82f6" size={50} />
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-[#030712] text-white flex flex-col lg:flex-row font-inter overflow-hidden">
      
      {/* 🎥 MAIN PLAYER AREA */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto custom-scrollbar">
        {/* Top Navbar */}
        <div className="p-4 md:px-8 py-4 flex items-center justify-between bg-[#030712]/80 backdrop-blur-md sticky top-0 z-30 border-b border-blue-500/10">
          <button onClick={() => navigate(-1)} className="flex items-center gap-3 text-blue-400 hover:text-blue-300 transition-all group">
            <div className="p-2 rounded-full bg-blue-500/10 border border-blue-500/20 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.4)]">
              <FaArrowLeftLong />
            </div>
            <span className="hidden md:block font-medium">Back to My Courses</span>
          </button>
          
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest truncate max-w-[200px] md:max-w-md">
            {course?.title}
          </h2>
        </div>

        {/* Video Screen */}
        <div className="px-4 md:px-8 py-4">
          <div className="w-full aspect-video bg-black rounded-3xl overflow-hidden border border-blue-500/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative ring-1 ring-white/5">
            {selectedLecture ? (
              <ModernVideoPlayer
                key={selectedLecture._id}
                src={selectedLecture.videoUrl || selectedLecture.rawVideoUrl}
                courseId={courseId}
                lectureId={selectedLecture._id}
                onEnded={handleVideoEnd}
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center gap-4 text-slate-500">
                <FaPlayCircle className="text-6xl opacity-20" />
                <p>Select a lesson from the curriculum</p>
              </div>
            )}
          </div>

          <div className="mt-8 mb-12">
            <h1 className="text-3xl md:text-4xl font-black text-white">
                {selectedLecture?.lectureTitle}
            </h1>
            <p className="text-slate-400 mt-4 max-w-3xl leading-relaxed text-lg italic">
                Enjoying the course? Keep going, you're doing great!
            </p>
          </div>
        </div>
      </div>

      {/* SIDEBAR: CURRICULUM & CREATOR */}
      <div className="w-full lg:w-[420px] bg-[#0A0F1C] border-l border-blue-500/10 h-screen flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.3)]">
        <div className="p-6 border-b border-blue-500/10 flex items-center justify-between bg-[#0A0F1C]">
          <h2 className="text-xl font-black text-blue-400 tracking-tight">Curriculum</h2>
          <HiOutlineAcademicCap className="text-blue-400 text-xl" />
        </div>

        {/* Curriculum List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {course?.sections?.map((section, sIdx) => (
            <div key={section._id} className="border-b border-white/5">
              <button
                onClick={() => toggleSection(section._id)}
                className={`w-full p-5 flex items-center justify-between transition-all ${expandedSections[section._id] ? 'bg-blue-500/5' : 'hover:bg-white/5'}`}
              >
                <div className="text-left">
                  <span className="text-[10px] text-blue-500 font-black uppercase tracking-widest opacity-70">Section {sIdx + 1}</span>
                  <h3 className="font-bold text-slate-200 text-sm">{section.sectionTitle}</h3>
                </div>
                <FaChevronDown className={`text-blue-500 text-xs transition-transform duration-300 ${expandedSections[section._id] ? "rotate-180" : ""}`} />
              </button>

              {expandedSections[section._id] && (
                <div className="bg-black/20">
                  {section.lectures?.map((lecture, lIdx) => (
                    <button
                      key={lecture._id}
                      onClick={() => setSelectedLecture(lecture)}
                      className={`w-full flex items-center gap-4 px-6 py-4 transition-all relative ${
                        selectedLecture?._id === lecture._id
                          ? "bg-blue-600/10 text-blue-300"
                          : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                      }`}
                    >
                      {selectedLecture?._id === lecture._id && <div className="absolute left-0 w-1 h-2/3 bg-blue-500 rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.8)]" />}
                      <div className="flex-1 text-left">
                        <p className="text-sm font-semibold">{lIdx + 1}. {lecture.lectureTitle}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* FIXED CREATOR SECTION */}
        <div className="p-6 bg-[#030712] border-t border-blue-500/20">
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm group hover:border-blue-500/30 transition-all">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img 
                  src={course?.creator?.profileImage || course?.creator?.photoUrl || "https://via.placeholder.com/150"} 
                  className="w-12 h-12 rounded-full object-cover border-2 border-blue-500/50 group-hover:scale-110 transition-transform" 
                  alt="Creator" 
                />
                <div className="absolute -bottom-1 -right-1 bg-blue-500 text-[10px] p-0.5 rounded-full border-2 border-[#0A0F1C]">
                  <FaCircleCheck className="text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-black text-white uppercase opacity-60">Instructor</h4>
                <p className="text-blue-400 text-sm font-bold truncate">{course?.creator?.name || "Educator"}</p>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-3 line-clamp-2 italic">
              "{course?.creator?.description || "Expert Educator at AetherLearn."}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewLecture;