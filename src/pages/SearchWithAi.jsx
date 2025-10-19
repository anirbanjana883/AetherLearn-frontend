import React, { useEffect, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { RiVoiceAiLine } from "react-icons/ri";
import { FaRobot, FaGhost } from "react-icons/fa6"; // Added FaGhost
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { serverUrl } from "../App";
import click_snd from "../assets/start.mp3";
import Card from "../component/Card"; // Using your consistent Card component

function SearchWithAi() {
  const startSound = new Audio(click_snd);
  const navigate = useNavigate();
  const [input, setInput] = useState(""); // Initialize as empty string
  const [recommendation, setRecommendation] = useState([]);
  const [listening, setListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  // --- Voice Synthesis Setup ---
  function speak(message) {
    if (!window.speechSynthesis) return;
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
    const femaleVoice = voices.find(v => /samantha|zira|female/i.test(v.name)) || voices.find(v => v.lang.startsWith("en"));
    if (femaleVoice) utterance.voice = femaleVoice;
    utterance.lang = "en-US";
    utterance.rate = 1.2;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  }

  // --- Voice Recognition Setup ---
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.onstart = () => setListening(true);
      recognitionInstance.onend = () => setListening(false);
      recognitionInstance.onresult = async (e) => {
        const transcript = e.results[0][0].transcript.trim();
        setInput(transcript);
        await handleRecommendation(transcript);
      };
      setRecognition(recognitionInstance);
    } else {
      toast.error("Speech recognition not supported in your browser.");
    }
  }, []);

  const handleVoiceSearch = () => {
    if (!recognition) return;
    startSound.play().catch(console.warn);
    recognition.start();
  };

  const handleRecommendation = async (query) => {
    if (!query) return;
    setListening(true); // Show loading/processing state
    try {
      const result = await axios.post(
        serverUrl + "/api/course/search",
        { input: query },
        { withCredentials: true }
      );
      setRecommendation(result.data);
      if (result.data.length > 0) {
        speak("These are the top courses I found for you.");
      } else {
        speak("Sorry, I could not find any courses matching your request.");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch recommendations.");
    } finally {
      setListening(false);
    }
  };

  return (
    <div className="w-full min-h-screen relative bg-[#030712] text-white flex flex-col items-center pt-24 sm:pt-32 pb-16 px-4">
      {/* Background Gradient */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_rgba(37,99,235,0.15)_0%,#030712_60%)]"></div>
      <button
          onClick={() => navigate("/")}
          className="absolute top-6 left-6 p-2 rounded-full bg-black/20 transition-colors hover:bg-blue-500/20 cursor-pointer"
        >
          <FaArrowLeftLong className="text-xl text-blue-400 w-10 h-10" />
        </button>


      {/* Main AI Search "Core" */}
      <div className="relative z-10 bg-slate-900/40 backdrop-blur-xl border border-blue-500/30 rounded-3xl p-6 sm:p-8 w-full max-w-2xl text-center shadow-[0_0_50px_rgba(59,130,246,0.4)]">
        
        <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-300 drop-shadow-[0_0_15px_rgba(59,130,246,0.6)] mb-8 flex items-center justify-center gap-3">
          <FaRobot className="text-cyan-400" />
          AI Course Search
        </h1>

        <div className="relative flex items-center">
          <input
            type="text"
            className="w-full pl-5 pr-28 py-4 bg-black/30 text-white placeholder-slate-400 border border-blue-500/40 rounded-full 
                       focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 transition-all duration-300"
            placeholder="What do you want to learn today?"
            onChange={(e) => setInput(e.target.value)}
            value={input}
            onKeyDown={(e) => e.key === 'Enter' && handleRecommendation(input)}
          />
          <div className="absolute right-2 flex items-center gap-1">
            {input && (
              <button
                className="p-3 bg-blue-600 rounded-full text-white transition-colors hover:bg-blue-500"
                onClick={() => handleRecommendation(input)}
              >
                <FaRobot className="text-xl" />
              </button>
            )}
            <button
              className={`p-3 rounded-full text-white transition-all duration-300 
                         ${listening ? 'bg-red-500 animate-pulse' : 'bg-cyan-500 hover:bg-cyan-400'}`}
              onClick={handleVoiceSearch}
            >
              <RiVoiceAiLine className="text-xl" />
            </button>
          </div>
        </div>
      </div>

      {/* Results or State Display */}
      <div className="w-full max-w-7xl mt-12 px-2 sm:px-4">
        {listening ? (
          <div className="flex flex-col items-center justify-center text-center py-16">
            <div className="flex items-center justify-center gap-2 h-10">
                <span className="w-2 h-4 bg-cyan-400 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                <span className="w-2 h-8 bg-cyan-400 rounded-full animate-pulse [animation-delay:-0.1s]"></span>
                <span className="w-2 h-4 bg-cyan-400 rounded-full animate-pulse"></span>
            </div>
            <h2 className="text-slate-300 font-semibold text-xl mt-4">Listening...</h2>
          </div>
        ) : recommendation.length > 0 ? (
          <>
            <h2 className="text-2xl font-bold text-slate-200 text-center mb-8">AI Search Results</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {recommendation.map((course,index) => (
                <div
                key={index}
                className="group relative bg-[#0A0F1C] rounded-2xl overflow-hidden shadow-[0_0_15px_rgba(37,99,235,0.3)] 
                           hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] transition-all duration-300 border border-blue-500/40 
                           hover:-translate-y-2 cursor-pointer flex flex-col"
              >
                <img src={course?.thumbnail} alt={course?.title} className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="p-5 flex flex-col flex-grow">
                  <span className="inline-block px-3 py-1 mb-3 bg-[#111827] text-blue-300 rounded-full text-xs font-medium border border-blue-500/50 w-fit">
                    {course?.category}
                  </span>
                  <h2 className="text-lg font-semibold text-blue-400 leading-tight line-clamp-2 h-14" title={course?.title}>
                    {course?.title}
                  </h2>
                  <p className="text-sm text-slate-400 mb-4">{course?.level}</p>
                  
                  {/* Explore Course Button */}
                  <button
                    className="w-full mt-auto px-4 py-3 bg-blue-600 border border-blue-600 text-white rounded-lg text-base font-semibold 
                               transition-all duration-300 hover:bg-blue-700 hover:shadow-[0_0_15px_rgba(59,130,246,0.8)] cursor-pointer"
                    onClick={() => navigate(`/viewcourse/${course._id}`)}
                  >
                    Explore Course
                  </button>
                </div>
              </div>
              ))}
            </div>
          </>
        ) : (
            <div className="flex flex-col items-center justify-center text-center py-16">
              <FaGhost className="text-cyan-500/20 text-8xl mb-6" />
              <h2 className="text-slate-300 font-semibold text-2xl">Awaiting Your Command</h2>
              <p className="text-slate-400 text-base mt-2 max-w-sm">
                Use the search bar or voice input to find the perfect course for you.
              </p>
            </div>
        )}
      </div>
    </div>
  );
}

export default SearchWithAi;