// import React, { useState } from "react";
// import { Settings } from "lucide-react";

// function Home() {
//   // State to manage the profile image URL
//   const [profileImage, setProfileImage] = useState("");

//   // Handler for when a new file is selected for the profile picture
//   const handleImageUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setProfileImage(URL.createObjectURL(file));
//     }
//   };

//   return (
//     <div className="bg-gray-100 min-h-screen font-sans">
//       {/* Profile Header */}
//       <div className="bg-blue-900 py-8 px-4 sm:px-6 md:px-10 lg:px-20 xl:px-32 flex flex-col md:flex-row items-center justify-between">
//         <div className="flex flex-col sm:flex-row items-center gap-5 mb-4 md:mb-0">
//           {/* Profile Picture with Upload Functionality */}
//           <div className="relative group">
//             <img
//               src="./Images/image.png"
//               alt="Profile"
//               className="rounded-full border-4 border-white w-28 h-28 sm:w-32 sm:h-32 object-cover cursor-pointer"
//               onClick={() =>
//                 document.getElementById("profileImageInput").click()
//               }
//             />
//             {/* Overlay for "Change Photo" on hover */}
//             <div
//               className="absolute inset-0 rounded-full bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
//               onClick={() =>
//                 document.getElementById("profileImageInput").click()
//               }
//             >
//               <span className="text-white text-sm font-medium">
//                 Change Photo
//               </span>
//             </div>
//             {/* Hidden file input */}
//             <input
//               type="file"
//               id="profileImageInput"
//               accept="image/*"
//               className="hidden"
//               onChange={handleImageUpload}
//             />
//           </div>
//           <div className="text-center sm:text-left pt-2 md:pt-0">
//             <h1 className="text-3xl font-bold text-white">John Smith</h1>
//             <span className="text-gray-200">120 Friends</span>
//           </div>
//         </div>
//         <div className="flex flex-col sm:flex-row gap-2">
//           <button className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 transition-colors duration-200">
//             + Edit Story
//           </button>
//           <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded font-medium hover:bg-gray-200 transition-colors duration-200">
//             Edit Profile
//           </button>
//         </div>
//       </div>

//       {/* Horizontal Rule */}
//       <div className="bg-blue-900">
//         <hr className="bg-white h-0.5 max-w-7xl mx-auto" />
//       </div>

//       {/* Navigation Tabs */}
//       <div className="bg-blue-900 border-b">
//         <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between px-4 py-2">
//           <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-2 sm:mb-0">
//             <button className="px-4 py-2 rounded bg-white font-medium hover:bg-blue-600 hover:text-white transition-colors duration-200 text-sm sm:text-base">
//               Posts
//             </button>
//             <button className="px-4 py-2 rounded bg-white font-medium hover:bg-blue-600 hover:text-white transition-colors duration-200 text-sm sm:text-base">
//               About
//             </button>
//             <button className="px-4 py-2 rounded bg-white font-medium hover:bg-blue-600 hover:text-white transition-colors duration-200 text-sm sm:text-base">
//               Friends
//             </button>
//             <button className="px-4 py-2 rounded bg-white font-medium hover:bg-blue-600 hover:text-white transition-colors duration-200 text-sm sm:text-base">
//               Photos
//             </button>
//             <button className="px-4 py-2 rounded bg-white font-medium hover:bg-blue-600 hover:text-white transition-colors duration-200 text-sm sm:text-base">
//               Videos
//             </button>
//             <button className="px-4 py-2 rounded bg-white font-medium hover:bg-blue-600 hover:text-white transition-colors duration-200 text-sm sm:text-base">
//               My Ads
//             </button>
//             <button className="px-4 py-2 rounded bg-white font-medium hover:bg-blue-600 hover:text-white transition-colors duration-200 text-sm sm:text-base">
//               More
//             </button>
//           </div>
//           <div>
//             {/* Setting Icon instead of button text */}
//             <button className="px-4 py-2 rounded bg-white font-medium hover:bg-blue-600 hover:text-white transition-colors duration-200">
//               <Settings className="w-5 h-5" />{" "}
//               {/* Lucide-react Settings icon */}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Home;

