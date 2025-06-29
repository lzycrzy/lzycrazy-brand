import React, { useState } from 'react';
import { Camera, Save } from 'lucide-react';
import axios from '../lib/axios/axiosInstance'; // Adjust the import path as necessary

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    fullName: '',
    email: '343@gmail.com',
    mobile: '',
    password: '',
    confirmPassword: '',
    image: 'https://storage.googleapis.com/a1aa/image/8304db84-2243-443d-a7aa-3588328fd97d.jpg',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUserData(prev => ({ ...prev, image: imageUrl }));
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveChanges = () => {
    setIsEditing(false);
    // Save logic here (e.g. API call)
    console.log('User data saved:', userData);
  };

  return (
    <div className="bg-[#f3f4f6]  font-sans text-[#1e293b]">
      <main className="max-w-6xl mx-auto">
        <h2 className="text-lg font-semibold mb-6">Update User</h2>

        {/* Profile Info */}
        <section className="bg-white rounded-xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16">
              <img
                className="w-16 h-16 rounded-full object-cover"
                src={userData.image}
                alt="User"
              />
              {isEditing && (
                <>
                  <label className="absolute -top-1 -right-1 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center border border-white cursor-pointer">
                    <Camera className="w-3 h-3 text-[#1e293b]" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </>
              )}
            </div>
            <div>
              <p className="font-semibold text-base leading-5">John Smith</p>
              <p className="text-xs text-gray-500 leading-4">{userData.email}</p>
            </div>
          </div>
          {!isEditing && (
            <button
              onClick={handleEditClick}
              className="bg-[#2563eb] text-white text-xs font-medium px-4 py-2 rounded-md"
            >
              Update Now
            </button>
          )}
        </section>

        {/* Form */}
        <form
          autoComplete="off"
          className="bg-white rounded-xl p-6 mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5"
        >
          {[
            ['Name', 'fullName', 'text'],
            ['Mobile No.', 'mobile', 'tel'],
            ['Email', 'email', 'email'],
            // ['Password', 'password', 'password'],
            // ['Confirm Password', 'confirmPassword', 'password'],
          ].map(([label, name, type]) => (
            <div key={name}>
              <label className="block text-xs mb-1">{label}:</label>
              <input
                type={type}
                name={name}
                value={userData[name]}
                disabled={!isEditing}
                onChange={handleInputChange}
                placeholder={`Your ${label}`}
                className={`w-full rounded-md bg-[#f9fafb] text-xs px-3 py-2 focus:outline-none focus:ring-2 ${isEditing
                    ? 'focus:ring-[#2563eb] text-gray-700'
                    : 'text-gray-400'
                  }`}
              />
            </div>
          ))}

          {/* Select Inputs */}
          {/* {[
            ['City', 'city', ['New York', 'Los Angeles', 'Chicago']],
            ['State', 'state', ['California', 'Texas', 'Florida']],
            ['Country', 'country', ['United States', 'Canada', 'United Kingdom']],
            ['Gender', 'gender', ['Male', 'Female', 'Other']],
          ].map(([label, name, options]) => (
            <div key={name}>
              <label className="block text-xs mb-1">{label}:</label>
              <select
                name={name}
                disabled={!isEditing}
                value={userData[name]}
                onChange={handleInputChange}
                className={`w-full rounded-md bg-[#f9fafb] text-xs px-3 py-2 appearance-none focus:outline-none focus:ring-2 ${isEditing
                    ? 'focus:ring-[#2563eb] text-gray-700'
                    : 'text-gray-400'
                  }`}
              >
                <option value="" disabled>
                  Your {label}
                </option>
                {options.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
          ))} */}

        </form>

        {/* Save Changes */}
        {isEditing && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleSaveChanges}
              className="bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-md flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;
