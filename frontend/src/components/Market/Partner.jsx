import React from 'react';
import { FaUser } from 'react-icons/fa';

const items = new Array(8).fill('Comming Soon.');

export default function Partner() {
  return (
    <div className="w-full overflow-hidden">
      <div className="scroll-track flex whitespace-nowrap animate-scroll-x gap-4">
        {/* Duplicate the items to create a seamless loop */}
        {[...items, ...items].map((item, index) => (
          <span
            key={index}
            className="p-4 cursor-pointer rounded border border-gray-300 drop-shadow-2xl flex items-center justify-center gap-2 w-48"
          >
            <FaUser size={30} />
            <span className="text-xl">{item}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
