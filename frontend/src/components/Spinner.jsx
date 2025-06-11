// import React from "react";
// import { motion } from "framer-motion";

// const loadingContainer = {
//   width: "4rem",
//   height: "4rem",
//   display: "flex",
//   justifyContent: "space-around",
// };

// const loadingCircle = {
//   display: "block",
//   width: "1rem",
//   height: "1rem",
//   backgroundColor: "#3A36DB",
//   borderRadius: "0.5rem",
// };

// const loadingContainerVariants = {
//   start: {
//     transition: {
//       staggerChildren: 0.2,
//     },
//   },
//   end: {
//     transition: {
//       staggerChildren: 0.2,
//     },
//   },
// };

// const loadingCircleVariants = {
//   start: {
//     y: "0%",
//   },
//   end: {
//     y: "60%",
//   },
// };

// const loadingCircleTransition = {
//   duration: 0.4,
//   yoyo: Infinity,
//   ease: "easeInOut",
// };

// const Loader = () => {
//   return (
//     <div>
//       {/* Background Overlay with blur */}
//       <div className="fixed top-0 left-0 w-full min-h-screen z-50 bg-black opacity-30 backdrop-blur-sm" />
//       <div className="flex fixed top-0 left-0 w-full justify-center items-center h-screen">
//         <motion.div
//           style={loadingContainer}
//           variants={loadingContainerVariants}
//           initial="start"
//           animate="end"
//         >
//           <motion.span
//             style={loadingCircle}
//             variants={loadingCircleVariants}
//             transition={loadingCircleTransition}
//           ></motion.span>
//           <motion.span
//             style={loadingCircle}
//             variants={loadingCircleVariants}
//             transition={loadingCircleTransition}
//           ></motion.span>
//           <motion.span
//             style={loadingCircle}
//             variants={loadingCircleVariants}
//             transition={loadingCircleTransition}
//           ></motion.span>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default Loader;



// src/components/Loader.jsx
import React from 'react';

const Loader = () => {
  return (
    <div className="overlay">
      <div className="loading-bar">
        <div className="blue-bar"></div>
      </div>

      <style>
        {`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          .overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            // background-color: rgba(255, 255, 255, 0.3); /* translucent */
            backdrop-filter: blur(8px); /* blur effect */
            -webkit-backdrop-filter: blur(8px); /* Safari support */
            z-index: 9999;
          }

          .loading-bar {
            width: 130px;
            height: 5px;
            border-radius: 2px;
            background-color: #fff;
            position: relative;
            overflow: hidden;
          }

          .blue-bar {
            height: 100%;
            width: 68px;
            position: absolute;
            transform: translate(-34px);
            background-color: #0a66c2;
            border-radius: 2px;
            animation: initial-loading 1.5s ease infinite;
          }

          @keyframes initial-loading {
            0% {
              transform: translate(-34px);
            }
            50% {
              transform: translate(96px);
            }
            100% {
              transform: translate(-34px);
            }
          }
        `}
      </style>
    </div>
  );
};

export default Loader;
