import { useRef } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

const stories = [
  {
    name: "Victor Exrixon",
    profile: "https://randomuser.me/api/portraits/men/32.jpg",
    storyImage: "https://source.unsplash.com/random/300x500?nature",
  },
  {
    name: "Surfiya Zakir",
    profile: "https://randomuser.me/api/portraits/women/44.jpg",
    storyImage: "https://source.unsplash.com/random/300x500?beach",
  },
  {
    name: "David Goria",
    profile: "https://randomuser.me/api/portraits/men/65.jpg",
    storyImage: "https://source.unsplash.com/random/300x500?mountains",
  },
  {
    name: "Alex Moore",
    profile: "https://randomuser.me/api/portraits/men/85.jpg",
    storyImage: "https://source.unsplash.com/random/300x500?city",
  },
  {
    name: "Nina Price",
    profile: "https://randomuser.me/api/portraits/women/22.jpg",
    storyImage: "https://source.unsplash.com/random/300x500?sunset",
  },
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
          {/* Add Story Card */}
          <div className="w-1/5 h-48 flex-shrink-0 flex flex-col items-center justify-center bg-gray-800 text-white rounded-lg p-4">
            <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full mb-2">
              <Plus className="text-gray-800" />
            </div>
            <p className="text-sm font-semibold">Add Story</p>
          </div>

          {/* Story Cards */}
          {stories.map((story, index) => (
            <div
              key={index}
              className="relative w-1/5 h-48 flex-shrink-0 rounded-xl overflow-hidden shadow-lg bg-cover bg-center text-white"
              style={{
                backgroundImage: `url(https://randomuser.me/api/portraits/men/${30 + index}.jpg)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="absolute inset-0 bg-grey bg-opacity-20"></div>
              <div className="absolute top-3 left-3">
                <img
                  src={story.profile}
                  alt={story.name}
                  className="w-10 h-10 rounded-full border-2 border-white shadow-md"
                />
              </div>
              <div className="absolute bottom-2 left-2 right-2 text-sm font-semibold text-center truncate">
                {story.name}
              </div>
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
