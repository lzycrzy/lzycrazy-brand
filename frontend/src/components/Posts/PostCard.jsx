import React from 'react';
import { FaThumbsUp, FaCommentAlt, FaShare } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import { useUser } from '../../context/UserContext';

const PostCard = ({ post }) => {
  const {
    user,          // user object like { _id, fullName, email, image }
    createdAt,
    text,
    mediaUrl,
    likesCount,
    commentsCount,
    sharesCount,
  } = post;
  const {  profilePic, displayName, fetchUser, updateUser } = useUser();
  const userImage = user?.image || 'https://flowbite.com/docs/images/people/profile-picture-5.jpg';
  const userName = user?.fullName || 'Unknown User';

  // Helper to detect if media is video
  const isVideo = mediaUrl && /\.(mp4|webm|ogg)$/i.test(mediaUrl);

  return (
    <div className="mb-6 w-full rounded-xl bg-white p-5 shadow-md">
      {/* Header */}
      <div className="mb-3 flex items-center">
        <img
          src={profilePic}
          alt={userName}
          className="mr-3 h-12 w-12 rounded-full object-cover"
        />
        <div>
          <div className="font-semibold text-gray-900">{userName}</div>
          <div className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </div>
        </div>
        <div className="ml-auto cursor-pointer text-gray-400 hover:text-gray-700">...</div>
      </div>

      {/* Content */}
      <div className="mb-4 text-gray-800 whitespace-pre-wrap">{text}</div>

      {/* Media Display */}
      {mediaUrl && (
        <div className="mb-4 w-full rounded-lg overflow-hidden">
          {isVideo ? (
            <video
              src={mediaUrl}
              controls
              className="max-h-[500px] w-full object-cover rounded-lg"
            />
          ) : (
            <img
              src={mediaUrl}
              alt="Post media"
              className="max-h-[500px] w-full object-cover rounded-lg"
            />
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-gray-200 pt-3 text-gray-600 text-sm">
        <button className="flex items-center space-x-1 hover:text-blue-600">
          <FaThumbsUp />
          <span>{likesCount || 0}</span>
        </button>
        <button className="flex items-center space-x-1 hover:text-blue-600">
          <FaCommentAlt />
          <span>{commentsCount || 0}</span>
        </button>
        <button className="flex items-center space-x-1 hover:text-blue-600">
          <FaShare />
          <span>{sharesCount || 0}</span>
        </button>
      </div>
    </div>
  );
};

export default PostCard;
