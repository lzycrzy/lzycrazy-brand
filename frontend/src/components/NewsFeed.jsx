import React from 'react';
import Header from '../components/Header';

const NewsFeed = () => {
  const newsItems = [
    {
      title: 'Breaking News Live Updates: Sri Lanka speaker recognises Ranil Wickremesinghe as Prime Minister',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      author: 'James',
      timeAgo: '2 Days Ago',
      views: '623k',
    },
    {
      title: 'India launches new satellite to boost communication in rural areas',
      videoUrl: 'https://www.w3schools.com/html/movie.mp4',
      author: 'Aditi Sharma',
      timeAgo: '1 Day Ago',
      views: '312k',
    },
    {
      title: 'Flood alert in Assam as heavy rains continue',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      author: 'Ravi Das',
      timeAgo: '3 Hours Ago',
      views: '102k',
    },
    // You can add more news items here
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold text-blue-700 mb-6">Top News</h2>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {newsItems.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <video
                src={item.videoUrl}
                controls
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-md font-semibold text-gray-800 mb-1 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {item.author} &middot; {item.timeAgo}
                </p>
                <p className="text-xs text-gray-500">{item.views} views</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsFeed;
