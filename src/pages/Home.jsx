import React from "react";
import Nav from "../component/Nav";
import home from "../assets/home1.jpeg";
import { SiViaplay } from "react-icons/si";
import ai_w from "../assets/ai.png"
import ai_b from "../assets/SearchAi.png"
import Logos from "../component/Logos";
import ExploreCourses from "../component/ExploreCourses";

function Home() {
  return (
    <div className="w-[100%] overflow-hidden">
      <div className="w-[100%] lg:h-[140vh] h-[70vh] relative">
        {/* nav componet  */}
        <Nav />
        {/* home image  */}
        <img
          src={home}
          className="object-cover md:object-fill w-[100%] lg:h-[100%] h-[50vh]"
          alt="home"
        />

        <span 
          className="lg:text-[70px] absolute md:text-[40px] lg:top-[10%] top-[15%] w-[100%] flex items-center justify-center text-white font-bold text-[18px]"
        >
          Elevate Your Skills, Unlock Your Potential
        </span>

        <span
          className="lg:text-[70px] text-[20px]  md:text-[40px] absolute lg:top-[18%] top-[20%] w-[100%] 
          flex items-center justify-center text-white font-bold "
        >
          Explore Your Career Paths
        </span>

        <div
          className="absolute lg:top-[30%] top-[75%] md:top-[80%] w-[100%] flex items-center justify-center gap-3 flex-wrap" 
        >
          <button
            className="px-[20px] py-[10px] border-2 lg:border-white border-black lg:text-white
            text-black rounded-[10px] text-[18px] font-light flex gap-2 cursor-pointer "
          >
            View All courses
            <SiViaplay className="w-[30px] h-[30px] lg:fill-white fill-black"/>
          </button>

          <button
            className="px-[20px] py-[10px] border-2 lg:bg-white bg-black lg:text-black
            text-white rounded-[10px] text-[18px] font-light flex gap-2 cursor-pointer items-center
            justify-center"
          >
            Search With AI
            <img src={ai_w}
              className="w-[30px] h-[30px] rounded-full hidden lg:block" 
             alt="" />

             <img src={ai_b}
              className="w-[40px] h-[40px] rounded-full lg:hidden" 
             alt="" />
          </button>
        </div>
      </div>
      {/* footers */}
       <Logos/>
       <ExploreCourses/>
    </div>
  );
}

export default Home;
