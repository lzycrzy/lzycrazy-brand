import React from "react";

const TextStoryCreator = ({
  fontStyle = "Arial",
  backgroundColor = "#ffb6c1", 
  text = "Your text here",
  style = {},
}) => {
  const isGradient =
    typeof backgroundColor === "string" &&
    backgroundColor.includes("gradient");

  return (
    <div
      className="w-full h-full flex items-center justify-center px-3 text-white text-center font-bold rounded"
      style={{
        background: isGradient ? backgroundColor : undefined,
        backgroundColor: !isGradient ? backgroundColor : undefined,
        fontFamily: fontStyle,
        fontSize: "0.8rem",
        ...style,
      }}
    >
      {text || "Your story"}
    </div>
  );
};

export default TextStoryCreator;
