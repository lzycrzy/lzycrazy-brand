import React from 'react';
import ReactDOM from 'react-dom';

const HiringTasksModal = ({ isOpen, onClose, onSubmitSuccess }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="bg-opacity-40 fixed inset-0 z-[1000] flex h-screen w-screen items-center justify-center backdrop-blur-sm">
      <div className="relative max-h-[95vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-6 text-2xl text-gray-600 hover:text-red-600"
        >
          &times;
        </button>

        <h2 className="text-3xl font-bold text-center mb-3 text-blue-700">WE ARE HIRING</h2>

        <p className="text-sm text-gray-700 text-center mb-6">
          You agree to LyCrazy hiring Terms & Conditions.
        </p>

        <div className="bg-green-100 text-green-700 text-center text-sm px-4 py-3 rounded mb-4">
          ✅ Form Successfully Submitted!
        </div>

        <p className="text-center text-md font-medium mb-6">
          Now Complete the Tasks Below to Proceed. Google Time Will Start After Completion.
        </p>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            onClose();
            if (onSubmitSuccess) onSubmitSuccess();
          }}
        >
          <div>
            <label className="block text-sm mb-1">Task 1</label>
            <textarea
              placeholder="Explain your experience, tools you're good at, etc."
              className="w-full px-4 py-2 border rounded-sm"
              rows={5}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Task 2</label>
            <textarea
              placeholder="Explain your experience, tools you're good at, etc."
              className="w-full px-4 py-2 border rounded-sm"
              rows={5}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
            >
              Clear
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
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
