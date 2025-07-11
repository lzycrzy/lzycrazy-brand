
// export default function Loader() {
//   return (
//     <div className='fixed w-full h-full top-0 bottom-0 left-0 bg-white/20 flex justify-center items-center'>
//       <div className='relative p-1 size-14  md:size-16 bg-gradient-to-tr animate-spin from-indigo-600 to-white rounded-full'>
//        <svg className='size-full rounded-full bg-white'>

//        </svg>
//       </div>
//     </div>
//   )
// }

// components/Loader.jsx
import React from 'react';

const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-none">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
};

export default Loader;
