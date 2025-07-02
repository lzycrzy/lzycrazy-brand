// PhotoStoryUploader.jsx
import React, { useState, forwardRef, useImperativeHandle } from "react";
import Cropper from "react-easy-crop";
import Slider from "@mui/material/Slider";
import getCroppedImg from "./cropImageHelper";

const PhotoStoryUploader = forwardRef(({ overlayText, fontStyle }, ref) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageSrc(URL.createObjectURL(file));
    }
  };

  const onCropComplete = (_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  };

  useImperativeHandle(ref, () => ({
    async getFinalCroppedStory() {
      if (!imageSrc || !croppedAreaPixels) return null;
      const finalImage = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation,
        overlayText,
        fontStyle
      );
      return {
        image: finalImage,
        type: "photo",
        user: "You",
        overlayText,
        fontStyle,
        createdAt: Date.now(),
      };
    },
  }));

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-black px-4">
      {!imageSrc ? (
        <div className="flex flex-col items-center gap-4">
          <label className="cursor-pointer bg-blue-600 px-5 py-2 rounded text-white hover:bg-blue-700">
            Upload Photo
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
          <p className="text-sm text-gray-600">Select a photo to start editing</p>
        </div>
      ) : (
        <>
          <div className="relative w-[270px] h-[480px] bg-black rounded-xl overflow-hidden">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={9 / 16}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onRotationChange={setRotation}
              onCropComplete={onCropComplete}
            />
            {overlayText && (
              <div
                className="absolute top-1/2 left-1/2 text-white text-xl font-bold text-center pointer-events-none px-2"
                style={{
                  transform: "translate(-50%, -50%)",
                  fontFamily: fontStyle,
                }}
              >
                {overlayText}
              </div>
            )}
          </div>

          <div className="w-full max-w-sm mt-4 space-y-4">
            <div>
              <label className="text-sm font-medium block mb-1">Zoom</label>
              <Slider min={1} max={3} step={0.1} value={zoom} onChange={(_, z) => setZoom(z)} />
            </div>
            <div className="flex justify-between items-center">
              <button
                onClick={() => setRotation((r) => r - 90)}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                ⟲ Rotate Left
              </button>
              <button
                onClick={() => setRotation((r) => r + 90)}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                ⟳ Rotate Right
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
});

export default PhotoStoryUploader;
