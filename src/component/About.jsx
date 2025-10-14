import React from "react";
import aboutImg from "../assets/about.png"; // replace with your image

function About() {
  return (
    <div className="w-full min-h-[60vh] lg:h-[70vh] bg-gradient-to-br from-[#000010] to-[#001133] text-white flex flex-col md:flex-row items-center justify-center gap-8 p-8 relative overflow-hidden">
      {/* Floating code particles */}
      {[...Array(20)].map((_, i) => (
        <span
          key={i}
          className="absolute text-blue-400 font-mono opacity-30 animate-float"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            fontSize: `${8 + Math.random() * 18}px`,
            animationDuration: `${3 + Math.random() * 5}s`,
          }}
        >
          {
            ["<>", "{}", "();", "/* */", "$", "const", "let"][
              Math.floor(Math.random() * 7)
            ]
          }
        </span>
      ))}

      {/* Image */}
      <div className="lg:w-1/3 md:w-1/2 w-full flex items-center justify-center relative">
        <div className="w-[80%] h-[80%] rounded-2xl overflow-hidden border-2 border-blue-400 shadow-[0_0_25px_rgba(0,150,255,0.5)]">
          <img
            src={aboutImg}
            alt="About"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Text Content */}
      <div className="lg:w-2/3 md:w-1/2 w-full flex flex-col items-start justify-center gap-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 drop-shadow-[0_0_10px_rgba(0,200,255,0.7)] ">
          About Us
        </h2>
        <p className="text-gray-300 text-lg md:text-xl leading-relaxed">
          We are dedicated to empowering learners with cutting-edge skills in
          technology, AI, and development. Our mission is to provide interactive
          courses, hands-on projects, and real-world insights that help you
          unlock your true potential and advance your career.
        </p>
        <ul className="text-gray-400 list-disc list-inside space-y-2 text-lg md:text-xl">
          <li>🌐 Learn cutting-edge technologies and frameworks</li>
          <li>💡 Work on hands-on projects to enhance your skills</li>
          <li>🚀 Boost your career with industry-relevant knowledge</li>
          <li>🤖 Explore AI, web development, and futuristic tech trends</li>
          <li>🎯 Join a community of passionate learners</li>
        </ul>
      </div>
    </div>
  );
}

export default About;
