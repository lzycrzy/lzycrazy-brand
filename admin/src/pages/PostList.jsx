import { Upload, Calendar, User, Eye, Play, X, Camera } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import UpdateMarketPostList from '../components/UpdateMarketPostList';
import instance from '../utils/axios';
import { toast } from 'react-toastify';
import { formatDate } from '../utils/formateDate';

export default function PostList() {
  const [isEditing, setIsEditing] = useState(false);
  const [editPostData, setEditPostData] = useState(null);
  
  const [temp, setTemp] = useState(null);
  const [filterable, setFilterable] = useState(null);

  function filterHandler(event) {
    let filterType = event.target.value;

    if (filterType === 'all') {
      setTemp(filterable);
      return;
    }
    setTemp(filterable.filter((item) => item.type == filterType));
  }

  const deleteMarketPost = async (id) => {
    const toastId = toast.loading('post deleting')
    try {
      const res = await instance.delete(`/admin/market-post/delete/${id}`);
      if (res?.success) {
        toast.success('post deleted successfully!')
      }

      console.log(res.data.data);
      setTemp(res.data.data)
      setFilterable(res.data.data);
    } catch (error) {
      console.log(error);
      toast.error('post not deleted');
    }

    toast.dismiss(toastId);
  };

  useEffect(() => {
    async function getPostList() {
      try {
        const res = await instance.get('/admin/market-post');
        console.log(res.data);
        setTemp(res.data.data);
        setFilterable(res.data.data);
      } catch (error) {
        console.log(error);
      }
    }

    getPostList();
  }, [isEditing, editPostData])

  return (
    <div>
      <div className="scrollbar-hide flex w-full justify-center overflow-y-hidden rounded-lg py-2 shadow-sm lg:max-w-[90vw]">
        <div className="space-y-3 w-full overflow-auto">
          <div className="space-x-2 font-semibold p-2">
            <label className="text-lg" htmlFor="filter-post">
              Filter:
            </label>
            <select
              onChange={filterHandler}
              className="rounded-lg border px-5 outline-none"
              id="filter-post"
            >
              <option value="" disabled>Select</option>
              <option value="all">All</option>
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
          </div>
          <table className='w-full'>
            <thead className="bg-gray-600">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-white">
                  Media
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
                <th colSpan={2} className="text-center px-4 py-3 text-sm font-medium text-white">
                  <h4>Action</h4>
                </th>
                
                {/* <th className="flex gap-24 px-4 py-3 text-left text-sm font-medium text-white"><h4>Edit</h4> <h4>Delete</h4></th>              */}
              </tr>
            </thead>
            <tbody className="space-y-2 divide-y divide-gray-200">
              {temp?.map((item, index) => (
                <tr
                
                  key={item._id}
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
                    {item.name}
                  </td>
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">
                    {item.url}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {formatDate(item.postDate)}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700 flex justify-center gap-2">
                    <button  onClick={() => {
                    setIsEditing(true);
                    setEditPostData(item);
                  }} className="rounded-lg bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700">
                      Edit
                    </button>
                    <button  onClick={() => deleteMarketPost(item._id)} className="rounded-lg bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700">
                      Delete
                    </button>
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                  </td>
                  {/* <td className="px-4 py-4 space-x-12 text-sm text-gray-700">
                    <button className='bg-blue-600 hover:bg-blue-700 py-1 px-3 rounded-lg text-white text-lg'>Edit</button>
                    <button className='bg-blue-600 hover:bg-blue-700 py-1 px-3 rounded-lg text-white text-lg'>Delete</button>
                    </td> */}
                </tr>
              ))}
            </tbody>
          </table>
          {isEditing && (
            <UpdateMarketPostList
              setEditData={setEditPostData}
              setIsEditing={setIsEditing}
              data={editPostData}
            />
          )}
        </div>
      </div>
    </div>
  );
}
