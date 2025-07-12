// import React, { useEffect, useState } from 'react';
// import { GrPrevious, GrNext } from 'react-icons/gr';
// import instance from '../../lib/axios/axiosInstance';
// import { FaLink } from 'react-icons/fa';

// function AdminPost() {
//   const [banners, setBanners] = useState([]);

//   // Split banners by type and position parity
//   const [leftImages, setLeftImages] = useState([]);
//   const [rightImages, setRightImages] = useState([]);
//   const [leftVideos, setLeftVideos] = useState([]);
//   const [rightVideos, setRightVideos] = useState([]);

//   // Navigation indices
//   const [leftImageIndex, setLeftImageIndex] = useState(0);
//   const [rightImageIndex, setRightImageIndex] = useState(0);
//   const [leftVideoIndex, setLeftVideoIndex] = useState(0);
//   const [rightVideoIndex, setRightVideoIndex] = useState(0);

//   async function fetchMarketPlacePost() {
//     try {
//       const response = await instance.get('/v1/admin/market-post');
//       if (response?.data?.data) {
//         const sorted = response.data.data.sort((a, b) => a.position - b.position);

//         const leftImgs = sorted.filter(
//           (item) => item.type === 'image' && item.position === 1,
//         );

//         const rightImgs = sorted.filter(
//           (item) => item.type === 'image' && item.position === 2,
//         );

//         const leftVids = sorted.filter(
//           (item) => item.type === 'video' && item.position === 3,
//         );

//         const rightVids = sorted.filter(
//           (item) => item.type === 'video' && item.position === 4,
//         );

//         console.log(sorted);

//         setBanners(sorted);
//         setLeftImages(leftImgs);
//         setRightImages(rightImgs);
//         setLeftVideos(leftVids);
//         setRightVideos(rightVids);

//         // reset indices
//         setLeftImageIndex(0);
//         setRightImageIndex(0);
//         setLeftVideoIndex(0);
//         setRightVideoIndex(0);
//       }
//     } catch (error) {
//       console.error('Failed to fetch marketplace posts:', error);
//     }
//   }

//   useEffect(() => {
//     fetchMarketPlacePost();
//   }, []);

//   // Auto slide intervals
//   useEffect(() => {
//     const intervals = [];

//     if (leftImages.length > 1) {
//       const interval = setInterval(() => {
//         setLeftImageIndex((prev) => (prev + 1) % leftImages.length);
//       }, 5000);
//       intervals.push(interval);
//     }

//     if (rightImages.length > 1) {
//       const interval = setInterval(() => {
//         setRightImageIndex((prev) => (prev + 1) % rightImages.length);
//       }, 5000);
//       intervals.push(interval);
//     }

//     if (leftVideos.length > 1) {
//       const interval = setInterval(() => {
//         setLeftVideoIndex((prev) => (prev + 1) % leftVideos.length);
//       }, 7000);
//       intervals.push(interval);
//     }

//     if (rightVideos.length > 1) {
//       const interval = setInterval(() => {
//         setRightVideoIndex((prev) => (prev + 1) % rightVideos.length);
//       }, 7000);
//       intervals.push(interval);
//     }

//     return () => intervals.forEach(clearInterval);
//   }, [leftImages, rightImages, leftVideos, rightVideos]);

//   // Render image or video banner
//   const renderBanner = (item) => {
//     if (!item) return null;
//     if (item.type === 'video') {
//       return (
//         // <video
//         //   controls
//         //   className="h-80 w-full object-cover border-2 border-gray-200 rounded"
//         //   src={item.postUrl}
//         //   alt={`Video Banner ${item.position}`}
//         // >
//         //   Your browser does not support the video tag.
//         // </video>

//         <div className="w-full h-full p-1 flex items-center justify-center bg-white">
//           <video
//             controls
//             className="max-w-full max-h-full object-contain rounded-xl"
//             src={item.postUrl}
//           />        
//         </div>

