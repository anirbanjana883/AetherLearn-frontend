import React, { useEffect, useRef, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import img from "../../assets/empty.jpg";
import axios from "axios";
import { serverUrl } from "../../App";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";
import { setCourseData } from "../../redux/courseSlice";

function EditCourse() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const [isPublished, setIsPublished] = useState(false);
  const thumb = useRef();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [price, setPrice] = useState("");
  const [frontendImage, setFrontendImage] = useState(img);
  const [backendImage, setBackendImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const { courseData } = useSelector((state) => state.course);

  const handleThumbnail = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const getCourseById = async () => {
    try {
      const result = await axios.get(
        serverUrl + `/api/course/getcourse/${courseId}`,
        { withCredentials: true }
      );
      setSelectedCourse(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (selectedCourse) {
      setTitle(selectedCourse.title || "");
      setSubtitle(selectedCourse.subtitle || "");
      setDescription(selectedCourse.description || "");
      setCategory(selectedCourse.category || "");
      setLevel(selectedCourse.level || "");
      setPrice(selectedCourse.price || "");
      setFrontendImage(selectedCourse.thumbnail || img);
      setIsPublished(selectedCourse?.isPublished);
    }
  }, [selectedCourse]);

  useEffect(() => {
    getCourseById();
  }, []);

  const handleEditCourse = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("subtitle", subtitle);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("level", level);
    formData.append("price", price);
    if (backendImage) formData.append("thumbnail", backendImage);
    formData.append("isPublished", isPublished);

    try {
      const result = await axios.post(
        `${serverUrl}/api/course/editcourse/${courseId}`,
        formData,
        { withCredentials: true }
      );

      const updatedData = result.data;
      if (updatedData.isPublished) {
        const updatedCourses = courseData.map((c) =>
          c._id === courseId ? updatedData : c
        );
        if (!courseData.some((c) => c._id === courseId)) {
          updatedCourses.push(updatedData);
        }
        dispatch(setCourseData(updatedCourses));
      } else {
        const filterCourse = courseData.filter((c) => c._id !== courseId);
        dispatch(setCourseData(filterCourse));
      }

      toast.success(result.data.message || "Course Updated Successfully");
      navigate("/courses");
    } catch (error) {
      console.error("Edit course error:", error);
      toast.error(error.response?.data?.message || "Failed to update course");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCourse = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this course?"
    );
    if (!confirmDelete) return;

    setLoading1(true);
    try {
      const result = await axios.delete(
        `${serverUrl}/api/course/remove/${courseId}`,
        { withCredentials: true }
      );

      if (result?.data) {
        const filterCourse = courseData.filter((c) => c._id !== courseId);
        dispatch(setCourseData(filterCourse));
        toast.success("Course Removed Successfully");
        navigate("/courses");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to remove course");
    } finally {
      setLoading1(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#030712]">
    <div className="max-w-5xl mx-auto p-6 mt-10 bg-[#0B0F1F] rounded-2xl  border border-blue-500 transition-all duration-00 drop-shadow-[0_0_10px_rgba(37,99,235,0.7)] hover:drop-shadow-[0_0_20px_rgba(37,99,235,1)]">
      {/* top part */}
      <div className="flex flex-col md:flex-row items-center md:items-start justify-between mb-6 relative">
        {/* Arrow */}
        <div className="absolute md:static left-0 top-0 md:top-auto md:mr-4">
          <FaArrowLeftLong
            className="w-6 h-6 text-blue-400 hover:text-blue-300 cursor-pointer transition-all duration-300"
            onClick={() => navigate("/courses")}
          />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-blue-400 md:ml-10 mt-2 md:mt-0 drop-shadow-[0_0_6px_rgba(37,99,235,0.7)]">
          Fill Course Information
        </h2>

        {/* Button */}
        <button
          className="bg-black border border-blue-500 text-blue-400 px-4 py-2 rounded-md hover:bg-blue-900 hover:text-white transition-all duration-300 mt-3 md:mt-0"
          onClick={() => navigate(`/createlecture/${selectedCourse?._id}`)}
        >
          Go to Lecture
        </button>
      </div>

      {/* info form */}
      <div className="bg-[#0A0F1C] p-6 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.4)] border border-blue-500">
        <h2 className="text-lg font-semibold text-blue-300 mb-4">
          Basic Course Information
        </h2>

        <div className="flex flex-col sm:flex-row sm:gap-4 gap-2 mb-6">
          {!isPublished ? (
            <button
              className="bg-green-900 text-green-400 px-4 py-2 rounded-md hover:bg-green-800 transition-colors duration-300"
              onClick={() => setIsPublished((prev) => !prev)}
            >
              Click to Publish
            </button>
          ) : (
            <button
              className="bg-red-900 text-red-400 px-4 py-2 rounded-md hover:bg-red-800 transition-colors duration-300"
              onClick={() => setIsPublished((prev) => !prev)}
            >
              Click to UnPublish
            </button>
          )}

          <button
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-all duration-300"
            onClick={handleRemoveCourse}
          >
            Remove Course
          </button>
        </div>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm font-medium text-blue-300 mb-1">
              Title
            </label>
            <input
              type="text"
              className="w-full border border-blue-500 bg-[#0B0F1F] text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Course Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-300 mb-1">
              Subtitle
            </label>
            <input
              type="text"
              className="w-full border border-blue-500 bg-[#0B0F1F] text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Course Subtitle"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-300 mb-1">
              Description
            </label>
            <textarea
              className="w-full border border-blue-500 bg-[#0B0F1F] text-white px-4 py-2 rounded-md h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Course description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-blue-300 mb-1">
                Category
              </label>
              <select
                className="w-full border border-blue-500 bg-[#0B0F1F] text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="" disabled>
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

            <div className="flex-1">
              <label className="block text-sm font-medium text-blue-300 mb-1">
                Level
              </label>
              <select
                className="w-full border border-blue-500 bg-[#0B0F1F] text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
              >
                <option value="" disabled>
                  -- Select Level --
                </option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-blue-300 mb-1">
                Price (INR)
              </label>
              <input
                type="number"
                className="w-full border border-blue-500 bg-[#0B0F1F] text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="₹"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-blue-300 mb-1">
              Course Thumbnail
            </label>
            <input
              type="file"
              hidden
              ref={thumb}
              accept="image/*"
              onChange={handleThumbnail}
            />
            <div className="relative w-[300px] h-[170px]">
              <img
                src={frontendImage}
                alt=""
                className="w-full h-full rounded-md cursor-pointer border border-blue-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.7)] transition-all duration-300"
                onClick={() => thumb.current.click()}
              />
              <FaEdit
                className="absolute top-2 right-2 w-5 h-5 text-blue-400 hover:text-blue-300 cursor-pointer"
                onClick={() => thumb.current.click()}
              />
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              className="bg-[#111827] border border-blue-500 text-blue-400 px-6 py-2 rounded-md hover:bg-blue-900 hover:text-white transition-all duration-300 cursor-pointer"
              onClick={() => navigate("/courses")}
            >
              Cancel
            </button>
            <button
              className="bg-black text-white px-6 py-2 rounded-md hover:bg-blue-800 transition-all duration-300 flex items-center justify-center gap-2"
              onClick={handleEditCourse}
            >
              {loading ? <ClipLoader size={25} color="white" /> : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>

    </div>
  );
}

export default EditCourse;
