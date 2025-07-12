import { useRef } from "react";

function Title({ title }) {
  const titleRef = useRef(null);

  return (
    <div
      ref={titleRef}
      className='absolute px-3 py-0.5 -bottom-10 bg-black rounded-full text-white right-1/2 translate-x-1/2 pointer-events-none transition-all duration-200 ease-in-out'
    >
      <span>{title}</span>
    </div>
  );
}

export default Title;
