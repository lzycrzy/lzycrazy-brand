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
import { useNavigate } from 'react-router-dom'; // for redirect
import instance from '../../lib/axios/axiosInstance';
import StoryBar from '../Home/StoryBar';
import StoryCreationModal from '../Home/StoryCreationModal';
import StoryViewer from '../Home/StoryViewer';
import PostCreateBox from '../Posts/PostCreateBox';
import PostCard from '../Posts/PostCard';
import Loader from '../../components/common/Spinner';//  your spinner

const MainFeed = ({ posts, onPostCreated, user }) => {
  const [stories, setStories] = useState([]);
  const [uniqueUserStories, setUniqueUserStories] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewerStories, setViewerStories] = useState([]);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // spinner
  const navigate = useNavigate(); //  redirect

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

      const seen = new Set();
      const unique = [];
      for (const s of allStories.slice().reverse()) {
        const uid = typeof s.user === 'object' ? s.user._id : s.user;
        if (!seen.has(uid)) {
          unique.push(s);
          seen.add(uid);
        }
      }
      setUniqueUserStories(unique.reverse());
    } catch (err) {
      console.error('Failed to load stories:', err.response?.data || err.message);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchStories();
  }, []);

  // Submit new story
  const handleStorySubmit = async (formData) => {
    try {
      setIsUploading(true);
  
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
          user: user, // ✅ Add full user object
          text: {
            content: savedStory.text.content,
            backgroundColor: savedStory.text.backgroundColor || '#000',
            fontStyle: savedStory.text.fontStyle || 'sans-serif',
          },
        };
      } else if (savedStory.video) {
        newStory = { ...savedStory, type: 'video', user: user }; // ✅ add user
      } else {
        newStory = { ...savedStory, type: 'photo', user: user }; // ✅ add user
      }
  
      const updatedStories = [newStory, ...stories];
      setStories(updatedStories);
  
      // Rebuild uniqueUserStories
      const seen = new Set();
      const unique = [];
      for (const s of updatedStories) {
        const uid = typeof s.user === 'object' ? s.user._id : s.user;
        if (!seen.has(uid)) {
          unique.push(s);
          seen.add(uid);
        }
      }
      setUniqueUserStories(unique);
  
      setShowCreateModal(false);
      setIsUploading(false);
  
      // Optionally reload view
      // navigate("/");
    } catch (err) {
      console.error('Story upload failed:', err.response?.data || err.message);
      alert('Failed to share story.');
      setIsUploading(false);
    }
  };
  
  const openViewer = async (story) => {
    const userId = typeof story.user === 'object' ? story.user._id : story.user;
    if (!userId) {
      console.error('Invalid user in story:', story);
      return;
    }

    try {
      const res = await instance.get(`/v1/users/story/view/${userId}`, {
        withCredentials: true,
      });

      const userStories = res.data.map((s) => {
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

      setViewerStories(userStories);
      setViewerVisible(true);
    } catch (err) {
      console.error('Failed to load user stories:', err);
    }
  };

  const closeViewer = () => {
    setViewerVisible(false);
    setViewerStories([]);
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Spinner while uploading */}
      {isUploading && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
          <Loader/>
        </div>
      )}

      {/* Story Bar */}
      <StoryBar
        stories={uniqueUserStories}
        onAddStory={() => setShowCreateModal(true)}
        onStoryClick={openViewer}
      />

      {/* Story Modal */}
      {showCreateModal && (
        <StoryCreationModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleStorySubmit}
          user={user}
        />
      )}

      {/* Viewer */}
      {viewerVisible && viewerStories.length > 0 && (
        <StoryViewer
          stories={viewerStories}
          initialIndex={0}
          onClose={closeViewer}
        />
      )}

      {/* Post Create */}
      <PostCreateBox onPostCreated={onPostCreated} />

      {/* Posts */}
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
