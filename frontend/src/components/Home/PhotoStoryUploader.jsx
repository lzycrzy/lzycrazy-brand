import React, {
  useState,
  useCallback,
  useRef,
  useImperativeHandle,
  useEffect,
} from "react";
import Cropper from "react-easy-crop";
import Slider from "@mui/material/Slider";
import getCroppedImg from "./cropImageHelper";

const PhotoStoryUploader = React.forwardRef(({ overlayText, fontStyle }, ref) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const inputRef = useRef();

  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl]);

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

  useImperativeHandle(ref, () => ({
    getFinalCroppedStory: async () => {
      if (!imageUrl || !croppedAreaPixels) return undefined;
      const croppedFile = await getCroppedImg(
        imageUrl,
        croppedAreaPixels,
        rotation,
        overlayText,
        fontStyle || "sans-serif"
      );
      return croppedFile;
    },
  }));

  return (
    <div className="flex flex-col items-center">
      {/* Upload Area or Cropper */}
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
                className="absolute top-1/2 left-1/2 text-white text-xl font-bold text-center px-2 pointer-events-none z-50"
                style={{
                  transform: "translate(-50%, -50%)",
                  fontFamily: fontStyle || "sans-serif",
                  wordBreak: "break-word",
                  whiteSpace: "pre-wrap",
                }}
              >
                {overlayText}
              </div>
            )}
          </>
        )}
      </div>

      {/* Sliders outside below the photo */}
      {imageUrl && (
        <div className="w-[270px] mt-4 space-y-4">
          <div>
            <label className="text-white text-sm block mb-1">Zoom</label>
            <Slider
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e, z) => setZoom(z)}
            />
          </div>
          <div>
            <label className="text-white text-sm block mb-1">Rotate</label>
            <Slider
              min={0}
              max={360}
              step={1}
              value={rotation}
              onChange={(e, r) => setRotation(r)}
            />
          </div>
        </div>
      )}
    </div>
  );
});

export default PhotoStoryUploader;
