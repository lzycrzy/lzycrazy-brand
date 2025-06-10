import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Loader2 } from "lucide-react";
import axios from "../lib/axios/axiosInstance";

export default function Stories() {
  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const fetchStories = async () => {
    try {
      const res = await axios.get("/v1/users/story", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials:"true",
      });
      console.log(res.data);
      setStories(res.data);
    } catch (err) {
      console.error("Failed to load stories:", err);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("image", file);

      await axios.post("/v1/users/story", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
        withCredentials:"true",
      });

      await fetchStories(); // refresh story list
    } catch (err) {
      console.error("Error uploading story:", err);
    } finally {
      setLoading(false);
    }
  };

  const openFilePicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  return (
    <div className="relative w-full px-4 py-6 bg-gray-100">
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="flex items-center space-x-2">
        <button
          onClick={() => scroll("left")}
          className="z-10 p-2 rounded-full bg-gray-200 hover:bg-gray-300 cursor-pointer"
        >
          <ChevronLeft />
        </button>

        <div ref={scrollRef} className="flex overflow-hidden w-full gap-3">
          {/* Add Story Card */}
          <div
            className="w-1/5 h-48 flex-shrink-0 flex flex-col items-center justify-center bg-gray-800 text-white rounded-lg p-4 cursor-pointer"
            onClick={openFilePicker}
          >
            <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full mb-2">
              {loading ? (
                <Loader2 className="animate-spin text-gray-800" />
              ) : (
                <Plus className="text-gray-800" />
              )}
            </div>
            <p className="text-sm font-semibold">Add Story</p>
          </div>

          {/* Render Stories */}
          {stories.map((story, index) => (
            <div
              key={index}
              className="relative w-1/5 h-48 flex-shrink-0 rounded-xl overflow-hidden shadow-lg bg-cover bg-center text-white"
              style={{
                backgroundImage: `url(${story.image})`,
              }}
            >
              
              <div className="absolute top-3 left-3">
                <img
                  src={story.user.image}
                  alt={story.user.fullName}
                  className="w-10 h-10 rounded-full border-2 border-white shadow-md"
                />
              </div>
              <div className="absolute bottom-2 left-2 right-2 text-sm font-semibold text-center truncate">
                {story.user.name}
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
