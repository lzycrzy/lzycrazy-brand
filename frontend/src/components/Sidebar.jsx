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
    // <div className="hidden md:block z-60 mt-20 fixed top-16 h-ful p-4 w-[275px]">
    //   <div className="space-y-2">
    //     <SidebarLink icon={FaUserCircle} label="Lzy Crazy" to="/profile" />
    //     <SidebarLink icon={FaFileAlt} label="My Ads" to="/my-ads" />
    //     <SidebarLink icon={LuBox} label="My Order" to="/my-orders" />
    //     <SidebarLink icon={FaShoppingCart} label="Market" to="/market" />
    //     <SidebarLink icon={FaUsers} label="My Group" to="/my-groups" />
    //     <SidebarLink icon={BiSolidMoviePlay} label="Movies" to="/movies" />
    //     <SidebarLink icon={FaStar} label="Saved" to="/saved" />
    //   </div>
    // </div>
    <div></div>
  );
};

export default Sidebar;