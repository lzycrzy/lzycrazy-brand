import React, { useEffect, useState } from 'react';
import { GrPrevious, GrNext } from 'react-icons/gr';
import instance from '../../lib/axios/axiosInstance';
import { FaLink } from 'react-icons/fa';

function AdminPost() {
  const [banners, setBanners] = useState([]);

  // Split banners by type and position parity
  const [leftImages, setLeftImages] = useState([]);
  const [rightImages, setRightImages] = useState([]);
  const [leftVideos, setLeftVideos] = useState([]);
  const [rightVideos, setRightVideos] = useState([]);

  // Navigation indices
  const [leftImageIndex, setLeftImageIndex] = useState(0);
  const [rightImageIndex, setRightImageIndex] = useState(0);
  const [leftVideoIndex, setLeftVideoIndex] = useState(0);
  const [rightVideoIndex, setRightVideoIndex] = useState(0);

  async function fetchMarketPlacePost() {
    try {
      const response = await instance.get('/v1/admin/market-post');
      if (response?.data?.data) {
        
        const sorted = response.data.data.sort((a, b) => a.position - b.position);

        const leftImgs = sorted.filter(
          (item) => item.type === 'image' && item.position % 2 === 1,
        );
        const rightImgs = sorted.filter(
          (item) => item.type === 'image' && item.position % 2 === 0,
        );

        const leftVids = sorted.filter(
          (item) => item.type === 'video' && item.position % 2 === 1,
        );
        const rightVids = sorted.filter(
          (item) => item.type === 'video' && item.position % 2 === 0,
        );

        setBanners(sorted);
        setLeftImages(leftImgs);
        setRightImages(rightImgs);
        setLeftVideos(leftVids);
        setRightVideos(rightVids);

        // reseting indices
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

  // Navigation helpers
  const prevIndex = (index, arr) => (index > 0 ? index - 1 : index);
  const nextIndex = (index, arr) => (index <= arr.length - 1 ? (index + 1)%arr.length : index);

  // Render banner (image or video)
  const renderBanner = (item) => {
    if (!item) return null;
    if (item.type === 'video') {
      return (
        <video
          controls
          className="h-72 w-full object-cover border rounded"
          src={item.postUrl}
          alt={`Video Banner ${item.position}`}
        >
          Your browser does not support the video tag.
        </video>
      );
    }
    return (
      <img
        src={item.postUrl}
        alt={`Image Banner ${item.position}`}
        className="h-72 w-full object-contain bg-center border-2 border-gray-200 overflow-hidden"
      />
    );
  };

  return (
    <div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {leftImages?.length > 0 && (
          <div
            key={leftImages[leftImageIndex]._id}
            className="relative overflow-hidden rounded-lg bg-white shadow"
          >
            <a
              href={leftImages[leftImageIndex].url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {renderBanner(leftImages[leftImageIndex])}
            </a>
            {leftImages?.length > 1 && <GrPrevious
              onClick={() => setLeftImageIndex((i) => prevIndex(i, leftImages))}
              className="absolute top-[45%] left-4 rounded-full bg-slate-100 p-2 text-4xl hover:bg-slate-400 cursor-pointer"
            />}
            {leftImages.length > 1 && <GrNext
              onClick={() => setLeftImageIndex((i) => nextIndex(i, leftImages))}
              className="absolute top-[45%] right-4 rounded-full bg-slate-100 p-2 text-4xl hover:bg-slate-400 cursor-pointer"
            />}
          </div>
        )}

        {rightImages?.length > 0 && (
          <div
            key={rightImages[rightImageIndex]._id}
            className="group relative overflow-hidden rounded-lg bg-white shadow-2xs border-1 border-gray-200"
          >
              {renderBanner(rightImages[rightImageIndex])}
            {rightImages.length > 1 && <GrPrevious
              onClick={() => setRightImageIndex((i) => prevIndex(i, rightImages))}
              className="absolute top-[45%] left-0 rounded-full bg-slate-100 p-2 text-4xl hover:bg-slate-400 cursor-pointer"
            />}

            {rightImages.length > 1 && <GrNext
              onClick={() => setRightImageIndex((i) => nextIndex(i, rightImages))}
              className="absolute top-[45%] right-0 rounded-full bg-slate-100 p-2 text-4xl hover:bg-slate-400 cursor-pointer"
            />}

            <div className='hidden group-hover:block absolute top-2 right-2'>
              <a
              href={rightImages[rightImageIndex].url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLink />
            </a>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 mt-3">
        {/* Left Videos */}
        {leftVideos?.length > 0 && (
          <div
            key={leftVideos[leftVideoIndex]._id}
            className="relative overflow-hidden rounded-lg bg-white shadow p-8"
          >
              {renderBanner(leftVideos[leftVideoIndex])}
            {leftVideos?.length > 1 &&<GrPrevious
              onClick={() => setLeftVideoIndex((i) => prevIndex(i, leftVideos))}
              className="absolute top-[45%] left-0 rounded-full bg-slate-100 p-2 text-4xl hover:bg-slate-300 cursor-pointer"
            />}
            {leftVideos.length > 1 && <GrNext
              onClick={() => setLeftVideoIndex((i) => nextIndex(i, leftVideos))}
              className="absolute top-[45%] right-0 rounded-full bg-slate-100 p-2 text-4xl hover:bg-slate-300 cursor-pointer"
            />}

            <div className='absolute top-2 right-2'>
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

        {rightVideos?.length > 0 && (
          <div
            key={rightVideos[rightVideoIndex]._id}
            className="relative overflow-hidden rounded-lg bg-white shadow p-8"
          >
              {renderBanner(rightVideos[rightVideoIndex])}
            {rightVideos.length > 1 && <GrPrevious
              onClick={() => setRightVideoIndex((i) => prevIndex(i, rightVideos))}
              className="absolute top-[45%] left-0 rounded-full bg-slate-100 p-2 text-4xl hover:bg-slate-300 cursor-pointer"
            />}
            {rightVideos.length > 1 &&<GrNext
              onClick={() => setRightVideoIndex((i) => nextIndex(i, rightVideos))}
              className="absolute top-[45%] right-0 rounded-full bg-slate-100 p-2 text-4xl hover:bg-slate-300 cursor-pointer"
            />}

            <div className='absolute top-2 right-2'>
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
