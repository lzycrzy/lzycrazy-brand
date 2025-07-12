import React, { useEffect, useRef, useState } from 'react';
import { GrPrevious, GrNext } from 'react-icons/gr';
import instance from '../../lib/axios/axiosInstance';
import { FaLink } from 'react-icons/fa';

function AdminPost() {
  const [banners, setBanners] = useState([]);

  const [leftImages, setLeftImages] = useState([]);
  const [rightImages, setRightImages] = useState([]);
  const [leftVideos, setLeftVideos] = useState([]);
  const [rightVideos, setRightVideos] = useState([]);

  const [leftImageIndex, setLeftImageIndex] = useState(0);
  const [rightImageIndex, setRightImageIndex] = useState(0);
  const [leftVideoIndex, setLeftVideoIndex] = useState(0);
  const [rightVideoIndex, setRightVideoIndex] = useState(0);

  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const interactionTimeoutRef = useRef(null);

  const handleUserInteraction = () => {
    setIsUserInteracting(true);
    if (interactionTimeoutRef.current) {
      clearTimeout(interactionTimeoutRef.current);
    }
    interactionTimeoutRef.current = setTimeout(() => {
      setIsUserInteracting(false);
    }, 10000); // 10 seconds
  };

  async function fetchMarketPlacePost() {
    try {
      const response = await instance.get('/v1/admin/market-post');
      if (response?.data?.data) {
        const sorted = response.data.data.sort((a, b) => a.position - b.position);

        const leftImgs = sorted.filter((item) => item.type === 'image' && item.position === 1);
        const rightImgs = sorted.filter((item) => item.type === 'image' && item.position === 2);
        const leftVids = sorted.filter((item) => item.type === 'video' && item.position === 3);
        const rightVids = sorted.filter((item) => item.type === 'video' && item.position === 4);

        setBanners(sorted);
        setLeftImages(leftImgs);
        setRightImages(rightImgs);
        setLeftVideos(leftVids);
        setRightVideos(rightVids);

        setLeftImageIndex(0);
        setRightImageIndex(0);
        setLeftVideoIndex(0);
        setRightVideoIndex(0);
      }
    } catch (error) {
      console.error('Failed to fetch marketplace posts:', error);
    }
  }

  useEffect(() => {
    fetchMarketPlacePost();
  }, []);

  useEffect(() => {
    const intervals = [];

    if (!isUserInteracting) {
      if (leftImages.length > 1) {
        const interval = setInterval(() => {
          setLeftImageIndex((prev) => (prev + 1) % leftImages.length);
        }, 5000);
        intervals.push(interval);
      }

      if (rightImages.length > 1) {
        const interval = setInterval(() => {
          setRightImageIndex((prev) => (prev + 1) % rightImages.length);
        }, 5000);
        intervals.push(interval);
      }

      if (leftVideos.length > 1) {
        const interval = setInterval(() => {
          setLeftVideoIndex((prev) => (prev + 1) % leftVideos.length);
        }, 7000);
        intervals.push(interval);
      }

      if (rightVideos.length > 1) {
        const interval = setInterval(() => {
          setRightVideoIndex((prev) => (prev + 1) % rightVideos.length);
        }, 7000);
        intervals.push(interval);
      }
    }

    return () => intervals.forEach(clearInterval);
  }, [leftImages, rightImages, leftVideos, rightVideos, isUserInteracting]);

  useEffect(() => {
    return () => {
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current);
      }
    };
  }, []);

  const renderBanner = (item) => {
  if (!item) return null;
  if (item.type === 'video') {
    return (
      <video
        controls
        className="h-80 w-full object-cover border-2 border-gray-200 rounded-lg"
        src={item.postUrl}
      >
        Your browser does not support the video tag.
      </video>
    );
  }
  return (
    <img
      src={item.postUrl}
      alt={`Image Banner ${item.position}`}
      className="h-80 w-full object-cover border-2 border-gray-200 rounded-lg"
    />
  );
};


  const prevIndex = (index, arr) => (index === 0 ? arr.length - 1 : index - 1);
  const nextIndex = (index, arr) => (index + 1) % arr.length;

  return (
    <div>
      {/* Images Row */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 mt-1">
        {/* Left Images */}
        {leftImages.length > 0 && (
          <div className="relative overflow-hidden rounded-lg bg-white shadow h-80 group">
            <div
              className="flex transition-transform duration-700 ease-in-out h-full"
              style={{ transform: `translateX(-${leftImageIndex * 100}%)` }}
            >
              {leftImages.map((item) => (
                <div key={item._id} className="flex-shrink-0 w-full h-full">

                  <a
                href={leftImages[leftImageIndex].url}
                target="_blank"
                rel="noopener noreferrer"
                >
                {renderBanner(item)}
              </a>
                </div>
              ))}
            </div>

            {leftImages.length > 1 && (
              <>
                <GrPrevious
                  onClick={() => {
                    handleUserInteraction();
                    setLeftImageIndex((i) => prevIndex(i, leftImages));
                  }}
                  className="absolute top-[45%] left-4 rounded-full p-2 text-4xl hover:bg-slate-400 cursor-pointer select-none"
                />
                <GrNext
                  onClick={() => {
                    handleUserInteraction();
                    setLeftImageIndex((i) => nextIndex(i, leftImages));
                  }}
                  className="absolute top-[45%] right-4 rounded-full p-2 text-4xl hover:bg-slate-400 cursor-pointer select-none"
                />
              </>
            )}

          
          </div>
        )}

        {/* Right Images */}
        {rightImages.length > 0 && (
          <div className="relative overflow-hidden rounded-lg bg-white shadow h-80 group">
            <div
              className="flex transition-transform duration-700 ease-in-out h-full"
              style={{ transform: `translateX(-${rightImageIndex * 100}%)` }}
            >
              {rightImages.map((item) => (
                <div key={item._id} className="flex-shrink-0 w-full h-full">
                  <a
                href={leftImages[leftImageIndex].url}
                target="_blank"
                rel="noopener noreferrer"
                >
                {renderBanner(item)}
              </a>
                </div>
              ))}
            </div>

            {rightImages.length > 1 && (
              <>
                <GrPrevious
                  onClick={() => {
                    handleUserInteraction();
                    setRightImageIndex((i) => prevIndex(i, rightImages));
                  }}
                  className="absolute top-[45%] left-4 rounded-full p-2 text-4xl hover:bg-slate-400 cursor-pointer select-none"
                />
                <GrNext
                  onClick={() => {
                    handleUserInteraction();
                    setRightImageIndex((i) => nextIndex(i, rightImages));
                  }}
                  className="absolute top-[45%] right-4 rounded-full p-2 text-4xl hover:bg-slate-400 cursor-pointer select-none"
                />
              </>
            )}

            {/* <div className="hidden group-hover:flex absolute top-2 right-2 w-8 h-8 bg-white rounded-full justify-center items-center">
              <a
                href={rightImages[rightImageIndex].url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLink />
              </a>
            </div> */}
          </div>
        )}
      </div>

      {/* Videos Row */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 mt-2 mb-16 md:mb-0">
        {/* Left Videos */}
        {leftVideos.length > 0 && (
          <div className="relative overflow-hidden rounded-lg bg-white shadow h-80 group">
            <div
              className="flex transition-transform duration-700 ease-in-out h-full"
              style={{ transform: `translateX(-${leftVideoIndex * 100}%)` }}
            >
              {leftVideos.map((item) => (
                <div key={item._id} className="flex-shrink-0 w-full h-full">
                  {renderBanner(item)}
                </div>
              ))}
            </div>

            {leftVideos.length > 1 && (
              <>
                <GrPrevious
                  onClick={() => {
                    handleUserInteraction();
                    setLeftVideoIndex((i) => prevIndex(i, leftVideos));
                  }}
                  className="absolute top-[45%] left-4 rounded-full p-2 text-4xl hover:bg-slate-300 cursor-pointer select-none"
                />
                <GrNext
                  onClick={() => {
                    handleUserInteraction();
                    setLeftVideoIndex((i) => nextIndex(i, leftVideos));
                  }}
                  className="absolute top-[45%] right-4 rounded-full p-2 text-4xl hover:bg-slate-300 cursor-pointer select-none"
                />
              </>
            )}

            <div className="hidden group-hover:flex absolute top-2 right-2 w-8 h-8 bg-white rounded-full justify-center items-center">
              <a
                href={leftVideos[leftVideoIndex].url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLink />
              </a>
            </div>
          </div>
        )}

        {/* Right Videos */}
        {rightVideos.length > 0 && (
          <div className="relative overflow-hidden rounded-lg bg-white shadow-lg h-80 group">
            <div
              className="flex transition-transform duration-700 ease-in-out h-full"
              style={{ transform: `translateX(-${rightVideoIndex * 100}%)` }}
            >
              {rightVideos.map((item) => (
                <div key={item._id} className="flex-shrink-0 w-full h-full">
                  {renderBanner(item)}
                </div>
              ))}
            </div>

            {rightVideos.length > 1 && (
              <>
                <GrPrevious
                  onClick={() => {
                    handleUserInteraction();
                    setRightVideoIndex((i) => prevIndex(i, rightVideos));
                  }}
                  className="absolute top-[45%] left-4 rounded-full p-2 text-4xl hover:bg-slate-300 cursor-pointer select-none"
                />
                <GrNext
                  onClick={() => {
                    handleUserInteraction();
                    setRightVideoIndex((i) => nextIndex(i, rightVideos));
                  }}
                  className="absolute top-[45%] right-4 rounded-full p-2 text-4xl hover:bg-slate-300 cursor-pointer select-none"
                />
              </>
            )}

            <div className="hidden group-hover:flex bg-white absolute top-2 right-2 w-8 h-8 rounded-full justify-center items-center">
              <a
                href={rightVideos[rightVideoIndex].url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLink />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPost;
