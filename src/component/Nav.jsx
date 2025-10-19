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

  const commonMobileLinkStyles =
    "text-3xl font-bold text-slate-200 transition-colors hover:text-cyan-300";
  const handleMobileNav = (path) => {
    navigate(path);
    setShowHam(false);
  };

  return (
    <>
      {/* ####### Desktop: The Sleek, Elongated Island ####### */}
      <div
        className="hidden lg:flex fixed top-4 left-1/2 -translate-x-1/2 items-center gap-6 p-2
                   bg-[#0A0F1C]/60 backdrop-blur-2xl border border-sky-300/30 rounded-full
                   transition-all duration-500 ease-in-out z-20
                   shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:shadow-[0_0_40px_rgba(37,99,235,0.5)]"
      >
        {/* Logo */}
        <img
          src={logo}
          alt="AetherLearn Logo"
          className="w-14 h-14 p-1 rounded-full cursor-pointer transition-all duration-300 
                     hover:shadow-[0_0_15px_rgba(56,189,248,0.8)] hover:scale-105"
          onClick={() => navigate("/")}
        />

        {/* Navigation Buttons (Always Visible) */}
        {userData?.role === "educator" && (
          <button
            className="px-6 py-2.5 rounded-full text-sm font-semibold bg-transparent border border-blue-500/60 text-blue-300 whitespace-nowrap
                       transition-all duration-300 hover:bg-blue-500/20 hover:text-white hover:border-blue-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.6)]"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </button>
        )}
        {userData?.role === "student" && (
          <button
            className="px-6 py-2.5 rounded-full text-sm font-semibold bg-transparent border border-blue-500/60 text-blue-300 whitespace-nowrap
                       transition-all duration-300 hover:bg-blue-500/20 hover:text-white hover:border-blue-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.6)]"
            onClick={() => navigate("/dashboardstudent")}
          >
            Dashboard
          </button>
        )}
        {!userData ? (
          <button
            className="px-6 py-2.5 rounded-full text-sm font-bold bg-transparent border border-cyan-500/50 whitespace-nowrap
                       text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400
                       transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] hover:border-cyan-400"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        ) : (
          <button
            className="px-6 py-2.5 rounded-full text-sm font-semibold bg-blue-600 border border-blue-600 text-white whitespace-nowrap
                       transition-all duration-300 hover:bg-blue-700 hover:shadow-[0_0_15px_rgba(59,130,246,0.8)]"
            onClick={handleLogOut}
          >
            Logout
          </button>
        )}

        {/* Profile Picture / Icon */}
        <div className="relative">
          <div
            className="cursor-pointer"
            onClick={() => setShow((prev) => !prev)}
          >
            {userData?.photoUrl ? (
              <img
                src={userData.photoUrl}
                alt="profile"
                className="w-14 h-14 rounded-full object-cover border-2 border-blue-500/50 transition-all duration-300 hover:border-cyan-400"
              />
            ) : userData ? (
              <div className="w-14 h-14 rounded-full text-white flex items-center justify-center text-xl font-bold border-2 border-blue-500/50 bg-gray-900 transition-all duration-300 hover:border-cyan-400">
                {userData.name.slice(0, 1).toUpperCase()}
              </div>
            ) : (
              <IoPersonCircleSharp className="w-14 h-14 text-slate-400 transition-colors duration-300 hover:text-cyan-400" />
            )}
          </div>
          {/* Profile Dropdown Menu */}
          {show && userData && (
            <div
              className="absolute top-[120%] right-0 w-48 flex flex-col items-start gap-1
                 bg-[#0A0F1C]/80 backdrop-blur-lg border border-blue-500/40 rounded-xl
                 p-2 shadow-[0_0_30px_rgba(37,99,235,0.4)] z-50" // <-- Added z-50
            >
              <button
                className="w-full text-left p-3 text-slate-200 text-sm font-medium rounded-md
                   transition-all duration-200 hover:bg-blue-500/10 hover:text-cyan-300 hover:pl-4"
                onClick={() => {
                  navigate("/profile");
                  setShow(false);
                }}
              >
                My Profile
              </button>
              <button
                className="w-full text-left p-3 text-slate-200 text-sm font-medium rounded-md
                   transition-all duration-200 hover:bg-blue-500/10 hover:text-cyan-300 hover:pl-4"
                onClick={() => {
                  navigate("/mycourses");
                  setShow(false);
                }}
              >
                My Courses
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ####### Mobile Navigation (Unchanged) ####### */}
      <div className="lg:hidden w-full h-20 fixed top-0 px-4 flex items-center justify-between bg-[#03012]/50 backdrop-blur-md border-b border-blue-500/20 z-20">
        <img
          src={logo}
          alt="Logo"
          className="w-14 rounded-md"
          onClick={() => navigate("/")}
        />
        <GiHamburgerMenu
          className="text-3xl text-cyan-400 cursor-pointer"
          onClick={() => setShowHam(true)}
        />
      </div>

      <div
        className={`fixed inset-0 w-full h-full bg-[#03012]/80 backdrop-blur-xl z-30 lg:hidden 
                   flex flex-col items-center justify-center gap-8
                   transition-transform duration-300 ease-in-out
                   ${showHam ? "translate-x-0" : "-translate-x-full"}`}
      >
        <GiTireIronCross
          className="text-4xl text-cyan-400 absolute top-6 right-5 cursor-pointer"
          onClick={() => setShowHam(false)}
        />
        {userData?.photoUrl ? (
          <img
            src={userData.photoUrl}
            alt="profile"
            className="w-20 h-20 rounded-full object-cover border-2 border-cyan-400"
          />
        ) : userData ? (
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold border-2 border-cyan-400 bg-gray-900">
            {userData.name.slice(0, 1).toUpperCase()}
          </div>
        ) : (
          <IoPersonCircleSharp className="w-20 h-20 text-slate-400" />
        )}

        {userData && (
          <>
            <button
              onClick={() => handleMobileNav("/profile")}
              className={commonMobileLinkStyles}
            >
              My Profile
            </button>
            <button
              onClick={() => handleMobileNav("/mycourses")}
              className={commonMobileLinkStyles}
            >
              My Courses
            </button>
          </>
        )}
        {userData?.role === "educator" && (
          <button onClick={() => handleMobileNav("/dashboard")} className={commonMobileLinkStyles}>Dashboard</button>
        )}
        {userData?.role === "student" && (
          <button onClick={() => handleMobileNav("/dashboardstudent")} className={commonMobileLinkStyles}>Dashboard</button>
        )}
        {!userData ? (
          <button
            onClick={() => handleMobileNav("/login")}
            className={commonMobileLinkStyles}
          >
            Login
          </button>
        ) : (
          <button
            onClick={() => {
              handleLogOut();
              setShowHam(false);
            }}
            className={commonMobileLinkStyles}
          >
            Logout
          </button>
        )}
      </div>
    </>
  );
}

export default Nav;
