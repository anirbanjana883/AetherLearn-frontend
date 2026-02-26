import React, { useEffect, useRef, useState } from "react";
import { FaArrowLeftLong, FaPlus, FaVideo } from "react-icons/fa6";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import img from "../../assets/empty.jpg";
import API, { serverUrl } from "../../api/axios.js";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";
import { setCourseData } from "../../redux/courseSlice";

function EditCourse() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const thumb = useRef();

  // --- STATE ---
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const { courseData } = useSelector((state) => state.course);

  // Course Form State
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [price, setPrice] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [frontendImage, setFrontendImage] = useState(img);
  const [backendImage, setBackendImage] = useState("");

  // Curriculum State
  const [sections, setSections] = useState([]);
  const [showAddSection, setShowAddSection] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [sectionLoading, setSectionLoading] = useState(false);

  // --- HANDLERS ---

  const getCourseById = async () => {
    try {
      const result = await API.get(`/course/${courseId}`);
      setSelectedCourse(result.data.data);
      // Sync sections specifically
      setSections(result.data.data.sections || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch course details");
    }
  };

  useEffect(() => {
    getCourseById();
  }, [courseId]);

  useEffect(() => {
    if (selectedCourse) {
      setTitle(selectedCourse.title || "");
      setSubtitle(selectedCourse.subtitle || "");
      setDescription(selectedCourse.description || "");
      setCategory(selectedCourse.category || "");
      setLevel(selectedCourse.level || "");
      setPrice(selectedCourse.price || "");
      setFrontendImage(selectedCourse.thumbnail || img);
      setIsPublished(selectedCourse?.isPublished || false);
    }
  }, [selectedCourse]);

  const handleThumbnail = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackendImage(file);
      setFrontendImage(URL.createObjectURL(file));
      // console.log("Local Preview URL:", URL.createObjectURL(file));
    }
  };

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
      const result = await API.patch(`/course/${courseId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const updatedData = result.data.data;
      // console.log(updatedData)

      // Update Redux state logic
      const currentCourses = Array.isArray(courseData) ? courseData : [];
      const updatedCourses = currentCourses.map((c) =>
        c._id === courseId ? updatedData : c,
      );
      dispatch(setCourseData(updatedCourses));

      toast.success("Course Updated Successfully");
      navigate("/courses");
    } catch (error) {
      console.error("Edit course error:", error);
      toast.error(error.response?.data?.message || "Failed to update course");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSection = async () => {
    if (!newSectionTitle.trim())
      return toast.error("Section title is required");
    setSectionLoading(true);
    try {
      const res = await API.post(`/course/${courseId}/sections`, {
        sectionTitle: newSectionTitle,
      });
      setSections([...sections, res.data.data]);
      setNewSectionTitle("");
      setShowAddSection(false);
      toast.success("Section added successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add section");
    } finally {
      setSectionLoading(false);
    }
  };

  const handleRemoveCourse = async () => {
    if (!window.confirm("Are you sure you want to remove this course?")) return;
    setLoading1(true);
    try {
      const result = await API.delete(`/course/${courseId}`);
      if (result?.data?.success) {
        const currentCourses = Array.isArray(courseData) ? courseData : [];
        dispatch(
          setCourseData(currentCourses.filter((c) => c._id !== courseId)),
        );
        toast.success("Course Removed Successfully");
        navigate("/courses");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove course");
    } finally {
      setLoading1(false);
    }
  };

  // --- NEW HANDLERS ---

  const handleEditSection = async (sectionId, currentTitle) => {
    const newTitle = prompt("Enter new section title:", currentTitle);
    if (!newTitle || newTitle === currentTitle) return;

    try {
      // Matches your route: courseRouter.patch("/:courseId/sections/:sectionId")
      const res = await API.patch(`/course/${courseId}/sections/${sectionId}`, {
        sectionTitle: newTitle,
      });

      setSections((prev) =>
        prev.map((s) => (s._id === sectionId ? res.data.data : s)),
      );
      toast.success("Section updated");
    } catch (error) {
      toast.error("Failed to update section");
    }
  };

  const handleRemoveSection = async (sectionId) => {
    if (
      !window.confirm(
        "Danger: This will delete all lectures in this section. Continue?",
      )
    )
      return;

    try {
      // Matches your route: courseRouter.delete("/:courseId/sections/:sectionId")
      await API.delete(`/course/${courseId}/sections/${sectionId}`);

      // Update local state by filtering out the deleted section
      setSections((prev) => prev.filter((s) => s._id !== sectionId));
      toast.success("Section and lectures removed");
    } catch (error) {
      toast.error("Failed to remove section");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#030712] pb-20">
      <div className="max-w-5xl mx-auto p-6 mt-10 bg-[#0B0F1F] rounded-2xl border border-blue-500 transition-all duration-300 drop-shadow-[0_0_10px_rgba(37,99,235,0.7)]">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 relative">
          <div className="flex items-center gap-4">
            <FaArrowLeftLong
              className="w-6 h-6 text-blue-400 hover:text-blue-300 cursor-pointer transition-all"
              onClick={() => navigate("/courses")}
            />
            <h2 className="text-2xl font-semibold text-blue-400 drop-shadow-[0_0_6px_rgba(37,99,235,0.7)]">
              Edit Course
            </h2>
          </div>
        </div>

        {/* BASIC INFORMATION FORM */}
        <div className="bg-[#0A0F1C] p-6 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.4)] border border-blue-500">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-lg font-semibold text-blue-300">
              Basic Course Information
            </h2>
            <div className="flex gap-3">
              <button
                className={`${isPublished ? "bg-red-900 text-red-400" : "bg-green-900 text-green-400"} px-4 py-2 rounded-md text-sm font-medium hover:opacity-80 transition-all`}
                onClick={() => setIsPublished(!isPublished)}
              >
                {isPublished ? "Unpublish Course" : "Publish Course"}
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 disabled:opacity-50"
                onClick={handleRemoveCourse}
                disabled={loading1}
              >
                {loading1 ? "Removing..." : "Delete"}
              </button>
            </div>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-blue-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  className="w-full border border-blue-500 bg-[#0B0F1F] text-white px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-blue-300 mb-1">
                  Subtitle
                </label>
                <input
                  type="text"
                  className="w-full border border-blue-500 bg-[#0B0F1F] text-white px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-blue-300 mb-1">
                  Description
                </label>
                <textarea
                  className="w-full border border-blue-500 bg-[#0B0F1F] text-white px-4 py-2 rounded-md h-24 resize-none outline-none focus:ring-2 focus:ring-blue-400"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-300 mb-1">
                  Category
                </label>
                <select
                  className="w-full border border-blue-500 bg-[#0B0F1F] text-white px-4 py-2 rounded-md outline-none"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="Web Development">Web Development</option>
                  <option value="UI/UX Designing">UI/UX Designing</option>
                  <option value="App Development">App Development</option>
                  <option value="AI / ML">AI / ML</option>
                </select>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-blue-300 mb-1">
                    Level
                  </label>
                  <select
                    className="w-full border border-blue-500 bg-[#0B0F1F] text-white px-4 py-2 rounded-md outline-none"
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                  >
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
                    className="w-full border border-blue-500 bg-[#0B0F1F] text-white px-4 py-2 rounded-md outline-none"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
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
              <div className="relative w-[280px] h-[160px] group">
                <img
                  src={frontendImage}
                  className="w-full h-full rounded-md border border-blue-500 object-cover cursor-pointer group-hover:opacity-75 transition-all"
                  onClick={() => thumb.current.click()}
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none transition-all">
                  <FaEdit className="text-white text-2xl" />
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t border-gray-800">
              <button
                className="bg-black text-white px-8 py-2 rounded-md hover:bg-blue-800 transition-all flex items-center gap-2"
                onClick={handleEditCourse}
                disabled={loading}
              >
                {loading ? (
                  <ClipLoader size={20} color="white" />
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* --- CURRICULUM BUILDER --- */}
        <div className="bg-[#0A0F1C] p-6 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.4)] border border-blue-500 mt-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-blue-300">
              Course Curriculum
            </h2>
            <button
              onClick={() => setShowAddSection(!showAddSection)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-all text-sm"
            >
              {showAddSection ? (
                "Cancel"
              ) : (
                <>
                  <FaPlus /> Add Section
                </>
              )}
            </button>
          </div>

          {showAddSection && (
            <div className="flex gap-2 mb-6 p-4 bg-[#0B0F1F] rounded-lg border border-dashed border-blue-500">
              <input
                type="text"
                autoFocus
                className="flex-1 border border-blue-500 bg-[#030712] text-white px-4 py-2 rounded-md outline-none"
                placeholder="Section Title (e.g. Getting Started)"
                value={newSectionTitle}
                onChange={(e) => setNewSectionTitle(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddSection()}
              />
              <button
                onClick={handleAddSection}
                disabled={sectionLoading}
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {sectionLoading ? (
                  <ClipLoader size={18} color="white" />
                ) : (
                  "Add"
                )}
              </button>
            </div>
          )}

          <div className="space-y-4">
            {sections.length > 0 ? (
              sections.map((section, index) => (
                <div
                  key={section._id}
                  className="group border border-gray-800 p-4 rounded-lg bg-[#0B0F1F] hover:border-blue-500/50 transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">
                          Section {index + 1}
                        </span>
                        {/* EDIT SECTION TITLE BUTTON */}
                        <FaEdit
                          className="text-gray-500 hover:text-blue-400 cursor-pointer text-xs"
                          onClick={() =>
                            handleEditSection(section._id, section.sectionTitle)
                          }
                        />
                        {/* REMOVE SECTION BUTTON */}
                        <FaTrash
                          className="text-gray-500 hover:text-red-500 cursor-pointer text-xs"
                          onClick={() => handleRemoveSection(section._id)}
                        />
                      </div>
                      <h4 className="text-white font-medium text-lg mt-1">
                        {section.sectionTitle}
                      </h4>
                      <p className="text-[10px] text-gray-500 mt-1 uppercase">
                        {section.lectures?.length || 0} Lectures Attached
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        navigate(`/createlecture/${courseId}/${section._id}`)
                      }
                      className="flex items-center gap-2 bg-[#111827] border border-blue-900/50 text-blue-400 px-4 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition-all text-xs font-bold"
                    >
                      <FaVideo /> MANAGE CONTENT
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 border border-dashed border-blue-900/30 rounded-xl">
                <p className="text-gray-600 italic text-sm">
                  Curriculum is empty. Initialize your first section above.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditCourse;
