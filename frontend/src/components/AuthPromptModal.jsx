import React from 'react';
import { useNavigate } from 'react-router-dom';

const AuthPromptModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
        <h2 className="text-lg font-semibold mb-2">Login Required</h2>
        <p className="text-gray-600 mb-6">Please login or signup to continue.</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => {
              onClose();
              navigate('/login');
            }}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Login
          </button>
          <button
            onClick={() => {
              onClose();
              navigate('/register');
            }}
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
          >
            Signup
          </button>
        </div>
        <button
          onClick={onClose}
          className="mt-4 text-sm text-gray-500 hover:underline"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AuthPromptModal;
