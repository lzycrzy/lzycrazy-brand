// // import React from 'react';
// // import Stories from './StorySlider';
// // import PostCreateBox from '../Posts/PostCreateBox';
// // import { FaCamera, FaFileAlt, FaThumbsUp, FaCommentAlt, FaShare } from 'react-icons/fa';
// // import { formatDistanceToNow } from 'date-fns';

// // const MainFeed = ({ posts }) => {
// //   return (
// //     <div className="flex flex-1 flex-col  p-6">
// //       <Stories />
// //       <PostCreateBox />

// //       {posts.map((post, idx) => {
// //         const {
// //           user,
// //           createdAt,
// //           text,
// //           mediaUrl,
// //           likesCount,
// //           commentsCount,
// //           sharesCount,
// //         } = post;

// //         const userImage = user?.image || 'https://flowbite.com/docs/images/people/profile-picture-5.jpg';
// //         const userName = user?.fullName || 'Unknown User';

// //         // Determine if media is a video or image
// //         const isVideo = mediaUrl?.match(/\.(mp4|webm|ogg)$/i);

// //         return (
// //           <div key={idx} className="mb-6 overflow-y-auto scroll-hidden rounded-xl bg-white p-5 shadow-sm">
// //             <div className="mb-2 flex items-center">
// //               <img
// //                 src={userImage}
// //                 alt={userName}
// //                 className="mr-3 h-10 w-10 rounded-full object-cover"
// //               />
// //               <div>
// //                 <div className="font-semibold text-gray-900">{userName}</div>
// //                 <div className="text-xs text-gray-500">
// //                   {createdAt && !isNaN(new Date(createdAt))
// //                     ? formatDistanceToNow(new Date(createdAt), { addSuffix: true })
// //                     : 'Some time ago'}
// //                 </div>
// //               </div>
// //               <div className="ml-auto cursor-pointer">...</div>
// //             </div>

// //             <div className="mb-2 whitespace-pre-wrap text-gray-800">{text}</div>

// //             {mediaUrl && (
// //               <div className="mb-4 w-full overflow-hidden rounded-lg">
// //                 {isVideo ? (
// //                   <video
// //                     src={mediaUrl}
// //                     controls
// //                     className="max-h-[500px] w-full object-cover"
// //                   />
// //                 ) : (
// //                   <img
// //                     src={mediaUrl}
// //                     alt="Post media"
// //                     className="max-h-[500px] w-full object-cover"
// //                   />
// //                 )}
// //               </div>
// //             )}

// //             <div className="flex items-center justify-between border-t border-gray-200 pt-3 text-sm text-gray-600">
// //               <button className="flex items-center space-x-1 hover:text-blue-600">
// //                 <FaThumbsUp />
// //                 <span>{likesCount || 0}</span>
// //               </button>
// //               <button className="flex items-center space-x-1 hover:text-blue-600">
// //                 <FaCommentAlt />
// //                 <span>{commentsCount || 0}</span>
// //               </button>
// //               <button className="flex items-center space-x-1 hover:text-blue-600">
// //                 <FaShare />
// //                 <span>{sharesCount || 0}</span>
// //               </button>
// //             </div>
// //           </div>
// //         );
// //       })}
// //     </div>
// //   );
// // };

// // export default MainFeed;


// import React from 'react';
// import Stories from './StorySlider';
// import PostCreateBox from '../Posts/PostCreateBox';
// import PostCard from '../Posts/PostCard'; // 🔹 Import reusable PostCard

// const MainFeed = ({ posts,onPostCreated }) => {
//   return (
//     <div className="flex flex-1 flex-col gap-6 p-6">
//       {/* Stories & Create Post */}
//       <Stories />
//       <PostCreateBox onPostCreated={onPostCreated} />

//       {/* Posts List */}
//       {posts?.length > 0 ? (
//         posts.map((post, idx) => (
//           <PostCard key={post._id || idx} post={post} />
//         ))
//       ) : (
//         <div className="text-center text-gray-500 mt-10">No posts to display</div>
//       )}
//     </div>
//   );
// };

// export default MainFeed;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import instance from '../../lib/axios/axiosInstance';
import StoryBar from '../Home/StoryBar';
import StoryCreationModal from '../Home/StoryCreationModal';
import StoryViewer from '../Home/StoryViewer';
import PostCreateBox from '../Posts/PostCreateBox';
import PostCard from '../Posts/PostCard';
import Loader from '../../components/common/Spinner';
import { useUser } from '../../context/UserContext'; // ✅ Added

