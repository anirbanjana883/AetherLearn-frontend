import React, { useState } from "react";
import logo from "../assets/logo.png";
import { IoPersonCircleSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import { setUserData } from "../redux/userSlice";
import { toast } from "react-toastify";
import axios from "axios";
import { GiHamburgerMenu } from "react-icons/gi";
import { GiTireIronCross } from "react-icons/gi";

function Nav() {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [showHam, setShowHam] = useState(false);

  const handleLogOut = async () => {
    try {
      const result = await axios.get(serverUrl + "/api/auth/logout", {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      console.log(result.data);
      toast.success("Logout Successfully");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div>
      <div
        className="w-[100%] h-[70px] fixed top-0 px-[20px] py-[10px] flex items-center justify-between
        bg-[#00000047] z-10"
      >
        {/* logo */}
        <div className="lg:w-[20%] w-[40%] lg:pl-[50px]">
          <img
            src={logo}
            alt=""
            className="w-[60px] rounded-[5px] border-2 border-white"
          />
        </div>

        {/* logout + profile image */}
        <div className="w-[30%] lg:flex items-center justify-center gap-4 hidden">
          {/* profile image / default icon */}
          {userData ? (
            userData.photoUrl ? (
              <img
                src={userData.photoUrl}
                alt="profile"
                className="w-[50px] h-[50px] rounded-full object-cover cursor-pointer"
                onClick={() => setShow((prev) => !prev)}
              />
            ) : (
              <div
                className="w-[50px] h-[50px] rounded-full text-white flex items-center justify-center text-[20px]
      border-2 bg-black border-white cursor-pointer"
                onClick={() => setShow((prev) => !prev)}
              >
                {userData?.name.slice(0, 1).toUpperCase()}
              </div>
            )
          ) : (
            <IoPersonCircleSharp
              className="w-[50px] h-[50px] fill-white cursor-pointer"
              onClick={() => setShow((prev) => !prev)}
            />
          )}

          {userData?.role === "educator" && (
            <div
              className="px-[20px] py-[10px] border-2 border-white
                  bg-[black] text-white rounded-[10px] text-[18px] font-light cursor-pointer"
                  onClick={()=>{navigate("/dashboard")}}
            >
              Dashboard
            </div>
          )}
          {!userData ? (
            <span
              className="px-[20px] py-[10px] border-2 border-white
                 text-white rounded-[10px] text-[18px] font-light cursor-pointer
                 bg-[#000000d5] hover:bg-[#000000f0] transition"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          ) : (
            <span
              className="px-[20px] py-[10px] bg-white border-white
                 text-black rounded-[10px] shadow-sm shadow-black text-[18px]
                cursor-pointer"
              onClick={handleLogOut}
            >
              Logout
            </span>
          )}

          {/* pop up for profile  */}
          {show && (
            <div
              className="absolute top-[110%] right-[15%] flex flex-col items-center justify-center
    gap-3 text-[16px] rounded-lg bg-white px-4 py-3 border-2 border-black
    shadow-lg transition-all duration-300
    hover:border-gray-300 hover:bg-gray-100"
            >
              <span
                className="bg-black text-white px-6 py-2 rounded-2xl font-medium shadow-sm
      hover:bg-gray-700 transition-colors duration-300 cursor-pointer"
                onClick={() => navigate("/profile")}
              >
                My Profile
              </span>

              <span
                className="bg-black text-white px-6 py-2 rounded-2xl font-medium shadow-sm
      hover:bg-gray-700 transition-colors duration-300 cursor-pointer"
      onClick={()=>navigate("/mycourses")}
              >
                My Courses
              </span>
            </div>
          )}
        </div>
        {/* hambarger */}
        <GiHamburgerMenu
          className="w-[35px] h-[35px] lg:hidden fill-white cursor-pointer"
          onClick={() => setShowHam((prev) => !prev)}
        />

        {/* $$$$$$$$$$$$$$$$$$$  mobile version $$$$$$$$$$$$$$$$$$$$$$$ */}

        {/* left slider menu  when clcked on hamberger*/}
        <div
          className={`fixed top-0 left-0 w-[100vw] h-[100vh] bg-[#000000d6] flex items-center justify-center flex-col gap-5 z-10 lg:hidden 
    transition-transform duration-500 ease-in-out
    ${showHam ? "translate-x-0" : "-translate-x-full"}`}
        >
          <GiTireIronCross
            className="w-[32px] h-[32px] fill-white absolute top-5 right-[4%] cursor-pointer"
            onClick={() => setShowHam((prev) => !prev)}
          />

          {/* profile image  */}
          <div
            className="w-[50px] h-[50px] rounded-full text-white flex items-center justify-center text-[20px]
          border-2 bg-black border-white cursor-pointer"
          >
            {/* profile image / default icon */}
            {userData ? (
              userData.photoUrl ? (
                <img
                  src={userData.photoUrl}
                  alt="profile"
                  className="w-[50px] h-[50px] rounded-full object-cover cursor-pointer border-2 border-white"
                />
              ) : (
                <div
                  className="w-[50px] h-[50px] rounded-full text-white flex items-center justify-center text-[20px]
      border-2 bg-black border-white cursor-pointer"
                  onClick={() => setShow((prev) => !prev)}
                >
                  {userData?.name.slice(0, 1).toUpperCase()}
                </div>
              )
            ) : (
              <IoPersonCircleSharp className="w-[50px] h-[50px] fill-white cursor-pointer" />
            )}
          </div>

          {/* dashboard and my profile */}
          {/* my profile  */}
          <div
            className="w-[200px] h-[65px] border-2 border-white
                  bg-[black] flex items-center justify-center 
                   text-white rounded-[10px] text-[18px] font-light cursor-pointer"
            onClick={() => navigate("/profile")}
          >
            My Profile
          </div>
          {/* my couses */}
          <div
            className="w-[200px] h-[65px] border-2 border-white
                  bg-[black] flex items-center justify-center 
                   text-white rounded-[10px] text-[18px] font-light cursor-pointer"
                   onClick={()=>navigate("/mycourses")}
          >
            My Courses
          </div>
          {/* dashboard */}
          {userData?.role === "educator" && (
            <div
              className="w-[200px] h-[65px] border-2 border-white
                  bg-[black] flex items-center justify-center 
                   text-white rounded-[10px] text-[18px] font-light cursor-pointer"
                   onClick={()=>{navigate("/dashboard")}}
            >
              Dashboard
            </div>
          )}
          {!userData ? (
            <span
              className="w-[200px] h-[65px] border-2 border-white
                  bg-[black] flex items-center justify-center 
                   text-white rounded-[10px] text-[18px] font-light cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          ) : (
            <span
              className="w-[200px] h-[65px] border-2 border-white
                  bg-[black] flex items-center justify-center 
                   text-white rounded-[10px] text-[18px] font-light cursor-pointer"
              onClick={handleLogOut}
            >
              Logout
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default Nav;
