import React, { useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../../api/axios.js";
import { useDispatch, useSelector } from "react-redux";
import { setLectureData } from "../../redux/lectureSlice";
import ClipLoader from "react-spinners/ClipLoader";

const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks to stay safe and fast

const NeonProgressBar = ({ progress, label }) => (
  <div className="w-full space-y-2 mt-4">
    <div className="flex justify-between items-end">
      <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest animate-pulse">
        {label}
      </span>
      <span className="text-sm font-mono text-blue-300">{progress}%</span>
    </div>
    <div className="relative w-full h-2 bg-gray-900 rounded-full border border-blue-900/30 overflow-hidden">
      <div
        className="absolute top-0 left-0 h-full bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,1)] transition-all duration-500 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  </div>
);

function EditLecture() {
  const { courseId, lectureId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { lectureData } = useSelector((state) => state.lecture);
  const selectedLecture = Array.isArray(lectureData) 
    ? lectureData.find((l) => l._id === lectureId)
    : null;

  const [lectureTitle, setLectureTitle] = useState(selectedLecture?.lectureTitle || "");
  const [videoFile, setVideoFile] = useState(null);
  const [isPreviewFree, setIsPreviewFree] = useState(selectedLecture?.isPreviewFree || false);
  
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");

  const uploadVideoInChunks = async (file) => {
    try {
      setStatusMessage("SYSTEM: INITIALIZING UPLINK...");
      const initRes = await API.post("/course/upload/initialize", { lectureId });
      const { uploadId } = initRes.data.data;

      const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

      for (let i = 0; i < totalChunks; i++) {
        const start = i * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, file.size);
        const chunk = file.slice(start, end);

        const formData = new FormData();
        // MATCHES YOUR BACKEND: chunkMulter.single("chunk")
        formData.append("chunk", chunk); 
        formData.append("uploadId", uploadId);
        formData.append("chunkIndex", i);

        setStatusMessage(`TRANSFERRING PACKET ${i + 1}/${totalChunks}`);
        await API.post("/course/upload/chunk", formData);
        
        setUploadProgress(Math.round(((i + 1) / totalChunks) * 100));
      }

      setStatusMessage("SYSTEM: STITCHING & HANDSHAKE...");
      await API.post("/course/upload/complete", {
        uploadId,
        totalChunks,
        lectureId
      });

      return true;
    } catch (error) {
      console.error("Uplink Error:", error);
      throw new Error("Data transmission failed. Check connection.");
    }
  };

  const handleEditLecture = async () => {
    if (!lectureTitle.trim()) return toast.error("Title is required");
    setLoading(true);

    try {
      // 1. Upload Video if selected
      if (videoFile) {
        await uploadVideoInChunks(videoFile);
      }

      // 2. Update Metadata (Title, Preview status)
      const res = await API.post(`/course/editlecture/${lectureId}`, {
        lectureTitle,
        isPreviewFree,
      });

      // 3. Update Redux
      const updatedLectures = lectureData.map((l) =>
        l._id === lectureId ? { ...l, ...res.data.data } : l
      );
      dispatch(setLectureData(updatedLectures));

      toast.success("Protocol Successful: Lecture Updated");
      navigate(-1); // Goes back to the CreateLecture/List page
    } catch (error) {
      toast.error(error.message || "Update Failed");
    } finally {
      setLoading(false);
      setUploadProgress(0);
      setStatusMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#0A0F1C] rounded-2xl p-8 border border-blue-500/40 shadow-[0_0_25px_rgba(37,99,235,0.2)]">
        
        <div className="flex items-center gap-4 mb-8">
          <FaArrowLeftLong
            className="w-6 h-6 text-blue-400 hover:text-blue-200 cursor-pointer transition-all"
            onClick={() => navigate(-1)}
          />
          <h2 className="text-2xl font-bold text-blue-400 tracking-tight uppercase">
            Edit Lecture <span className="text-blue-900">//</span>
          </h2>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-[10px] font-bold text-blue-300 uppercase mb-2 tracking-widest">Lecture Title</label>
            <input
              type="text"
              value={lectureTitle}
              onChange={(e) => setLectureTitle(e.target.value)}
              className="w-full bg-[#030712] border border-blue-900/50 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-all placeholder:text-gray-700"
              placeholder="Enter Lecture Title"
            />
          </div>

          <div className="p-6 border border-dashed border-blue-900/50 rounded-xl bg-blue-950/5">
            <label className="block text-[10px] font-bold text-blue-300 uppercase mb-3 tracking-widest text-center">Video Uplink (Optional)</label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files[0])}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
            />
          </div>

          {loading && videoFile && (
            <NeonProgressBar progress={uploadProgress} label={statusMessage} />
          )}

          <div className="flex items-center gap-3 py-2">
            <input
              type="checkbox"
              id="isFree"
              checked={isPreviewFree}
              onChange={() => setIsPreviewFree(!isPreviewFree)}
              className="h-5 w-5 accent-blue-500 bg-gray-900 border-blue-900 rounded"
            />
            <label htmlFor="isFree" className="text-sm text-blue-200 cursor-pointer select-none">
              Mark as Free Preview
            </label>
          </div>

          <button
            disabled={loading}
            onClick={handleEditLecture}
            className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs tracking-[0.2em] transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? <ClipLoader size={20} color="white" /> : "UPDATE_LECTURE_CORE"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditLecture;