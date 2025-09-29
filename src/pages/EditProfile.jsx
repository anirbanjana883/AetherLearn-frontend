import React, { useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import { setUserData } from "../redux/userSlice";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";
import axios from "axios";

function EditProfile() {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  const [name, setName] = useState(userData.name || "");
  const [description, setDescription] = useState(userData.description || "");
  const [photoUrl, setPhotoUrl] = useState(null);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  // const fromData = new FormData();
  // fromData.append("name", name);
  // fromData.append("description", description);
  // fromData.append("photoUrl", photoUrl);

  const handleEditProfile = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      if (photoUrl) {
        formData.append("photoUrl", photoUrl); 
      }

      const result = await axios.post(
        serverUrl + "/api/user/profile",
        formData,
        { withCredentials: true }
      );
      dispatch(setUserData(result.data));
      setLoading(false);
      navigate("/");
      toast.success("Profile updated successfully");
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-xl w-full relative">
        <FaArrowLeftLong
          className="absolute top-[5%] left-[5%] w-[27px] h-[27px] cursor-pointer"
          onClick={() => navigate("/profile")}
        />

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Edit Profile
        </h2>

        <form
          action=""
          className="space-y-5"
          onSubmit={(e) => e.preventDefault()}
        >
          {/* photo of user */}
          <div className="flex flex-col items-center text-center">
            {userData?.photoUrl ? (
              <img
                src={userData?.photoUrl}
                alt=""
                className="w-24 h-24 rounded-full object-cover border-4 border-[black]"
              />
            ) : (
              <div
                className="w-24 h-24 rounded-full text-white flex items-center justify-center
          text-[50px] border-2 bg-black border-white"
              >
                {userData?.name.slice(0, 1).toUpperCase()}
              </div>
            )}
          </div>
          {/* Avatar Upload */}
          <div className="mb-4">
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Select Avatar
            </label>

            <div className="flex items-center gap-3">
              {/* Hidden Input */}
              <input
                type="file"
                id="image"
                name="photoUrl"
                accept="image/*"
                className="hidden"
                onChange={(e) => setPhotoUrl(e.target.files[0])}
              />

              {/* Custom Button */}
              <label
                htmlFor="image"
                className="cursor-pointer px-4 py-2 bg-black text-white text-sm rounded-md 
                 hover:bg-gray-800 transition"
              >
                Choose File
              </label>

              {/* File Name Display
              <span
                id="fileName"
                className="text-sm text-gray-500 truncate max-w-[200px]"
              >
                {photoUrl.name}
              </span> */}
            </div>
          </div>

          {/* User Name */}
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              User Name
            </label>
            <input
              id="name"
              type="text"
              placeholder={userData?.name}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm
               focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              readOnly
              type="text"
              placeholder={userData?.email}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm 
               bg-gray-100 text-gray-700 cursor-not-allowed"
            />
          </div>

          {/* Bio */}
          <div className="mb-4">
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Bio
            </label>
            <textarea
              id="bio"
              name="description"
              rows={3}
              placeholder="Tell us about yourself..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm resize-none
               focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
            />
          </div>
          <button
            className="w-full bg-[black] active:bg-[#454545] text-white py-2 rounded-md font-medium
             transition"
            disabled={loading}
            onClick={handleEditProfile}
          >
            {loading ? <ClipLoader size={30} color="white" /> : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;
