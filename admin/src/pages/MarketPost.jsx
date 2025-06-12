import React, { useState, useRef } from 'react';
import { Camera, Plus, Trash2, X, Play, Pause, ChevronDown } from 'lucide-react';

const MarketPost = () => {
  const [currentBanner, setCurrentBanner] = useState({
    file: null,
    url: 'https://storage.googleapis.com/a1aa/image/59f4d141-79d8-4137-3b2c-b6b064f01d6d.jpg',
    type: 'image'
  });
  const [currentTitle, setCurrentTitle] = useState('');
  const [selectedFileType, setSelectedFileType] = useState('image');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [savedItems, setSavedItems] = useState([
    { id: 1, title: 'Title1', banner: { url: 'https://storage.googleapis.com/a1aa/image/b9c00183-0b10-4388-fc9b-e08f6e6039ba.jpg', type: 'image' } },
    { id: 2, title: 'Title2', banner: { url: 'https://storage.googleapis.com/a1aa/image/b9c00183-0b10-4388-fc9b-e08f6e6039ba.jpg', type: 'image' } },
    { id: 3, title: 'Title3', banner: { url: 'https://storage.googleapis.com/a1aa/image/b9c00183-0b10-4388-fc9b-e08f6e6039ba.jpg', type: 'image' } },
    { id: 4, title: 'Title4', banner: { url: 'https://storage.googleapis.com/a1aa/image/b9c00183-0b10-4388-fc9b-e08f6e6039ba.jpg', type: 'image' } },
    { id: 5, title: 'Title5', banner: { url: 'https://storage.googleapis.com/a1aa/image/b9c00183-0b10-4388-fc9b-e08f6e6039ba.jpg', type: 'image' } },
    { id: 6, title: 'Title6', banner: { url: 'https://storage.googleapis.com/a1aa/image/b9c00183-0b10-4388-fc9b-e08f6e6039ba.jpg', type: 'image' } },
  ]);
  const [previewItem, setPreviewItem] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const type = file.type.startsWith('video/') ? 'video' : 'image';
      setCurrentBanner({ file, url, type });
    }
  };

  const getAcceptedFiles = () => {
    return selectedFileType === 'image' ? 'image/*' : 'video/*';
  };

  const handleFileTypeChange = (type) => {
    setSelectedFileType(type);
    setIsDropdownOpen(false);
  };

  const handleAddItem = () => {
    if (currentTitle.trim() && currentBanner.url) {
      const newItem = {
        id: Date.now(),
        title: currentTitle.trim(),
        banner: { url: currentBanner.url, type: currentBanner.type }
      };
      setSavedItems([...savedItems, newItem]);
      setCurrentTitle('');
    }
  };

  const handleDeleteItem = (id) => {
    setSavedItems(savedItems.filter(item => item.id !== id));
  };

  const handleThumbnailClick = (item) => {
    setPreviewItem(item);
    setIsPlaying(false);
  };

  const closePreview = () => {
    setPreviewItem(null);
    setIsPlaying(false);
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const renderMedia = (banner, className = '', showControls = false) => {
    if (banner.type === 'video') {
      return (
        <div className="relative">
          <video
            ref={showControls ? videoRef : null}
            src={banner.url}
            className={className}
            muted
            loop
            onPlay={() => showControls && setIsPlaying(true)}
            onPause={() => showControls && setIsPlaying(false)}
          />
          {!showControls && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-md">
              <Play className="w-6 h-6 text-white" />
            </div>
          )}
        </div>
      );
    }
    return <img src={banner.url} alt="Banner" className={className} />;
  };

  return (
    <div className="bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Add Section */}
       <div className="flex items-end space-x-6 mb-6">
  {/* File Type Dropdown */}
  <div className="relative h-24 flex flex-col justify-between">
    <p className="text-gray-800 font-semibold text-base">File Type</p>
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center justify-between w-32 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <span className="capitalize text-gray-700">{selectedFileType}</span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
      </button>

      {isDropdownOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          <button
            onClick={() => handleFileTypeChange('image')}
            className="w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-100"
          >
            Image
          </button>
          <button
            onClick={() => handleFileTypeChange('video')}
            className="w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-100"
          >
            Video
          </button>
        </div>
      )}
    </div>
  </div>

  {/* Banner Upload */}
  <div className="h-24 flex flex-col justify-between">
    <p className="text-gray-800 font-semibold text-base">Banner1</p>
    <div className="relative inline-block">
      {renderMedia(currentBanner, "rounded-md w-24 h-11 object-cover")}
      <button
        onClick={() => fileInputRef.current?.click()}
        className="absolute top-1 right-1 bg-gray-200 rounded-full p-1 text-gray-700 hover:bg-gray-300"
        aria-label="Upload banner"
      >
        <Camera className="w-4 h-4" />
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept={getAcceptedFiles()}
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  </div>

  {/* Title Input */}
  <div className="flex-1 h-24 flex flex-col justify-between">
    <p className="text-gray-800 font-semibold text-base">Title1</p>
    <input
      value={currentTitle}
      onChange={(e) => setCurrentTitle(e.target.value)}
      className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="Enter title"
      type="text"
    />
  </div>

  {/* Add Button */}
  <button
    onClick={handleAddItem}
    className="ml-6 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2 flex items-center space-x-2"
  >
    <Plus className="w-4 h-4" />
    <span>Add</span>
  </button>
</div>


        {/* Saved Items List */}
        <div className="space-y-2">
          {savedItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center bg-gray-100 rounded-md px-3 py-2 space-x-3 border border-gray-300"
            >
              <div
                onClick={() => handleThumbnailClick(item)}
                className="cursor-pointer"
              >
                {renderMedia(item.banner, "rounded-md flex-shrink-0 w-12 h-10 object-cover hover:opacity-80 transition-opacity")}
              </div>
              <p className="text-gray-400 text-base flex-1 select-none">
                {item.title}
              </p>
              <button
                onClick={() => handleDeleteItem(item.id)}
                className="text-blue-600 hover:text-blue-800 transition-colors"
                aria-label={`Delete ${item.title}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Preview Modal */}
        {previewItem && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-hidden relative">
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-lg font-semibold text-gray-800">
                  {previewItem.title}
                </h3>
                <button
                  onClick={closePreview}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-4 max-h-[70vh] overflow-auto">
                <div className="relative">
                  {previewItem.banner.type === 'video' ? (
                    <div className="relative">
                      <video
                        ref={videoRef}
                        src={previewItem.banner.url}
                        className="max-w-full max-h-[60vh] rounded-md"
                        controls={false}
                        muted
                        loop
                      />
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-center">
                        <button
                          onClick={togglePlayPause}
                          className="bg-black bg-opacity-50 text-white rounded-full p-3 hover:bg-opacity-70 transition-all"
                        >
                          {isPlaying ? (
                            <Pause className="w-6 h-6" />
                          ) : (
                            <Play className="w-6 h-6" />
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={previewItem.banner.url}
                      alt={previewItem.title}
                      className="max-w-full max-h-[60vh] rounded-md object-contain"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketPost;