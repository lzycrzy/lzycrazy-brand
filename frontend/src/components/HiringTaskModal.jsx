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
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/30 px-2 py-4 backdrop-blur-sm overflow-auto">
      <div className="relative w-full max-w-md sm:max-w-xl lg:max-w-3xl rounded-lg bg-white p-5 sm:p-8 shadow-2xl overflow-y-auto max-h-[95vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-5 text-2xl text-gray-600 hover:text-red-600"
        >
          &times;
        </button>

        <h2 className="mb-3 text-center text-2xl sm:text-3xl font-bold text-blue-700">
          WE ARE HIRING
        </h2>

        <p className="mb-3 text-center text-sm text-gray-700">
          You agree to LzyCrazy hiring Terms & Conditions.
        </p>
        <p className="mb-4 text-center text-sm text-gray-700">
          Welcome to LzyCrazy, and thank you for joining us as a Fresher Intern!
        </p>

        <div className="mb-4 rounded bg-green-100 px-4 py-3 text-center text-sm text-green-700">
          Form Successfully Submitted!
        </div>

        <p className="mb-6 text-center text-base font-medium text-gray-800">
          Now Complete the Tasks Below to Proceed. Google Time Will Start After Completion.
        </p>

        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            onClose();
            if (onSubmitSuccess) onSubmitSuccess();
          }}
        >
          {/* Task 1 */}
          {/* Task 1 */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-800">
              Task 1
            </label>
            <div className="rounded-sm border bg-gray-50 px-4 py-3 text-sm leading-relaxed text-gray-700">
              <p className="mb-2">
                Please read the following instructions carefully and follow each step sincerely:
              </p>
              <ul className="list-disc space-y-1 pl-6">
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
          {/* Task 2 */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-800">
              Task 2
            </label>
            <div className="rounded-sm border bg-gray-50 px-4 py-3 text-sm leading-relaxed text-gray-700 space-y-2">
              <p><strong>Step 1:</strong><br />Create your account on the LzyCrazy platform.</p>
              <p>
                <strong>Step 2:</strong><br />
                Explore and check all pages of the LzyCrazy website.<br />
                <span className="italic text-gray-600">
                  Note: Make notes of how each section works, what content is displayed, and what features are available.
                </span>
              </p>
              <p><strong>Step 3:</strong><br />Follow your selected meeting timing and strictly adhere to the company’s guidelines and work ethics.</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
            {/* <button
              type="button"
              className="w-full sm:w-auto rounded-lg bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400"
            >
              Clear
            </button> */}
            <button
              type="submit"
              className="w-full sm:w-auto rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
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

