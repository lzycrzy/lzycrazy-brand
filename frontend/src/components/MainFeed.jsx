import React from 'react';
import Stories from './StorySlider';
import PostCreateBox from './PostCreateBox';
import { FaCamera, FaFileAlt, FaThumbsUp, FaCommentAlt, FaShare } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';

const MainFeed = ({ posts }) => {
  return (
    <div className="flex flex-1 flex-col overflow-y-auto p-4">
      <Stories />
      <PostCreateBox />

      {posts.map((post, idx) => {
        const {
          user,
          createdAt,
          text,
          mediaUrl,
          likesCount,
          commentsCount,
          sharesCount,
        } = post;

        const userImage = user?.image || 'https://flowbite.com/docs/images/people/profile-picture-5.jpg';
        const userName = user?.fullName || 'Unknown User';

        // Determine if media is a video or image
        const isVideo = mediaUrl?.match(/\.(mp4|webm|ogg)$/i);

        return (
          <div key={idx} className="mb-6 rounded-xl bg-white p-5 shadow-sm">
            <div className="mb-2 flex items-center">
              <img
                src={userImage}
                alt={userName}
                className="mr-3 h-10 w-10 rounded-full object-cover"
              />
              <div>
                <div className="font-semibold text-gray-900">{userName}</div>
                <div className="text-xs text-gray-500">
                  {createdAt && !isNaN(new Date(createdAt))
                    ? formatDistanceToNow(new Date(createdAt), { addSuffix: true })
                    : 'Some time ago'}
                </div>
              </div>
              <div className="ml-auto cursor-pointer">...</div>
            </div>

            <div className="mb-2 whitespace-pre-wrap text-gray-800">{text}</div>

            {mediaUrl && (
              <div className="mb-4 w-full overflow-hidden rounded-lg">
                {isVideo ? (
                  <video
                    src={mediaUrl}
                    controls
                    className="max-h-[500px] w-full object-cover"
                  />
                ) : (
                  <img
                    src={mediaUrl}
                    alt="Post media"
                    className="max-h-[500px] w-full object-cover"
                  />
                )}
              </div>
            )}

            <div className="flex items-center justify-between border-t border-gray-200 pt-3 text-sm text-gray-600">
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
      })}
    </div>
  );
};

export default MainFeed;
