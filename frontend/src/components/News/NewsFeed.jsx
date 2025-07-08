import React, { useEffect, useState } from 'react';
import axios from '../../lib/axios/axiosInstance';
import Header from '../static/Header1';
import Footer from '../static/Footer1';

const NewsFeed = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch news from backend
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get('/v1/news'); // Adjust this path based on your setup
        console.log(res.data)
        setNewsItems(res.data);
      } catch (err) {
        console.error('Failed to fetch news:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex flex-1 mt-20 min-h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden md:block w-64 pt-6 gap-2.5 bg-white shadow-md p-4 overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">Top Uploaders</h3>
          <ul className="space-y-4">
            {[...new Set(newsItems.map(item => item.profileName))].map((name, idx) => {
              const image = newsItems.find(item => item.profileName === name)?.profileImage?.url;
              return (
                <li key={idx} className="flex items-center gap-3">
                  <img src={image || "/missing.png"} alt={name || "News Image"} className="w-10 h-10 rounded-full object-cover" loading="lazy" />
                  <span className="text-sm font-medium text-gray-800">{name}</span>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <h2 className="text-2xl font-bold mb-6">Lzycrazy News</h2>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {newsItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <video src={item.video?.url} controls className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h3 className="text-md font-semibold text-gray-800 mb-1 line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {item.profileName} &middot; {new Date(item.date).toDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default NewsFeed;
