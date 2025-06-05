import { useRef } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

const stories = [
  { name: "Victor Exrixon" },
  { name: "Surfiya Zakir" },
  { name: "David Goria" },
  { name: "Alex Moore" },
  { name: "Nina Price" },
];

export default function Stories() {
  const scrollRef = useRef(null);

  const scroll = (direction) => { 
    if (scrollRef.current) {
      const container = scrollRef.current;
      const scrollAmount = container.offsetWidth;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative w-full px-4 py-6 bg-gray-100">
      <div className="flex items-center space-x-2">
        <button
          onClick={() => scroll("left")}
          className="z-10 p-2 rounded-full bg-gray-200 hover:bg-gray-300 cursor-pointer"
        >
          <ChevronLeft />
        </button>

        <div ref={scrollRef} className="flex overflow-hidden w-full gap-3">
          <div className="w-1/5  h-48 flex-shrink-0 flex flex-col items-center justify-center bg-gray-800 text-white rounded-lg p-4">
            <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full mb-2">
              <Plus className="text-gray-800" />
            </div>
            <p className="text-sm font-semibold">Add Story</p>
          </div>

          {stories.map((story, index) => (
            <div
              key={index}
              className="w-1/5 h-48 flex-shrink-0 flex flex-col items-center justify-end rounded-xl p-4 bg-gradient-to-t from-black via-gray-800 to-gray-600 text-white shadow-lg transform transition"
            >
              <img
                src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                alt="profile"
                className="w-14 h-14 rounded-full border-2 border-white mb-3 shadow-md"
              />
              <p className="text-sm font-semibold text-center truncate w-full">
                {story.name}
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          className="z-10 p-2 rounded-full bg-gray-200 hover:bg-gray-300 cursor-pointer"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}
