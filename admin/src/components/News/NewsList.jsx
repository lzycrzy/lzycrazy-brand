import React, { useState } from 'react';
import { FaEye, FaUser, FaPlay, FaTrash } from 'react-icons/fa';

const NewsList = () => {
  const [newsList, setNewsList] = useState([
    {
      id: 1,
      title: 'Breaking Tech News!',
      date: '2025-06-20',
      profileName: 'Amit Kumar',
      profileImage: 'https://randomuser.me/api/portraits/men/75.jpg',
      video: null,
      views: '663k',
    },
    {
      id: 2,
      title: 'World News Update',
      date: '2025-06-21',
      profileName: 'Priya Sharma',
      profileImage: 'https://randomuser.me/api/portraits/women/65.jpg',
      video: null,
      views: '521k',
    },
  ]);

  const handleDelete = (id) => {
    const updated = newsList.filter((item) => item.id !== id);
    setNewsList(updated);
  };

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
                  <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    {/* Video cell */}
                    <td className="px-4 py-4">
                      <div className="relative w-20 h-12 bg-gray-200 rounded overflow-hidden flex items-center justify-center">
                        {item.video ? (
                          <video
                            src={URL.createObjectURL(item.video)}
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

                    {/* Title */}
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900 max-w-xs lg:max-w-md">
                        {item.title}
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-4 text-sm text-gray-700">
                      {new Date(item.date).toLocaleDateString()}
                    </td>

                    {/* Views */}
                    <td className="px-4 py-4 text-sm text-gray-700 font-medium">
                      <div className="flex items-center gap-1">
                        <FaEye className="w-4 h-4 text-gray-400" />
                        {item.views}
                      </div>
                    </td>

                    {/* Profile image */}
                    <td className="px-4 py-4">
                      <img
                        src={item.profileImage}
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover border"
                      />
                    </td>

                    {/* Username */}
                    <td className="px-4 py-4 text-sm text-gray-900 font-medium">
                      {item.profileName}
                    </td>

                    {/* Delete button */}
                    <td className="px-4 py-4">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
                      >
                        <FaTrash className="w-4 h-4" /> Delete
                      </button>
                    </td>
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

export default NewsList;
