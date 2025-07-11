import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { useProduct } from '../../store/useProduct';
import { toast } from 'react-toastify';
import { useAsset } from '../../store/useAsset';

const MobileNav = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { setIsAddProductModal } = useProduct();
  const { getAssetUrl, loaded } = useAsset();

  const mobileLinks = [
    { image: loaded ? getAssetUrl('store.png') : '/missing.png', label: 'Market', path: '/market' },
    { image: loaded ? getAssetUrl('movie-reel.png') : '/missing.png', label: 'Movies', path: '/movies' },
    // { image: loaded ? getAssetUrl('play-button-arrowhead.png') : '/missing.png', label: 'Play', path: '/play' },
    // { image: loaded ? getAssetUrl('hand.png') : '/missing.png', label: 'Saved', path: '/saved' },
  ];

  const handleNavigation = (path) => {
    if (!user) {
      alert('Please login first');
      navigate('/');
    } else {
      navigate(path);
    }
  };

  const handleAddClick = () => {
    if (!user) {
      toast.error('Please login first');
      navigate('/');
    } else {
      setIsAddProductModal(true);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around h-14 bg-white border-t shadow-md lg:hidden">
      {/* First two nav items */}
      {mobileLinks.slice(0, mobileLinks.length/2).map((item, i) => (
        <button
          key={i}
          onClick={() => handleNavigation(item.path)}
          className="group flex flex-col items-center justify-center text-gray-600 transition hover:text-blue-600"
        >
          <img
            src={item.image}
            alt={item.label}
            className="h-[22px] w-[22px] object-contain group-hover:brightness-110"
          />
          <span className="text-[10px] mt-1 group-hover:text-blue-600">
            {item.label}
          </span>
        </button>
      ))}

      {/* Center Add Button */}
      <button
        onClick={handleAddClick}
        className="relative -mt-6 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md border"
      >
        {loaded && (
          <img
            src={getAssetUrl('add.png')}
            alt="Add"
            className="h-8 w-8 object-contain group-hover:brightness-110"
          />
        )}
      </button>

      {/* Last two nav items */}
      {mobileLinks.slice(mobileLinks.length/2).map((item, i) => (
        <button
          key={i}
          onClick={() => handleNavigation(item.path)}
          className="group flex flex-col items-center justify-center text-gray-600 transition hover:text-blue-600"
        >
          <img
            src={item.image}
            alt={item.label}
            className="h-[22px] w-[22px] object-contain group-hover:brightness-110"
          />
          <span className="text-[10px] mt-1 group-hover:text-blue-600">
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default MobileNav;
