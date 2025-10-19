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

  const handleEditProfile = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      if (photoUrl) formData.append("photoUrl", photoUrl);

      const result = await axios.post(`${serverUrl}/api/user/profile`, formData, {
        withCredentials: true,
      });
      dispatch(setUserData(result.data));
      setLoading(false);
      navigate("/profile");
      toast.success("Profile updated successfully");
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030712] px-4 py-10 font-inter text-white">
      <FaArrowLeftLong
          className="absolute top-[5%] left-[5%] w-7 h-7 text-blue-400 cursor-pointer hover:scale-110 transition-transform "
          onClick={() => navigate("/profile")}
        />
      <div className="bg-[#0A0F1C] rounded-2xl shadow-[0_0_25px_rgba(37,99,235,0.3)] hover:shadow-[0_0_45px_rgba(37,99,235,0.6)] p-8 max-w-xl w-full relative border border-blue-500/40 transition-all duration-500">
        
        {/* Back button */}
        

        <h2 className="text-2xl font-bold text-center text-blue-400 drop-shadow-[0_0_5px_rgba(37,99,235,0.9)] mb-6">
          Edit Profile
        </h2>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
          {/* Profile Photo */}
          <div className="flex flex-col items-center text-center">
            {userData?.photoUrl ? (
              <img
                src={userData.photoUrl}
                alt=""
                className="w-24 h-24 rounded-full object-cover border-4 border-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.7)]"
              />
            ) : (
              <div className="w-24 h-24 rounded-full flex items-center justify-center text-[50px] border-2 border-blue-500 bg-black text-blue-400 shadow-[0_0_10px_rgba(37,99,235,0.7)]">
                {userData?.name?.slice(0, 1).toUpperCase()}
              </div>
            )}
          </div>

          {/* Avatar Upload */}
          <div>
            <label className="block text-sm font-medium text-blue-400 mb-2">Select Avatar</label>
            <div className="flex items-center gap-3">
              <input
                type="file"
                id="image"
                accept="image/*"
                className="hidden"
                onChange={(e) => setPhotoUrl(e.target.files[0])}
              />
              <label
                htmlFor="image"
                className="cursor-pointer px-4 py-2 bg-black text-white text-sm rounded-md hover:shadow-[0_0_10px_rgba(37,99,235,0.7)] transition"
              >
                Choose File
              </label>
              {photoUrl && <span className="text-sm text-gray-400 truncate max-w-[150px]">{photoUrl.name}</span>}
            </div>
          </div>

          {/* User Name */}
          <div>
            <label className="block text-sm font-medium text-blue-400 mb-1">User Name</label>
            <input
              type="text"
              placeholder={userData?.name}
              className="w-full px-4 py-2 rounded-md bg-[#030712] border border-blue-500/50 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-blue-400 mb-1">Email</label>
            <input
              readOnly
              type="text"
              placeholder={userData?.email}
              className="w-full px-4 py-2 rounded-md bg-[#0A0F1C] border border-blue-500/50 text-gray-400 text-sm cursor-not-allowed"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-blue-400 mb-1">Bio</label>
            <textarea
              rows={3}
              placeholder="Tell us about yourself..."
              className="w-full px-4 py-2 rounded-md bg-[#030712] border border-blue-500/50 text-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Save Button */}
          <button
            type="submit"
            onClick={handleEditProfile}
            disabled={loading}
            className="w-full bg-black py-2 rounded-md text-white font-medium hover:shadow-[0_0_15px_rgba(37,99,235,0.7)] transition-all duration-300"
          >
            {loading ? <ClipLoader size={30} color="white" /> : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;
