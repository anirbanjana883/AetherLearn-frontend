import React from "react";
import aboutImg from "../assets/about.png"; // replace with your image
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5"; // New icon for the list

function About() {
  return (
    <div className="w-full relative bg-[#030712] text-white flex flex-col lg:flex-row items-center justify-center gap-12 px-6 py-16 md:py-24 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 z-0">
        <div className="absolute w-[150%] h-[150%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle_farthest-corner,rgba(37,99,235,0.1)_0%,rgba(3,7,18,0)_60%)]"></div>
      </div>

      {/* Image with HUD Frame */}
      <div className="relative z-10 w-full max-w-md lg:w-1/3 flex items-center justify-center group">
        <div className="relative w-[90%] sm:w-[80%] aspect-square rounded-2xl p-2 border-2 border-blue-500/20 bg-black/30 backdrop-blur-sm">
          {/* Corner Brackets for HUD effect */}
          <div className="absolute -top-2 -left-2 w-10 h-10 border-t-2 border-l-2 border-cyan-400 rounded-tl-xl transition-all duration-300 group-hover:w-12 group-hover:h-12"></div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 border-b-2 border-r-2 border-cyan-400 rounded-br-xl transition-all duration-300 group-hover:w-12 group-hover:h-12"></div>
          <img
            src={aboutImg}
            alt="About AetherLearn"
            className="w-full h-full object-cover rounded-lg shadow-[0_0_30px_rgba(56,189,248,0.4)] transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </div>

      {/* Text Content */}
      <div className="relative z-10 w-full max-w-2xl lg:w-1/2 flex flex-col items-start justify-center gap-4 text-center lg:text-left items-center lg:items-start">
        <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-300 drop-shadow-[0_0_15px_rgba(37,99,235,0.5)]">
          About Us
        </h2>
        <p className="text-slate-300 text-base md:text-lg leading-relaxed mt-2">
          We are dedicated to empowering learners with cutting-edge skills in
          technology, AI, and development. Our mission is to provide interactive
          courses, hands-on projects, and real-world insights that help you
          unlock your true potential and advance your career.
        </p>
        <ul className="text-slate-200 space-y-3 text-base md:text-lg mt-4 w-full">
          {[
            "Learn cutting-edge technologies",
            "Work on hands-on projects",
            "Boost your career with relevant knowledge",
            "Explore AI and futuristic tech trends",
            "Join a community of passionate learners",
          ].map((item, i) => (
            <li key={i} className="flex items-center gap-3">
              <IoCheckmarkDoneCircleOutline className="text-cyan-400 text-2xl flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default About;