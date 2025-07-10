import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../../utils/cropImage"; 
import "react-easy-crop/react-easy-crop.css";

const ImageDetail = ({ setImage, image, setEdit }) => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const imageUrl = state?.image;

  const [rotation, setRotation] = useState(0);
  // const [tag, setTag] = useState("");
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [previewImage, setPreviewImage] = useState(image || imageUrl);

  // Redirect if no image
  useEffect(() => {
    if (!image && !imageUrl) {
      navigate("/");
    }
  }, [image, imageUrl, navigate]);

  const handleCrop = () => setShowCropper(true);

  const handleCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleApplyCrop = async () => {
    try {
      const croppedImg = await getCroppedImg(previewImage, croppedAreaPixels, rotation);
      setPreviewImage(croppedImg); // update the preview to cropped image
      setShowCropper(false);
    } catch (e) {
      console.error("Cropping failed:", e);
    }
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // const handleTag = () => {
  //   const input = prompt("Enter tag:");
  //   if (input) setTag(input);
  // };

  const handleSave = () => {
    setImage(previewImage, tag);
    setEdit(prev => !prev);
  };

  const handleCancel = () => {
    if (window.confirm("Discard changes and go back?")) {
      navigate("/");
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-70 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full h-full md:w-3/4 md:h-3/4 lg:w-2/3 lg:h-2/3 p-6 flex">
        {/* Left Panel */}
        <div className="flex flex-col justify-between w-1/3 p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Edit Tools</h2>
          <button onClick={handleCrop} className="mb-2 hover:bg-gray-100 px-3 py-2 rounded text-left">✂️ Crop</button>
          <button onClick={handleRotate} className="mb-2 hover:bg-gray-100 px-3 py-2 rounded text-left">🔄 Rotate</button>
          {/* <button onClick={handleTag} className="mb-2 hover:bg-gray-100 px-3 py-2 rounded text-left">🏷️ Tag</button> */}

          <div className="mt-auto pt-10 flex gap-2">
            <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700">Save</button>
            <button onClick={handleCancel} className="bg-gray-300 px-4 py-2 rounded w-full hover:bg-gray-400">Cancel</button>
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex-1 flex justify-center items-center p-4 relative">
          {showCropper ? (
            <div className="relative w-full h-[60vh]">
              <Cropper
                image={previewImage}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={4 / 3}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={handleCropComplete}
              />
              <button onClick={handleApplyCrop} className="absolute bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded">
                Apply Crop
              </button>
            </div>
          ) : (
            previewImage && (
              <img
                src={previewImage}
                alt="Edited"
                className="max-h-full max-w-full transition-transform rounded"
                style={{ transform: `rotate(${rotation}deg)` }}
              />
            )
          )}

          {/* {tag && (
            <div className="absolute top-5 left-5 bg-white px-3 py-1 rounded shadow text-sm font-medium">
              🏷️ Tagged: {tag}
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default ImageDetail;
