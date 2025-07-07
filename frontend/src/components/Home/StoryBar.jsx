// import React from 'react';
// import TextStoryCreator from './TextStoryCreator';

// const StoryBar = ({ stories, onAddStory, onStoryClick }) => {
//   return (
//     <div className="flex space-x-3 overflow-x-auto p-2">
//       {/* Add Story Button */}
//       <button
//         onClick={onAddStory}
//         className="flex h-40 w-24 flex-col items-center justify-center rounded-lg bg-white text-sm font-semibold text-blue-600 shadow transition hover:bg-blue-50"
//       >
//         + Add Story
//       </button>

//       {/* Story Items */}
//       {Array.isArray(stories) &&
//         stories.map((story, index) =>
//           story ? (
//             <StoryItem
//               key={story.id || index}
//               story={story}
//               onClick={() => onStoryClick(story)}
//             />
//           ) : null,
//         )}
//     </div>
//   );
// };

// const StoryItem = ({ story, onClick }) => {
//   const baseClasses =
//     'w-24 h-40 rounded-lg overflow-hidden shadow cursor-pointer';
//   console.log(story.type)
//   if (story.type === 'text') {
//     return (
//       <div onClick={onClick} className={baseClasses} title="View Text Story">
//         <TextStoryCreator
//           text={story.text?.content || 'Your story'}
//           backgroundColor={story.text?.backgroundColor || '#000'} // ✅ Corrected
//           fontStyle={story.text?.fontStyle || 'sans-serif'} // ✅ Also fix this to just a string
//           style={{ fontSize: '0.7rem', padding: '0.25rem', height: '100%' }}
//         />
//       </div>
//     );
//   }

//   if (story.type === 'video') {
//     return (
//       <div onClick={onClick} className={baseClasses} title="View Video Story">
//         <video
//           src={story.video}
//           muted
//           playsInline
//           preload="metadata" // ✅ Only loads metadata, not entire video
//           className="h-full w-full object-cover"
//           onLoadedMetadata={(e) => e.target.currentTime = 0.1} // ✅ Show first frame
//         />
//       </div>
//     );
//   }
  

//   // Default: photo story
//   return (
//     <div onClick={onClick} className={baseClasses} title="View Photo Story">
//       <img
//         src={story.image}
//         alt={`${story.user?.name || 'User'}'s story`}
//         className="h-full w-full object-cover"
//       />
//     </div>
//   );
// };

// export default StoryBar;


import React from 'react';
import TextStoryCreator from './TextStoryCreator';

const StoryBar = ({ stories, onAddStory, onStoryClick }) => {
  return (
    <div className="flex space-x-3 overflow-x-auto p-2">
      {/* Add Story Button */}
      <button
        onClick={onAddStory}
        className="flex h-40 w-24 flex-col items-center justify-center rounded-lg bg-white text-sm font-semibold text-blue-600 shadow transition hover:bg-blue-50"
      >
        + Add Story
      </button>

      {/* Story Items */}
      {Array.isArray(stories) &&
        stories.map((story, index) =>
          story ? (
            <StoryItem
              key={story.id || index}
              story={story}
              onClick={() => onStoryClick(story)}
            />
          ) : null
        )}
    </div>
  );
};

const StoryItem = ({ story, onClick }) => {
  const baseClasses =
    'w-24 h-40 rounded-lg overflow-hidden shadow cursor-pointer relative'; // relative for positioning profile image
    console.log("User:", story.user);

  const renderProfileImage = () => {
    const img = story.user?.image;
    return img ? (
      <img
        src={img}
        alt="User"
        className="absolute bottom-1 left-1 w-6 h-6 rounded-full border-2 border-white object-cover z-10"
      />
    ) : null;
  };

  if (story.type === 'text') {
    return (
      <div onClick={onClick} className={baseClasses} title="View Text Story">
        <TextStoryCreator
          text={story.text?.content || 'Your story'}
          backgroundColor={story.text?.backgroundColor || '#000'}
          fontStyle={story.text?.fontStyle || 'sans-serif'}
          style={{ fontSize: '0.7rem', padding: '0.25rem', height: '100%' }}
        />
        {renderProfileImage()}
      </div>
    );
  }

  if (story.type === 'video') {
    return (
      <div onClick={onClick} className={baseClasses} title="View Video Story">
        <video
          src={story.video}
          muted
          playsInline
          preload="metadata"
          className="h-full w-full object-cover"
          onLoadedMetadata={(e) => (e.target.currentTime = 0.1)}
        />
        {renderProfileImage()}
      </div>
    );
  }

  // Default: photo story
  return (
    <div onClick={onClick} className={baseClasses} title="View Photo Story">
      <img
        src={story.image}
        alt={`${story.user?.name || 'User'}'s story`}
        className="h-full w-full object-cover"
      />
      {renderProfileImage()}
    </div>
  );
};

export default StoryBar;