//       );
//     }
//     return (
//       // <img
//       //   src={item.postUrl}
//       //   alt={`Image Banner ${item.position}`}
//       //   className="h-80 w-full object-contain bg-center border-2 border-gray-200 overflow-hidden"
//       // />

//       <div className="w-full h-full flex items-center justify-center bg-white">
//         <img
//           src={item.postUrl}
//           alt={`Image Banner ${item.position}`}
//           loading="lazy" 
//           className="max-w-full max-h-full object-contain border-2 border-gray-100 rounded-xl"
//         />
//       </div>

//     );
//   };

//   // Helper prev/next index logic
//   const prevIndex = (index, arr) => (index === 0 ? arr.length - 1 : index - 1);
//   const nextIndex = (index, arr) => (index + 1) % arr.length;

//   return (
//     <div>
//       {/* Images Row */}
//       <div className="grid grid-cols-1 gap-3 md:grid-cols-2 m-2 mb-16 md:mb-0">
//         {/* Left Images */}
//         {leftImages.length > 0 && (
//           <div className="relative overflow-hidden rounded-lg bg-white h-70 group shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
//             <div
//               className="flex transition-transform duration-1000 ease-in-out h-full"
//               style={{ transform: `translateX(-${leftImageIndex * 100}%)` }}
//             >
//               {leftImages.map((item) => (
//                 <div key={item._id} className="flex-shrink-0 w-full">
//                   {renderBanner(item)}
//                 </div>
//               ))}
//             </div>

//             {leftImages.length > 1 && (
//               <>
//                 <GrPrevious
//                   onClick={() => setLeftImageIndex((i) => prevIndex(i, leftImages))}
//                   className="absolute top-[45%] left-4 rounded-full  p-1 text-4xl hover:bg-slate-400 cursor-pointer select-none"
//                 />
//                 <GrNext
//                   onClick={() => setLeftImageIndex((i) => nextIndex(i, leftImages))}
//                   className="absolute top-[45%] right-4 rounded-full  p-1 text-4xl hover:bg-slate-400 cursor-pointer select-none"
//                 />
//               </>
//             )}

//             <div className="hidden group-hover:flex absolute top-2 right-2 w-8 h-8 bg-white rounded-full justify-center items-center">
//               <a
//                 href={leftImages[leftImageIndex].url}
//                 target="_blank"
//                 rel="noopener noreferrer"
//               >
//                 <FaLink />
//               </a>
//             </div>
//           </div>
//         )}

//         {/* Right Images */}
//         {rightImages.length > 0 && (
//           <div className="relative overflow-hidden rounded-lg bg-white h-70 group shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
//             <div
//               className="flex transition-transform duration-1000 ease-in-out h-full"
//               style={{ transform: `translateX(-${rightImageIndex * 100}%)` }}
//             >
//               {rightImages.map((item) => (
//                 <div key={item._id} className="flex-shrink-0 w-full">
//                   {renderBanner(item)}
//                 </div>
//               ))}
//             </div>

//             {rightImages.length > 1 && (
//               <>
//                 <GrPrevious
//                   onClick={() => setRightImageIndex((i) => prevIndex(i, rightImages))}
//                   className="absolute top-[45%] left-4 rounded-full  p-2 text-4xl hover:bg-slate-400 cursor-pointer select-none"
//                 />
//                 <GrNext
//                   onClick={() => setRightImageIndex((i) => nextIndex(i, rightImages))}
//                   className="absolute top-[45%] right-4 rounded-full  p-2 text-4xl hover:bg-slate-400 cursor-pointer select-none"
//                 />
//               </>
//             )}

