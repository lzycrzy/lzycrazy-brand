import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Loader2, X } from 'lucide-react';
import axios from '../../lib/axios/axiosInstance';

export default function Stories() {
  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUserStories, setSelectedUserStories] = useState(null);
  const [viewerId, setViewerId] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setViewerId(user?._id || null);
    fetchStories();
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.offsetWidth;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const fetchStories = async () => {
    try {
      const res = await axios.get('/v1/users/story', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        withCredentials: true,
      });
      setStories(res.data);
    } catch (err) {
      console.error('Failed to load stories for slider:', err);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('image', file);
      await axios.post('/v1/users/story', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      await fetchStories();
    } catch (err) {
      console.error('Error uploading story:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStoryClick = async (story) => {
    try {
      await axios.post(
        `/v1/users/story/view/${story._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          withCredentials: true,
        },
      );

      const res = await axios.get(`/v1/users/story/view/${story.user._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        withCredentials: true,
      });
      console.log("views",res.data)
      setSelectedUserStories(res.data);
    } catch (err) {
      console.error(
        "Failed to record story view or fetch user's stories:",
        err,
      );
    }
  };

  const openFilePicker = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  return (
    <div className="relative w-full bg-gray-100 px-4 py-6">
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
  
      {/* Desktop Arrows & Story Cards */}
      <div className="hidden sm:flex items-center space-x-2">
        <button
          onClick={() => scroll('left')}
          className="z-10 rounded-full bg-gray-200 p-2 hover:bg-gray-300"
        >
          <ChevronLeft />
        </button>
  
        <div
          ref={scrollRef}
          className="scrollbar-hide flex w-full gap-3 overflow-x-auto sm:overflow-x-visible"
        >
          {/* Add Story Card (Desktop) */}
          <div
            onClick={openFilePicker}
            className="flex h-48 w-[180px] flex-shrink-0 cursor-pointer flex-col items-center justify-center rounded-lg bg-gray-800 p-4 text-white"
          >
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-white">
              {loading ? (
                <Loader2 className="animate-spin text-gray-800" />
              ) : (
                <Plus className="text-gray-800" />
              )}
            </div>
            <p className="text-sm font-semibold">Add Story</p>
          </div>
  
          {/* Desktop Stories */}
          {stories.map((story) => (
            <div
              key={story._id}
              onClick={() => handleStoryClick(story)}
              className="relative h-48 w-[180px] flex-shrink-0 cursor-pointer rounded-xl bg-cover bg-center shadow-md"
              style={{ backgroundImage: `url(${story.image})` }}
            >
              <div className="absolute top-3 left-3">
                <img
                  src={story.user.image}
                  alt={story.user.name}
                  className="h-10 w-10 rounded-full border-2 border-white"
                />
              </div>
              <div className="absolute bottom-2 left-2 right-2 text-center text-sm font-semibold text-white">
                {story.user.name}
              </div>
              <div className="absolute top-2 right-2 rounded-full bg-black bg-opacity-50 px-2 py-1 text-xs text-white">
                {story.views?.length ?? 0} views
              </div>
            </div>
          ))}
        </div>
  
        <button
          onClick={() => scroll('right')}
          className="z-10 rounded-full bg-gray-200 p-2 hover:bg-gray-300"
        >
          <ChevronRight />
        </button>
      </div>
  
      {/* Mobile: Instagram-style Circular Scrollable Stories */}
      <div
        ref={scrollRef}
        className="sm:hidden flex gap-4 overflow-x-auto scrollbar-hide mt-2"
      >
        {/* Add Story (Mobile) */}
        <div onClick={openFilePicker} className="flex flex-col items-center">
          <div className="mb-1 h-16 w-16 rounded-full border-2 border-dashed border-blue-500 flex items-center justify-center">
            {loading ? (
              <Loader2 className="animate-spin text-blue-600" />
            ) : (
              <Plus className="text-blue-600" />
            )}
          </div>
          <p className="text-xs text-center text-blue-600">Add</p>
        </div>
  
        {/* Mobile Stories */}
        {stories.map((story) => (
          <div
            key={story._id}
            onClick={() => handleStoryClick(story)}
            className="flex flex-col items-center"
          >
            <img
              src={story.user.image}
              alt={story.user.name}
              className="h-25 w-25 rounded-full border-4 border-blue-500 object-cover"
            />
            <p className="mt-1 text-xs text-center text-gray-700">
              {story.user.name}
            </p>
          </div>
        ))}
      </div>
  
      {/* Modal Story Viewer */}
      {selectedUserStories && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4">
          <div className="relative max-h-full w-full max-w-4xl overflow-y-auto rounded-lg bg-white">
            <button
              className="absolute top-2 right-2 rounded-full p-2 text-black hover:bg-gray-200"
              onClick={() => setSelectedUserStories(null)}
            >
              <X size={24} />
            </button>
  
            <h2 className="border-b p-4 text-xl font-bold">
              {selectedUserStories[0]?.user?.fullName}'s Stories
            </h2>
  
            <div className="relative flex gap-4 overflow-x-auto px-4 py-6">
              {selectedUserStories.map((story) => (
                <div
                  key={story._id}
                  className="min-w-[90%] overflow-hidden rounded-lg border shadow-md"
                >
                  <img
                    src={story.image}
                    alt="story"
                    className="max-h-[500px] w-full object-contain"
                  />
                  <div className="p-3">
                    <p className="text-sm text-gray-600">
                      Uploaded: {new Date(story.createdAt).toLocaleString()}
                    </p>
                    {story.views.map((view, i) =>
                      view.user ? (
                        <li key={i} className="mt-1 flex items-center space-x-2">
                          <img
                            src={view.user.image}
                            alt={view.user.fullName}
                            className="h-6 w-6 rounded-full"
                          />
                          <span className="text-sm text-gray-700">
                            {view.user.fullName} at{' '}
                            {new Date(view.viewedAt).toLocaleString()}
                          </span>
                        </li>
                      ) : (
                        <li key={i} className="text-sm text-gray-500">
                          Unknown viewer
                        </li>
                      )
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