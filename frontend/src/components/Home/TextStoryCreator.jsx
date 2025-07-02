import React from "react";

const TextStoryCreator = ({
  fontStyle = "Arial",
  bgColor = "#ffb6c1",
  text = "Your text here",
}) => {
  const isGradient = bgColor.includes("gradient");

  return (
    <div
      className="w-[270px] h-[480px] rounded-xl flex items-center justify-center px-4 text-white text-3xl text-center font-bold"
      style={{
        background: isGradient ? bgColor : undefined,
        backgroundColor: !isGradient ? bgColor : undefined,
        fontFamily: fontStyle,
        overflowWrap: "break-word",
        wordBreak: "break-word",
      }}
    >
      {text}
    </div>
  );
};

export default TextStoryCreator;
