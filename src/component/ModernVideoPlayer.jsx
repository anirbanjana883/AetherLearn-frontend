import React, { useRef, useState, useEffect } from "react";
import {
  FaPlay, FaPause, FaVolumeUp, FaVolumeMute,
  FaExpand, FaRedo, FaExclamationTriangle,
} from "react-icons/fa";
import { toast } from "react-toastify";
import API from "../api/axios.js"; // 🚨 ADDED: Import your API instance

// 🚨 ADDED: courseId and lectureId props
function ModernVideoPlayer({ src, courseId, lectureId, onEnded }) {
  const videoRef = useRef(null);
  const lastLoggedTimeRef = useRef(0); // 🚨 Tracks exact time for accurate deltas

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isBuffering, setIsBuffering] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");
  const [controlsVisible, setControlsVisible] = useState(true);
  const [videoEnded, setVideoEnded] = useState(false);

  // --- 💓 FAANG HEARTBEAT TELEMETRY ---
  useEffect(() => {
    let heartbeat;
    // Only run interval if video is actively playing and we have IDs
    if (isPlaying && courseId && lectureId) {
      heartbeat = setInterval(() => {
        const currentVideoTime = videoRef.current?.currentTime || 0;
        const delta = currentVideoTime - lastLoggedTimeRef.current;

        // Ensure delta is positive and less than 6 seconds (prevents Seek Cheating)
        if (delta > 0 && delta <= 6) {
          // 1. Sync Student Progress (Absolute Time to Redis)
          API.post("/progress/save", { 
            courseId, 
            lectureId, 
            watchTime: currentVideoTime 
          }).catch(() => {}); // Silent catch

          // 2. Track Educator Analytics (Watch Time Delta to Redis)
          API.post(`/analytics/${courseId}/telemetry`, { 
            courseId, 
            lectureId, 
            watchTimeDelta: delta 
          }).catch(() => {}); // Silent catch
        }
        
        // Update baseline for the next heartbeat
        lastLoggedTimeRef.current = currentVideoTime;
      }, 5000); // Fires every 5 seconds
    }

    return () => clearInterval(heartbeat);
  }, [isPlaying, courseId, lectureId]);

  // Reset baseline when source changes
  useEffect(() => {
    setHasError(false);
    setIsBuffering(true);
    lastLoggedTimeRef.current = 0; 
  }, [src]);

  const handleError = () => {
    setIsBuffering(false);
    setHasError(true);
    toast.error("Could not load video. The source may be invalid or blocked.");
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video || hasError) return;
    if (videoEnded) {
      video.currentTime = 0;
      setVideoEnded(false);
    }
    if (isPlaying) video.pause();
    else video.play();
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    setProgress((video.currentTime / video.duration) * 100);
    setCurrentTime(formatTime(video.currentTime));
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (video) setDuration(formatTime(video.duration));
  };

  const handleSeek = (e) => {
    const video = videoRef.current;
    if (!video) return;
    const newTime = (e.target.value / 100) * video.duration;
    video.currentTime = newTime;
    setProgress(e.target.value);
    
    // 🚨 ANTI-CHEAT: Reset baseline so they don't generate fake watch time when skipping
    lastLoggedTimeRef.current = newTime;
    
    if (videoEnded) setVideoEnded(false);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e) => {
    const vol = parseFloat(e.target.value);
    const video = videoRef.current;
    if (!video) return;
    video.volume = vol;
    setVolume(vol);
    setIsMuted(vol === 0);
  };

  const toggleFullscreen = async () => {
    const container = videoRef.current?.parentElement;
    if (!container) return;
    try {
      if (!document.fullscreenElement) {
        await container.requestFullscreen();
        if (screen.orientation && screen.orientation.lock) {
            await screen.orientation.lock("landscape").catch(() => {});
        }
      } else {
        await document.exitFullscreen();
        if (screen.orientation && screen.orientation.unlock) {
            screen.orientation.unlock();
        }
      }
    } catch (error) {
      console.error("Fullscreen failed:", error);
    }
  };

  const handleSpeedChange = (e) => {
    const rate = parseFloat(e.target.value);
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = rate;
    setPlaybackRate(rate);
  };

  const handleWaiting = () => setIsBuffering(true);
  const handlePlaying = () => {
      setIsPlaying(true);
      setIsBuffering(false);
  };
  const handlePause = () => setIsPlaying(false);

  // 🚨 ADDED: Auto-complete when video finishes
  const handleEnded = async () => {
    setIsPlaying(false);
    setVideoEnded(true);
    
    try {
      if (courseId && lectureId) {
        await API.post('/progress/complete', { courseId, lectureId });
        toast.success("Lecture Complete! 🎉");
      }
    } catch (error) {
      console.error("Failed to mark complete:", error);
    }

    if (onEnded) onEnded();
  };

  useEffect(() => {
    let timer;
    if (controlsVisible && isPlaying) {
      timer = setTimeout(() => setControlsVisible(false), 3000);
    }
    return () => clearTimeout(timer);
  }, [controlsVisible, isPlaying]);

  return (
    <div
      className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-xl group"
      onMouseMove={() => setControlsVisible(true)}
      onClick={() => setControlsVisible(true)}
    >
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-contain"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onWaiting={handleWaiting}
        onPlaying={handlePlaying}
        onPause={handlePause}
        onEnded={handleEnded}
        onError={handleError}
        onCanPlay={() => setIsBuffering(false)}
        onClick={(e) => { e.stopPropagation(); togglePlay(); }}
        playsInline
      />

      {/* ERROR OVERLAY */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-red-400 p-4 text-center">
          <FaExclamationTriangle className="text-4xl mb-3" />
          <p className="font-semibold text-lg">Video Unavailable</p>
        </div>
      )}

      {/* Center Play/Pause/Replay Button */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 pointer-events-none
                  ${!isPlaying && !isBuffering && !hasError ? 'opacity-100' : 'opacity-0'}`}
      >
        <button
          onClick={(e) => { e.stopPropagation(); togglePlay(); }}
          className="p-4 bg-black/40 backdrop-blur-sm rounded-full text-white text-4xl transition-transform hover:scale-110 focus:outline-none pointer-events-auto"
        >
          {videoEnded ? <FaRedo /> : <FaPlay />}
        </button>
      </div>

      {/* CONTROLS */}
      {!hasError && (
        <div
          className={`absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black/80 to-transparent flex flex-col gap-2
                      transition-opacity duration-300 ${controlsVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="range"
            min="0" max="100"
            value={progress || 0}
            onChange={handleSeek}
            className="w-full accent-blue-500 cursor-pointer"
          />

          <div className="flex items-center justify-between text-white text-sm">
            <div className="flex items-center gap-4">
              <button onClick={togglePlay} className="text-lg hover:scale-110 transition-transform">
                {isPlaying ? <FaPause /> : <FaPlay />}
              </button>
              <div className="flex items-center gap-2">
                <button onClick={toggleMute} className="text-lg hover:scale-110 transition-transform">
                  {isMuted || volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
                </button>
                <input
                  type="range" min="0" max="1" step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20 accent-cyan-500 cursor-pointer hidden sm:block"
                />
              </div>
              <span className="text-xs text-slate-300 font-mono">
                {currentTime} / {duration}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={playbackRate}
                onChange={handleSpeedChange}
                className="bg-transparent text-white border-none rounded-md text-xs font-semibold focus:outline-none"
              >
                {[0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => (
                  <option key={rate} value={rate} className="bg-gray-800">{rate}x</option>
                ))}
              </select>
              <button onClick={toggleFullscreen} className="text-lg hover:scale-110 transition-transform">
                <FaExpand />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BUFFERING SPINNER */}
      {isBuffering && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 pointer-events-none">
          <div className="w-10 h-10 border-4 border-t-blue-500 border-slate-700 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}

export default ModernVideoPlayer;