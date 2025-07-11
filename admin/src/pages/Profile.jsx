// import React, { useState } from 'react';
// import { Camera, Save } from 'lucide-react';
// import instance from '../utils/axios';

// const Profile = () => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [userData, setUserData] = useState({
//     fullName: '',
//     email: '343@gmail.com',
//     mobile: '',
//     password: '',
//     confirmPassword: '',
//     image: 'https://storage.googleapis.com/a1aa/image/8304db84-2243-443d-a7aa-3588328fd97d.jpg',
//   });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setUserData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const imageUrl = URL.createObjectURL(file);
//       setUserData(prev => ({ ...prev, image: imageUrl }));
//     }
//   };

//   const handleEditClick = () => {
//     setIsEditing(true);
//   };

//   const handleSaveChanges = () => {
//     setIsEditing(false);
//     // Save logic here (e.g. API call)
//     console.log('User data saved:', userData);
//   };

//   return (
//     <div className="bg-[#f3f4f6]  font-sans text-[#1e293b]">
//       <main className="max-w-6xl mx-auto">
//         <h2 className="text-lg font-semibold mb-6">Update User</h2>

//         {/* Profile Info */}
//         <section className="bg-white rounded-xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
//           <div className="flex items-center gap-4">
//             <div className="relative w-16 h-16">
//               <img
//                 className="w-16 h-16 rounded-full object-cover"
//                 src={userData.image}
//                 alt="User"
//               />
//               {isEditing && (
//                 <>
//                   <label className="absolute -top-1 -right-1 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center border border-white cursor-pointer">
//                     <Camera className="w-3 h-3 text-[#1e293b]" />
//                     <input
//                       type="file"
//                       className="hidden"
//                       accept="image/*"
//                       onChange={handleImageChange}
//                     />
//                   </label>
//                 </>
//               )}
//             </div>
//             <div>
//               <p className="font-semibold text-base leading-5">John Smith</p>
//               <p className="text-xs text-gray-500 leading-4">{userData.email}</p>
//             </div>
//           </div>
//           {!isEditing && (
//             <button
//               onClick={handleEditClick}
//               className="bg-[#2563eb] text-white text-xs font-medium px-4 py-2 rounded-md"
//             >
//               Update Now
//             </button>
//           )}
//         </section>

//         {/* Form */}
//         <form
//           autoComplete="off"
//           className="bg-white rounded-xl p-6 mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5"
//         >
//           {[
//             ['Name', 'fullName', 'text'],
//             ['Mobile No.', 'mobile', 'tel'],
//             ['Email', 'email', 'email'],
//             // ['Password', 'password', 'password'],
//             // ['Confirm Password', 'confirmPassword', 'password'],
//           ].map(([label, name, type]) => (
//             <div key={name}>
//               <label className="block text-xs mb-1">{label}:</label>
//               <input
//                 type={type}
//                 name={name}
//                 value={userData[name]}
//                 disabled={!isEditing}
//                 onChange={handleInputChange}
//                 placeholder={`Your ${label}`}
//                 className={`w-full rounded-md bg-[#f9fafb] text-xs px-3 py-2 focus:outline-none focus:ring-2 ${isEditing
//                     ? 'focus:ring-[#2563eb] text-gray-700'
//                     : 'text-gray-400'
//                   }`}
//               />
//             </div>
//           ))}

//           {/* Select Inputs */}
//           {/* {[
//             ['City', 'city', ['New York', 'Los Angeles', 'Chicago']],
//             ['State', 'state', ['California', 'Texas', 'Florida']],
//             ['Country', 'country', ['United States', 'Canada', 'United Kingdom']],
//             ['Gender', 'gender', ['Male', 'Female', 'Other']],
//           ].map(([label, name, options]) => (
//             <div key={name}>
//               <label className="block text-xs mb-1">{label}:</label>
//               <select
//                 name={name}
//                 disabled={!isEditing}
//                 value={userData[name]}
//                 onChange={handleInputChange}
//                 className={`w-full rounded-md bg-[#f9fafb] text-xs px-3 py-2 appearance-none focus:outline-none focus:ring-2 ${isEditing
//                     ? 'focus:ring-[#2563eb] text-gray-700'
//                     : 'text-gray-400'
//                   }`}
//               >
//                 <option value="" disabled>
//                   Your {label}
//                 </option>
//                 {options.map((option) => (
//                   <option key={option}>{option}</option>
//                 ))}
//               </select>
//             </div>
//           ))} */}

