import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import rocketImg from "../assets/remove-logo.png"; // Update the path to your image

const VerifiedPage = () => {
  const [flyAway, setFlyAway] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setFlyAway(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-screen m-0 flex flex-col justify-center items-center text-white overflow-hidden font-sans bg-gradient-to-br from-[#1ebddd] to-[#db9c13]">
      <div
        className={`text-center p-5 rounded-full backdrop-blur-[10px] mb-5 transition-transform duration-[2000ms] ease-in-out ${
          flyAway ? "animate-rocketFly" : "animate-fadeIn"
        }`}
      >
        <img src={rocketImg} alt="Rocket" className="w-[200px]" />
      </div>

      <div className="text-center bg-white/10 p-6 px-10 rounded-2xl backdrop-blur-sm shadow-lg w-[300px] animate-fadeIn">
        <h1 className="text-2xl font-semibold mb-3 text-white">✅ Verified!</h1>
        <p className="text-base text-gray-100 mb-2">
          Your message has been sent successfully.
        </p>
        <p className="text-base text-gray-100 mb-4">We’ll get back soon</p>

        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-4 py-2 bg-white text-gray-800 font-semibold rounded-md hover:bg-gray-100 transition"
        >
          ← Back to Home
        </button>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease-in-out forwards;
        }

        @keyframes rocketFly {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          50% { transform: translateY(-200px) scale(1.1); opacity: 1; }
          100% { transform: translateY(-1000px) scale(0.5) rotate(10deg); opacity: 0; }
        }
        .animate-rocketFly {
          animation: rocketFly 2s ease-in forwards;
        }
      `}</style>
    </div>
  );
};

export default VerifiedPage;
