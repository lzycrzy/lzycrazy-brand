// import React from 'react';
// import ReactDOM from 'react-dom';

// const HiringTasksModal = ({ isOpen, onClose, onSubmitSuccess }) => {
//   if (!isOpen) return null;

//   return ReactDOM.createPortal(
//     <div className="bg-opacity-40 fixed inset-0 z-[1000] flex h-screen w-screen items-center justify-center backdrop-blur-sm">
//       <div className="relative max-h-[95vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-8 shadow-2xl">
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-6 text-2xl text-gray-600 hover:text-red-600"
//         >
//           &times;
//         </button>

//         <h2 className="text-3xl font-bold text-center mb-3 text-blue-700">
//           WE ARE HIRING 
//         </h2>

//         <p className="text-sm text-gray-700 text-center mb-6">
//           You agree to LyCrazy hiring Terms & Conditions.
//         </p >
//         <p className="text-sm text-gray-700 text-center mb-6">
//          Welcome to LzyCrazy, and thank you for joining us as a Fresher Intern!
//         </p>

//         <div className="bg-green-100 text-green-700 text-center text-sm px-4 py-3 rounded mb-4">
//            Form Successfully Submitted!
//         </div>

//         <p className="text-center text-md font-medium mb-6">
//           Now Complete the Tasks Below to Proceed. Google Time Will Start After Completion.
//         </p>

//         <form
//           className="space-y-4"
//           onSubmit={(e) => {
//             e.preventDefault();
//             onClose();
//             if (onSubmitSuccess) onSubmitSuccess();
//           }}
//         >
//           {/* Task 1 Card */}
//           <div>
//             <label className="block text-sm mb-1 font-semibold">Task 1</label>
//             <div className="w-full px-4 py-3 border rounded-sm bg-gray-50 text-sm leading-relaxed text-gray-700">
//               <p className="mb-2">Please read the following instructions carefully and follow each step sincerely:</p>
//               <ul className="list-disc pl-6 space-y-1">
//                 <li><strong>Shift Timings (Choose as per your availability):</strong></li>
//                 <ul className="list-disc pl-6">
//                   <li>Morning Shift: 10:00 AM to 5:00 PM</li>
//                   <li>Evening Shift: 5:00 PM to 12:00 AM</li>
//                   <li>Night Shift: 12:00 AM to 7:00 AM</li>
//                 </ul>
//                 <li>Please inform us of your preferred shift.</li>
//                 <li>You are required to join the daily meeting via the link below.</li>
//               </ul>
//             </div>
//           </div>

//           {/* Task 2 Card */}
//           <div>
//             <label className="block text-sm mb-1 font-semibold">Task 2</label>
//             <div className="w-full px-4 py-3 border rounded-sm bg-gray-50 text-sm leading-relaxed text-gray-700 space-y-2">
//               <p><strong>Step 1:</strong><br />Create your account on the LzyCrazy platform.</p>
//               <p><strong>Step 2:</strong><br />Explore and check all pages of the LzyCrazy website.<br />
//               <span className="text-gray-600 italic">
//                 Note: Make notes of how each section works, what content is displayed, and what features are available. This will help you better understand the platform and your future tasks.
//               </span></p>
//               <p><strong>Step 3:</strong><br />Follow your selected meeting timing and strictly adhere to the company’s guidelines and work ethics.</p>
//             </div>
//           </div>

//           <div className="flex justify-end space-x-3 pt-4">
//             <button
//               type="button"
//               className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
//             >
//               Clear
//             </button>
//             <button
//               type="submit"
//               className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
//             >
//               SUBMIT TASKS
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>,
//     document.body
//   );
// };

// export default HiringTasksModal;


// new responsive modal component for hiring tasks
import React from 'react';
import ReactDOM from 'react-dom';

const HiringTasksModal = ({ isOpen, onClose, onSubmitSuccess }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="relative w-[95%] sm:w-11/12 md:w-4/5 lg:w-3/5 max-h-[95vh] overflow-y-auto rounded-lg bg-white p-4 sm:p-6 md:p-8 shadow-2xl">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-xl sm:text-2xl text-gray-600 hover:text-red-600"
        >
          &times;
        </button>

        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-4 text-blue-700">
          WE ARE HIRING
        </h2>

        <p className="text-xs sm:text-sm text-gray-700 text-center mb-3">
          You agree to LyCrazy hiring Terms & Conditions.
        </p>
        <p className="text-xs sm:text-sm text-gray-700 text-center mb-4">
          Welcome to LzyCrazy, and thank you for joining us as a Fresher Intern!
        </p>

        <div className="bg-green-100 text-green-700 text-center text-xs sm:text-sm px-4 py-3 rounded mb-4">
          Form Successfully Submitted!
        </div>

        <p className="text-center text-sm sm:text-base font-medium mb-6">
          Now complete the tasks below to proceed. Google Time will start after completion.
        </p>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            onClose();
            if (onSubmitSuccess) onSubmitSuccess();
          }}
        >
          {/* Task 1 */}
          <div>
            <label className="block text-sm font-semibold mb-1">Task 1</label>
            <div className="w-full px-4 py-3 border rounded-md bg-gray-50 text-sm leading-relaxed text-gray-700">
              <p className="mb-2">Please read the following instructions carefully and follow each step sincerely:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Shift Timings (Choose as per your availability):</strong></li>
                <ul className="list-disc pl-6">
                  <li>Morning Shift: 10:00 AM to 5:00 PM</li>
                  <li>Evening Shift: 5:00 PM to 12:00 AM</li>
                  <li>Night Shift: 12:00 AM to 7:00 AM</li>
                </ul>
                <li>Please inform us of your preferred shift.</li>
                <li>You are required to join the daily meeting via the link below.</li>
              </ul>
            </div>
          </div>

          {/* Task 2 */}
          <div>
            <label className="block text-sm font-semibold mb-1">Task 2</label>
            <div className="w-full px-4 py-3 border rounded-md bg-gray-50 text-sm leading-relaxed text-gray-700 space-y-2">
              <p><strong>Step 1:</strong><br />Create your account on the LzyCrazy platform.</p>
              <p><strong>Step 2:</strong><br />Explore and check all pages of the LzyCrazy website.<br />
                <span className="text-gray-600 italic">
                  Note: Make notes of how each section works, what content is displayed, and what features are available. This will help you better understand the platform and your future tasks.
                </span>
              </p>
              <p><strong>Step 3:</strong><br />Follow your selected meeting timing and strictly adhere to the company’s guidelines and work ethics.</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-end sm:space-x-3 space-y-2 sm:space-y-0 pt-4">
            <button
              type="button"
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 w-full sm:w-auto"
            >
              Clear
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 w-full sm:w-auto"
            >
              SUBMIT TASKS
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default HiringTasksModal;

