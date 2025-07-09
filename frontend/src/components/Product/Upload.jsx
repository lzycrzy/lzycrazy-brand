import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useProduct } from '../../store/useProduct';
import { useAsset } from '../../store/useAsset';

const Upload = ({ photos, setPhotos }) => {
  const totalImages = 8;
  const inputRefs = useRef([]);
  const [images, setImages] = useState(Array(totalImages).fill(null));
  const [draggedIndex, setDraggedIndex] = useState(null);
  const { getAssetUrl, loaded } = useAsset();


  useEffect(() => {
    const newImages = [...Array(totalImages).fill(null)];
    photos.forEach((img, i) => {
      if (i < totalImages) newImages[i] = {dataURL: img};
    });
    setImages(newImages);
  }, [photos]);

  const handleClick = (index) => {
    if (images[index]) return;
    if (index !== 0 && !images[index - 1]) {
      alert("Add image sequentially.");
      return;
    }
    inputRefs.current[index]?.click();
  };

  // console.log(images)

const handleChange = (e, index) => {
  const files = Array.from(e.target.files);
  const updated = [...images];
  const isPhotosLimitFull = images.filter(item => item !== null);

  if (files.length + isPhotosLimitFull.length > totalImages) {
    toast.error('Only 8 photos are allowed.');
    return;
  }

  let currentIndex = index;

  const processFile = (file) => {
    return new Promise((resolve) => {
      const extension = file.name.split('.').pop();
      const timestamp = Date.now().toString(36);
      const randomPart = Math.random().toString(36).slice(2, 6);
      const newName = `${timestamp}_${randomPart}.${extension}`;
      const renamedFile = new File([file], newName, { type: file.type });

      const reader = new FileReader();
      reader.onloadend = () => {
        resolve({
          dataURL: reader.result,
          file: renamedFile,
        });
      };

      reader.readAsDataURL(renamedFile);
    });
  };

  const processFiles = async () => {
    for (let file of files) {
      if (file && file.type.startsWith('image/') && currentIndex < totalImages) {
        const result = await processFile(file);
        updated[currentIndex] = result;
        currentIndex++;
      }
    }

    const filtered = updated.filter(img => img !== null);
    setImages([...updated]);
    setPhotos(filtered);
  };

  processFiles();
  e.target.value = null;
};

  const removeSelectImage = (e, index) => {
    e.stopPropagation();
    const updated = [...images];
    for (let i = index; i < totalImages - 1; i++) {
      updated[i] = updated[i + 1];
    }
    updated[totalImages - 1] = null;
    setImages(updated);
    setPhotos(updated.filter(img => img !== null));
  };

  const onDragStart = (index) => {
    setDraggedIndex(index);
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = (targetIndex) => {
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const updated = [...images];
    const draggedImage = updated[draggedIndex];

    updated.splice(draggedIndex, 1);
    updated.splice(targetIndex, 0, draggedImage);

    updated.length = totalImages;
    const filtered = updated.filter(img => img !== null);

    setImages(updated);
    setPhotos(filtered);
    setDraggedIndex(null);
  };

  return (
    <>
      <div className="grid grid-cols-8 gap-4">
        {Array.from({ length: totalImages }).map((_, index) => (
          <div
            key={index}
            onClick={() => handleClick(index)}
            onDragOver={onDragOver}
            onDrop={() => onDrop(index)}
            draggable={!!images[index]}
            onDragStart={() => onDragStart(index)}
            className={`
              w-[60px] h-[60px] border-2 rounded-md flex items-center justify-center bg-gray-100
              ${images[index - 1] || index === 0 ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}
              overflow-hidden relative group
            `}
            style={{
              backgroundImage: images[index]?.dataURL ? `url(${images[index]?.dataURL})` : 'none',
              backgroundPosition: 'center',
              backgroundSize: 'cover',
            }}
          >
            {!images[index] && (
              <span className="text-gray-400 text-2xl font-bold flex flex-col items-center justify-center">
                {loaded && <img src={getAssetUrl('camera.png') || "/missing.png"} alt="Camera" width={20} />}
                <span className='text-[12px] text-center'>
                  {images[index - 1] || index === 0 ? 'Add Photo' : ""}
                </span>
              </span>
            )}

            {images[index] && (
              <>
                <span
                  onClick={(e) => removeSelectImage(e, index)}
                  className='hidden w-full h-full group-hover:flex justify-center items-center bg-gray-200 transition-all duration-200'
                >
                  X
                </span>
                {index === 0 && (
                  <span className='absolute top-0 left-0 bg-green-600 text-white text-[10px] px-1 rounded-br'>
                    Cover
                  </span>
                )}
              </>
            )}

            <input
              type="file"
              accept="image/*"
              multiple
              ref={(el) => (inputRefs.current[index] = el)}
              onChange={(e) => handleChange(e, index)}
              className="hidden"
            />
          </div>
        ))}
      </div>

      {photos[0] === 'empty' && (
        <span className='text-[12px] text-pink-600'>Please select at least one image</span>
      )}
    </>
  );
};

export default Upload;
