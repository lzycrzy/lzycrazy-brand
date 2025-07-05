import React, { useState } from 'react';
import { GrNext, GrPrevious } from 'react-icons/gr';

export default function ImgCarousel({ post }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  function next() {
    if (currentIndex < post.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  }
  function prev() {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }
  return (
    <div className="relative h-80 overflow-hidden rounded-lg bg-white shadow">
      <a href={post[currentIndex]?.url} target="_blank">
        <img
          className="h-full w-full object-contain"
          src={post[currentIndex]?.src}
          alt={currentIndex}
        />
      </a>
      <GrPrevious
        onClick={prev}
        className="absolute top-[45%] left-4 rounded-full bg-slate-100 p-2 text-4xl hover:bg-slate-400"
      />
      <GrNext
        onClick={next}
        className="absolute top-[45%] right-4 rounded-full bg-slate-100 p-2 text-4xl hover:bg-slate-400"
      />
    </div>
  );
}