//         </form>

//         {/* Save Changes */}
//         {isEditing && (
//           <div className="mt-4 flex justify-end">
//             <button
//               onClick={handleSaveChanges}
//               className="bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-md flex items-center gap-2"
//             >
//               <Save className="w-4 h-4" />
//               Save Changes
//             </button>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };

// export default Profile;


import React, { useState, useEffect } from 'react';
import { Camera, Save } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import instance from '../utils/axios';
import { toast } from 'react-toastify';

const Profile = () => {
  const { admin, updateAdmin } = useAdmin();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    image: '',
  });

  const [imageFile, setImageFile] = useState(null);

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (admin) {
      setUserData({
        fullName: admin.fullName || '',
        email: admin.email || '',
        mobile: admin.phone || '',
        image: admin.image || 'https://i.ibb.co/2kR5zq0/default-avatar.png',
      });
    }
  }, [admin]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setUserData((prev) => ({ ...prev, image: URL.createObjectURL(file) }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditClick = () => setIsEditing(true);

  const handleSaveChanges = async () => {
    try {
      const formData = new FormData();
      formData.append('fullName', userData.fullName);
      formData.append('phone', userData.mobile);
      if (imageFile) formData.append('image', imageFile);

      const res = await instance.put('/admin/profile/update', formData);
      toast.success('Profile updated successfully');
      updateAdmin(res.data.admin);
      setIsEditing(false);

      // If any password field is filled, attempt password update
      const { currentPassword, newPassword, confirmPassword } = passwords;
      if (currentPassword || newPassword || confirmPassword) {
        if (!currentPassword || !newPassword || !confirmPassword) {
          return toast.error('Please fill in all password fields.');
        }
        if (newPassword !== confirmPassword) {
          return toast.error('New passwords do not match.');
        }

        await instance.put('/admin/password/update', {
          currentPassword,
          newPassword,
        });

        toast.success('Password updated successfully');
        setPasswords({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to update profile or password');
    }
  };

  return (
    <div className="bg-[#f3f4f6] font-sans text-[#1e293b]">
      <main className="max-w-6xl mx-auto">
        <h2 className="text-lg font-semibold mb-6">Admin Profile</h2>

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
                <label className="absolute -top-1 -right-1 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center border border-white cursor-pointer">
                  <Camera className="w-3 h-3 text-[#1e293b]" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>
            <div>
              <p className="font-semibold text-base leading-5">
                {userData.fullName || 'Admin'}
              </p>
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

        {/* Profile Form */}
        <form
          autoComplete="off"
          className="bg-white rounded-xl p-6 mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5"
        >
          {[['Full Name', 'fullName', 'text'], ['Mobile Number', 'mobile', 'tel'], ['Email', 'email', 'email']].map(
            ([label, name, type]) => (
              <div key={name}>
                <label className="block text-xs mb-1">{label}:</label>
                <input
                  type={type}
                  name={name}
                  value={userData[name]}
                  disabled={!isEditing || name === 'email'}
                  onChange={handleInputChange}
                  placeholder={`Your ${label}`}
                  className={`w-full rounded-md bg-[#f9fafb] text-xs px-3 py-2 focus:outline-none focus:ring-2 ${
                    isEditing ? 'focus:ring-[#2563eb] text-gray-700' : 'text-gray-400'
                  }`}
                />
              </div>
            )
          )}

          {/* Password Fields */}
          {isEditing && (
            <>
              <div>
                <label className="block text-xs mb-1">Current Password:</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwords.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter current password"
                  className="w-full rounded-md bg-[#f9fafb] text-xs px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-gray-700"
                />
              </div>
              <div>
                <label className="block text-xs mb-1">New Password:</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwords.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password"
                  className="w-full rounded-md bg-[#f9fafb] text-xs px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-gray-700"
                />
              </div>
              <div>
                <label className="block text-xs mb-1">Confirm New Password:</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwords.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm new password"
                  className="w-full rounded-md bg-[#f9fafb] text-xs px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-gray-700"
                />
              </div>
            </>
          )}
        </form>

        {/* Save Button */}
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