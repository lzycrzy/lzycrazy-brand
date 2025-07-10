import React, { useEffect, useState } from 'react';
import { GrPrevious, GrNext } from 'react-icons/gr';
import { FaLink } from 'react-icons/fa';
import instance from '../../lib/axios/axiosInstance';

function AdminPost() {
  const [itemsByPosition, setItemsByPosition] = useState({});
  const [indices, setIndices] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await instance.get('/v1/admin/market-post');
        const sorted = res.data.data
          .map((item) => ({
            ...item,
            position: Number(item.position),
            type: item.type.toLowerCase().trim(),
          }))
          .sort((a, b) => a.position - b.position);

        const grouped = {};
        const initIndices = {};

        for (let i = 1; i <= 4; i++) {
          grouped[i] = sorted.filter((item) => item.position === i);
          initIndices[i] = 0;
        }

        console.log("Grouped:", grouped);

        setItemsByPosition(grouped);
        setIndices(initIndices);
      } catch (err) {
        console.error('Failed to fetch:', err);
      }
    };

    fetchData();
  }, []);

  const prevIndex = (i, arr) => (i > 0 ? i - 1 : arr.length - 1);
  const nextIndex = (i, arr) => (i + 1) % arr.length;

  const renderMedia = (item) => {
    if (!item) return null;
    if (item.type === 'video') {
      return (
        <video
          controls
          className="h-80 w-full object-cover border-2 border-gray-200 rounded"
          src={item.postUrl}
        />
      );
    }
    return (
      <img
        src={item.postUrl}
        alt={`Banner ${item.position}`}
        className="h-80 w-full object-contain border-2 border-gray-200 rounded"
      />
    );
  };

  const Carousel = ({ items, position }) => {
    const currentIndex = indices[position] || 0;
    const current = items?.[currentIndex];

    if (!current) return null;

    return (
      <div key={current._id} className="group relative overflow-hidden rounded-lg bg-white shadow">
        <div className="absolute top-2 left-2 z-10 text-xs bg-gray-100 px-2 py-1 rounded font-semibold text-gray-700">
          Position {position}
        </div>

        {renderMedia(current)}

        {items.length > 1 && (
          <>
            <GrPrevious
              onClick={() =>
                setIndices((prev) => ({
                  ...prev,
                  [position]: prevIndex(prev[position], items),
                }))
              }
              className="absolute top-[45%] left-4 rounded-full bg-slate-100 p-2 text-3xl hover:bg-slate-300 cursor-pointer"
            />
            <GrNext
              onClick={() =>
                setIndices((prev) => ({
                  ...prev,
                  [position]: nextIndex(prev[position], items),
                }))
              }
              className="absolute top-[45%] right-4 rounded-full bg-slate-100 p-2 text-3xl hover:bg-slate-300 cursor-pointer"
            />
          </>
        )}

        {current.url && (
          <div className="hidden group-hover:flex absolute top-2 right-2 w-8 h-8 bg-white rounded-full justify-center items-center">
            <a href={current.url} target="_blank" rel="noopener noreferrer">
              <FaLink />
            </a>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      {[1, 2, 3, 4].map((pos) =>
        itemsByPosition[pos]?.length > 0 ? (
          <Carousel key={pos} items={itemsByPosition[pos]} position={pos} />
        ) : (
          <div
            key={`empty-${pos}`}
            className="h-80 border-2 border-dashed rounded flex items-center justify-center text-gray-400"
          >
            No post at position {pos}
          </div>
        )
      )}
    </div>
  );
}

export default AdminPost;
