import {
  FaUserCircle, FaFileAlt, FaShoppingCart,
  FaUsers, FaStar
} from 'react-icons/fa';
import { LuBox } from 'react-icons/lu';
import { BiSolidMoviePlay } from 'react-icons/bi';
import { Link, useLocation } from 'react-router-dom';

const links = [
  { icon: FaUserCircle, label: 'Lzy Crazy', path: '/' },
  { icon: FaFileAlt, label: 'My Ads', path: '/ads' },
  { icon: LuBox, label: 'My Order', path: '/orders' },
  { icon: FaShoppingCart, label: 'Market', path: '/market' },
  { icon: FaUsers, label: 'My Group', path: '/groups' },
  { icon: BiSolidMoviePlay, label: 'Movies', path: '/movies' },
  { icon: FaStar, label: 'Saved', path: '/saved' },
  { icon: FaUsers, label: 'Hiring', path: '/hiring' },
];

const Sidebar = ({ compact = false }) => {
  const location = useLocation();

  return (
    <div className={`p-2 ${compact ? 'flex justify-around w-full' : 'hidden md:block'}`}>
      <div className={`${compact ? 'flex justify-between w-full' : 'space-y-2'}`}>
        {links.map((item, i) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={i} to={item.path} className="block">
              <div
                className={`${
                  compact
                    ? 'flex items-center justify-center w-full py-3'
                    : `flex h-[49px] w-[250px] items-center rounded-md px-4 shadow transition ${
                        isActive ? 'bg-blue-100' : 'bg-white'
                      }`
                }`}
              >
                <SidebarLink icon={item.icon} label={item.label} compact={compact} isActive={isActive} />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

const SidebarLink = ({ icon: Icon, label, compact, isActive }) => (
  <div
    className={`flex items-center gap-2 rounded-md px-2 py-2 transition ${
      compact
        ? 'flex-col text-xs'
        : 'hover:bg-gray-100 cursor-pointer'
    } ${isActive ? 'text-blue-600 font-semibold' : ''}`}
  >
    <span className="text-xl">
      <Icon className={`text-blue-500 ${isActive ? 'text-blue-600' : ''}`} />
    </span>
    {!compact && <span className="text-sm font-medium text-gray-800">{label}</span>}
    {compact && <span className="text-[10px] text-gray-600">{label}</span>}
  </div>
);

export default Sidebar;
