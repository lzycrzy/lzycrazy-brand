import React, { useRef, useEffect, useState } from "react";

const TextStoryEditor = ({ fontStyle, bgColor = "#ffb6c1", text, onChange }) => {
  const divRef = useRef(null);
  const isGradient = typeof bgColor === "string" && bgColor.includes("gradient");
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (divRef.current && divRef.current.innerText !== text) {
      divRef.current.innerText = text || "";
    }
  }, [text]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div
        ref={divRef}
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => onChange(e.currentTarget.innerText)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-[320px] h-[570px] max-h-full text-center text-white text-3xl font-bold rounded-xl px-6 py-4"
        style={{
          background: isGradient ? bgColor : undefined,
          backgroundColor: !isGradient ? bgColor : undefined,
          fontFamily: fontStyle,
          overflowWrap: "break-word",
          wordBreak: "break-word",
          outline: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {text === "" && !focused ? "Start typing" : null}
      </div>
    </div>
  );
};

export default TextStoryEditor;