//             <div className="hidden group-hover:flex absolute top-2 right-2 w-8 h-8 bg-white rounded-full justify-center items-center">
//               <a
//                 href={rightImages[rightImageIndex].url}
//                 target="_blank"
//                 rel="noopener noreferrer"
//               >
//                 <FaLink />
//               </a>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Videos Row */}
//       <div className="grid grid-cols-1 gap-3 md:grid-cols-2 m-2 mb-16 md:mb-0">
//         {/* Left Videos */}
//         {leftVideos.length > 0 && (
//           <div className="relative overflow-hidden rounded-lg bg-white h-70 group shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
//             <div
//               className="flex transition-transform duration-1000 ease-in-out h-full w-full"
//               style={{ transform: `translateX(-${leftVideoIndex * 100}%)` }}
//             >
//               {leftVideos.map((item) => (
//                 <div key={item._id} className="flex-shrink-0 w-full h-full">
//                   {renderBanner(item)}
//                 </div>
//               ))}
//             </div>

//             {leftVideos.length > 1 && (
//               <>
//                 <GrPrevious
//                   onClick={() => setLeftVideoIndex((i) => prevIndex(i, leftVideos))}
//                   className="absolute top-[45%] left-4 rounded-full  p-2 text-4xl hover:bg-slate-300 cursor-pointer select-none"
//                 />
//                 <GrNext
//                   onClick={() => setLeftVideoIndex((i) => nextIndex(i, leftVideos))}
//                   className="absolute top-[45%] right-4 rounded-full  p-2 text-4xl hover:bg-slate-300 cursor-pointer select-none"
//                 />
//               </>
//             )}

//             <div className="hidden group-hover:flex absolute top-2 right-2 w-8 h-8 bg-white rounded-full justify-center items-center">
//               <a
//                 href={leftVideos[leftVideoIndex].url}
//                 target="_blank"
//                 rel="noopener noreferrer"
//               >
//                 <FaLink />
//               </a>
//             </div>
//           </div>
//         )}

//         {/* Right Videos */}
//         {rightVideos.length > 0 && (
//           <div className="relative overflow-hidden rounded-lg bg-white h-70 group shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
//             <div
//               className="flex transition-transform duration-700 ease-in-out h-full w-full"
//               style={{ transform: `translateX(-${rightVideoIndex * 100}%)` }}
//             >
//               {rightVideos.map((item) => (
//                 <div key={item._id} className="flex-shrink-0 w-full h-full">
//                   {renderBanner(item)}
//                 </div>
//               ))}
//             </div>

//             {rightVideos.length > 1 && (
//               <>
//                 <GrPrevious
//                   onClick={() => setRightVideoIndex((i) => prevIndex(i, rightVideos))}
//                   className="absolute top-[45%] left-4 rounded-full  p-2 text-4xl hover:bg-slate-300 cursor-pointer select-none"
//                 />
//                 <GrNext
//                   onClick={() => setRightVideoIndex((i) => nextIndex(i, rightVideos))}
//                   className="absolute top-[45%] right-4 rounded-full  p-2 text-4xl hover:bg-slate-300 cursor-pointer select-none"
//                 />
//               </>
//             )}

//             <div className="hidden group-hover:flex bg-white absolute top-2 right-2 w-8 h-8 rounded-full justify-center items-center">
//               <a
//                 href={rightVideos[rightVideoIndex].url}
//                 target="_blank"
//                 rel="noopener noreferrer"
//               >
//                 <FaLink />
//               </a>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default AdminPost;




import React, { useEffect, useState } from 'react';
import { GrPrevious, GrNext } from 'react-icons/gr';
import instance from '../../lib/axios/axiosInstance';
import { FaLink } from 'react-icons/fa';

