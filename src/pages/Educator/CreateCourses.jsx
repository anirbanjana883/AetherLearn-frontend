import React, { useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../../App";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";
import axios from "axios";

function CreateCourses() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateCourse = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        serverUrl + "/api/course/create",
        { title, category },
        { withCredentials: true }
      );
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
      {/* Card */}
      <div className="relative w-full max-w-lg p-8 rounded-2xl bg-[#0A0F1C] border border-blue-500/40 shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_40px_rgba(37,99,235,0.7)] transition-all duration-500">

        {/* Back Arrow */}
        <FaArrowLeftLong
          className="absolute left-5 top-5 w-6 h-6 text-blue-400 hover:text-blue-300 cursor-pointer transition-all duration-300 hover:scale-110"
          onClick={() => navigate("/courses")}
        />

        {/* Title */}
        <h2 className="text-3xl font-semibold text-center mb-8 text-blue-400 drop-shadow-[0_0_8px_rgba(37,99,235,0.8)]">
          Create Course
        </h2>

        {/* Form */}
        <form
          className="space-y-6"
          onSubmit={(e) => e.preventDefault()}
        >
          {/* Course Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Course Title
            </label>
            <input
              type="text"
              id="title"
              placeholder="Enter Course Title"
              className="w-full bg-transparent border border-blue-500/40 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 placeholder-gray-500 hover:shadow-[0_0_10px_rgba(0,255,255,0.25)]"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />
          </div>

          {/* Course Category */}
          <div>
            <label
              htmlFor="cat"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Course Category
            </label>

            <select
              id="cat"
              name="cat"
              defaultValue=""
              aria-label="Select Category"
              className="w-full bg-black border border-blue-500/40 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 hover:shadow-[0_0_10px_rgba(0,255,255,0.25)] transition-all duration-300 cursor-pointer"
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="" disabled >
                -- Select Category --
              </option>
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

          {/* Submit Button */}
          <button
            className="w-full bg-black border border-blue-500 text-blue-400 px-4 py-2 rounded hover:bg-blue-900 hover:text-white transition-all duration-300 hover:shadow-[0_0_20px_rgba(37,99,235,0.6)]"
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
