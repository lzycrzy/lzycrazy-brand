import React from 'react';

const PostCard = ({ post }) => {
  return (
    <div className="mb-6 w-full rounded-xl bg-white p-5 shadow-sm">
      <div className="mb-2 flex items-center">
        <img
          src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
          alt="User"
          className="mr-3 h-10 w-10 rounded-full"
        />
        <div>
          <div className="font-semibold">{post.user}</div>
          <div className="text-xs text-gray-500">{post.time}</div>
        </div>
        <div className="ml-auto cursor-pointer">...</div>
      </div>

      <div className="mb-2">{post.content}</div>

      {post.image && (
        <img
          src={post.image}
          alt="Post"
          className="mb-2 h-72 w-full rounded-lg object-cover"
        />
      )}

      <div className="mt-2 flex justify-around text-sm text-gray-600">
        <div className="flex items-center space-x-1">👍 {post.likes}</div>
        <div className="flex items-center space-x-1">💬 {post.comments}</div>
        <div className="flex items-center space-x-1">🔗 {post.share}</div>
      </div>
    </div>
  );
};

export default PostCard;
