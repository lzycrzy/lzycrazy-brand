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
  ];
  
  const Sidebar = () => (
    <div className="hidden p-4 md:block">
      <div className="space-y-2">
        {links.map((item, i) => (
          <div key={i} className="flex h-[49px] w-[275px] items-center rounded-md bg-white px-4 shadow">
            <SidebarLink icon={item.icon} label={item.label} />
          </div>
        ))}
      </div>
    </div>
  );
  
  const SidebarLink = ({ icon: Icon, label }) => (
    <div className="flex cursor-pointer items-center gap-3 rounded-md px-4 py-3 transition hover:bg-gray-100">
      <span className="text-xl">
        <Icon className="text-blue-500" />
      </span>
      <span className="text-sm font-medium text-gray-800">{label}</span>
    </div>
  );
  
  export default Sidebar;
  