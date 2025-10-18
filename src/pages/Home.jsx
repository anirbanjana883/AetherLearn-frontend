import React, { useEffect, useState } from "react";
import Nav from "../component/Nav";
import { SiViaplay } from "react-icons/si";
import ai_w from "../assets/ai.png";
import Logos from "../component/Logos";
import ExploreCourses from "../component/ExploreCourses";
import CardPage from "../component/CardPage";
import { useNavigate } from "react-router-dom";
import About from "../component/About";
import Footer from "../component/Footer";
import ReviewPage from "../component/ReviewPage";

function Home() {
  const navigate = useNavigate();
  const [isHeroVisible, setIsHeroVisible] = useState(false);

  useEffect(() => {
    setIsHeroVisible(true);
  }, []);

  return (
    <div className="w-full bg-[#030712] text-white min-h-screen overflow-x-hidden flex flex-col justify-between">
      <div className="relative w-full min-h-screen flex flex-col justify-between p-4 pb-16 md:pb-8 overflow-hidden">


        {/* Nav component */}
        <div className="absolute top-0 left-0 w-full z-20">
          <Nav />
        </div>

        {/* TOP: AETHERLEARN Logo */}
<div className="relative z-10 flex flex-col items-center justify-start pt-20 sm:pt-24 md:pt-32 pb-4 flex-grow-0">
  <div
    className={`
      relative group cursor-pointer
      transition-all duration-1000 ease-out 
      ${isHeroVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-95"}
    `}
  >
    {/* Base Layer: The main, readable text */}
    <h1
      className={`
        relative text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black 
        tracking-wider md:tracking-[.25em] 
        text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-500
        drop-shadow-[0_0_25px_rgba(56,189,248,0.6)] 
        transition-all duration-300 ease-in-out
        group-hover:scale-105 group-hover:drop-shadow-[0_0_40px_rgba(56,189,248,1)]
      `}
    >
      AETHERLEARN
    </h1>


  </div>
</div>
        {/* MIDDLE: Robot Face - Styled exactly like the image provided */}
<div className="relative z-10 flex items-center justify-center flex-grow py-8 ">
  <div
    className={`
      relative w-48 h-48 md:w-56 md:h-56 rounded-[2.5rem] bg-gradient-to-br from-gray-800 via-gray-900 to-black 
      shadow-lg flex items-center justify-center border border-gray-700
      transition-all duration-1000 ease-out delay-200 
      animate-float group // Uses your .animate-float class 
      ${isHeroVisible ? "opacity-100 scale-100" : "opacity-0 scale-50"}
    `}
    style={{ 
      animationDuration: '6s', 
      boxShadow: 'inset 0px 8px 20px rgba(0,0,0,0.7), 0px 0px 40px rgba(37,99,235,0.4)' 
    }}
  >
    {/* Metallic Sheen Overlay */}
    <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-tl from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

    {/* Side "Antenna/Ears" - Now using theme color */}
    {/* Left Antenna */}
    <div className="absolute w-2 h-8 bg-gray-700 -left-2 top-1/3 rounded-l-md border-y border-l border-gray-600 transition-transform duration-200 group-hover:-translate-x-1 group-hover:rotate-[-5deg]">
        <div className="absolute top-1/2 -translate-y-1/2 right-1 w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_5px_rgba(34,211,238,1)]"></div>
    </div>
    {/* Right Antenna */}
    <div className="absolute w-2 h-8 bg-gray-700 -right-2 top-1/3 rounded-r-md border-y border-r border-gray-600 transition-transform duration-200 group-hover:translate-x-1 group-hover:rotate-[5deg]">
        <div className="absolute top-1/2 -translate-y-1/2 left-1 w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_5px_rgba(34,211,238,1)]"></div>
    </div>

    {/* Eyes - Now using theme colors */}
    <div className="absolute top-[35%] flex gap-5">
      {/* Left Eye */}
      <div className="relative w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
        <div className="absolute w-full h-full rounded-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8),0_0_30px_rgba(34,211,238,0.6)] transition-all duration-300 group-hover:shadow-[0_0_25px_rgba(59,130,246,1),0_0_50px_rgba(34,211,238,0.8)] animate-[pulse_2s_infinite]"></div>
        <div className="w-4 h-4 rounded-full bg-gray-900 border-2 border-cyan-300/50"></div>
      </div>
      {/* Right Eye */}
      <div className="relative w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
        <div className="absolute w-full h-full rounded-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8),0_0_30px_rgba(34,211,238,0.6)] transition-all duration-300 group-hover:shadow-[0_0_25px_rgba(59,130,246,1),0_0_50px_rgba(34,211,238,0.8)] animate-[pulse_2s_infinite_200ms]"></div>
        <div className="w-4 h-4 rounded-full bg-gray-900 border-2 border-cyan-300/50"></div>
      </div>
    </div>
    
    {/* Mouth - Now with a subtle blue glow */}
    <div className="absolute bottom-1/4 w-1/3 h-1 bg-gray-600 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.4)]"></div>
  </div>
</div>

        {/* BOTTOM: Dynamic Headlines and Action Buttons */}
        <div className="relative z-10 flex flex-col items-center justify-end text-center pt-4 flex-grow-0">
          <p
            className={`text-xl md:text-3xl lg:text-4xl font-bold text-slate-200 drop-shadow-lg transition-all duration-1000 ease-out delay-300
                      ${isHeroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            Elevate Your Skills, Unlock Your Potential
          </p>
          <p
            className={`mt-2 text-xl md:text-3xl lg:text-4xl font-bold text-blue-300 drop-shadow-lg transition-all duration-1000 ease-out delay-400
                      ${isHeroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            Explore Your Career Paths
          </p>

          <div
            className={`mt-10 flex flex-col sm:flex-row items-center justify-center gap-6 transition-all duration-1000 ease-out delay-500
                      ${isHeroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <button
              onClick={() => navigate("/allcourses")}
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-3 rounded-full text-lg font-bold bg-blue-600 text-white transition-all duration-300 overflow-hidden border-2 border-blue-600 hover:bg-blue-700 hover:shadow-[0_0_35px_-5px_rgba(37,99,235,0.9)] focus:outline-none focus:ring-4 focus:ring-blue-500/50"
            >
              <span className="relative z-10 flex items-center gap-3">
                View All courses
                <SiViaplay className="w-6 h-6 transition-transform duration-300 group-hover:scale-125" />
              </span>
            </button>

            <button
              onClick={() => navigate("/search")}
              className="group relative flex items-center justify-center gap-3 px-8 py-3 rounded-full text-lg font-bold bg-black/30 backdrop-blur-sm text-blue-300 border-2 border-blue-500/50 transition-all duration-300 hover:border-cyan-400 hover:text-white hover:shadow-[0_0_25px_rgba(56,189,248,0.6)] focus:outline-none focus:ring-4 focus:ring-cyan-500/50"
            >
              Search With AI
              <img
                src={ai_w}
                className="w-7 h-7 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110"
                alt="AI Search Icon"
              />
            </button>
          </div>
        </div>
      </div >

      {/* Your other components */}
      <Logos />
      <ExploreCourses />
      <CardPage />
      <About />
      <ReviewPage />
      <Footer />
    </div>
  );
}

export default Home;