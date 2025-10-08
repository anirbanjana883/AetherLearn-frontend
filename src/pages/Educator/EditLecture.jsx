import React, { useState } from 'react';
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { serverUrl } from '../../App';
import { useDispatch, useSelector } from 'react-redux';
import { setLectureData } from '../../redux/lectureSlice';
import ClipLoader from 'react-spinners/ClipLoader';

function EditLecture() {
  const { courseId, lectureId } = useParams();
  const { lectureData } = useSelector(state => state.lecture);
  const selectedLecture = lectureData.find(lecture => lecture._id === lectureId);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [lectureTitle, setLectureTitle] = useState(selectedLecture?.lectureTitle || "");
  const [videoUrl, setVideoUrl] = useState(null);
  const [isPreviewFree, setIsPreviewFree] = useState(selectedLecture?.isPreviewFree || false);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);


  const handleEditLecture = async () => {
    if (!lectureTitle.trim()) {
      toast.error("Lecture title cannot be empty");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("lectureTitle", lectureTitle);
      if (videoUrl) formData.append("videoUrl", videoUrl);
      formData.append("isPreviewFree", isPreviewFree);

      const result = await axios.post(
        `${serverUrl}/api/course/editlecture/${lectureId}`,
        formData,
        { withCredentials: true }
      );

   
      const updatedLectures = lectureData.map(lecture =>
        lecture._id === lectureId ? result.data : lecture
      );
      dispatch(setLectureData(updatedLectures));

      toast.success("Lecture updated successfully!");
      navigate(`/createlecture/${courseId}`);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to update lecture");
    } finally {
      setLoading(false);
    }
  };

const removeLecture = async () => {
  setLoading1(true); 

  try {
    const result = await axios.delete(
      `${serverUrl}/api/course/removelecture/${lectureId}`,
      { withCredentials: true }
    );

    console.log(result.data);
    toast.success("Lecture removed successfully!");

    dispatch(setLectureData(lectureData.filter(l => l._id !== lectureId)));

    navigate(`/createlecture/${courseId}`);
  } catch (error) {
    console.log(error);
    toast.error(error.response?.data?.message || "Failed to remove lecture");
  } finally {
    setLoading1(false); 
  }
};

  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center p-4'>
      <div className='w-full max-w-xl bg-white rounded-xl shadow-lg p-6 space-y-6'>
        
        {/* Header */}
        <div className='flex items-center gap-2'>
          <FaArrowLeftLong
            className='text-gray-600 cursor-pointer'
            onClick={() => navigate(`/createlecture/${courseId}`)}
          />
          <h2 className='text-xl font-semibold text-gray-800'>
            Update Course Lecture
          </h2>
        </div>

        {/* Remove Lecture Button (not yet functional) */}
        <button
          className='mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all text-sm cursor-pointer'
          disabled={loading1}
          onClick={removeLecture}
        >
          {loading1 ? <ClipLoader size={30} color='white' /> : "Remove Lecture"}         
        </button>

        <div className='space-y-4'>
          {/* Lecture Title */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Lecture Title *
            </label>
            <input
              type="text"
              className='w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2
              focus:ring-black focus:outline-none'
              required
              value={lectureTitle}
              onChange={(e) => setLectureTitle(e.target.value)}
            />
          </div>

          {/* Video Upload */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Video *
            </label>
            <input
              type="file"
              className='w-full border border-gray-300 rounded-md p-2 file:mr-4 file:py-2
              file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-gray-700
              file:text-white hover:file:bg-gray-500 cursor-pointer'
              accept='video/*'
              onChange={(e) => setVideoUrl(e.target.files[0])}
            />
          </div>

          {/* Free Preview Checkbox */}
          <div className='flex items-center gap-3'>
            <input
              type="checkbox"
              className='accent-black h-4 w-4 cursor-pointer'
              id='isFree'
              checked={isPreviewFree}
              onChange={() => setIsPreviewFree(prev => !prev)}
            />
            <label htmlFor="isFree" className='text-sm text-gray-700'>
              Is this lecture FREE?
            </label>
          </div>

          {loading && <p className='text-sm text-gray-500'>Uploading Lecture... Please wait</p>}
        </div>

        {/* Submit Button */}
        <div className='pt-4'>
          <button
            className='w-full bg-black text-white py-3 rounded-md text-sm font-medium hover:bg-gray-700
              transition cursor-pointer flex items-center justify-center'
            disabled={loading}
            onClick={handleEditLecture}
          >
            {loading ? <ClipLoader size={30} color='white' /> : "Update Lecture"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditLecture;