const MainFeed = ({ posts, onPostCreated }) => {
  const { user, loading } = useUser(); // ✅ Fetched from context
  const [stories, setStories] = useState([]);
  const [uniqueUserStories, setUniqueUserStories] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewerStories, setViewerStories] = useState([]);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const buildUniqueUserStories = (storyList) => {
    const seen = new Set();
    const unique = [];
    for (const s of [...storyList].reverse()) {
      const uid = typeof s.user === 'object' ? s.user._id : s.user;
      if (!seen.has(uid)) {
        unique.push(s);
        seen.add(uid);
      }
    }
    return unique.reverse();
  };

  const fetchStories = async () => {
    try {
      const res = await instance.get('/v1/users/story', {
        withCredentials: true,
      });

      const allStories = res.data.map((story) => {
        if (story.text?.content) {
          return {
            ...story,
            type: 'text',
            text: {
              content: story.text.content,
              backgroundColor: story.text.backgroundColor || '#000',
              fontStyle: story.text.fontStyle || 'sans-serif',
            },
          };
        } else if (story.video) {
          return { ...story, type: 'video' };
        }
        return { ...story, type: 'photo' };
      });

      setStories(allStories);
      setUniqueUserStories(buildUniqueUserStories(allStories));
    } catch (err) {
      console.error('Failed to load stories:', err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const handleStorySubmit = async (formData) => {
    try {
      setIsUploading(true);

      if (!user || !user._id) {
        throw new Error("User info not available.");
      }

      const res = await instance.post('/v1/users/story', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      const savedStory = res.data.story;

      let newStory;
      if (savedStory.text?.content) {
        newStory = {
          ...savedStory,
          type: 'text',
          user: { _id: user._id },
          text: {
            content: savedStory.text.content,
            backgroundColor: savedStory.text.backgroundColor || '#000',
            fontStyle: savedStory.text.fontStyle || 'sans-serif',
          },
        };
      } else if (savedStory.video) {
        newStory = { ...savedStory, type: 'video', user: { _id: user._id } };
      } else {
        newStory = { ...savedStory, type: 'photo', user: { _id: user._id } };
      }

      const updatedStories = [newStory, ...stories];
      setStories(updatedStories);
      setUniqueUserStories(buildUniqueUserStories(updatedStories));

      setShowCreateModal(false);
      setIsUploading(false);
    } catch (err) {
      console.error('Story upload failed:', err.message || err);
      alert('Failed to share story. Make sure you are logged in.');
      setIsUploading(false);
    }
  };

  const openViewer = async (story) => {
    const userId = typeof story.user === 'object' ? story.user._id : story.user;
    if (!userId) {
      console.error('Invalid user in story:', story);
      return;
    }

    const userStories = stories.filter((s) => {
      const sUserId = typeof s.user === 'object' ? s.user._id : s.user;
      return sUserId === userId;
    });

    if (userStories.length === 0) {
      try {
        const res = await instance.get(`/v1/users/story/view/${userId}`, {
          withCredentials: true,
        });

        const serverStories = res.data.map((s) => {
          if (s.text?.content) {
            return {
              ...s,
              type: 'text',
              text: {
                content: s.text.content,
                backgroundColor: s.text.backgroundColor || '#000',
                fontStyle: s.text.fontStyle || 'sans-serif',
              },
            };
          } else if (s.video) {
            return { ...s, type: 'video' };
          }
          return { ...s, type: 'photo' };
        });

        setViewerStories(serverStories);
        setViewerVisible(true);
      } catch (err) {
        console.error('Failed to load user stories:', err);
      }
    } else {
      setViewerStories(userStories);
      setViewerVisible(true);
    }
  };

  const closeViewer = () => {
    setViewerVisible(false);
    setViewerStories([]);
  };

  if (loading || !user) {
    return <Loader />;
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {isUploading && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
          <Loader />
        </div>
      )}

      <StoryBar
        stories={uniqueUserStories}
        onAddStory={() => setShowCreateModal(true)}
        onStoryClick={openViewer}
      />

      {showCreateModal && (
        <StoryCreationModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleStorySubmit}
          user={user}
        />
      )}

      {viewerVisible && viewerStories.length > 0 && (
        <StoryViewer
          stories={viewerStories}
          initialIndex={0}
          onClose={closeViewer}
        />
      )}

      <PostCreateBox onPostCreated={onPostCreated} />

      {posts?.length > 0 ? (
        posts.map((post, idx) => (
          <PostCard key={post._id || idx} post={post} />
        ))
      ) : (
        <div className="text-center text-gray-500 mt-10">
          No posts to display
        </div>
      )}
    </div>
  );
};

export default MainFeed;
