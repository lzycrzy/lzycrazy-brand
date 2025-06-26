import {
    FaUserCircle, FaFileAlt, FaShoppingCart,
    FaUsers, FaStar
  } from 'react-icons/fa';
  import { LuBox } from 'react-icons/lu';
  import { BiSolidMoviePlay } from 'react-icons/bi';
  import { useNavigate } from 'react-router-dom';
  
  const mobileLinks = [
    { icon: FaUserCircle, label: 'Profile', path: '/profile' },
    { icon: FaShoppingCart, label: 'Market', path: '/market' },
    { icon: LuBox, label: 'Orders', path: '/orders' },
    { icon: BiSolidMoviePlay, label: 'Movies', path: '/movies' },
    { icon: FaStar, label: 'Saved', path: '/saved' },
  ];
  
  const MobileNav = () => {
    const navigate = useNavigate();
  
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center h-14 bg-white border-t shadow-md lg:hidden">
        {mobileLinks.map((item, i) => (
          <button
            key={i}
            onClick={() => navigate(item.path)}
            className="flex flex-col items-center text-gray-600 hover:text-blue-600"
          >
            <item.icon className="text-xl" />
            <span className="text-[10px]">{item.label}</span>
          </button>
        ))}
      </div>
    );
  };
  
  export default MobileNav;
  