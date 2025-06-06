import React from 'react';
import { FaCamera, FaFileAlt } from 'react-icons/fa';

const PostCreateBox = () => {
  return (
    <div className=" w-full mb-6 rounded-xl bg-white p-4 shadow-sm">
      <div className="flex items-start space-x-4">
        <img
          src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
          alt="User"
          className="h-11 w-11 rounded-full object-cover"
        />
        <textarea
          placeholder="What's on your mind?"
          className="flex-1 resize-none rounded-xl border bg-gray-50 p-3 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
          rows={3}
        />
      </div>
      <div className="mt-4 flex justify-end space-x-2">
        <button className="flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm text-blue-700 hover:bg-blue-200">
          <FaCamera /> Photo/Video
        </button>
        <button className="flex items-center gap-2 rounded-full bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700">
          <FaFileAlt /> Post
        </button>
      </div>
    </div>
  );
};

export default PostCreateBox;
