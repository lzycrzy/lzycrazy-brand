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
      console.log(response.data.data)
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

  const prevIndex = (index, arr) => (index > 0 ? index - 1 : index);
  const nextIndex = (index, arr) => (index <= arr.length - 1 ? (index + 1)%arr.length : index);

  const renderBanner = (item) => {
    if (!item) return null;
    if (item.type === 'video') {
      return (
        <video
          controls
          className="h-80 w-full object-cover border-2 border-gray-200 rounded"
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
        className="h-80 w-full object-contain bg-center border-2 border-gray-200 overflow-hidden"
      />
    );
  };

  return (
    <div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 mt-3">
        {leftImages?.length > 0 && (
          <div
            key={leftImages[leftImageIndex]._id}
            className="group relative overflow-hidden rounded-lg bg-white shadow"
          >
            
              {renderBanner(leftImages[leftImageIndex])}
            {leftImages?.length > 1 && <GrPrevious
              onClick={() => setLeftImageIndex((i) => prevIndex(i, leftImages))}
              className="absolute top-[45%] left-4 rounded-full bg-slate-100 p-2 text-4xl hover:bg-slate-400 cursor-pointer"
            />}
            {leftImages.length > 1 && <GrNext
              onClick={() => setLeftImageIndex((i) => nextIndex(i, leftImages))}
              className="absolute top-[45%] right-4 rounded-full bg-slate-100 p-2 text-4xl hover:bg-slate-400 cursor-pointer"
            />}

            <div className='hidden group-hover:flex absolute top-2 right-2 w-8 h-8 bg-white rounded-full justify-center items-center'>
              <a
              href={leftImages[leftImageIndex].url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLink />
            </a>
            </div>
          </div>
        )}

        {rightImages?.length > 0 && (
          <div
            key={rightImages[rightImageIndex]._id}
            className="group relative overflow-hidden rounded-lg bg-white shadow-2xs"
          >
              {renderBanner(rightImages[rightImageIndex])}
            {rightImages.length > 1 && <GrPrevious
              onClick={() => setRightImageIndex((i) => prevIndex(i, rightImages))}
              className="absolute top-[45%] left-4 rounded-full bg-slate-100 p-2 text-4xl hover:bg-slate-400 cursor-pointer"
            />}

            {rightImages.length > 1 && <GrNext
              onClick={() => setRightImageIndex((i) => nextIndex(i, rightImages))}
              className="absolute top-[45%] right-4 rounded-full bg-slate-100 p-2 text-4xl hover:bg-slate-400 cursor-pointer"
            />}

            <div className='hidden group-hover:flex absolute top-2 right-2 w-8 h-8 bg-white rounded-full justify-center items-center'>
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

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 mt-3 mb-16 md:mb-0">
        {/* Left Videos */}
        {leftVideos?.length > 0 && (
          <div
            key={leftVideos[leftVideoIndex]._id}
            className="group relative overflow-hidden rounded-lg bg-white shadow"
          >
              {renderBanner(leftVideos[leftVideoIndex])}
            {leftVideos?.length > 1 &&<GrPrevious
              onClick={() => setLeftVideoIndex((i) => prevIndex(i, leftVideos))}
              className="absolute top-[45%] left-4 rounded-full bg-slate-100 p-2 text-4xl hover:bg-slate-300 cursor-pointer"
            />}
            {leftVideos.length > 1 && <GrNext
              onClick={() => setLeftVideoIndex((i) => nextIndex(i, leftVideos))}
              className="absolute top-[45%] right-4 rounded-full bg-slate-100 p-2 text-4xl hover:bg-slate-300 cursor-pointer"
            />}

            <div className='hidden group-hover:flex absolute top-2 right-2 w-8 h-8 bg-white rounded-full justify-center items-center'>
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
            className="group relative overflow-hidden rounded-lg bg-white shadow-lg"
          >
              {renderBanner(rightVideos[rightVideoIndex])}
            {rightVideos.length > 1 && <GrPrevious
              onClick={() => setRightVideoIndex((i) => prevIndex(i, rightVideos))}
              className="absolute top-[45%] left-4 rounded-full bg-slate-100 p-2 text-4xl hover:bg-slate-300 cursor-pointer"
            />}
            {rightVideos.length > 1 &&<GrNext
              onClick={() => setRightVideoIndex((i) => nextIndex(i, rightVideos))}
              className="absolute top-[45%] right-4 rounded-full bg-slate-100 p-2 text-4xl hover:bg-slate-300 cursor-pointer"
            />}

            <div className='hidden group-hover:flex bg-white absolute top-2 right-2 w-8 h-8 rounded-full justify-center items-center'>
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