import { useState } from 'react'

const LeftSideDeatil = ({ data,images }) => {
  const [currentImage, setCurrentImage] = useState(0)

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="relative  overflow-hidden">
        <img 
          src={images[currentImage]} 
          alt="Property" 
          className="w-full h-[350px] object-cover transition-transform duration-300"
        />
        <button 
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white border-none p-3 cursor-pointer text-lg rounded transition-colors duration-300 z-10"
          onClick={prevImage}
        >
          <span>❮</span>
        </button>
        <button 
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white border-none p-3 cursor-pointer text-lg rounded transition-colors duration-300 z-10"
          onClick={nextImage}
        >
          <span>❯</span>
        </button>
      </div>
      
      <div className="flex gap-2 p-4 bg-slate-50 border-t border-slate-200">
        {images.map((image, index) => (
          <div 
            key={index}
            className={`w-75 h-15 rounded-md overflow-hidden cursor-pointer border-2 transition-all duration-300 hover:scale-105 ${
              index === currentImage ? 'border-indigo-500' : 'border-transparent'
            }`}
            onClick={() => setCurrentImage(index)}
          >
            <img src={image} alt={`Property ${index + 1}`} className="w-full h-full object-cover" loading="lazy" />
          </div>
        ))}
      </div>

            <div className="space-y-4 p-4 shadow-lg  mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <span className="text-base">🏢</span>
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 uppercase tracking-wide">Floor Number</span>
              <p className="text-xs text-slate-700 font-medium">{data.floorDetails.floor} of {data.floorDetails.totalFloors}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-base">📅</span>
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 uppercase tracking-wide">Possession in</span>
              <p className="text-xs text-slate-700 font-medium">{data.possession}</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <span className="text-base">✅</span>
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 uppercase tracking-wide">Verified</span>
              <p className="text-xs text-slate-700 font-medium">Last</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-base">👤</span>
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 uppercase tracking-wide">Owner Posting</span>
              <p className="text-xs text-slate-700 font-medium">Only</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3 p-4 shadow-2xl ">
        <h3 className="text-xl font-semibold text-slate-900">Description</h3>
        <p className="text-sm leading-relaxed text-slate-600">{data.description}</p>
      </div>
    </div>
  )
}

export default LeftSideDeatil