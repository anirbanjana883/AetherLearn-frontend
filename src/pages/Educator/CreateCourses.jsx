import React, { useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios.js";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";

function CreateCourses() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState(""); 
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateCourse = async () => {
    setLoading(true);
    try {
      // 2. Included subtitle in the API request body
      const result = await API.post("/course/", { 
        title, 
        category, 
        subtitle 
      });
      
      navigate("/courses");
      setLoading(false);
      toast.success("Course Created Successfully");
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030712] text-white px-4 py-10">
      <div className="relative w-full max-w-lg p-8 rounded-2xl bg-[#0A0F1C] border border-blue-500/40 shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_40px_rgba(37,99,235,0.7)] transition-all duration-500">
        
        <FaArrowLeftLong
          className="absolute left-5 top-5 w-6 h-6 text-blue-400 hover:text-blue-300 cursor-pointer transition-all duration-300 hover:scale-110"
          onClick={() => navigate("/courses")}
        />

        <h2 className="text-3xl font-semibold text-center mb-8 text-blue-400 drop-shadow-[0_0_8px_rgba(37,99,235,0.8)]">
          Create Course
        </h2>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          {/* Course Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
              Course Title
            </label>
            <input
              type="text"
              id="title"
              placeholder="e.g. Mastering React"
              className="w-full bg-transparent border border-blue-500/40 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 placeholder-gray-500"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />
          </div>

          <div>
            <label htmlFor="subtitle" className="block text-sm font-medium text-gray-300 mb-2">
              Course Subtitle
            </label>
            <input
              type="text"
              id="subtitle"
              placeholder="e.g. Build real-world applications from scratch"
              className="w-full bg-transparent border border-blue-500/40 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 placeholder-gray-500"
              onChange={(e) => setSubtitle(e.target.value)}
              value={subtitle}
            />
          </div>

          {/* Course Category */}
          <div>
            <label htmlFor="cat" className="block text-sm font-medium text-gray-300 mb-2">
              Course Category
            </label>
            <select
              id="cat"
              name="cat"
              value={category}
              className="w-full bg-black border border-blue-500/40 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer transition-all duration-300"
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="" disabled>-- Select Category --</option>
              <option value="Web Development">Web Development</option>
              <option value="UI/UX Designing">UI/UX Designing</option>
              <option value="App Development">App Development</option>
              <option value="Blockchain">Blockchain</option>
              <option value="AI / ML">AI / ML</option>
              <option value="Data Science">Data Science</option>
              <option value="Data Analytics">Data Analytics</option>
              <option value="Ethical Hacking">Ethical Hacking</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <button
            className="w-full bg-black border border-blue-500 text-blue-400 px-4 py-2 rounded hover:bg-blue-900 hover:text-white transition-all duration-300"
            onClick={handleCreateCourse}
          >
            {loading ? <ClipLoader size={28} color="white" /> : "Create Course"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateCourses;