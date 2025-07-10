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
import { Routes, Route } from 'react-router-dom';
import instance from '../../lib/axios/axiosInstance';
import StoryBar from '../Home/StoryBar';
import StoryCreationModal from '../Home/StoryCreationModal';
import StoryViewer from '../Home/StoryViewer';
// import PostCreateBox from '../Posts/PostCreateBox';
// import PostCard from '../Posts/PostCard';
import CreatePost from '../Posts/CreatePost';
import ImageDetail from '../Posts/ImageDetail';
import CreatePostBox from '../Posts/createPostBox';
// import VideoOptions from '../Posts/';

const MainFeed = ({ posts, onPostCreated, user }) => {
  const [stories, setStories] = useState([]);
  const [uniqueUserStories, setUniqueUserStories] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewerStories, setViewerStories] = useState([]);
  const [viewerVisible, setViewerVisible] = useState(false);
    const [savedImage, setSavedImage] = useState(null);
    const [showPostModal, setShowPostModal] = useState(false);

  // Fetch stories
  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await instance.get('/v1/users/story', {
          withCredentials: true,
        });

        const allStories = res.data.map((story) => {
          if (story.text?.content) {
            return { ...story, type: 'text', text: story.text.content };
          } else if (story.video) {
            return { ...story, type: 'video' };
          }
          return { ...story, type: 'photo' };
        });

        setStories(allStories);

        // Filter: show only latest story per user in StoryBar
        const seen = new Set();
        const unique = [];
        for (const s of allStories) {
          const uid = typeof s.user === 'object' ? s.user._id : s.user;
          if (!seen.has(uid)) {
            unique.push(s);
            seen.add(uid);
          }
        }
        setUniqueUserStories(unique);
      } catch (err) {
        console.error('Failed to load stories:', err.response?.data || err.message);
      }
    };

    fetchStories();
  }, []);

  // Submit new story
  const handleStorySubmit = async (formData) => {
    try {
      const res = await instance.post('/v1/users/story', formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      const savedStory = res.data.story;
      const updated = [...stories, savedStory];
      setStories(updated);
      setShowCreateModal(false);
    } catch (err) {
      console.error("Story upload failed:", err.response?.data || err.message);
      alert("Failed to share story.");
    }
  };

  // When a story is clicked: fetch all stories for that user
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
          return { ...s, type: 'text', bgColor:s.text.backgroundColor, text: s.text.content };
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

  // Handle save image from ImageDetail component
  const handleSaveImage = (imageUrl) => {
    setSavedImage(imageUrl); // Save the image URL after cropping or modifying
  };
  async function post(){
            const dell= await instance.get("/v1/Post/")
            console.log("dell",dell);
            
  }
useEffect(()=>{
post()

},[])
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
        {/* Post Creation */}
         <CreatePostBox
      user={user}
      onOpenModal={() => setShowPostModal(true)} 
    />
      {showPostModal && (
      <CreatePost
        user={user}
        onClose={() => setShowPostModal(false)} // Add this prop in CreatePost
        // onPostCreated={handlePostCreated} // Refresh posts on submit
      />
    )}
       {/* <CreatePost savedImage={savedImage} onPostCreated={onPostCreated} /> */}
      {/* Story Bar with one story per user */}
      <StoryBar
        stories={uniqueUserStories}
        onAddStory={() => setShowCreateModal(true)}
        onStoryClick={openViewer}
      />

      {/* Story Creation Modal */}
      {showCreateModal && (
        <StoryCreationModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleStorySubmit}
          user={user}
        />
      )}

      {/* Story Viewer */}
      {viewerVisible && viewerStories.length > 0 && (
        <StoryViewer
          stories={viewerStories}
          initialIndex={0}
          onClose={closeViewer}
        />
      )}

      {/* Post Creation */}
      {/* <PostCreateBox onPostCreated={onPostCreated} />

      {/* Posts */}
      {/* {posts?.length > 0 ? (
        posts.map((post, idx) => (
          <PostCard key={post._id || idx} post={post} />
        ))
      ) : (
        <div className="text-center text-gray-500 mt-10">No posts to display</div>
      )}  */}
     
  
     

      {/* Routes for other components */}
      <Routes>
        <Route
          path="/image-detail"
          element={<ImageDetail onSaveImage={handleSaveImage} />}
        />
         {/* <Route path="/video-options" element={<VideoOptions />} /> */}
      </Routes>
    
    </div>
  );
};

export default MainFeed;