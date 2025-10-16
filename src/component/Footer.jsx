import React from "react";
import logo from "../assets/logo.png";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaGithub } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="w-full bg-[#050505] text-white py-10 px-6 sm:px-10 lg:px-20 border-t border-blue-500/30">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-start gap-10 lg:gap-20">
        {/* Brand & Description */}
        <div className="flex flex-col gap-4 max-w-md w-full">
          <div className="relative w-fit">
            {/* Logo */}
            <img
              src={logo}
              alt="AetherLearn Logo"
              className="h-10 rounded-[5px] relative z-20 mb-2"
            />

            {/* Brand Name with Glow */}
            <h2 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 drop-shadow-[0_0_10px_rgba(0,200,255,0.7)] relative z-20">
              AETHERLEARN
            </h2>

            {/* Glow Background */}
            <span className="absolute inset-0 rounded-[5px] bg-gradient-to-r from-blue-400 via-red-500 to-purple-500 opacity-40 blur-2xl animate-pulse -z-10"></span>
          </div>

          {/* Description */}
          <p className="text-gray-400 text-sm md:text-base leading-relaxed">
            Elevate your skills with futuristic, tech-inspired learning
            experiences. Join our community and stay ahead in the tech world.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-3 min-w-[150px]">
          <h3 className="text-lg font-semibold text-blue-400">Quick Links</h3>
          <ul className="flex flex-col gap-2 text-gray-400 text-sm md:text-base">
            <li
              className="hover:text-blue-300 transition cursor-pointer"
              onClick={() => navigate("/")}
            >
              Home
            </li>
            <li
              className="hover:text-blue-300 transition cursor-pointer"
              onClick={() => navigate("/allcourses")}
            >
              Courses
            </li>
            <li
              className="hover:text-blue-300 transition cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Login
            </li>
            <li className="hover:text-blue-300 transition cursor-pointer">
              Contact
            </li>
            <li className="hover:text-blue-300 transition cursor-pointer">
              Legal
            </li>
          </ul>
        </div>

        {/* Social Icons */}
        <div className="flex flex-col gap-3">
          <h3 className="text-lg font-semibold text-blue-400">Follow Us</h3>
          <div className="flex gap-5 mt-1">
            <FaFacebookF className="w-5 h-5 sm:w-6 sm:h-6 hover:text-blue-300 cursor-pointer transition-all hover:scale-110" />
            <FaTwitter className="w-5 h-5 sm:w-6 sm:h-6 hover:text-blue-300 cursor-pointer transition-all hover:scale-110" />
            <FaLinkedinIn className="w-5 h-5 sm:w-6 sm:h-6 hover:text-blue-300 cursor-pointer transition-all hover:scale-110" />
            <FaGithub className="w-5 h-5 sm:w-6 sm:h-6 hover:text-blue-300 cursor-pointer transition-all hover:scale-110" />
          </div>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="mt-10 text-center text-gray-500 text-xs sm:text-sm">
        &copy; {new Date().getFullYear()} AETHERLEARN Tech. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
