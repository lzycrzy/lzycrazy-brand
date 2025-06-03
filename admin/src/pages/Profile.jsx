import React from 'react';

const Profile = () => {
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">User Profile</h1>
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>
        <div className="px-6 pb-6">
          <div className="-mt-16 mb-4 flex flex-col items-center md:flex-row md:items-end">
            <div className="mb-2 flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-white shadow md:mb-0">
              <div className="text-5xl font-bold text-blue-500">LC</div>
            </div>
            <div className="text-center md:ml-6 md:text-left">
              <h2 className="text-xl font-bold">John Doe</h2>
              <p className="text-gray-500">Administrator</p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-3 text-lg font-semibold">
                Personal Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full rounded border px-3 py-2"
                    defaultValue="John Doe"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full rounded border px-3 py-2"
                    defaultValue="john.doe@example.com"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="w-full rounded border px-3 py-2"
                    defaultValue="+1 (555) 987-6543"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Job Title
                  </label>
                  <input
                    type="text"
                    className="w-full rounded border px-3 py-2"
                    defaultValue="Administrator"
                  />
                </div>
              </div>
            </div>
            <div>
              <h3 className="mb-3 text-lg font-semibold">Account Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <input
                    type="text"
                    className="w-full rounded border px-3 py-2"
                    defaultValue="johndoe"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    type="password"
                    className="w-full rounded border px-3 py-2"
                    defaultValue="********"
                  />
                </div>
                <div className="pt-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600"
                      defaultChecked
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      Receive email notifications
                    </span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600"
                      defaultChecked
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      Enable two-factor authentication
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