// import {
//   FaBell,
//   FaCamera,
//   FaFile,
//   FaFileAlt,
//   FaHome,
//   FaPlus,
//   FaSearch,
//   FaShoppingCart,
//   FaUsers,
//   FaSignOutAlt,
// } from 'react-icons/fa';
// import Stories from './StorySlider';
// import { Link, useNavigate } from 'react-router-dom';
// import { CiSettings } from 'react-icons/ci';
// import { MdOutlineChat } from 'react-icons/md';
// import { SiCoinmarketcap } from 'react-icons/si';
// import { FaFileVideo, FaStar } from 'react-icons/fa6';
// import { BsCameraReels } from 'react-icons/bs';
// import { FaUserCircle } from 'react-icons/fa';
// import { LuBox } from 'react-icons/lu';
// import { BiSolidMoviePlay } from 'react-icons/bi';
// import { useState } from 'react';
// import logo from '../assets/logo.png';

// const BASE_URL = import.meta.env.VITE_API_URL;

// const Home = () => {
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
//   const navigate = useNavigate();
//   const SidebarLink = ({ icon: Icon, label, to }) => (
//     <Link
//       to={to}
//       className="flex items-center gap-3 text-sm font-medium text-gray-700"
//     >
//       <Icon className="text-lg" />
//       <span>{label}</span>
//     </Link>
//   );

//   const handleLogout = async () => {
//     const token = localStorage.getItem('token');
//     const response = await fetch(`${BASE_URL}/api/auth/logout`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     const data = await response.json();
//     if (data.status === 'success') {
//       localStorage.removeItem('token');
//       localStorage.removeItem('loggedInUser');
//       navigate('/');
//     }
//   };

//   const posts = [
//     {
//       user: 'Surfiya Zakir',
//       time: '3 hours ago',
//       content: 'Bacon ipsum dolor amet sirloin jowl turducken pork...',
//       image:
//         'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=600',
//       likes: '2.8K Likes',
//       comments: '22 Comments',
//       share: 'Share',
//     },
//     {
//       user: 'Byrom Guitet',
//       time: '0.5 hrs ago',
//       content: 'hello admin',
//       image: null,
//       likes: '15 Likes',
//       comments: 'Comment',
//       share: 'Share',
//     },
//   ];

//   const people = [
//     {
//       name: 'Mohannad Zitoune',
//       follow: true,
//       image: 'https://flowbite.com/docs/images/people/profile-picture-5.jpg',
//     },
//     {
//       name: 'Hurin Seary',
//       follow: true,
//       image: 'https://flowbite.com/docs/images/people/profile-picture-5.jpg',
//     },
//     {
//       name: 'Goria Coast',
//       follow: false,
//       image: 'https://flowbite.com/docs/images/people/profile-picture-5.jpg',
//     },
//     {
//       name: 'Davi Goria',
//       follow: false,
//       image: 'https://flowbite.com/docs/images/people/profile-picture-5.jpg',
//     },
//   ];

//   return (
//     <div className="flex h-screen flex-col bg-gray-100 font-sans">
//       {/* Header */}
//       <div className="sticky top-0 z-50 bg-white px-4 py-2 shadow-sm">
//         <div className="relative mx-auto flex max-w-screen-xl items-center justify-between">
//           {/* Left - Logo */}
//           <div className="flex-shrink-0">
//             <img
//               src={logo}
//               alt="Logo"
//               className="h-[40px] w-[100px] object-contain"
//             />
//           </div>

//           {/* Center - Middle Tabs (Absolutely Centered) */}
//           <div className="absolute left-1/2 hidden -translate-x-1/2 transform items-center gap-4 lg:flex">
//             <HeaderIcon icon={FaHome} />
//             <HeaderIcon icon={SiCoinmarketcap} />
//             <HeaderIcon icon={FaFileVideo} />
//             <HeaderIcon icon={BsCameraReels} />
//             <HeaderIcon icon={MdOutlineChat} />
//           </div>

//           {/* Right - Search + Icons */}
//           <div className="flex flex-shrink-0 items-center gap-3">
//             {/* Search Bar */}
//             <div className="mr-2 hidden w-[250px] items-center rounded-full bg-gray-100 px-4 py-2 md:flex">
//               <FaSearch className="text-lg text-gray-500" />
//               <input
//                 type="text"
//                 placeholder="Search..."
//                 className="flex-1 bg-transparent px-3 text-sm text-gray-700 placeholder-gray-500 outline-none"
//               />
//             </div>

//             {/* Right Icons */}
//             <HeaderIcon icon={FaBell} to="/notifications" />
//             <HeaderIcon icon={FaPlus} to="/add" />

