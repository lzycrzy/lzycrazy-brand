import {
  FaUserCircle, FaFileAlt, FaShoppingCart,
  FaUsers, FaStar
} from 'react-icons/fa';
import { LuBox } from 'react-icons/lu';
import { BiSolidMoviePlay } from 'react-icons/bi';

const links = [
  { icon: FaUserCircle, label: 'Lzy Crazy' },
  { icon: FaFileAlt, label: 'My Ads' },
  { icon: LuBox, label: 'My Order' },
  { icon: FaShoppingCart, label: 'Market' },
  { icon: FaUsers, label: 'My Group' },
  { icon: BiSolidMoviePlay, label: 'Movies' },
  { icon: FaStar, label: 'Saved' },
  { icon: FaUsers, label: 'Hiring' },
];

const Sidebar = ({ compact = false }) => (
  <div className={`p-2 ${compact ? 'flex justify-around w-full' : 'hidden md:block'}`}>
    <div className={`${compact ? 'flex justify-between w-full' : 'space-y-2'}`}>
      {links.map((item, i) => (
        <div
          key={i}
          className={`${
            compact
              ? 'flex items-center justify-center w-full py-3'
              : 'flex h-[49px] w-[250px] items-center rounded-md bg-white px-4 shadow'
          }`}
        >
          <SidebarLink icon={item.icon} label={item.label} compact={compact} />
        </div>
      ))}
    </div>
  </div>
);

const SidebarLink = ({ icon: Icon, label, compact }) => (
  <div
    className={`flex items-center gap-2 rounded-md px-2 py-2 transition ${
      compact ? 'flex-col text-xs' : 'hover:bg-gray-100 cursor-pointer'
    }`}
  >
    <span className="text-xl">
      <Icon className="text-blue-500" />
    </span>
    {!compact && <span className="text-sm font-medium text-gray-800">{label}</span>}
    {compact && <span className="text-[10px] text-gray-600">{label}</span>}
  </div>
);

export default Sidebar;
