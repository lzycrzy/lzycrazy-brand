import React, { useState, useEffect } from 'react';
import instance from '../../lib/axios/axiosInstance';
import StoryBar from '../Home/StoryBar';
import StoryCreationModal from '../Home/StoryCreationModal';
import StoryViewer from '../Home/StoryViewer';
import PostCreateBox from '../Posts/PostCreateBox';
import PostCard from '../Posts/PostCard';

const MainFeed = ({ posts, onPostCreated }) => {
  const { user, loading } = useUser();
  const [stories, setStories] = useState([]);
  const [uniqueUserStories, setUniqueUserStories] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewerStories, setViewerStories] = useState([]);
  const [viewerVisible, setViewerVisible] = useState(false);

  // Fetch stories
  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await instance.get('/v1/users/story', {
          withCredentials: true,
        });

      const allStories = res.data.map((story) => {
        const userId = story.user?._id || story.user;
        const img = story.user?.image;
        const normalizedUser = { _id: userId, image: img };

        if (story.text?.content) {
          return {
            ...story,
            user: normalizedUser,
            type: 'text',
            text: {
              content: story.text.content,
              backgroundColor: story.text.backgroundColor || '#000',
              fontStyle: story.text.fontStyle || 'sans-serif',
            },
          };
        } else if (story.video) {
          return { ...story, user: normalizedUser, type: 'video' };
        }

        return { ...story, user: normalizedUser, type: 'photo' };
      });

      setStories(allStories);
      setUniqueUserStories(buildUniqueUserStories(allStories));
    } catch (err) {
      console.error('Failed to load stories:', err.response?.data || err.message);
    }
  }})

  useEffect(() => {
    fetchStories();
  }, []);

  const handleStorySubmit = async (formData) => {
    try {
      setIsUploading(true);

      if (!user || !user.profile || !user.profile.id) {
        throw new Error('User info not available.');
      }

      const res = await instance.post('/v1/users/story', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      const savedStory = res.data.story;

      const fullUser = {
        _id: user._id,
        fullName: user.profile?.name || '',
        email: user.email,
        image: user.profile?.photoURL || '',
      };

      let newStory;
      if (savedStory.text?.content) {
        newStory = {
          ...savedStory,
          type: 'text',
          user: fullUser,
          text: {
            content: savedStory.text.content,
            backgroundColor: savedStory.text.backgroundColor || '#000',
            fontStyle: savedStory.text.fontStyle || 'sans-serif',
          },
        };
      } else if (savedStory.video) {
        newStory = { ...savedStory, type: 'video', user: fullUser };
      } else {
        newStory = { ...savedStory, type: 'photo', user: fullUser };
      }

      //  Fix: Remove existing user stories and add only the latest
      const otherStories = stories.filter((s) => {
        const sUserId = typeof s.user === 'object' ? s.user._id : s.user;
        return sUserId !== user._id;
      });

      const combinedStories = [newStory, ...otherStories];

      setStories(combinedStories);
      setUniqueUserStories(buildUniqueUserStories(combinedStories));

      
     
    window.location.reload();
    setShowCreateModal(false);
    
     
      navigate('/dashboard');
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
      {/* Story Bar with one story per user */}
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

      {/* Post Creation */}
      <PostCreateBox onPostCreated={onPostCreated} />

      {/* Posts */}
      {posts?.length > 0 ? (
        posts.map((post, idx) => (
          <PostCard key={post._id || idx} post={post} />
        ))
      ) : (
        <div className="text-center text-gray-500 mt-10">No posts to display</div>
      )}
    </div>
  );
};

export default MainFeed;