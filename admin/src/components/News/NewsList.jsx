import React, { useEffect, useState } from 'react';
import { FaEye, FaUser, FaPlay, FaTrash } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import instance from '../../utils/axios';

const NewsList = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch news on mount
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await instance.get('/news');
        console.log(res.data)
        setNewsList(res.data);
      } catch (err) {
        console.error('Failed to fetch news:', err);
        toast.error('Failed to fetch news');
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  //  Delete news from backend
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this news item?')) return;
    try {
      await instance.delete(`/news/${id}`);
      setNewsList(prev => prev.filter((item) => item._id !== id));
      toast.success('News deleted');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete news');
    }
  };

  if (loading) return <div className="p-6 text-center">Loading news...</div>;

  return (
    <div className="min-h-screen p-6 bg-gray-100 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-600">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white">Video</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white">Title</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white">Post Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white">Views</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white">User Profile</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white">User Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {newsList.map((item, index) => (
                  <tr key={item._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-4">
                      <div className="relative w-20 h-12 bg-gray-200 rounded overflow-hidden flex items-center justify-center">
                        {item.video?.url ? (
                          <video
                            src={item.video.url}
                            className="w-full h-full object-cover"
                            controls
                          />
                        ) : (
                          <>
                            <div className="w-full h-full bg-blue-900 flex items-center justify-center">
                              <FaPlay className="w-4 h-4 text-white" />
                            </div>
                            <div className="absolute top-0 left-0 bg-red-600 text-white text-xs px-1 py-0.5 rounded-br">
                              LIVE
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 max-w-xs lg:max-w-md">
                      {item.title}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      {new Date(item.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700 font-medium">
                      <div className="flex items-center gap-1">
                        <FaEye className="w-4 h-4 text-gray-400" />
                        {item.views || '0'}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <img
                        src={item.profileImage?.url || 'https://via.placeholder.com/40'}
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover border"
                      />
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 font-medium">
                      {item.profileName}
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
                      >
                        <FaTrash className="w-4 h-4" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {newsList.length === 0 && (
              <div className="text-center text-gray-500 p-6">No news found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsList;
