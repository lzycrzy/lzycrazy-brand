import React, { useState, useRef, useEffect } from "react";

function ImageUploader() {
  const [imageUrl, setImageUrl] = useState(null);
  const currentObjectUrl = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Revoke old URL if exists to avoid memory leaks
      if (currentObjectUrl.current) {
        URL.revokeObjectURL(currentObjectUrl.current);
      }

      // Create new blob URL for preview
      const newUrl = URL.createObjectURL(file);

      // Store the new URL for later revoking
      currentObjectUrl.current = newUrl;

      // Update state to show preview
      setImageUrl(newUrl);
    }
  };

  // Revoke object URL when component unmounts to free memory
  useEffect(() => {
    return () => {
      if (currentObjectUrl.current) {
        URL.revokeObjectURL(currentObjectUrl.current);
      }
    };
  }, []);

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {imageUrl && <img src={imageUrl || "/missing.png"} alt="Preview" style={{ width: 200 }} loading="lazy" />}
    </div>
  );
}

export default ImageUploader;
