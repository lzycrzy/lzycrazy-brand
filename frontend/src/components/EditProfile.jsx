// components/EditProfileModal.jsx
import React, { useState } from 'react';

const EditProfile = ({ profilePic, currentName, onClose, onSave, onImageChange }) => {
  const [newName, setNewName] = useState(currentName);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/30">
      <div className="w-[90%] max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">Edit Profile</h2>

        <div className="mb-4 flex items-center gap-4">
          <img
            src={profilePic}
            alt="New Profile"
            className="h-16 w-16 rounded-full object-cover"
          />
          <input type="file" accept="image/*" onChange={onImageChange} />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="mt-1 w-full rounded border px-3 py-2"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave(newName);
              onClose();
            }}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
