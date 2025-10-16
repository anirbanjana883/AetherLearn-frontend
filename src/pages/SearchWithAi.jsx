import React, { useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import ai_w from "../assets/ai.png";
import { RiVoiceAiLine } from "react-icons/ri";
import { FaRobot } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { serverUrl } from "../App";
import click_snd from "../assets/start.mp3"




function SearchWithAi() {
    const startSount = new Audio(click_snd)
  const navigate = useNavigate();
  const [input, setInput] = useState();
  const [recommendation, setRecommendation] = useState([]);
  const [listening , setListening] = useState(false)

function speak(message) {
  if (!window.speechSynthesis) {
    console.warn("Speech synthesis not supported");
    return;
  }

  const utterance = new SpeechSynthesisUtterance(message);

  
  let voices = window.speechSynthesis.getVoices();

  
  if (!voices.length) {
    window.speechSynthesis.onvoiceschanged = () => {
      voices = window.speechSynthesis.getVoices();
      selectFemaleVoiceAndSpeak(utterance, voices);
    };
  } else {
    selectFemaleVoiceAndSpeak(utterance, voices);
  }
}


function selectFemaleVoiceAndSpeak(utterance, voices) {
  
  const femaleVoice = voices.find(v =>
    /samantha|zira|female/i.test(v.name)
  ) || voices.find(v => v.lang.startsWith("en")); 

  if (femaleVoice) {
    utterance.voice = femaleVoice;
  }

  utterance.lang = "en-US";
  utterance.rate = 1.5;   
  utterance.pitch = 1;  
  window.speechSynthesis.speak(utterance);
}



  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  const recognition = new SpeechRecognition();

  if (!recognition) {
    toast.error("Speech recognition not supported");
  }

const handleSearch = async () => {
    
  if (!recognition) return;
  setListening(true)

  const startSound = new Audio(click_snd); // create inside handler
  startSound.play().catch((err) => {
    console.warn("Audio play prevented:", err);
  });

  recognition.onresult = async (e) => {
    const transcript = e.results[0][0].transcript.trim();
    setInput(transcript);
    console.log("Speech result:", transcript);
    await hadleRecommendation(transcript);
  };

  recognition.start();
};


  const hadleRecommendation = async (query) => {
    
    try {
      const result = await axios.post(
        serverUrl + "/api/course/search",
        { input: query },
        { withCredentials: true }
      );
      console.log(result.data);
      setRecommendation(result.data);
      setListening(false)
      if(result.data.length > 0){
        speak("These are the top courses I found for you");
      }else{
        speak("I cannot find any courses for you");
      }
    } catch (error) {
    setListening(false)
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white flex flex-col items-center px-4 py-16">
      {/* Search Container */}
      <div className="bg-[#0f0f0f] shadow-neon rounded-3xl p-6 sm:p-10 w-full max-w-2xl text-center relative">
        {/* Back Arrow */}
        <FaArrowLeftLong className="text-cyan-400 w-6 h-6 sm:w-7 sm:h-7 cursor-pointer absolute top-6 left-6 hover:text-purple-400 transition-colors" 
          onClick={()=>navigate("/")}
        />

        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-100 mb-8 flex items-center justify-center gap-3">
          <FaRobot className="w-8 h-8 sm:w-10 sm:h-10" />
          Search With <span className="text-[#CB99C7] glow-text">AI</span>
        </h1>

        {/* Search Box */}
        <div className="flex items-center bg-gray-800 rounded-full overflow-hidden shadow-neonInput relative w-full">
          {/* Input */}
          <input
            type="text"
            className="flex-grow px-4 py-3 bg-transparent text-white placeholder-gray-400 focus:outline-none text-sm sm:text-base focus:ring-2 focus:ring-cyan-400 rounded-full transition-all"
            placeholder="What do you want to learn? (e.g. AI, Cloud, SpringBoot...)"
            onChange={(e) => setInput(e.target.value)}
            value={input}
          />

          {/* AI Button */}
          {
            input && 
            <button
              className="absolute right-14 sm:right-16 bg-gradient-to-r from-purple-600 to-cyan-400 hover:from-cyan-400 hover:to-purple-600 rounded-full w-10 h-10 flex items-center justify-center cursor-pointer shadow-glow transition-all"
              onClick={() => hadleRecommendation(input)}
            >
              <FaRobot className="w-8 h-8" />
            </button>
          }
          {/* Voice AI Button */}
          <button
            className="absolute right-2 bg-gradient-to-r from-purple-600 to-cyan-400 hover:from-cyan-400 hover:to-purple-600 rounded-full w-10 h-10 flex items-center justify-center cursor-pointer shadow-glow transition-all"
            onClick={handleSearch}
          >
            <RiVoiceAiLine className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {recommendation.length > 0 ? (
        <div className="w-full max-w-6xl mt-12 px-2 sm:px-4">
            <h1 className="text-xl sm:text-2xl font-semibold mb-6 text-white text-center">
                AI Search Results
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
                {
                    recommendation?.map((course,index)=>(
                        <div 
                        key={index}
                        className="bg-white tetx-black p-5 rounded-2xl shadow-md hover:shadow-indigo-500/30
                         transition-all duration-200 border border-gray-200 cursor-pointer hover:bg-gray-200"

                         onClick={()=>navigate(`/viewcourse/${course._id}`)}
                        >
                            <h2 className="text-lg text-black font-bold sm:text-xl">{course?.title}</h2>
                            <p className="tetx-sm text-gray-600 mt-1">{course?.category}</p>
                        </div>
                    ))
                }
            </div>

        </div>
      ):(
        listening? 
        <h1 className="text-center text-xl sm:text-2xl mt-10 text-gray-400">Listening ...</h1> 
        : 
        <h1 className="text-center text-xl sm:text-2xl mt-10 text-gray-400">No Courses Found</h1>
      )}
    </div>
  );
}

export default SearchWithAi;
