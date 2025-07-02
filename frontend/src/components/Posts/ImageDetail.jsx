// components/ImageDetail.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ImageDetail = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const imageUrl = state?.image;

  const [rotation, setRotation] = useState(0);
  const [tag, setTag] = useState("");
  const [cropped, setCropped] = useState(false);

  // Redirect if no image is passed
  useEffect(() => {
    if (!imageUrl) {
      navigate("/");
    }
  }, [imageUrl, navigate]);

  const handleSave = () => {
    alert("Saved!\n" + JSON.stringify({ rotation, tag, cropped }));
    navigate("/");
  };

  const handleCancel = () => {
    if (window.confirm("Discard changes and go back?")) {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white p-6 shadow-md border-r flex flex-col">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">Edit Tools</h2>

        <button onClick={() => setCropped(true)} className="mb-2 hover:bg-gray-100 px-3 py-2 rounded text-left">
          ✂️ Crop
        </button>

        <button onClick={() => setRotation((prev) => prev + 90)} className="mb-2 hover:bg-gray-100 px-3 py-2 rounded text-left">
          🔄 Rotate
        </button>

        <button
          onClick={() => {
            const input = prompt("Enter tag:");
            if (input) setTag(input);
          }}
          className="mb-2 hover:bg-gray-100 px-3 py-2 rounded text-left"
        >
          🏷️ Tag
        </button>

        <div className="mt-auto pt-10 flex gap-2">
          <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700">
            Save
          </button>
          <button onClick={handleCancel} className="bg-gray-300 px-4 py-2 rounded w-full hover:bg-gray-400">
            Cancel
          </button>
        </div>
      </aside>

      {/* Image Preview */}
      <main className="flex-1 bg-black flex items-center justify-center relative">
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Uploaded"
            className="transition-all rounded"
            style={{
              transform: `rotate(${rotation}deg)`,
              height: cropped ? "60vh" : "80vh",
            }}
          />
        )}

        {tag && (
          <div className="absolute top-5 left-5 bg-white px-3 py-1 rounded shadow text-sm">
            🏷️ Tagged: {tag}
          </div>
        )}
      </main>
    </div>
  );
};

export default ImageDetail;
