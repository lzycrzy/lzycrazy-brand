import React from 'react';
import Header from '../components/Header1';
import Footer from '../components/Footer1';

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
    // Add more items as needed
  ];

  const uploaders = [
    { name: 'James', image: 'https://randomuser.me/api/portraits/men/10.jpg' },
    { name: 'Aditi Sharma', image: 'https://randomuser.me/api/portraits/women/15.jpg' },
    { name: 'Ravi Das', image: 'https://randomuser.me/api/portraits/men/20.jpg' },
    { name: 'Meena Kapoor', image: 'https://randomuser.me/api/portraits/women/25.jpg' },
    { name: 'Aman Verma', image: 'https://randomuser.me/api/portraits/men/30.jpg' },
    { name: 'Priya Sen', image: 'https://randomuser.me/api/portraits/women/35.jpg' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Main Layout Section */}
      <div className="flex flex-1 min-h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 pt-10 gap-2.5 bg-white  shadow-md p-4 overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4 ">Top Uploaders</h3>
          <ul className="space-y-4">
            {uploaders.map((user, idx) => (
              <li key={idx} className="flex items-center gap-3">
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="text-sm font-medium text-gray-800">{user.name}</span>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <h2 className="text-2xl font-bold  mb-6">Lzycrazy News</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default NewsFeed;
