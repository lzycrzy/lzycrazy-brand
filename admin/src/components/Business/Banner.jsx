import React, { useRef, useState } from 'react'

const Banner = () => {
  const [image, setImage] = useState()
  const inputRef = useRef(null)
  

  const handleClick = () => {
    inputRef.current.click()
  }

  const handleChange = (event) => {
    const file = event.target.files[0]
    setImage(file)
  }

  return (
    <div className="max-w-3xl mx-auto mt-16 bg-white rounded-2xl shadow-2xl p-8 flex flex-col gap-8">
      {/* Banner image heading at the top */}
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Banner Image</h2>
      {/* Title and Save button in a row */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
        <div className="flex flex-col items-start w-full md:w-auto">
          <label htmlFor="title" className="mb-1 text-lg font-semibold text-gray-700">Title</label>
          <input
            type="text"
            id="title"
            placeholder="Enter banner title"
            className="w-72 px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>
        <button className="px-8 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-green-700 transition font-semibold mt-4 md:mt-0">
          Save
        </button>
      </div>
      {/* Banner image and upload */}
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="flex flex-col items-center w-full md:w-2/3">
          <div className="w-full h-48 flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg mb-4 overflow-hidden">
            {image ? (
              <img
                src={URL.createObjectURL(image)}
                alt="Banner Preview"
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-gray-400">No image selected</span>
            )}
          </div>
          <input
            type="file"
            ref={inputRef}
            onChange={handleChange}
            className="hidden"
            accept="image/*"
          />
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
            onClick={handleClick}
          >
            {image ? "Change Image" : "Upload Image"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Banner