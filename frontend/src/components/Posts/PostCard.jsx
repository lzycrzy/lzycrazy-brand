// import React from 'react';
// import { FaThumbsUp, FaCommentAlt, FaShare } from 'react-icons/fa';
// import { formatDistanceToNow } from 'date-fns';
// import { useUser } from '../../context/UserContext';

// const PostCard = ({ post }) => {
//   const {
//     user,          // user object like { _id, fullName, email, image }
//     createdAt,
//     text,
//     mediaUrl,
//     likesCount,
//     commentsCount,
//     sharesCount,
//   } = post;
//   const {  profilePic, displayName, fetchUser, updateUser } = useUser();
//   const userImage = user?.image || 'https://flowbite.com/docs/images/people/profile-picture-5.jpg';
//   const userName = user?.fullName || 'Unknown User';

//   // Helper to detect if media is video
//   const isVideo = mediaUrl && /\.(mp4|webm|ogg)$/i.test(mediaUrl);

//   return (
//     <div className="mb-6 w-full rounded-xl bg-white p-5 shadow-md">
//       {/* Header */}
//       <div className="mb-3 flex items-center">
//         <img
//           src={profilePic|| 'https://i.ibb.co/2kR5zq0/default-avatar.png'}
//           alt={userName}
//           onError={(e) => {
//             e.target.src = 'https://i.ibb.co/2kR5zq0/default-avatar.png';
//           }}
//           className="mr-3 h-12 w-12 rounded-full object-cover"
//         />
//         <div>
//           <div className="font-semibold text-gray-900">{userName}</div>
//           <div className="text-xs text-gray-500">
//             {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
//           </div>
//         </div>
//         <div className="ml-auto cursor-pointer text-gray-400 hover:text-gray-700">...</div>
//       </div>

//       {/* Content */}
//       <div className="mb-4 text-gray-800 whitespace-pre-wrap">{text}</div>

//       {/* Media Display */}
//       {mediaUrl && (
//         <div className="mb-4 w-full rounded-lg overflow-hidden">
//           {isVideo ? (
//             <video
//               src={mediaUrl}
//               controls
//               className="max-h-[500px] w-full object-cover rounded-lg"
//             />
//           ) : (
//             <img
//               src={mediaUrl}
//               alt="Post media"
//               className="max-h-[500px] w-full object-cover rounded-lg"
//             />
//           )}
//         </div>
//       )}

//       {/* Footer */}
//       <div className="flex items-center justify-between border-t border-gray-200 pt-3 text-gray-600 text-sm">
//         <button className="flex items-center space-x-1 hover:text-blue-600">
//           <FaThumbsUp />
//           <span>{likesCount || 0}</span>
//         </button>
//         <button className="flex items-center space-x-1 hover:text-blue-600">
//           <FaCommentAlt />
//           <span>{commentsCount || 0}</span>
//         </button>
//         <button className="flex items-center space-x-1 hover:text-blue-600">
//           <FaShare />
//           <span>{sharesCount || 0}</span>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default PostCard;

import React, { useState, useEffect } from 'react';
import {
  FiHeart,
  FiMessageCircle,
  FiShare2,
} from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import { useUser } from '../../context/UserContext';
import axios from '../../lib/axios/axiosInstance';
import Modal from '../common/Modal';

