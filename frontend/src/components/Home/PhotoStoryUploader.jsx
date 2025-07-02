import React, {
  useState,
  useCallback,
  useRef,
  useImperativeHandle,
} from "react";
import Cropper from "react-easy-crop";
import Slider from "@mui/material/Slider";
import getCroppedImg from "./cropImageHelper"; // make sure this works

const PhotoStoryUploader = React.forwardRef(({ overlayText, fontStyle }, ref) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const inputRef = useRef();

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  // Expose to parent via ref
  useImperativeHandle(ref, () => ({
    getFinalCroppedStory: async () => {
      if (!imageUrl || !croppedAreaPixels) return undefined;
  
      const croppedFile = await getCroppedImg(
        imageUrl,
        croppedAreaPixels,
        rotation,
        overlayText,
        fontStyle
      );
  
      return croppedFile; // ✅ Return the File directly
    },
  }));
  

  return (
    <div className="relative w-[270px] h-[480px] bg-black rounded-xl overflow-hidden">
      {!imageUrl ? (
        <label className="cursor-pointer text-white bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          Upload Photo
          <input
            type="file"
            accept="image/*"
            onChange={onFileChange}
            ref={inputRef}
            className="hidden"
          />
        </label>
      ) : (
        <>
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={9 / 16}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            onCropComplete={onCropComplete}
          />

          {/* Overlay text preview */}
          {overlayText && (
            <div
              className="absolute top-1/2 left-1/2 text-white text-xl font-bold text-center px-2 pointer-events-none"
              style={{
                transform: "translate(-50%, -50%)",
                fontFamily: fontStyle,
              }}
            >
              {overlayText}
            </div>
          )}

          {/* Zoom & rotation sliders */}
          <div className="absolute bottom-2 left-2 right-2 space-y-2 bg-black bg-opacity-50 p-2 rounded">
            <label className="text-white text-sm">Zoom</label>
            <Slider
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e, z) => setZoom(z)}
            />
            <label className="text-white text-sm">Rotate</label>
            <Slider
              min={0}
              max={360}
              step={1}
              value={rotation}
              onChange={(e, r) => setRotation(r)}
            />
          </div>
        </>
      )}
    </div>
  );
});

export default PhotoStoryUploader;
