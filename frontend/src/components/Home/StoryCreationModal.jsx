import React, { useRef, useState, useEffect } from "react";
import PhotoStoryUploader from "./PhotoStoryUploader";
import TextStoryEditor from "./TextStoryEditor";
import axios from '../../lib/axios/axiosInstance';
import instance from "../../lib/axios/axiosInstance";

const StoryCreationModal = ({ onClose, onSubmit, user }) => {
  const [mode, setMode] = useState(null);
  const fileInputRef = useRef(null);
  const photoUploaderRef = useRef(null);

  const [profileImage, setProfileImage] = useState(
    user?.profileImage || "https://i.pravatar.cc/150?u=you"
  );
  const [fontStyle, setFontStyle] = useState("sans-serif");
  const [bgColor, setBgColor] = useState("#ffb6c1");
  const [overlayText, setOverlayText] = useState("");
  const [textStoryContent, setTextStoryContent] = useState("");
  const [showFontDropdown, setShowFontDropdown] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);

  const fontOptions = [
    { label: "Clean", value: "sans-serif" },
    { label: "Classic", value: "serif" },
    { label: "Mono", value: "monospace" },
    { label: "Handwritten", value: "cursive" },
  ];

  const backgroundOptions = [
    "#1877F2", "#E1306C", "#FCAF45", "#8E44AD",
    "#FFC107", "#34A853", "#F28B82", "#FFB6C1",
    "#000000", "#ffffff",
  ];

  const getFontLabel = (value) =>
    fontOptions.find((f) => f.value === value)?.label || value;

  useEffect(() => {
    setOverlayText("");
    setTextStoryContent("");
    setVideoFile(null);
    setVideoPreview(null);
  }, [mode]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const handleShare = async () => {
    const createdAt = Date.now();
    const formData = new FormData();

    try {
      if (mode === "photo") {
        const story = await photoUploaderRef.current?.getFinalCroppedStory();
        if (!story || !story.file) {
          alert("No photo selected");
          return;
        }
        formData.append("image", story.file);
        formData.append("overlayText", overlayText);
        formData.append("fontStyle", fontStyle);
      } else if (mode === "video") {
        if (!videoFile) {
          alert("No video selected");
          return;
        }
        formData.append("media", videoFile);
        formData.append("overlayText", overlayText);
        formData.append("fontStyle", fontStyle);
      } else if (mode === "text") {
        if (!textStoryContent.trim()) {
          alert("Please enter text for your story");
          return;
        }
        formData.append("textContent", textStoryContent);
        formData.append("fontStyle", fontStyle);
        formData.append("backgroundColor", bgColor);
      }
console.log(formData)
      const res = await instance.post(
        '/v1/users/story',
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const storyData = res.data;
      onSubmit({ ...storyData, user: user?.name || "You", createdAt });
      setMode(null);
    } catch (err) {
      console.error("Error sharing story:", err);
      alert("Error uploading story");
    }
  };

  const handleDiscard = () => {
    setMode(null);
    setOverlayText("");
    setTextStoryContent("");
    setVideoFile(null);
    setVideoPreview(null);
  };

  return (
    <div className="fixed inset-0 z-[100] flex bg-[#f0f2f5] text-black">
      {/* Left Panel */}
      <div className="w-[360px] bg-white border-r flex flex-col justify-between shadow-md">
        <div>
          {/* Header */}
          <div className="flex items-center gap-2 p-4 border-b">
            <button onClick={onClose} className="text-2xl text-gray-600 hover:text-black">✕</button>
            <h2 className="text-lg font-semibold">Add to Story</h2>
          </div>

          {/* Profile */}
          <div className="p-4 flex items-center gap-3 border-b">
            <div>
              <img
                src={profileImage}
                alt="profile"
                className="w-12 h-12 rounded-full object-cover cursor-pointer"
                onClick={() => fileInputRef.current.click()}
              />
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
            <span className="font-medium text-md">{user?.name || "You"}</span>
          </div>

          {/* Controls */}
          {(mode === "photo" || mode === "video") && (
            <div className="p-4 border-b space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Add Text</label>
                <input
                  type="text"
                  value={overlayText}
                  onChange={(e) => setOverlayText(e.target.value)}
                  className="w-full border px-3 py-1 rounded"
                  placeholder="Write overlay text..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Font</label>
                <div className="relative">
                  <button
                    onClick={() => setShowFontDropdown(!showFontDropdown)}
                    className="w-full flex items-center justify-between px-3 py-2 border rounded text-left"
                    style={{ fontFamily: fontStyle }}
                  >
                    <span className="text-base">Aa {getFontLabel(fontStyle)}</span>
                    <span>▼</span>
                  </button>
                  {showFontDropdown && (
                    <div className="absolute z-10 mt-1 w-full border rounded bg-white shadow max-h-40 overflow-auto">
                      {fontOptions.map((font) => (
                        <div
                          key={font.value}
                          style={{ fontFamily: font.value }}
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setFontStyle(font.value);
                            setShowFontDropdown(false);
                          }}
                        >
                          Aa {font.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {mode === "text" && (
            <div className="p-4 border-b space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Font</label>
                <div className="relative">
                  <button
                    onClick={() => setShowFontDropdown(!showFontDropdown)}
                    className="w-full flex items-center justify-between px-3 py-2 border rounded text-left"
                    style={{ fontFamily: fontStyle }}
                  >
                    <span className="text-base">Aa {getFontLabel(fontStyle)}</span>
                    <span>▼</span>
                  </button>
                  {showFontDropdown && (
                    <div className="absolute z-10 mt-1 w-full border rounded bg-white shadow max-h-40 overflow-auto">
                      {fontOptions.map((font) => (
                        <div
                          key={font.value}
                          style={{ fontFamily: font.value }}
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setFontStyle(font.value);
                            setShowFontDropdown(false);
                          }}
                        >
                          Aa {font.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-1">Backgrounds</p>
                <div className="flex gap-2 flex-wrap">
                  {backgroundOptions.map((color) => (
                    <button
                      key={color}
                      onClick={() => setBgColor(color)}
                      className="w-8 h-8 rounded-full"
                      style={{
                        backgroundColor: color,
                        border: bgColor === color ? "2px solid black" : "",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {mode && (
          <div className="p-4 border-t flex gap-2">
            <button
              onClick={handleDiscard}
              className="flex-1 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Discard
            </button>
            <button
              onClick={handleShare}
              className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Share to Story
            </button>
          </div>
        )}
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center bg-[#f0f2f5]">
        {!mode && (
          <div className="flex gap-10">
            {["photo", "text", "video"].map((type) => (
              <div
                key={type}
                onClick={() => setMode(type)}
                className={`w-[200px] h-[300px] rounded-xl flex flex-col items-center justify-center text-white cursor-pointer shadow hover:scale-105 transition ${
                  type === "photo"
                    ? "bg-gradient-to-br from-blue-500 to-blue-300"
                    : type === "text"
                    ? "bg-gradient-to-br from-pink-500 to-purple-500"
                    : "bg-gradient-to-br from-gray-700 to-gray-500"
                }`}
              >
                <div className="bg-white text-black rounded-full w-12 h-12 flex items-center justify-center text-xl mb-3">
                  {type === "photo" ? "📷" : type === "text" ? "Aa" : "🎥"}
                </div>
                <p className="font-semibold">
                  Create a {type.charAt(0).toUpperCase() + type.slice(1)} Story
                </p>
              </div>
            ))}
          </div>
        )}

        {mode === "photo" && (
          <PhotoStoryUploader
            ref={photoUploaderRef}
            fontStyle={fontStyle}
            overlayText={overlayText}
          />
        )}

        {mode === "text" && (
          <TextStoryEditor
            fontStyle={fontStyle}
            bgColor={bgColor}
            text={textStoryContent}
            onChange={setTextStoryContent}
          />
        )}

        {mode === "video" && (
          <div className="flex flex-col items-center space-y-4">
            {!videoPreview ? (
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
                  src={videoPreview}
                  autoPlay
                  muted
                  loop
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
        )}
      </div>
    </div>
  );
};

export default StoryCreationModal;
