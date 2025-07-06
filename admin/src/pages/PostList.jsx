import { Play } from 'lucide-react';
import { useEffect, useState } from 'react';
import UpdateMarketPostList from '../components/UpdateMarketPostList';
import instance from '../utils/axios';
import Loader from '../components/Loader';

export default function PostList() {
  const [isEditing, setIsEditing] = useState(false);
  const [editPostData, setEditPostData] = useState(null);
  const [newsData, setNewsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [temp, setTemp] = useState([]);

  function filterHandler(event) {
    let filterType = event.target.value;
    if (filterType === 'All') {
      setNewsData([...temp]);
    } else {
      setNewsData(temp.filter(item => item.type === filterType));
    }
  }

  function postEditHandler(editingData) {
    setIsEditing(true);
    setEditPostData(editingData);
  }

  async function deletePost(_id, postUrl) {
    const confirm = window.confirm('Are you sure you want to delete this post?');
    if (confirm) {
      const response = await instance.delete(`/admin/deletePost/${_id}`, postUrl);
      if (response.data?.message) {
        setNewsData(prev => prev.filter(item => item._id !== _id));
      }
    }
  }

  async function postListHandler() {
    setIsLoading(true);
    const response = await instance.get('/admin/marketPost');
    if (response.data?.message) {
      setNewsData([...response.data.message]);
      setTemp([...response.data.message]);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    postListHandler();
  }, []);

  return (
    <div className="w-full flex justify-center py-4">
      <div className="w-full max-w-screen-xl bg-white rounded-lg shadow-sm overflow-hidden px-4">
        <div className="mb-4 flex items-center gap-2">
          <label htmlFor="filter-post" className="text-lg font-semibold">Filter</label>
          <select onChange={filterHandler} className="border border-gray-300 rounded-lg px-3 py-1" id="filter-post">
            <option value="All">Select</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
        </div>

        {isLoading ? (
          <Loader />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-full table-auto">
              <thead className="bg-gray-600">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white">Video</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white">User Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white">URL</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white">Post Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white">Edit</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {newsData.map((item, index) => (
                  <tr key={item._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
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
                    <td className="px-4 py-4 text-sm text-gray-900 font-medium">{item.userName}</td>
                    <td className="px-4 py-4 text-sm text-gray-900 font-medium break-words max-w-[200px]">{item.url}</td>
                    <td className="px-4 py-4 text-sm text-gray-700">{item.postDate?.split('T')[0]}</td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      <button
                        onClick={() => postEditHandler(item)}
                        className="bg-blue-600 hover:bg-blue-700 py-1 px-3 rounded-lg text-white text-sm"
                      >
                        Edit
                      </button>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      <button
                        onClick={() => deletePost(item._id, item.postUrl)}
                        className="bg-red-600 hover:bg-red-700 py-1 px-3 rounded-lg text-white text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {isEditing && (
              <UpdateMarketPostList
                key={editPostData._id}
                isEditing={isEditing}
                setNewsData={setNewsData}
                setIsEditing={setIsEditing}
                data={editPostData}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
