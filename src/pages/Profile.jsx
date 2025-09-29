import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";

function Profile() {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-xl w-full relative">
        <FaArrowLeftLong className="absolute top-[8%] left-[5%] w-[27px] h-[27px] cursor-pointer"
          onClick={()=>navigate("/")}
        />
        {/* photo name role */}
        <div className="flex flex-col items-center text-center">
          {/* user imagte  */}
          {userData?.photoUrl ?
          <img
            src={userData?.photoUrl}
            alt=""
            className="w-24 h-24 rounded-full object-cover border-4 border-[black]"
          />
          :
          <div className="w-24 h-24 rounded-full text-white flex items-center justify-center
          text-[50px] border-2 bg-black border-white">
            {userData?.name.slice(0, 1).toUpperCase()}
          </div>
          }
            {/* name */}
          <h2 className="text-2xl font-bold mt-4 text-gray-800">
            {userData?.name}
          </h2>
          {/* role */}
          <p className="text-sm text-gray-500">{userData.role}</p>
        </div>

        {/* info */}
        <div className="mt-6 space-y-4">
          {/* email */}
          <div className="text-sm flex items-center justify-start gap-1">
            <span>Email : </span>
            <span>{userData?.email}</span>
          </div>

            {/* bio */}
          <div className="text-sm flex items-center justify-start gap-1">
            <span>Bio : </span>
            <span>{userData?.description}</span>
          </div>

          {/* enrolled courses */}
          <div className="text-sm flex items-center justify-start gap-1">
            <span>Enrollesd Courses : </span>
            <span>{userData?.enrolledCourses?.length || 0}</span>
          </div>
        </div>
        {/* edit profile button */}
        <div className="mt-6 flex justify-center gap-4">
            <button className="px-5 py-2 rounded bg-black text-white active:bg-[#4b4b4b]
             cursor-pointer transition"
              onClick={()=>navigate("/editprofile")}
             >
              Edit Profile
            </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
