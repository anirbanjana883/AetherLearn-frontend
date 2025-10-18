import React, { useRef, useState, useEffect } from "react";
import {
  FaPlay,
  FaPause,
  FaVolumeUp,
  FaVolumeMute,
  FaExpand,
} from "react-icons/fa";

function ModernVideoPlayer({ src }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isBuffering, setIsBuffering] = useState(false);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");
  const [controlsVisible, setControlsVisible] = useState(true);

  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
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
    const container = videoRef.current.parentElement;
    if (!container) return;

    try {
      if (!document.fullscreenElement) {
        // Enter fullscreen
        await container.requestFullscreen();
        // Lock to landscape (primarily for mobile)
        await screen.orientation.lock("landscape");
      } else {
        // Exit fullscreen
        await document.exitFullscreen();
        // Unlock orientation
        screen.orientation.unlock();
      }
    } catch (error) {
      console.error("Fullscreen or orientation lock failed:", error);
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
  const handlePlaying = () => setIsBuffering(false);


  useEffect(() => {
    if (!controlsVisible || !isPlaying) return;
    const timer = setTimeout(() => setControlsVisible(false), 3000);
    return () => clearTimeout(timer);
  }, [controlsVisible, isPlaying]);


  const handleTap = () => {
    setControlsVisible(true);
    if (!isPlaying) togglePlay();
  };

  return (
    <div
      className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-xl"
      onClick={handleTap}
    >
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-cover"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onWaiting={handleWaiting}
        onPlaying={handlePlaying}
      />

      {/* CONTROLS */}
      {controlsVisible && (
        <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col gap-2 transition-all duration-300">
          {/* Progress Bar */}
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleSeek}
            onClick={(e) => e.stopPropagation()} // stop tap play
            className="w-full accent-red-500 cursor-pointer"
          />

          {/* Bottom Row */}
          <div className="flex items-center justify-between text-white text-sm">
            {/* Left side */}
            <div className="flex items-center gap-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
                className="text-lg hover:scale-110 transition cursor-pointer"
              >
                {isPlaying ? <FaPause /> : <FaPlay />}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMute();
                }}
                className="text-lg hover:scale-110 transition"
              >
                {isMuted || volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
              </button>

              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={handleVolumeChange}
                onClick={(e) => e.stopPropagation()}
                className="w-20 accent-green-500 cursor-pointer"
              />

              <span className="text-xs text-gray-300">
                {currentTime} / {duration}
              </span>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <select
                value={playbackRate}
                onChange={handleSpeedChange}
                onClick={(e) => e.stopPropagation()}
                className="bg-gray-800 text-white border border-gray-600 rounded-md px-2 py-1 text-xs focus:ring-1 focus:ring-green-400"
              >
                <option className="bg-gray-800 text-white" value="0.5">0.5x</option>
                <option className="bg-gray-800 text-white" value="0.75">0.75x</option>
                <option className="bg-gray-800 text-white" value="1">1x</option>
                <option className="bg-gray-800 text-white" value="1.25">1.25x</option>
                <option className="bg-gray-800 text-white" value="1.5">1.5x</option>
                <option className="bg-gray-800 text-white" value="2">2x</option>
              </select>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFullscreen();
                }}
                className="text-lg hover:scale-110 transition"
              >
                <FaExpand />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BUFFERING SPINNER */}
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <div className="w-10 h-10 border-4 border-t-red-500 border-gray-700 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}

export default ModernVideoPlayer;
