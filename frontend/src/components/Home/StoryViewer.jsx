import React, { useState, useEffect, useRef } from "react";
import "./StoryViewer.css";

const StoryViewer = ({ stories = [], initialIndex = 0, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(true);
  const timerRef = useRef(null);

  // Filter expired stories (24hr rule)
  const validStories = stories.filter(
    (story) => !story.createdAt || Date.now() - story.createdAt < 24 * 60 * 60 * 1000
  );

  const story = validStories[currentIndex];

  // Reset index when initialIndex changes
  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  // Auto advance story every 5s
  useEffect(() => {
    clearTimeout(timerRef.current);
    if (isPlaying) {
      timerRef.current = setTimeout(() => {
        handleNext();
      }, 5000);
    }
    return () => clearTimeout(timerRef.current);
  }, [currentIndex, isPlaying]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Prevent scroll behind story viewer
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % validStories.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + validStories.length) % validStories.length);
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  if (!validStories.length) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black bg-opacity-90 flex flex-col justify-between p-4 text-white select-none">
      {/* Top Controls */}
      <div className="flex justify-between items-center">
        <button
          className="text-3xl font-bold"
          onClick={onClose}
          aria-label="Close story viewer"
        >
          ×
        </button>

        {/* Progress Bar */}
        <div className="flex gap-1 flex-1 mx-4">
          {validStories.map((_, i) => (
            <div key={i} className="flex-1 h-1 bg-white/25 rounded overflow-hidden">
              <div
                className={`h-full ${
                  i < currentIndex
                    ? "bg-white w-full"
                    : i === currentIndex && isPlaying
                    ? "bg-white animate-story-progress"
                    : "bg-white w-0"
                }`}
              />
            </div>
          ))}
        </div>

        {/* Play/Pause */}
        <button
          className="text-2xl font-bold"
          onClick={togglePlayPause}
          aria-label={isPlaying ? "Pause story" : "Play story"}
        >
          {isPlaying ? "⏸" : "▶"}
        </button>
      </div>

      {/* Story Content */}
      <div className="flex-1 flex items-center justify-center relative cursor-pointer">
        {/* Click zones for next/prev */}
        <div className="flex absolute inset-0 z-10">
          <div className="flex-1" onClick={handlePrev} />
          <div className="flex-1" onClick={handleNext} />
        </div>

        {/* Text Story */}
        {story.type === "text" && (
          <div
            className="w-[360px] h-[640px] rounded-xl flex items-center justify-center px-4 text-white text-3xl text-center font-bold z-0"
            style={{
              backgroundColor: story.bgColor,
              fontFamily: story.fontStyle || "sans-serif",
              overflowWrap: "break-word",
              wordBreak: "break-word",
            }}
          >
            {story.text || "Your story text"}
          </div>
        )}

        {/* Photo Story */}
        {story.type === "photo" && (
          <div className="relative w-[360px] h-[640px] rounded-xl overflow-hidden z-0">
            <img
              src={story.image}
              alt={`${story.user || "User"}'s story`}
              className="w-full h-full object-cover"
            />
            {story.overlayText && (
              <div
                className="absolute top-1/2 left-1/2 text-white text-xl font-bold text-center px-2"
                style={{
                  transform: "translate(-50%, -50%)",
                  fontFamily: story.fontStyle || "sans-serif",
                  pointerEvents: "none",
                }}
              >
                {story.overlayText}
              </div>
            )}
          </div>
        )}

        {/* Video Story */}
        {story.type === "video" && (
          <div className="relative w-[360px] h-[640px] rounded-xl overflow-hidden bg-black flex items-center justify-center z-0">
            <video
              src={story.video}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-contain"
            />
            {story.overlayText && (
              <div
                className="absolute top-1/2 left-1/2 text-white text-xl font-bold text-center px-2"
                style={{
                  transform: "translate(-50%, -50%)",
                  fontFamily: story.fontStyle || "sans-serif",
                  pointerEvents: "none",
                }}
              >
                {story.overlayText}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StoryViewer;
