import React, { useRef, useState, useEffect } from 'react';
import PhotoStoryUploader from './PhotoStoryUploader';
import TextStoryEditor from './TextStoryEditor';
import axios from '../../lib/axios/axiosInstance';
import instance from '../../lib/axios/axiosInstance';

const StoryCreationModal = ({ onClose, onSubmit, user }) => {
  const [mode, setMode] = useState(null);
  const fileInputRef = useRef(null);
  const photoUploaderRef = useRef(null);

  const [profileImage, setProfileImage] = useState(
    user?.profileImage || 'https://i.pravatar.cc/150?u=you',
  );
  const [fontStyle, setFontStyle] = useState('sans-serif');
  const [bgColor, setBgColor] = useState('#ffb6c1');
  const [overlayText, setOverlayText] = useState('');
  const [textStoryContent, setTextStoryContent] = useState('');
  const [showFontDropdown, setShowFontDropdown] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);

  const fontOptions = [
    { label: 'Clean', value: 'sans-serif' },
    { label: 'Classic', value: 'serif' },
    { label: 'Mono', value: 'monospace' },
    { label: 'Handwritten', value: 'cursive' },
  ];

  const backgroundOptions = [
    '#1877F2',
    '#E1306C',
    '#FCAF45',
    '#8E44AD',
    '#FFC107',
    '#34A853',
    '#F28B82',
    '#FFB6C1',
    '#000000',
    '#ffffff',
  ];

  const getFontLabel = (value) =>
    fontOptions.find((f) => f.value === value)?.label || value;

  useEffect(() => {
    setOverlayText('');
    setTextStoryContent('');
    setVideoFile(null);
    setVideoPreview(null);
  }, [mode]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
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
    const formData = new FormData();
  
    if (mode === 'photo') {
      const blob = await photoUploaderRef.current?.getFinalCroppedStory();
      if (!blob) {
        alert("No photo selected");
        return;
      }
  
      const file = new File([blob], `${Date.now()}-cropped.jpg`, { type: blob.type });
      formData.append("image", file);
      formData.append("overlayText", overlayText);
      formData.append("fontStyle", fontStyle);
    } else if (mode === 'video') {
      if (!videoFile) {
        alert("No video selected");
        return;
      }
  
      formData.append("media", videoFile);
      formData.append("overlayText", overlayText);
      formData.append("fontStyle", fontStyle);
    } else if (mode === 'text') {
      if (!textStoryContent.trim()) {
        alert("Please enter text for your story");
        return;
      }
  
      formData.append("textContent", textStoryContent);
      formData.append("fontStyle", fontStyle);
      formData.append("backgroundColor", bgColor);
    }
  
    // Debug
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
  
    // Send formData to parent for upload
    onSubmit(formData);
  
    // Close modal and reset
    setMode(null);
  };
  

  const handleDiscard = () => {
    setMode(null);
    setOverlayText('');
    setTextStoryContent('');
    setVideoFile(null);
    setVideoPreview(null);
  };

  return (
    <div className="fixed inset-0 z-[100] flex bg-[#f0f2f5] text-black">
      {/* Left Panel */}
      <div className="flex w-[360px] flex-col justify-between border-r bg-white shadow-md">
        <div>
          {/* Header */}
          <div className="flex items-center gap-2 border-b p-4">
            <button
              onClick={onClose}
              className="text-2xl text-gray-600 hover:text-black"
            >
              ✕
            </button>
            <h2 className="text-lg font-semibold">Add to Story</h2>
          </div>

          {/* Profile */}
          <div className="flex items-center gap-3 border-b p-4">
            <div>
              <img
                src={profileImage}
                alt="profile"
                className="h-12 w-12 cursor-pointer rounded-full object-cover"
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
            <span className="text-md font-medium">{user?.name || 'You'}</span>
          </div>

          {/* Controls */}
          {(mode === 'photo' || mode === 'video') && (
            <div className="space-y-4 border-b p-4">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Add Text
                </label>
                <input
                  type="text"
                  value={overlayText}
                  onChange={(e) => setOverlayText(e.target.value)}
                  className="w-full rounded border px-3 py-1"
                  placeholder="Write overlay text..."
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Font</label>
                <div className="relative">
                  <button
                    onClick={() => setShowFontDropdown(!showFontDropdown)}
                    className="flex w-full items-center justify-between rounded border px-3 py-2 text-left"
                    style={{ fontFamily: fontStyle }}
                  >
                    <span className="text-base">
                      Aa {getFontLabel(fontStyle)}
                    </span>
                    <span>▼</span>
                  </button>
                  {showFontDropdown && (
                    <div className="absolute z-10 mt-1 max-h-40 w-full overflow-auto rounded border bg-white shadow">
                      {fontOptions.map((font) => (
                        <div
                          key={font.value}
                          style={{ fontFamily: font.value }}
                          className="cursor-pointer px-3 py-2 hover:bg-gray-100"
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

          {mode === 'text' && (
            <div className="space-y-4 border-b p-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Font</label>
                <div className="relative">
                  <button
                    onClick={() => setShowFontDropdown(!showFontDropdown)}
                    className="flex w-full items-center justify-between rounded border px-3 py-2 text-left"
                    style={{ fontFamily: fontStyle }}
                  >
                    <span className="text-base">
                      Aa {getFontLabel(fontStyle)}
                    </span>
                    <span>▼</span>
                  </button>
                  {showFontDropdown && (
                    <div className="absolute z-10 mt-1 max-h-40 w-full overflow-auto rounded border bg-white shadow">
                      {fontOptions.map((font) => (
                        <div
                          key={font.value}
                          style={{ fontFamily: font.value }}
                          className="cursor-pointer px-3 py-2 hover:bg-gray-100"
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
                <p className="mb-1 text-sm font-medium">Backgrounds</p>
                <div className="flex flex-wrap gap-2">
                  {backgroundOptions.map((color) => (
                    <button
                      key={color}
                      onClick={() => setBgColor(color)}
                      className="h-8 w-8 rounded-full"
                      style={{
                        backgroundColor: color,
                        border: bgColor === color ? '2px solid black' : '',
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
          <div className="flex gap-2 border-t p-4">
            <button
              onClick={handleDiscard}
              className="flex-1 rounded bg-gray-200 py-2 hover:bg-gray-300"
            >
              Discard
            </button>
            <button
              onClick={handleShare}
              className="flex-1 rounded bg-blue-600 py-2 text-white hover:bg-blue-700"
            >
              Share to Story
            </button>
          </div>
        )}
      </div>

      {/* Right Panel */}
      <div className="flex flex-1 items-center justify-center bg-[#f0f2f5]">
        {!mode && (
          <div className="flex gap-10">
            {['photo', 'text', 'video'].map((type) => (
              <div
                key={type}
                onClick={() => setMode(type)}
                className={`flex h-[300px] w-[200px] cursor-pointer flex-col items-center justify-center rounded-xl text-white shadow transition hover:scale-105 ${
                  type === 'photo'
                    ? 'bg-gradient-to-br from-blue-500 to-blue-300'
                    : type === 'text'
                      ? 'bg-gradient-to-br from-pink-500 to-purple-500'
                      : 'bg-gradient-to-br from-gray-700 to-gray-500'
                }`}
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl text-black">
                  {type === 'photo' ? '📷' : type === 'text' ? 'Aa' : '🎥'}
                </div>
                <p className="font-semibold">
                  Create a {type.charAt(0).toUpperCase() + type.slice(1)} Story
                </p>
              </div>
            ))}
          </div>
        )}

        {mode === 'photo' && (
          <PhotoStoryUploader
            ref={photoUploaderRef}
            fontStyle={fontStyle}
            overlayText={overlayText}
          />
        )}

        {mode === 'text' && (
          <TextStoryEditor
            fontStyle={fontStyle}
            bgColor={bgColor}
            text={textStoryContent}
            onChange={setTextStoryContent}
          />
        )}

        {mode === 'video' && (
          <div className="flex flex-col items-center space-y-4">
            {!videoPreview ? (
              <label className="cursor-pointer rounded bg-blue-600 px-5 py-2 text-white hover:bg-blue-700">
                Upload Video
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="relative h-[480px] w-[270px] overflow-hidden rounded-xl bg-black">
                <video
                  src={videoPreview}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="h-full w-full object-cover"
                />
                {overlayText && (
                  <div
                    className="absolute top-1/2 left-1/2 px-2 text-center text-xl font-bold text-white"
                    style={{
                      transform: 'translate(-50%, -50%)',
                      fontFamily: fontStyle,
                      pointerEvents: 'none',
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
