// import { Link, useLocation } from 'react-router';
// import { LayoutDashboard } from 'lucide-react';

// export function Sidebar() {
//   const location = useLocation();
//   const currentPath =
//     location.pathname === '/' ? '/dashboard' : location.pathname;

//   const menuItems = [
//     { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
//   ];

//   return (
//     <div className="flex h-full w-64 flex-col border-r border-gray-200 bg-white">
//       {/* Header */}
//       <div className="border-b border-gray-100 px-6 py-9">
//         <h1 className="text-xl font-bold text-gray-900">
//           <span className="text-blue-600">LZY</span> CRAZY
//         </h1>
//       </div>

//       {/* Navigation Menu */}
//       <div className="flex-1 overflow-y-auto py-4">
//         <nav className="space-y-1 px-3">
//           {menuItems.map((item, index) => {
//             const Icon = item.icon;
//             const isActive = currentPath === item.path;
//             return (
//               <Link
//                 key={index}
//                 to={item.path}
//                 className={`flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
//                   isActive
//                     ? 'bg-blue-600 text-white'
//                     : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
//                 }`}
//               >
//                 <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
//                 {item.label}
//               </Link>
//             );
//           })}
//         </nav>
//       </div>
//     </div>
//   );
// }



// Sidebar.jsx
import { Link } from "react-router-dom";
import {
  FaUserCircle,
  FaFileAlt,
  FaShoppingCart,
  FaUsers,
  FaStar,
} from "react-icons/fa";
import { LuBox } from "react-icons/lu";
import { BiSolidMoviePlay } from "react-icons/bi";

const SidebarLink = ({ icon: Icon, label, to }) => (
  <Link
    to={to}
    className="flex items-center gap-3 text-gray-700 text-sm font-medium py-3 px-4 rounded-md hover:bg-gray-100 transition"
  >
    <Icon className="text-blue-500 text-xl" />
    <span>{label}</span>
  </Link>
);

const Sidebar = () => {
  return (
    <div className="hidden md:block p-4 w-[275px]">
      <div className="space-y-2">
        <SidebarLink icon={FaUserCircle} label="Lzy Crazy" to="/profile" />
        <SidebarLink icon={FaFileAlt} label="My Ads" to="/my-ads" />
        <SidebarLink icon={LuBox} label="My Order" to="/my-orders" />
        <SidebarLink icon={FaShoppingCart} label="Market" to="/market" />
        <SidebarLink icon={FaUsers} label="My Group" to="/my-groups" />
        <SidebarLink icon={BiSolidMoviePlay} label="Movies" to="/movies" />
        <SidebarLink icon={FaStar} label="Saved" to="/saved" />
      </div>
    </div>
  );
};

export default Sidebar;