const PostCard = ({ post }) => {
  const {
    user: postUser,
    createdAt,
    text,
    mediaUrl,
    likes = [],
    comments = [],
    shares = [],
    _id,
  } = post;

  const { user } = useUser(); // Logged-in user
  const isVideo = mediaUrl && /\.(mp4|webm|ogg)$/i.test(mediaUrl);
  const userImage = postUser?.image || 'https://i.ibb.co/2kR5zq0/default-avatar.png';
  const userName = postUser?.fullName || 'Unknown User';

  const [liked, setLiked] = useState(false);
  const [likeList, setLikeList] = useState(likes);
  const [commentList, setCommentList] = useState(comments);
  const [newComment, setNewComment] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const userId = user?._id;
    const isLiked = likeList?.some((l) => {
      const likeUser = typeof l.user === 'string' ? l.user : l.user?._id;
      return likeUser === userId;
    });
    setLiked(isLiked);
  }, [likeList, user]);

  const handleLike = async () => {
    try {
      const res = await axios.post(`/v1/posts/${_id}/like`);
      const updatedLikes = res.data.likes || [];
      setLikeList(updatedLikes);

      const isLiked = updatedLikes.some((l) => {
        const likeUser = typeof l.user === 'string' ? l.user : l.user?._id;
        return likeUser === user._id;
      });

      setLiked(isLiked);
    } catch (err) {
      console.error('Like Error:', err);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const res = await axios.post(`/v1/posts/${_id}/comment`, { text: newComment });
      setCommentList(res.data.comments || []);
      setNewComment('');
    } catch (err) {
      console.error('Comment Error:', err);
    }
  };

  return (
    <>
      <div className="mb-6 w-full rounded-2xl border border-gray-200 bg-white shadow hover:shadow-md transition duration-300">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3">
          <img src={userImage} className="h-10 w-10 rounded-full" alt="User" />
          <div>
            <p className="font-semibold text-gray-900">{userName}</p>
            <p className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>

        {/* Media */}
        {mediaUrl && (
          <div className="max-h-[500px] w-full bg-black">
            {isVideo ? (
              <video src={mediaUrl} controls className="w-full max-h-[500px] object-contain" />
            ) : (
              <img
                src={mediaUrl}
                alt="media"
                className="w-full max-h-[500px] object-cover"
              />
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-6 px-4 pt-3 text-xl text-gray-700">
          <button onClick={handleLike} className={`${liked ? 'text-red-500' : 'hover:text-black'}`}>
            <FiHeart />
          </button>
          <button onClick={() => setShowModal(true)} className="hover:text-black">
            <FiMessageCircle />
          </button>
          <button className="hover:text-black">
            <FiShare2 />
          </button>
        </div>

        {/* Like avatars */}
        {likeList.length > 0 && (
          <div className="flex items-center gap-1 px-4 pt-2">
            {likeList.slice(0, 3).map((like, index) => (
              <img
                key={index}
                src={like.user?.image || 'https://i.ibb.co/2kR5zq0/default-avatar.png'}
                alt="Liked by"
                className="w-6 h-6 rounded-full border"
                title={like.user?.fullName || 'User'}
              />
            ))}
            {likeList.length > 3 && (
              <span className="text-xs text-gray-500 ml-2">+{likeList.length - 3} others</span>
            )}
          </div>
        )}

        {/* Post Text */}
        <div className="px-4 py-2 text-sm text-gray-800 whitespace-pre-wrap">{text}</div>

        {/* Comments count */}
        <div className="px-4 pb-4 text-sm text-gray-500 cursor-pointer" onClick={() => setShowModal(true)}>
          View all {commentList.length} comments
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <div className="space-y-4">
            {/* Post Header */}
            <div className="flex items-center gap-3">
              <img src={userImage} className="w-10 h-10 rounded-full" alt="User" />
              <div>
                <p className="font-semibold">{userName}</p>
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>

            {/* Text + Media */}
            <div className="text-gray-800 text-sm whitespace-pre-wrap">{text}</div>
            {mediaUrl && (
              isVideo ? (
                <video src={mediaUrl} controls className="rounded w-full max-h-[300px]" />
              ) : (
                <img src={mediaUrl} alt="media" className="rounded w-full max-h-[300px] object-contain" />
              )
            )}

            {/* Comments */}
            <div className="max-h-60 overflow-y-auto space-y-3 border-t pt-3">
              {commentList.map((comment, i) => (
                <div key={i} className="flex items-start gap-3 bg-gray-100 p-2 rounded">
                  <img
                    src={comment.user?.image || 'https://i.ibb.co/2kR5zq0/default-avatar.png'}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm">
                      <strong>{comment.user?.fullName || 'Anonymous'}:</strong> {comment.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Comment */}
            <div className="flex gap-2 pt-2">
              <input
                type="text"
                placeholder="Write a comment..."
                className="flex-1 border p-2 rounded"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button
                onClick={handleAddComment}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Post
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default PostCard;
