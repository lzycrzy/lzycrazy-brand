import React from "react";

const TextStoryCreator = ({
  fontStyle = "sans-serif",            // Accepts string font names
  backgroundColor = "#ffb6c1",         // Standard background color
  text = "Your text here",
  style = {},
}) => {
  const isGradient =
    typeof backgroundColor === "string" &&
    backgroundColor.includes("gradient");

  // Determine text color based on background for better contrast
  const getTextColor = (bg) => {
    if (isGradient) return "#fff";
    try {
      const color = bg.toLowerCase();
      if (color === "#fff" || color === "#ffffff" || color.includes("white")) {
        return "#000";
      }
    } catch (e) {}
    return "#fff";
  };

  return (
    <div
      className="w-full h-full flex items-center justify-center px-3 text-center font-bold rounded"
      style={{
        background: isGradient ? backgroundColor : undefined,
        backgroundColor: !isGradient ? backgroundColor : undefined,
        color: getTextColor(backgroundColor),
        fontSize: "0.8rem",
        fontFamily: fontStyle,
        wordBreak: "break-word",
        ...style,
      }}
    >
      {text}
    </div>
  );
};

export default TextStoryCreator;
