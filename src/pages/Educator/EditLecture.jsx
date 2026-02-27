import React, { useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../../api/axios.js";
import { useDispatch, useSelector } from "react-redux";
import { setLectureData } from "../../redux/lectureSlice";
import ClipLoader from "react-spinners/ClipLoader";

const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks matching your controller expectations

const NeonProgressBar = ({ progress, label }) => (
  <div className="w-full space-y-2 mt-4 animate-in fade-in duration-500">
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
      // Matches courseRouter.post("/uploads/init", ...)
      const initRes = await API.post("/course/uploads/init", { lectureId });
      const { uploadId } = initRes.data.data;

      const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

      for (let i = 0; i < totalChunks; i++) {
        const start = i * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, file.size);
        const chunk = file.slice(start, end);

        const formData = new FormData();
        // Key "chunk" matches your backend: chunkMulter.single("chunk")
        formData.append("chunk", chunk); 
        formData.append("uploadId", uploadId);
        formData.append("chunkIndex", i);

        setStatusMessage(`TRANSFERRING PACKET ${i + 1}/${totalChunks}`);
        // Matches courseRouter.post("/uploads/chunk", ...)
        await API.post("/course/uploads/chunk", formData);
        
        setUploadProgress(Math.round(((i + 1) / totalChunks) * 100));
      }

      setStatusMessage("SYSTEM: STITCHING & HANDSHAKE...");
      // Matches courseRouter.post("/uploads/complete", ...)
      await API.post("/course/uploads/complete", {
        uploadId,
        totalChunks,
        lectureId
      });

      return true;
    } catch (error) {
      console.error("Uplink Error:", error);
      throw new Error("Video transmission failed. Check server disk space.");
    }
  };

  const handleEditLecture = async () => {
    if (!lectureTitle.trim()) return toast.error("Title is required");
    setLoading(true);

    try {
      // 1. Chunked Video Upload (if file selected)
      if (videoFile) {
        await uploadVideoInChunks(videoFile);
      }

      // 2. Metadata Update (Title, Preview Status)
      // Matches courseRouter.patch("/lectures/:lectureId", ...)
      const res = await API.patch(`/course/lectures/${lectureId}`, {
        lectureTitle,
        isPreviewFree,
      });

      // 3. Update Redux State
      const updatedLectures = lectureData.map((l) =>
        l._id === lectureId ? { ...l, ...res.data.data } : l
      );
      dispatch(setLectureData(updatedLectures));

      toast.success("Update Successful: Background processing started.");
      navigate(-1); 
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
              className="w-full bg-[#030712] border border-blue-900/50 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-all placeholder:text-gray-700 font-medium"
              placeholder="e.g. Modular Architecture"
            />
          </div>

          <div className="p-6 border border-dashed border-blue-900/50 rounded-xl bg-blue-950/5">
            <label className="block text-[10px] font-bold text-blue-300 uppercase mb-3 tracking-widest text-center">Video Uplink (Replacer)</label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files[0])}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
            />
            <p className="text-[10px] text-gray-600 mt-2 text-center italic">Leave empty to keep existing video.</p>
          </div>

          {loading && videoFile && (
            <NeonProgressBar progress={uploadProgress} label={statusMessage} />
          )}

          <div className="flex items-center gap-3 py-2 bg-[#0d1425] p-3 rounded-lg border border-blue-900/20">
            <input
              type="checkbox"
              id="isFree"
              checked={isPreviewFree}
              onChange={() => setIsPreviewFree(!isPreviewFree)}
              className="h-5 w-5 accent-blue-500 bg-gray-900 border-blue-900 rounded"
            />
            <label htmlFor="isFree" className="text-sm text-blue-200 cursor-pointer select-none font-semibold">
              Enable Free Preview for this lecture
            </label>
          </div>

          <button
            disabled={loading}
            onClick={handleEditLecture}
            className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs tracking-[0.2em] transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? <ClipLoader size={20} color="white" /> : "EXECUTE_UPDATE_SEQUENCE"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditLecture;