import React from 'react';
import ReactDOM from 'react-dom';

const SuccessPopup = ({ isOpen, onClose, message = "Your tasks have been submitted successfully!" }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-40 backdrop-blur-sm">
      <div className="bg-white w-[90%] max-w-md p-8 rounded-lg shadow-xl text-center">
        <h2 className="text-2xl font-semibold text-green-600 mb-2">✅ Success!</h2>
        <p className="text-gray-700 mb-4">{message}</p>
        <button
          onClick={onClose}
          className="mt-2 px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          Got it!
        </button>
      </div>
    </div>,
    document.body // ⬅️ Render directly to <body>
  );
};

export default SuccessPopup;
