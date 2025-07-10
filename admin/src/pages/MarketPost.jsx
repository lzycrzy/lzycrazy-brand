import React, { useState } from 'react';
import { Upload, Calendar, User, Eye, Play, X, Camera } from 'lucide-react';

const NewsDashboard = () => {
  const [formData, setFormData] = useState({
    title: 'Lorem ipsum jewfin jsdnfaskjfn',
    name: '',
    date: '12-06-2025'
  });
  
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  
  const [newsData, setNewsData] = useState([
    {
      id: 1,
      title: 'Breaking News Live Updates: Sri Lanka Speaker Recognises Ranil Wickremesinghe As Prime Minister',
      postDate: '12-06-2025',
      views: '663k',
      userName: 'John Smith',
      thumbnail: '/api/placeholder/60/40',
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'
    },
    
    {
      id: 2,
      title: 'Breaking News Live Updates: Sri Lanka Speaker Recognises Ranil Wickremesinghe As Prime Minister',
      postDate: '11-06-2025',
      views: '663k',
      userName: 'John Smith',
      thumbnail: '/api/placeholder/60/40',
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'
    },
    {
      id: 3,
      title: 'Breaking News Live Updates: Sri Lanka Speaker Recognises Ranil Wickremesinghe As Prime Minister',
      postDate: '10-06-2025',
      views: '663k',
      userName: 'John Smith',
      thumbnail: '/api/placeholder/60/40'
    },
    {
      id: 4,
      title: 'Breaking News Live Updates: Sri Lanka Speaker Recognises Ranil Wickremesinghe As Prime Minister',
      postDate: '09-06-2025',
      views: '663k',
      userName: 'John Smith',
      thumbnail: '/api/placeholder/60/40'
    },
    {
      id: 5,
      title: 'Breaking News Live Updates: Sri Lanka Speaker Recognises Ranil Wickremesinghe As Prime Minister',
      postDate: '08-06-2025',
      views: '663k',
      userName: 'John Smith',
      thumbnail: '/api/placeholder/60/40'
    },
    {
      id: 6,
      title: 'Breaking News Live Updates: Sri Lanka Speaker Recognises Ranil Wickremesinghe As Prime Minister',
      postDate: '07-06-2025',
      views: '663k',
      userName: 'John Smith',
      thumbnail: '/api/placeholder/60/40'
    },
    {
      id: 7,
      title: 'Breaking News Live Updates: Sri Lanka Speaker Recognises Ranil Wickremesinghe As Prime Minister',
      postDate: '06-06-2025',
      views: '663k',
      userName: 'John Smith',
      thumbnail: '/api/placeholder/60/40'
    }
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
    }
  };

  const handleSubmit = () => {
    if (!formData.title.trim() || !formData.name.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    const newEntry = {
      id: newsData.length + 1,
      title: formData.title,
      postDate: formData.date,
      views: '0',
      userName: formData.name,
      thumbnail: videoPreview || '/api/placeholder/60/40',
      videoUrl: videoPreview
    };

    setNewsData(prev => [newEntry, ...prev]);
    
    // Reset form
    setFormData({
      title: '',
      name: '',
      date: new Date().toLocaleDateString('en-GB').split('/').join('-')
    });
    setVideoFile(null);
    setVideoPreview(null);
    
    alert('News entry added successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Upload Form Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Video Upload Section */}
            <div className="lg:col-span-1">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Video</h3>
              <div className="relative">
                {videoPreview ? (
                  <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                    <video 
                      src={videoPreview} 
                      className="w-full h-full object-cover"
                      controls
                    />
                    <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 text-xs font-bold rounded">
                      BREAKING NEWS
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-48 bg-blue-900 rounded-lg flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20">
                      <div className="w-full h-full bg-gradient-to-r from-blue-800 to-blue-900"></div>
                      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMSIgZmlsbD0iIzMzNzNkYyIgZmlsbC1vcGFjaXR5PSIwLjMiLz4KPC9zdmc+')] opacity-50"></div>
                    </div>
                    <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 text-sm font-bold rounded">
                      BREAKING NEWS
                    </div>
                    <div className="absolute bottom-4 right-4 text-white text-xs opacity-75">
                      gettyimages
                    </div>
                    <Play className="w-12 h-12 text-white opacity-75" />
                  </div>
                )}
                
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                  id="video-upload"
                />
                <label
                  htmlFor="video-upload"
                  className="mt-4 w-full bg-white border border-gray-300 rounded-lg px-4 py-2 flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <Upload className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-700 font-medium">Upload</span>
                </label>
              </div>
            </div>

            {/* Form Fields Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title Field */}
              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-3">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter video title"
                  required
                />
              </div>

              {/* Profile Section */}
              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-3">Profile</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                      <User className="w-6 h-6 text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Name"
                        required
                      />
                    </div>
                    
                    <div className="relative">
                      <input
                        type="text"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                        placeholder="DD-MM-YYYY"
                        pattern="\d{2}-\d{2}-\d{4}"
                      />
                      <Calendar className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleSubmit}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
                >
                  Submit
                </button>
              </div>
            </div>
        
      </div>
        </div>

        {/* Data Table Section */}
       <div className="w-full max-w-[1600px] mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
  <div className="overflow-x-auto">
    <table className="min-w-full table-auto">
      <thead className="bg-gray-600">
        <tr>
          <th className="px-4 py-3 text-left text-sm font-medium text-white">Video</th>
          <th className="px-4 py-3 text-left text-sm font-medium text-white">Title</th>
          <th className="px-4 py-3 text-left text-sm font-medium text-white">Post Date</th>
          <th className="px-4 py-3 text-left text-sm font-medium text-white">Views</th>
          <th className="px-4 py-3 text-left text-sm font-medium text-white">User Profile</th>
          <th className="px-4 py-3 text-left text-sm font-medium text-white">User Name</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {newsData.map((item, index) => (
          <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
            <td className="px-4 py-4">
              <div className="relative w-16 h-12 bg-gray-200 rounded overflow-hidden">
                <div className="w-full h-full bg-blue-900 flex items-center justify-center">
                  <Play className="w-4 h-4 text-white" />
                </div>
                <div className="absolute top-0 left-0 bg-red-600 text-white text-xs px-1 py-0.5 rounded-br">
                  LIVE
                </div>
              </div>
            </td>
            <td className="px-4 py-4">
              <div className="text-sm text-gray-900 max-w-xs lg:max-w-md">{item.title}</div>
            </td>
            <td className="px-4 py-4 text-sm text-gray-700">{item.postDate}</td>
            <td className="px-4 py-4 text-sm text-gray-700 font-medium">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4 text-gray-400" />
                {item.views}
              </div>
            </td>
            <td className="px-4 py-4">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-600" />
              </div>
            </td>
            <td className="px-4 py-4 text-sm text-gray-900 font-medium">{item.userName}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

      </div>
    </div>
  );
};

export default NewsDashboard;