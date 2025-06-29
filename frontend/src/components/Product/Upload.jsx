import React, { useRef, useState } from 'react';
import CameraPlus from '../../assets/Camera.png'

const Upload = ({formData}) => {
  const totalImages = 12;
  const inputRefs = useRef([]);
  const [images, setImages] = useState(Array(totalImages).fill(null));


  console.log(formData)

  const handleClick = (index) => {

    if (images[index]) {
      return;
    }

    if (index !== 0 && !images[index-1]) {
      alert("Add image sequentially.")
      return;
    }
    inputRefs.current[index]?.click();
  };

  const handleChange = (e, index) => {
    const files = Array.from(e.target.files);
    const updated = [...images]

    for (let file of files) {
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();

        reader.onloadend = () => {
          updated[index] = reader.result;
          console.log(index, updated)
          index++;
          setImages([...updated]);
          formData.photos = updated;
        };

        reader.readAsDataURL(file);
        if (index >= totalImages) break;
      }
    }
    e.target.value = null
  }

  function removeSelectImage(e, index) {
    e.stopPropagation();
      const updated = [...images];
      for (let i = index; i < totalImages - 1; i++) {
        updated[i] = updated[i + 1];
      }

      updated[totalImages - 1] = null;

      setImages(updated);
  }

  return (
    <>
    <div className="grid grid-cols-4 gap-4">
      {Array.from({ length: totalImages }).map((_, index) => (
        <div
          key={index}
          onClick={() => handleClick(index)}
          className={`
            w-[60px] h-[60px] border-2 rounded-md flex items-center justify-center bg-gray-100
            ${images[index - 1] || index === 0 ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}
            overflow-hidden relative group
          `}

          style={{
            backgroundImage: images[index]? `url(${images[index]})` : 'none',
            backgroundPosition: 'center',
            backgroundSize: 'cover'
          }}
        >
          {!images[index] && <span className="text-gray-400 text-2xl font-bold flex flex-col items-center justify-center">
            <img src={CameraPlus} width={20} />
            <span className='text-[12px] text-center'>{images[index - 1] || index === 0 ? 'Add Photo' : ""}</span>
            </span>
          }

          {images[index] && <span onClick={(e) => removeSelectImage(e, index)} className='hidden w-full h-full group-hover:flex justify-center items-center bg-gray-200 transition-all duration-200'>X</span>}
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
    {formData.photos[0] === 'empty' && <span className='text-[12px] text-pink-600'>Please select atleat one image</span>}
    </>
  );
};

export default Upload;
