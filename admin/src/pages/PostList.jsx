import { Play } from 'lucide-react';
import { useEffect, useState } from 'react';
import UpdateMarketPostList from '../components/UpdateMarketPostList';
import instance from '../utils/axios';
import Loader from '../components/loader';

export default function PostList() {
  const [isEditing, setIsEditing] = useState(false);
  const [editPostData, setEditPostData] = useState(null);
  const [newsData, setNewsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [temp, setTemp] = useState([]);
  const[deleting,setDeleting]=useState(false)
  function filterHandler(event) {
    let filterType = event.target.value;
    if (filterType == 'all') {
      setNewsData([...temp]);
    }
    setNewsData(temp.filter((item) => item.type == filterType));
  }
  function postEditHandler(editingData) {
    setIsEditing((prev) => !prev);
    setEditPostData(editingData);
  }
  async function deletePost(_id, postUrl) {
    const confirm = window.confirm('Are you sure you want to delete post');
    if (confirm) {
      setDeleting(true)
      const response = await instance.delete(
        `/admin/deletePost/${_id}`,
        postUrl,
      );
      if (response.data?.message) {
        setDeleting(false)
        setNewsData((prev) => prev.filter((item) => item._id !== _id));
      }
    }
  }
  async function postListHandler() {
    setIsLoading(true);
    const response = await instance.get('/admin/marketPost');
    if (response.data?.message) {
      setIsLoading(false);
      setNewsData([...response?.data.message]);
      setTemp([...response?.data.message]);
    }
  }
  useEffect(() => {
    postListHandler();
  }, []);
  return (
    <div>
      <div className="scrollbar-hide flex h-[80vh] w-full justify-center overflow-y-hidden rounded-lg py-2 shadow-sm lg:max-w-[90vw]">
        {isLoading ? (
          <Loader />
        ) : (
          <div className="scrollbar-hide space-y-3 overflow-auto ">
            <div className="space-x-2 font-semibold">
              <label className="text-lg" htmlFor="filter-post">
                Filter
              </label>
              <select
                onChange={filterHandler}
                className="rounded-lg border-2 border-solid px-3"
                id="filter-post"
              >
                <option value="all">Select</option>
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            </div>
            <table>
              <thead className="bg-gray-600">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white">
                    Video
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white">
                    User Name
                  </th>
                  <th className="flex justify-center px-4 py-3 text-left text-sm font-medium text-white">
                    Url
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white">
                    Post Date
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white">
                    <h4>Edit</h4>
                  </th>
                  <th className="flex justify-center px-4 py-3 text-left text-sm font-medium text-white">
                    {' '}
                    <h4>Delete</h4>
                  </th>
                  {/* <th className="flex gap-24 px-4 py-3 text-left text-sm font-medium text-white"><h4>Edit</h4> <h4>Delete</h4></th>              */}
                </tr>
              </thead>
              <tbody className="space-y-2 divide-y  divide-gray-200">
                {newsData.map((item, index) => (
                  <tr
                    key={item.id}
                    className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  >
                    <td className="flex gap-3 px-4 py-4">
                      <div className="relative h-12 w-16 overflow-hidden rounded bg-gray-200">
                        <div className="flex h-full w-full items-center justify-center bg-blue-900">
                          <Play className="h-4 w-4 text-white" />
                        </div>
                        <div className="absolute top-0 left-0 rounded-br bg-red-600 px-1 py-0.5 text-xs text-white">
                          LIVE
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">
                      {item.userName}
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">
                      {item.url}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      {item.postDate?.split('T')[0]}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      <button
                        onClick={() => postEditHandler(item)}
                        className="rounded-lg bg-blue-600 px-3 py-1 text-lg text-white hover:bg-blue-700"
                      >
                        Edit
                      </button>
                    </td>
                    <td className="flex gap-4 px-4 py-4 text-sm text-gray-700">
                      {/* <button onClick={()=>postEditHandler(item)} className='bg-blue-600 hover:bg-blue-700 py-1 px-3 rounded-lg text-white text-lg'>Edit</button>  */}
                      <button
                        onClick={() => deletePost(item._id, item.postUrl)}
                        className="rounded-lg bg-blue-600 px-3 py-1 text-lg text-white hover:bg-blue-700"
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
    {deleting&&<Loader/>}
    </div>
  );
}
