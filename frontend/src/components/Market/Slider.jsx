import React, { useState, useEffect, useRef } from 'react';
import { GrPrevious, GrNext } from 'react-icons/gr';
import { FaLink } from 'react-icons/fa';

export default function Slider({ items, autoSlideInterval = 5000 }) {
  // ALWAYS call hooks here, no early returns before this
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef(null);

  // Early return AFTER hooks
  if (!items || items.length === 0) {
    return <div className="p-4 text-center">No items to display</div>;
  }

  const nextIndex = (i) => (i + 1) % items.length;
  const prevIndex = (i) => (i - 1 + items.length) % items.length;

  const triggerAnimation = () => {
    setAnimating(true);
    setTimeout(() => setAnimating(false), 500);
  };

  const goNext = () => {
    setIndex((i) => {
      const nxt = nextIndex(i);
      triggerAnimation();
      return nxt;
    });
  };

  const goPrev = () => {
    setIndex((i) => {
      const prev = prevIndex(i);
      triggerAnimation();
      return prev;
    });
  };

  useEffect(() => {
    if (items.length <= 1) return;

    timerRef.current = setInterval(() => {
      setIndex((i) => {
        const nxt = nextIndex(i);
        triggerAnimation();
        return nxt;
      });
    }, autoSlideInterval);

    return () => clearInterval(timerRef.current);
  }, [items, autoSlideInterval]);

  const currentItem = items[index];

  const renderBanner = (item) => {
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
        className="h-80 w-full object-contain bg-center border-2 border-gray-200 overflow-hidden"
      />
    );
  };

  return (
    <div
      key={currentItem._id}
      className={`group relative overflow-hidden rounded-lg bg-white shadow
        transition-transform duration-500 ease-in-out
        ${animating ? 'slide-left' : ''}`}
    >
      {renderBanner(currentItem)}

      {items.length > 1 && (
        <>
          <GrPrevious
            onClick={goPrev}
            className="absolute top-[45%] left-4 rounded-full bg-slate-600 p-2 text-4xl hover:bg-slate-400 cursor-pointer"
          />
          <GrNext
            onClick={goNext}
            className="absolute top-[45%] right-4 rounded-full bg-slate-600 p-2 text-4xl hover:bg-slate-400 cursor-pointer"
          />
        </>
      )}

      <div className="hidden group-hover:flex absolute top-2 right-2 w-8 h-8 bg-white rounded-full justify-center items-center">
        <a href={currentItem.url} target="_blank" rel="noopener noreferrer">
          <FaLink />
        </a>
      </div>
    </div>
  );
}