function AdminPost() {
  const [leftImages, setLeftImages] = useState([]);
  const [rightImages, setRightImages] = useState([]);
  const [leftVideos, setLeftVideos] = useState([]);
  const [rightVideos, setRightVideos] = useState([]);

  const [leftImageIndex, setLeftImageIndex] = useState(0);
  const [rightImageIndex, setRightImageIndex] = useState(0);
  const [leftVideoIndex, setLeftVideoIndex] = useState(0);
  const [rightVideoIndex, setRightVideoIndex] = useState(0);

  async function fetchMarketPlacePost() {
    try {
      const response = await instance.get('/v1/admin/market-post');
      if (response?.data?.data) {
        const sorted = response.data.data.sort((a, b) => a.position - b.position);

        setLeftImages(sorted.filter(i => i.type === 'image' && i.position === 1));
        setRightImages(sorted.filter(i => i.type === 'image' && i.position === 2));
        setLeftVideos(sorted.filter(i => i.type === 'video' && i.position === 3));
        setRightVideos(sorted.filter(i => i.type === 'video' && i.position === 4));

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

    if (leftImages.length > 1) {
      intervals.push(setInterval(() => {
        setLeftImageIndex(prev => (prev + 1) % leftImages.length);
      }, 5000));
    }

    if (rightImages.length > 1) {
      intervals.push(setInterval(() => {
        setRightImageIndex(prev => (prev + 1) % rightImages.length);
      }, 5000));
    }

    if (leftVideos.length > 1) {
      intervals.push(setInterval(() => {
        setLeftVideoIndex(prev => (prev + 1) % leftVideos.length);
      }, 7000));
    }

    if (rightVideos.length > 1) {
      intervals.push(setInterval(() => {
        setRightVideoIndex(prev => (prev + 1) % rightVideos.length);
      }, 7000));
    }

    return () => intervals.forEach(clearInterval);
  }, [leftImages, rightImages, leftVideos, rightVideos]);

  const renderBanner = (item) => {
    if (!item) return null;

    if (item.type === 'video') {
      return (
        <video
          controls
          className="w-full h-full object-contain rounded-none"
          src={item.postUrl}
        />
      );
    }

    return (
      <img
        src={item.postUrl}
        alt={`Banner ${item.position}`}
        loading="lazy"
        className="w-full h-full object-contain rounded-none"
      />
    );
  };

  const prevIndex = (index, arr) => (index === 0 ? arr.length - 1 : index - 1);
  const nextIndex = (index, arr) => (index + 1) % arr.length;

  const renderCarousel = (items, index, setIndex, type) => (
    <div className="relative overflow-hidden bg-white rounded-lg h-70 group shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
      <div
        className="flex transition-transform duration-1000 ease-in-out h-full w-full"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {items.map(item => (
          <div key={item._id} className="flex-shrink-0 w-full h-full">
            {renderBanner(item)}
          </div>
        ))}
      </div>

      {items.length > 1 && (
        <>
          <GrPrevious
            onClick={() => setIndex(i => prevIndex(i, items))}
            className="absolute top-1/2 -translate-y-1/2 left-4 z-10 rounded-full p-2 text-3xl bg-white hover:bg-gray-300 cursor-pointer"
          />
          <GrNext
            onClick={() => setIndex(i => nextIndex(i, items))}
            className="absolute top-1/2 -translate-y-1/2 right-4 z-10 rounded-full p-2 text-3xl bg-white hover:bg-gray-300 cursor-pointer"
          />
        </>
      )}

      <div className="hidden group-hover:flex absolute top-2 right-2 w-8 h-8 bg-white rounded-full justify-center items-center z-10">
        <a
          href={items[index]?.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaLink />
        </a>
      </div>
    </div>
  );

  return (
    <div>
      {/* Images */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-2 mb-2">
        {leftImages.length > 0 && renderCarousel(leftImages, leftImageIndex, setLeftImageIndex, 'image')}
        {rightImages.length > 0 && renderCarousel(rightImages, rightImageIndex, setRightImageIndex, 'image')}
      </div>

      {/* Videos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-2 mb-2">
        {leftVideos.length > 0 && renderCarousel(leftVideos, leftVideoIndex, setLeftVideoIndex, 'video')}
        {rightVideos.length > 0 && renderCarousel(rightVideos, rightVideoIndex, setRightVideoIndex, 'video')}
      </div>
    </div>
  );
}

export default AdminPost;
