import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";

function Profile() {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#030712] text-white px-4 py-10 flex items-center justify-center font-inter">
      <div className="bg-[#0A0F1C] shadow-[0_0_25px_rgba(37,99,235,0.3)] hover:shadow-[0_0_45px_rgba(37,99,235,0.6)] rounded-2xl p-8 max-w-xl w-full relative border border-blue-500/40 transition-all duration-500">
        {/* Back button */}
        <FaArrowLeftLong
          className="absolute top-[5%] left-[5%] w-7 h-7 text-blue-400 cursor-pointer hover:scale-110 transition-transform"
          onClick={() => navigate("/")}
        />

        {/* Photo, Name, Role */}
        <div className="flex flex-col items-center text-center">
          {userData?.photoUrl ? (
            <img
              src={userData?.photoUrl}
              alt=""
              className="w-24 h-24 rounded-full object-cover border-4 border-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.7)]"
            />
          ) : (
            <div className="w-24 h-24 rounded-full flex items-center justify-center text-[50px] border-2 border-blue-500 bg-black text-blue-400 shadow-[0_0_10px_rgba(37,99,235,0.7)]">
              {userData?.name?.slice(0, 1).toUpperCase()}
            </div>
          )}

          <h2 className="text-2xl font-bold mt-4 text-blue-400 drop-shadow-[0_0_5px_rgba(37,99,235,0.9)]">
            {userData?.name}
          </h2>
          <p className="text-gray-400">{userData?.role}</p>
        </div>

        {/* Info Section */}
        <div className="mt-6 space-y-4 text-gray-300">
          <div className="flex items-center justify-start gap-2">
            <span className="text-blue-400">Email:</span>
            <span>{userData?.email}</span>
          </div>

          <div className="flex items-center justify-start gap-2">
            <span className="text-blue-400">Bio:</span>
            <span>{userData?.description}</span>
          </div>

          <div className="flex items-center justify-start gap-2">
            <span className="text-blue-400">Enrolled Courses:</span>
            <span>{userData?.enrolledCourses?.length || 0}</span>
          </div>
        </div>

        {/* Edit Profile Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => navigate("/editprofile")}
            className="px-5 py-2 rounded-md bg-black text-white hover:shadow-[0_0_15px_rgba(37,99,235,0.7)] transition-all duration-300"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