//             {/* Settings Dropdown */}
//             <button
//               onClick={toggleDropdown}
//               className="group rounded-full p-2 text-gray-700 transition hover:bg-gray-100"
//             >
//               <CiSettings className="text-[22px] group-hover:text-blue-600" />
//             </button>

//             {/* Dropdown */}
//             {isDropdownOpen && (
//               <div className="absolute top-16 right-4 z-50 mt-2 w-48 divide-y divide-gray-100 rounded-lg bg-white shadow-md">
//                 <div className="px-4 py-3">
//                   <p className="text-sm font-semibold text-gray-900">
//                     Alexa....
//                   </p>
//                   <p className="truncate text-sm text-gray-600">
//                     tushar@example.com
//                   </p>
//                 </div>
//                 <div className="py-3">
//                   <button
//                     onClick={handleLogout}
//                     className="block w-full px-4 py-2 text-left text-sm text-red-700 hover:bg-gray-100"
//                   >
//                     <FaSignOutAlt className="mr-2 inline" /> Sign out
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Body */}
//       <div className="flex flex-1 overflow-hidden">
//         {/* Sidebar */}
//         <div className="hidden p-4 md:block">
//           <div className="space-y-2">
//             <div className="flex h-[49px] w-[275px] items-center rounded-md bg-white px-4 shadow">
//               <SidebarLink icon={FaUserCircle} label="Lzy Crazy" />
//             </div>
//             <div className="flex h-[49px] w-[275px] items-center rounded-md bg-white px-4 shadow">
//               <SidebarLink icon={FaFileAlt} label="My Ads" />
//             </div>
//             <div className="flex h-[49px] w-[275px] items-center rounded-md bg-white px-4 shadow">
//               <SidebarLink icon={LuBox} label="My Order" />
//             </div>
//             <div className="flex h-[49px] w-[275px] items-center rounded-md bg-white px-4 shadow">
//               <SidebarLink icon={FaShoppingCart} label="Market" />
//             </div>
//             <div className="flex h-[49px] w-[275px] items-center rounded-md bg-white px-4 shadow">
//               <SidebarLink icon={FaUsers} label="My Group" />
//             </div>
//             <div className="flex h-[49px] w-[275px] items-center rounded-md bg-white px-4 shadow">
//               <SidebarLink icon={BiSolidMoviePlay} label="Movies" />
//             </div>
//             <div className="flex h-[49px] w-[275px] items-center rounded-md bg-white px-4 shadow">
//               <SidebarLink icon={FaStar} label="Saved" />
//             </div>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="flex flex-1 flex-col overflow-y-auto p-4">
//           <Stories />
//           <div className="mb-6 rounded-xl bg-white p-4 shadow-sm">
//             <div className="flex items-start space-x-4">
//               <img
//                 src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
//                 alt="User"
//                 className="h-11 w-11 rounded-full object-cover shadow-sm"
//               />
//               <textarea
//                 placeholder="What's on your mind?"
//                 className="flex-1 resize-none rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
//                 rows={3}
//               />
//             </div>
//             <div className="mt-4 flex justify-end space-x-2">
//               <button className="flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200">
//                 <FaCamera /> Photo/Video
//               </button>
//               <button className="flex items-center gap-2 rounded-full bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700">
//                 <FaFileAlt /> Post
//               </button>
//             </div>
//           </div>

//           {posts.map((post, idx) => (
//             <div key={idx} className="mb-6 rounded-xl bg-white p-5 shadow-sm">
//               <div className="mb-2 flex items-center">
//                 <img
//                   src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
//                   alt="User"
//                   className="mr-3 h-10 w-10 rounded-full"
//                 />
//                 <div>
//                   <div className="font-semibold">{post.user}</div>
//                   <div className="text-xs text-gray-500">{post.time}</div>
//                 </div>
//                 <div className="ml-auto cursor-pointer">...</div>
//               </div>
//               <div className="mb-2">{post.content}</div>
//               {post.image && (
//                 <img
//                   src={post.image}
//                   alt="Post"
//                   className="mb-2 h-72 w-full rounded-lg object-cover"
//                 />
//               )}
//               <div className="mt-2 flex justify-around text-sm text-gray-600">
//                 <div className="flex cursor-pointer items-center space-x-1">
//                   👍 {post.likes}
//                 </div>
//                 <div className="flex cursor-pointer items-center space-x-1">
//                   💬 {post.comments}
//                 </div>
//                 <div className="flex cursor-pointer items-center space-x-1">
//                   🔗 {post.share}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Right Sidebar */}
//         <div className="hidden w-full max-w-xs overflow-y-auto rounded-lg bg-white p-5 shadow-lg lg:block">
//           <h3 className="mb-4 text-lg font-semibold text-gray-800">
//             People You May Know
//           </h3>
//           {people.map((p, i) => (
//             <div key={i} className="mb-4 flex items-center">
//               <img
//                 src={p.image}
//                 alt={p.name}
//                 className="mr-3 h-12 w-12 rounded-full object-cover shadow-sm"
//               />
//               <div className="flex-1">
//                 <div className="font-medium text-gray-900">{p.name}</div>
//                 <button
//                   className={`mt-1 rounded-full border px-3 py-1.5 text-xs font-medium transition duration-200 ${
//                     p.follow
//                       ? 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100'
//                       : 'border-blue-600 bg-blue-600 text-white hover:bg-blue-700'
//                   }`}
//                 >
//                   {p.follow ? 'Following' : 'Follow'}
//                 </button>
//               </div>
//             </div>
//           ))}

