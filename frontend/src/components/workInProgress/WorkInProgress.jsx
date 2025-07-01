import React from "react";
import { useNavigate } from "react-router";

const WorkInProgress = ({ onClose }) => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col items-center justify-center bg-gradient-to-r from-gray-300 via-gray-200 to-gray-100 text-center px-4">
      <h1 className="text-3xl sm:text-4xl pt-10 text-gray-700 mb-2 flex flex-wrap items-center justify-center gap-2">
        Work in
        <dotlottie-player
          src="https://lottie.host/3a325af7-9d27-4e82-a446-6cc4484c8e65/R2NSwToBjX.lottie"
          background="transparent"
          speed="1"
          className="w-10 h-10 sm:w-14 sm:h-14"
          loop
          autoplay
        ></dotlottie-player>
        Progress...
      </h1>

      <div className="flex justify-center items-center flex-grow">
        <dotlottie-player
          src="https://lottie.host/0aa41633-6fc1-4f84-a214-3719083ad5f8/Ww9H9lkgth.lottie"
          background="transparent"
          speed="1"
          className="w-64 sm:w-80 md:w-[350px] h-auto"
          loop
          autoplay
        ></dotlottie-player>
      </div>

      <div className="mb-6">
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default WorkInProgress;
