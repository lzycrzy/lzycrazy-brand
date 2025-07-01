import React, { useState } from "react";

const VideoStoryUploader = ({ onVideoSelected, overlayText, fontStyle }) => {
  const [videoSrc, setVideoSrc] = useState(null);

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
      onVideoSelected({
        type: "video",
        video: url,
        overlayText,
        fontStyle,
        user: "You",
        createdAt: Date.now(),
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-black px-4">
      {!videoSrc ? (
        <label className="cursor-pointer bg-blue-600 px-5 py-2 rounded text-white hover:bg-blue-700">
          Upload Video
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoUpload}
            className="hidden"
          />
        </label>
      ) : (
        <div className="relative w-[270px] h-[480px] bg-black rounded-xl overflow-hidden">
          <video
            src={videoSrc}
            controls
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          {overlayText && (
            <div
              className="absolute top-1/2 left-1/2 text-white text-xl font-bold text-center px-2"
              style={{
                transform: "translate(-50%, -50%)",
                fontFamily: fontStyle,
                pointerEvents: "none",
              }}
            >
              {overlayText}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoStoryUploader;