//           <div className="mt-6">
//             <h3 className="text-md mb-2 font-semibold text-gray-800">
//               Invite Your Friends
//             </h3>
//             <input
//               type="email"
//               placeholder="Enter email address"
//               className="w-full rounded-full border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
//             />
//             <button className="mt-3 w-full rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
//               Send Invite
//             </button>
//           </div>

//           <div className="mt-8 text-xs text-gray-500">
//             <div>© 2025 LzyCrazy</div>
//             <div className="mt-2 flex flex-wrap gap-3">
//               <a href="#" className="hover:underline">
//                 About
//               </a>
//               <a href="#" className="hover:underline">
//                 Blog
//               </a>
//               <a href="#" className="hover:underline">
//                 Contact
//               </a>
//               <a href="#" className="hover:underline">
//                 More
//               </a>
//             </div>
//             <div className="mt-2">Languages</div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;

// const HeaderIcon = ({ icon: Icon, to = '#', label = '' }) => (
//   <Link
//     to={to}
//     aria-label={label}
//     className="group rounded-full p-2 text-gray-700 transition hover:bg-gray-100"
//   >
//     <Icon className="text-[22px] group-hover:text-blue-600" />
//   </Link>
// );

// const SidebarLink = ({ icon: Icon, label }) => (
//   <div className="flex cursor-pointer items-center gap-3 rounded-md px-4 py-3 transition hover:bg-gray-100">
//     <span className="text-xl">
//       <Icon className="text-blue-500" />
//     </span>
//     <span className="text-sm font-medium text-gray-800">{label}</span>
//   </div>
// );




import Header from './Header';
import Sidebar from './Sidebar1';
import MainFeed from './MainFeed';
import RightSidebar from './RightSidebar';
import ChatSidebar from './ChatSidebar'; // Coming soon

const Home = () => {
  const posts = [
    {
      user: "Alice Johnson",
      time: "1 hour ago",
      content: "Loving this new community!",
      image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
      likes: 15,
      comments: 4,
      share: 1,
    },
    {
      user: "Bob Smith",
      time: "3 hours ago",
      content: "Check out my latest project!",
      image: "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d",
      likes: 28,
      comments: 7,
      share: 3,
    },
  ];
  
  const people = [
    {
      name: "Aarav Mehta",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      follow: false,
    },
    {
      name: "Ishita Roy",
      image: "https://randomuser.me/api/portraits/women/45.jpg",
      follow: true,
    },
    {
      name: "Karan Patel",
      image: "https://randomuser.me/api/portraits/men/52.jpg",
      follow: false,
    },
    {
      name: "Riya Singh",
      image: "https://randomuser.me/api/portraits/women/12.jpg",
      follow: true,
    },
    {
      name: "Neeraj Gupta",
      image: "https://randomuser.me/api/portraits/men/64.jpg",
      follow: false,
    },
  ];
  

  return (
    <div className="h-screen w-screen mt-0 top-0  gap-4 flex flex-col bg-gray-100 font-sans overflow-hidden m-0 p-0">
      <Header />
      <div className="flex flex-1 overflow-hidden gap-4 px-4">
        <Sidebar />
        
        <div className="flex-1 overflow-y-auto no-scrollbar">
          <MainFeed posts={posts} />
        </div>

        <RightSidebar people={people} />
        <ChatSidebar />
      </div>
    </div>
  );
};

export default Home;

