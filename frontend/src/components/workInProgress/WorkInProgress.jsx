import React from "react";
import { useNavigate } from "react-router";


const WorkInProgress = ({ onClose }) => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-gray-300 via-gray-200 to-gray-100 text-center px-4">
            <h1 className="text-4xl text-gray-700 mb-5 flex flex-wrap items-center justify-center gap-2">
                Work in
                <dotlottie-player
                    src="https://lottie.host/3a325af7-9d27-4e82-a446-6cc4484c8e65/R2NSwToBjX.lottie"
                    background="transparent"
                    speed="1"
                    style={{ width: "80px", height: "80px" }}
                    loop
                    autoplay
                ></dotlottie-player>
                Progress...
            </h1>

            <div className="flex justify-center items-center mb-6">
                <dotlottie-player
                    src="https://lottie.host/0aa41633-6fc1-4f84-a214-3719083ad5f8/Ww9H9lkgth.lottie"
                    background="transparent"
                    speed="1"
                    style={{ width: "500px", height: "500px" }}
                    loop
                    autoplay
                ></dotlottie-player>
            </div>

            <button
                onClick={() => navigate("/")}  // or "/dashboard" if user is logged in
                className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
                Go Back
            </button>
        </div>
    );
};

export default WorkInProgress;
