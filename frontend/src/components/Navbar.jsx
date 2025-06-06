import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaBell,
  FaCamera,
  FaPlus,
  FaSearch,
  FaSignOutAlt,
} from "react-icons/fa";
import { CiSettings } from "react-icons/ci";
import { MdOutlineChat } from "react-icons/md";
import { SiCoinmarketcap } from "react-icons/si";
import { FaFileVideo } from "react-icons/fa6";
import { BsCameraReels } from "react-icons/bs";
import { FaHome } from "react-icons/fa";
import logo from '../assets/logo.png';

const BASE_URL = import.meta.env.VITE_API_URL;

const HeaderIcon = ({ icon: Icon, to = "#", label = "" }) => (
  <Link
    to={to}
    aria-label={label}
    className="group p-2 rounded-full hover:bg-gray-100 transition text-gray-700"
  >
    <Icon className="text-[22px] group-hover:text-blue-600" />
  </Link>
);

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
  const navigate = useNavigate();

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/api/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (data.status === "success") {
      localStorage.removeItem("token");
      localStorage.removeItem("loggedInUser");
      navigate("/");
    }
  };

  return (
    // <div className="sticky left-0 top-0 z-100 bg-white w-full shadow-sm px-4 py-2">
    //   <div className="left-0 mx-auto relative flex items-center justify-between">
    //     {/* Left - Logo */}
    //     <div className="flex-shrink-0">
    //       <img src={logo} alt="Logo" className="w-[100px] h-[40px] object-contain" />
    //     </div>

    //     {/* Center - Middle Tabs (Absolutely Centered) */}
    //     <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 items-center gap-4">
    //       <HeaderIcon icon={FaHome} />
    //       <HeaderIcon icon={SiCoinmarketcap} />
    //       <HeaderIcon icon={FaFileVideo} />
    //       <HeaderIcon icon={BsCameraReels} />
    //       <HeaderIcon icon={MdOutlineChat} />
    //     </div>

    //     {/* Right - Search + Icons */}
    //     <div className="flex-shrink-0 flex items-center gap-3">
    //       {/* Search Bar */}
    //       <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 w-[250px] mr-2">
    //         <FaSearch className="text-gray-500 text-lg" />
    //         <input
    //           type="text"
    //           placeholder="Search..."
    //           className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-500 outline-none px-3"
    //         />
    //       </div>

    //       {/* Right Icons */}
    //       <HeaderIcon icon={FaBell} to="/notifications" />
    //       <HeaderIcon icon={FaPlus} to="/add" />

    //       {/* Settings Dropdown */}
    //       <button
    //         onClick={toggleDropdown}
    //         className="group p-2 rounded-full hover:bg-gray-100 transition text-gray-700"
    //       >
    //         <CiSettings className="text-[22px] group-hover:text-blue-600" />
    //       </button>

    //       {/* Dropdown */}
    //       {isDropdownOpen && (
    //         <div className="absolute right-4 top-16 mt-2 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow-md z-50">
    //           <div className="px-4 py-3">
    //             <p className="text-sm font-semibold text-gray-900">Alexa....</p>
    //             <p className="text-sm text-gray-600 truncate">tushar@example.com</p>
    //           </div>
    //           <div className="py-3">
    //             <button
    //               onClick={handleLogout}
    //               className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
    //             >
    //               <FaSignOutAlt className="inline mr-2" /> Sign out
    //             </button>
    //           </div>
    //         </div>
    //       )}
    //     </div>
    //   </div>
    // </div>
    <div></div>
  );
};

export default Header;
