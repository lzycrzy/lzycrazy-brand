import React from "react";

const ModalOverlay = ({
  isOpen,
  title,
  message,
  showInput,
  inputValue,
  setInputValue,
  onClose,
  onConfirm,
  customContent,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div className="bg-white w-full max-w-md mx-4 p-6 rounded-lg shadow-xl relative">
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black text-lg font-semibold"
          >
            ←
          </button>
          <h2 className="text-lg font-semibold flex-1 text-center">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black text-2xl"
          >
            &times;
          </button>
        </div>

        {customContent ? (
          customContent
        ) : (
          <>
            <p className="text-sm text-gray-600 mb-4">{message}</p>
            {showInput && (
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full border px-3 py-2 rounded mb-4"
              />
            )}
          </>
        )}

        {!customContent && (
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              OK
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalOverlay;