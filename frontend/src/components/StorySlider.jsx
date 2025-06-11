import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Loader2, X } from "lucide-react";
import axios from "../lib/axios/axiosInstance";

export default function Stories() {
  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // For the modal: all stories of the clicked user
  const [selectedUserStories, setSelectedUserStories] = useState(null);

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
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        withCredentials: true,
      });
      setStories(res.data);
    } catch (err) {
      console.error("Failed to load stories for slider:", err);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    console.log(file)
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("image", file);

      await axios.post("/v1/users/story", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      await fetchStories(); // refresh story list
    } catch (err) {
      console.error("Error uploading story:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle click on a story in the slider
  const handleStoryClick = async (story) => {
    try {
      // Record view for the clicked story id
      await axios.post(`/v1/users/story/view/${story._id}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        withCredentials: true,
      });

      // Fetch all stories of the user
      const res = await axios.get(`/v1/users/story/view/${story.user._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        withCredentials: true,
      });
      setSelectedUserStories(res.data);
    } catch (err) {
      console.error("Failed to record story view or fetch user's stories:", err);
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

          {/* Render Stories (one per user) */}
          {stories.map((story) => (
            <div
              key={story._id || story.id}
              className="relative w-1/5 h-48 flex-shrink-0 rounded-xl overflow-hidden shadow-lg bg-cover bg-center text-white cursor-pointer"
              style={{ backgroundImage: `url(${story.image})` }}
              onClick={() => handleStoryClick(story)}
            >
              <div className="absolute top-3 left-3">
                <img
                  src={story.user.image}
                  alt={story.user.name || story.user.fullName}
                  className="w-10 h-10 rounded-full border-2 border-white shadow-md"
                />
              </div>
              <div className="absolute bottom-2 left-2 right-2 text-sm font-semibold text-center truncate">
                {story.user.name}
              </div>
              <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
                {/* Show views count */}
                {story.views?.length ?? 0} views
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

      {/* Story Viewer Modal: Show all stories of selected user */}
      {selectedUserStories && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-4 overflow-auto">
          <div className="relative bg-white rounded-lg max-w-3xl w-full max-h-full overflow-y-auto">
            <button
              className="absolute top-2 right-2 text-black p-2 hover:bg-gray-200 rounded-full"
              onClick={() => setSelectedUserStories(null)}
            >
              <X size={24} />
            </button>

            <h2 className="text-xl font-bold p-4 border-b">
              {selectedUserStories[0]?.user?.name}'s Stories
            </h2>

            <div className="p-4 space-y-6">
              {selectedUserStories.map((story) => (
                <div key={story._id} className="border rounded-lg overflow-hidden shadow-md">
                  <img
                    src={story.image}
                    alt="story"
                    className="w-full max-h-96 object-contain"
                  />
                  <div className="p-3">
                    <p className="text-sm text-gray-600">
                      Uploaded at: {new Date(story.createdAt).toLocaleString()}
                    </p>
                    <h4 className="mt-2 font-semibold">Viewed by:</h4>
                    {story.views.length === 0 ? (
                      <p className="text-gray-500 text-sm">No views yet</p>
                    ) : (
                      <ul className="max-h-40 overflow-y-auto">
                        {story.views.map((view) => (
                          <li key={view.user._id} className="flex items-center space-x-2 mt-1">
                            <img
                              src={view.user.image}
                              alt={view.user.name}
                              className="w-6 h-6 rounded-full"
                            />
                            <span className="text-sm text-gray-700">
                              {view.user.name} at {new Date(view.viewedAt).toLocaleString()}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
