import React, { useEffect, useRef, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import img from "../../assets/empty.jpg";
import { FaEdit } from "react-icons/fa";
import axios from "axios";
import { serverUrl } from "../../App";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";
import { setCourseData } from "../../redux/courseSlice";

function EditCourse() {
  const navigate = useNavigate();
  const { courseId } = useParams(); // getting couse id through prarams
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
    setBackendImage(file); // file path
    setFrontendImage(URL.createObjectURL(file)); // file url
  };

  const getCourseById = async () => {
    try {
      const result = await axios.get(
        serverUrl + `/api/course/getcourse/${courseId}`,
        { withCredentials: true }
      );
      setSelectedCourse(result.data);
      console.log(result.data);
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

      if (result?.data) {
        console.log(result.data);
        toast.success(result.data.message || "Course Updated Successfully");
        navigate("/courses");
      } else {
        toast.warn("Course update completed, but no response from server.");
      }
    } catch (error) {
      console.error("Edit course error:", error);
      if (error.response) {
        toast.error(error.response.data?.message || "Failed to update course");
      } else if (error.request) {
        toast.error("No response from server. Please try again later.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
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

      if (result && result.data) {
        const filterCourse = courseData.filter((c) => c._id !== courseId);
        dispatch(setCourseData(filterCourse));
        toast.success("Course Removed Successfully");
        navigate("/courses");
      } else {
        toast.warn("Course deletion did not return a response.");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to remove course");
    } finally {
      setLoading1(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 mt-10 bg-white rounded-lg shadow-md">
      {/* top part */}
      <div
        className="flex items-center justify-center gap-[20px] md:justify-between flex-col md:flex-row
       mb-6 relative"
      >
        <FaArrowLeftLong
          className="top-[-20%] md:top-[20%] absolute left-[0] md:left-[2%] w-[22px] h-[22px] cursor-pointer"
          onClick={() => navigate("/courses")}
        />

        <h2 className="text-2xl font-semibold md:pl-[60px]">
          Fill Course Information
        </h2>

        <div className="space-x2 space-y-2">
          <button className="bg-black text-white px-4 py-2 rounded-md"
            onClick={()=>navigate(`/createlecture/${selectedCourse?._id}`)}
          >
            Go to lecture
          </button>
        </div>
      </div>

      {/* info from*/}
      <div className="bg-gray-50 p-6 rounded-md">
        <h2>Basic Course Information</h2>

        <div className="flex gap-8 mb-6">
          {!isPublished ? (
            <button
              className="bg-green-100 text-green-600 px-4 py-2 rounded-md border-1 cursor-pointer"
              onClick={() => setIsPublished((prev) => !prev)}
            >
              Click to Publish
            </button>
          ) : (
            <button
              className="bg-red-100 text-red-600 px-4 py-2 rounded-md border-1 cursor-pointer"
              onClick={() => setIsPublished((prev) => !prev)}
            >
              Click to UnPublish
            </button>
          )}

          <button
            className="bg-red-500 text-white px-4 py-2 rounded-md border-1 cursor-pointer"
            onClick={handleRemoveCourse}
          >
            Click to Remove
          </button>
        </div>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label
              htmlFor="title"
              className="block text-md font-medium text-gray-700 mb-1"
            >
              Title
            </label>
            <input
              type="text"
              name=""
              id="title"
              className="w-full border px-4 py-2 rounded-md"
              placeholder="Course Title"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />
          </div>

          <div>
            <label
              htmlFor="subtitle"
              className="block text-md font-medium text-gray-700 mb-1"
            >
              Subtitle
            </label>
            <input
              type="text"
              name=""
              id="subtitle"
              className="w-full border px-4 py-2 rounded-md"
              placeholder="Course subtitle"
              onChange={(e) => setSubtitle(e.target.value)}
              value={subtitle}
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-md font-medium text-gray-700 mb-1"
            >
              Course Description
            </label>
            <textarea
              type="text"
              name=""
              id="description"
              className="w-full border px-4 py-2 rounded-md h-24 resize-none"
              placeholder="Course description"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
            ></textarea>
          </div>

          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
            {/* category */}
            <div className="flex-1">
              <label
                htmlFor="cat"
                className="block text-md font-medium text-gray-700 mb-1"
              >
                Select Course Category
              </label>
              <select
                id="cat"
                name="cat"
               
                aria-label="Select Category"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 
               focus:outline-none focus:ring-2 focus:ring-black focus:border-black 
               hover:border-gray-400 transition-colors duration-200 cursor-pointer"
                onChange={(e) => setCategory(e.target.value)}
                value={category}
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

            {/* level */}
            <div className="flex-1">
              <label
                htmlFor="des"
                className="block text-md font-medium text-gray-700 mb-1"
              >
                Select Course Level
              </label>
              <select
                id="des"
                name="des"
                
                aria-label="Select Level"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 
               focus:outline-none focus:ring-2 focus:ring-black focus:border-black 
               hover:border-blue-400 transition-colors duration-200 cursor-pointer"
                onChange={(e) => setLevel(e.target.value)}
                value={level}
              >
                <option value="" disabled>
                  -- Select Level --
                </option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            {/* price */}
            <div className="flex-1">
              <label
                htmlFor="price"
                className="block text-md font-medium text-gray-700 mb-1"
              >
                Couse Price (INR)
              </label>
              <input
                type="number"
                id="price"
                className="w-full border px-4 py-2 rounded-md"
                placeholder="₹"
                onChange={(e) => setPrice(e.target.value)}
                value={price}
              />
            </div>
          </div>
          <div>
            <label
              htmlFor=""
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Course Thumbnail
            </label>
            <input
              type="file"
              hidden
              ref={thumb}
              accept="image/*"
              onChange={handleThumbnail}
            />
          </div>
          <div className="relative w-[300px] h-[170px]">
            <img
              src={frontendImage}
              alt=""
              className="w-[100%] h-[100%] border-1 border-black rounded-[5px] cursor-pointer"
              onClick={() => thumb.current.click()}
            />
            <FaEdit
              className="w-[20px] h-[20px] absolute top-2 right-2 cursor-pointer"
              onClick={() => thumb.current.click()}
            />
          </div>

          <div className="flex items-center justify-start gap-8 ">
            <button
              className="bg-[#e9e8e8] hover:bg-red-200 text-black border-1 border-black
             cursor-pointer px-4 py-2 rounded-md"
              onClick={() => navigate("/courses")}
            >
              Cancel
            </button>

            <button
              className="bg-black text-white px-7 py-2 rounded-md hover:bg-gray-800 cursor-pointer"
              onClick={handleEditCourse}
            >
              {loading ? <ClipLoader size={30} color="white" /> : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditCourse;
