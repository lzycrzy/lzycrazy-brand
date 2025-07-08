import {
  FaFileAlt
} from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

const Sidebar = ({ compact = false }) => {
  const location = useLocation();
  const { user, profilePic, displayName } = useUser();

  const links = [
    {
      icon: () => <img src={profilePic || "/missing.png"} alt={displayName || "Profile"} className="w-6 h-6 md:w-8 md:h-8 rounded-full object-cover" loading="lazy" />,
      label: displayName || 'User',
      path: '/'
    },
    { icon: FaFileAlt, label: 'My Ads', path: '/ads' },
  ];

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
                <SidebarLink
                  icon={item.icon}
                  label={item.label}
                  compact={compact}
                  isActive={isActive}
                />
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
      {Icon
        ? typeof Icon === 'function'
          ? <Icon />
          : <Icon className={`text-blue-500 ${isActive ? 'text-blue-600' : ''}`} />
        : null}
    </span>
    {!compact && <span className="text-sm font-medium text-gray-800">{label}</span>}
    {compact && <span className="text-[10px] text-gray-600">{label}</span>}
  </div>
);

export default Sidebar;
