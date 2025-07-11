import { useState } from 'react';
import { formatDate } from '../../utils/formatDate';
import { useAsset } from '../../store/useAsset';
import { useEffect } from 'react';

const iconMap = {
  floor: '🏢',
  totalFloors: '🏢',
  possession: '📅',
  verified: '✅',
  ownerPosting: '👤',
  fuel: '⛽',
  transmission: '⚙️',
  kmDriven: '🛣️',
  year: '📆',
  owners: '🙍‍♂️',
  brand: '🏷️',
  model: '🆔',
  price: '💰',
};

const readable = (key) => {
  return key
    .replace(/([A-Z])/g, ' $1') // camelCase → space
    .replace(/_/g, ' ') // underscores → space
    .replace(/\b\w/g, (l) => l.toUpperCase()); // capitalize
};   

const LeftSideDeatil = ({ data, images }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const { getAssetUrl, loaded } = useAsset();

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const displayData = Object.entries({
    ...data,
    ...data.features,
  }).filter(
    ([key, value]) =>
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
  );

  const formatToINR = (value) => {
    const number = parseInt(value.replace(/,/g, ''), 10);
    if (isNaN(number)) return '';
    return new Intl.NumberFormat('en-IN').format(number);
  };

  useEffect(() => {
    if (images.length === 0 && loaded) {
      console.log("No image selected")
      const img = getAssetUrl('PlaceholderImage.svg');
      console.log(img);
      setCurrentImage(getAssetUrl('PlaceholderImage.svg'))
    }
  }, [loaded])

  console.log(currentImage)

  return (
    <div className="h-full flex flex-col">
      {/* Image Carousel */}
      <div className="relative overflow-hidden">
        <img
          src={images.length > 0 ? images[currentImage] : currentImage}
          alt={images[currentImage] ? `Image ${currentImage + 1}` : 'Product Image'}
          className="w-full h-[350px] object-contain transition-transform duration-300"
        />
        <button
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white border-none p-3 cursor-pointer text-lg rounded z-10"
          onClick={prevImage}
        >
          ❮
        </button>

        <button
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white border-none p-3 cursor-pointer text-lg rounded z-10"
          onClick={nextImage}
        >
          ❯
        </button>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 p-4 bg-slate-50 border-t border-slate-200">
        {images.length > 0 ? images.map((image, index) => (
          <div
            key={index}
            className={`w-[100px] h-15 rounded-md overflow-hidden cursor-pointer border-2 transition-all hover:scale-105 ${
              index === currentImage ? 'border-indigo-500' : 'border-transparent'
            }`}
            onClick={() => setCurrentImage(index)}
          >
            <img src={image || "/missing.png"} alt={`Image ${index + 1}`} className="w-[100px] h-full object-cover" />
          </div>
        )): (
          <div
            className={`w-[100px] h-15 rounded-md overflow-hidden cursor-pointer border-2 transition-all hover:scale-105 `}
          >
            <img src={loaded && currentImage || "/missing.png"} alt={`No image uploaded}`} className="w-[100px] h-full object-cover" />
          </div>
        )}


      </div>

        <div className="space-y-4 p-4 shadow-lg mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            Post Date: {formatDate(data.createdAt)}
          </div>
        </div>

      {/* Description */}
      {data.description && (
        <div className="space-y-3 p-4 shadow-2xl flex flex-col flex-1">
          <h3 className="text-xl font-semibold text-slate-900 underline">Description</h3>
          <p className="text-sm leading-relaxed text-slate-600 text-justify">{data.description}.</p>
        </div>
      )}
    </div>
  );
};

export default LeftSideDeatil;
