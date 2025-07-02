import React from "react";
import TextStoryCreator from "./TextStoryCreator"; // Used for live text preview

const StoryBar = ({ stories, onAddStory, onStoryClick }) => {
  return (
    <div className="flex space-x-3 overflow-x-auto p-2">
      {/* Add Story Button */}
      <button
        onClick={onAddStory}
        className="w-24 h-40 bg-white rounded-lg flex flex-col items-center justify-center text-sm text-blue-600 font-semibold shadow hover:bg-blue-50 transition"
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
  const baseClasses = "w-24 h-40 rounded-lg overflow-hidden shadow cursor-pointer";

  if (story.type === "text") {
    return (
      <div onClick={onClick} className={baseClasses} title="View Text Story">
        <TextStoryCreator
          fontStyle={story.fontStyle}
          bgColor={story.bgColor}
          text={story.text || "Your story"}
          style={{ fontSize: "0.7rem", padding: "0.25rem", height: "100%" }}
        />
      </div>
    );
  }

  if (story.type === "video") {
    return (
      <div onClick={onClick} className={`${baseClasses} bg-black`} title="View Video Story">
        <video
          src={story.video}
          muted
          playsInline
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  // Default: photo story
  return (
    <div onClick={onClick} className={baseClasses} title="View Photo Story">
      <img
        src={story.image}
        alt={`${story.user || "User"}'s story`}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default StoryBar;
