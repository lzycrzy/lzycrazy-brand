import React, { useState } from 'react';
import { FaGlobeAmericas } from 'react-icons/fa';

const Intro = () => {
  const [activeTab, setActiveTab] = useState('addBio');
  const [bio, setBio] = useState('');
  const [tempBio, setTempBio] = useState('');
  const [editing, setEditing] = useState(false);

  const startEditing = () => {
    setTempBio(bio);
    setEditing(true);
  };

  const handleSave = () => {
    setBio(tempBio);
    setEditing(false);
  };

  const handleCancel = () => {
    setTempBio(bio);
    setEditing(false);
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Intro</h2>

      <div className="flex mb-4 space-x-4">
        {['addBio', 'editDetails'].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setEditing(false);
            }}
            className={`capitalize px-4 py-2 rounded-md transition ${
              activeTab === tab
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {tab === 'addBio' ? 'Add Bio' : 'Edit Details'}
          </button>
        ))}
      </div>

      {/* Add Bio Tab */}
      {activeTab === 'addBio' && (
        <div>
          {!editing && bio ? (
            <div className="flex justify-between items-center">
              <p className="text-gray-800">{bio}</p>
              <button
                className="text-sm text-blue-600 hover:underline"
                onClick={startEditing}
              >
                Edit
              </button>
            </div>
          ) : (
            <>
              {!editing && (
                <button
                  className="px-4 py-2 text-sm bg-gray-100 rounded-md hover:bg-gray-200"
                  onClick={startEditing}
                >
                  + Add a bio
                </button>
              )}

              {editing && (
                <div className="space-y-3 mt-3">
                  <textarea
                    className="w-full border rounded-md p-3 text-sm resize-none"
                    placeholder="Describe who you are..."
                    value={tempBio}
                    onChange={(e) => setTempBio(e.target.value)}
                    rows={3}
                  />
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <FaGlobeAmericas className="text-gray-400" />
                      <span>Public</span>
                    </div>
                    <div className="space-x-2">
                      <button
                        onClick={handleCancel}
                        className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        className="px-3 py-1 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Edit Details Tab */}
      {activeTab === 'editDetails' && (
        <div className="space-y-3 mt-3">
          <label className="block text-sm text-gray-700">Bio</label>

          {!editing ? (
            <div className="flex justify-between items-center">
              <p className="text-gray-800">{bio || 'No bio added yet.'}</p>
              <button
                className="text-sm text-blue-600 hover:underline"
                onClick={startEditing}
              >
                Edit
              </button>
            </div>
          ) : (
            <>
              <textarea
                className="w-full border rounded-md p-3 text-sm resize-none"
                value={tempBio}
                onChange={(e) => setTempBio(e.target.value)}
                rows={3}
              />
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <FaGlobeAmericas className="text-gray-400" />
                  <span>Public</span>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={handleCancel}
                    className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-3 py-1 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Intro;
