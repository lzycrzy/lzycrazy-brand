import React, { useEffect, useState } from 'react';
import { FaEye, FaPlay, FaTrash } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import instance from '../../utils/axios';
import ConfirmationModal from '../common/ConfirmationModal';

const NewsList = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const res = await instance.get('/news');
      setNewsList(res.data);
    } catch (err) {
      console.error('Failed to fetch news:', err);
      toast.error('Failed to fetch news');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await instance.delete(`/news/${selectedItem._id}`);
      toast.success('News deleted successfully');
      setModalOpen(false);
      fetchNews(); // Or use: window.location.reload();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete news');
    }
  };

  if (loading) return <div className="p-6 text-center">Loading news...</div>;

  return (
    <div className="p-4 max-w-7xl mx-auto bg-gray-100 rounded shadow">
      <div className="bg-white rounded-lg shadow-sm overflow-auto max-h-[540px] border border-gray-200">
        <table className="min-w-full table-fixed">
          <thead className="bg-gray-600 text-white sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">Video</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Title</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Post Date</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Views</th>
              <th className="px-4 py-3 text-left text-sm font-medium">User Profile</th>
              <th className="px-4 py-3 text-left text-sm font-medium">User Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 bg-white">
            {newsList.length > 0 ? (
              newsList.map((item, index) => (
                <tr
                  key={item._id}
                  className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
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
                      onClick={() => handleDelete(item)}
                      className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
                    >
                      <FaTrash className="w-4 h-4" /> Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  No news found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this news item?"
      />
    </div>
  );
};

export default NewsList;
