// import { Link, useLocation } from 'react-router';
// import {
//   LayoutDashboard,
//   Grid3X3,
//   MapPin,
//   Store,
//   FileText,
//   Package,
//   FileBarChart,
//   Users,
//   LogOut,
//   Camera,
//   Plus,
//   List,
//   Boxes
// } from 'lucide-react';
// import { useState } from 'react';

// export function Sidebar() {
//   const location = useLocation();
//   const currentPath = location.pathname === '/' ? '/dashboard' : location.pathname;

//   const [isNewsOpen, setIsNewsOpen] = useState(
//     currentPath.startsWith('/news')
//   );
//   const [isServicesOpen, setIsServicesOpen] = useState(
//     currentPath.startsWith('/services')
//   );
//   const [isBusinessOpen, setIsBusinessOpen] = useState(currentPath.startsWith('/shop'));
//   const toggleServices = () => setIsServicesOpen(!isServicesOpen);
  
//   const toggleNews = () => setIsNewsOpen(!isNewsOpen);
//   const toggleBusiness = () => setIsBusinessOpen(!isBusinessOpen);

//   const menuItems = [
//     { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
//     { icon: Camera, label: 'Market-Post', path: '/market' },
//     { icon: Grid3X3, label: 'Category', path: '/category' },
//     {
//       icon: MapPin,
//       label: 'LzyCrazy Services',
//       path: '/services',
//       isSubmenu: true,
//       children: [
//         { label: 'Add Service', path: '/services/add', icon: Plus },
//         { label: 'Service List', path: '/services/list', icon: List }
//       ]
//     },
//     {
//       icon: Store,
//       label: 'Business Profile',
//       path: '/shop',
//       isSubmenu: true,
//       children: [
//         { label: 'Logo ', path: '/shop/logo', icon: Camera },
//         { label: 'Banner ', path: '/shop/banner', icon: Camera },
//         { label: 'Category ', path: '/shop/category', icon: Grid3X3 },
//         { label: 'Card ', path: '/shop/card', icon: Boxes }
//       ]
//     },
//     {
//       icon: FileText,
//       label: 'LzyCrazy News',
//       path: '/news',
//       isSubmenu: true,
//       children: [
//         { label: 'Add News', path: '/news/add', icon: Plus },
//         { label: 'News List', path: '/news/list', icon: List }
//       ]
//     },
//     {
//       icon: FileBarChart,
//       label: 'We are hiring',
//       path: '/Applications/Hiring'
//     },
    
//     { icon: FileBarChart, label: 'Client Enquiry', path: '/client-enquiry' },
   
//     { icon: LogOut, label: 'Logout', path: '/logout' }
//   ];
  
//   return (
//     <div className="flex h-full w-64 flex-col bg-white">
//       {/* Header */}
//       <div className="px-6 py-6">
//         <h1 className="text-xl font-bold text-gray-900">
//           <span className="text-blue-600">LZY</span> CRAZY
//         </h1>
//       </div>

//       {/* Navigation Menu */}
//       <div className="flex-1 overflow-y-auto">
//         <nav className="space-y-1">
//           {menuItems.map((item, index) => {
//             const Icon = item.icon;
//             const isActive = currentPath === item.path || currentPath.startsWith(item.path);

//             if (item.isSubmenu) {
//               const isServiceMenu = item.path === '/services';
//               const isOpen = isServiceMenu ? isServicesOpen : isNewsOpen;
//               const toggleFn = isServiceMenu ? toggleServices : toggleNews;
            
//               return (
//                 <div key={index}>
//                   <button
//                     onClick={toggleFn}
//                     className={`w-full relative flex items-center px-6 py-3 text-sm font-medium transition-colors text-left ${
//                       isActive
//                         ? 'text-blue-600 bg-blue-50'
//                         : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
//                     }`}
//                   >
//                     {isActive && (
//                       <div className="absolute left-0 top-0 h-full w-1 bg-blue-600" />
//                     )}
//                     <item.icon className="mr-4 h-5 w-5 flex-shrink-0" />
//                     {item.label}
//                   </button>
            
//                   {/* Submenu */}
//                   {isOpen && (
//                     <div className="ml-10 space-y-1">
//                       {item.children.map((sub, subIndex) => {
//                         const SubIcon = sub.icon;
//                         const subActive = currentPath === sub.path;
//                         return (
//                           <Link
//                             key={subIndex}
//                             to={sub.path}
//                             className={`flex items-center px-4 py-2 text-sm font-medium transition-colors rounded-md ${
//                               subActive
//                                 ? 'text-blue-600 bg-blue-100'
//                                 : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
//                             }`}
//                           >
//                             <SubIcon className="mr-2 h-4 w-4" />
//                             {sub.label}
//                           </Link>
//                         );
//                       })}
//                     </div>
//                   )}
//                 </div>
//               );
//             }
            

//             return (
//               <Link
//                 key={index}
//                 to={item.path}
//                 className={`relative flex items-center px-6 py-3 text-sm font-medium transition-colors ${
//                   isActive
//                     ? 'text-blue-600 bg-blue-50'
//                     : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
//                 }`}
//               >
//                 {isActive && (
//                   <div className="absolute left-0 top-0 h-full w-1 bg-blue-600"></div>
//                 )}
//                 <Icon className="mr-4 h-5 w-5 flex-shrink-0" />
//                 {item.label}
//               </Link>
//             );
//           })}
//         </nav>
//       </div>
//     </div>
//   );
// }



import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Grid3X3,
  MapPin,
  Store,
  FileText,
  FileBarChart,
  LogOut,
  Camera,
  Plus,
  List,
  Boxes,
  ChevronRight
} from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import instance from '../utils/axios';

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setAdmin } = useAdmin();

  const currentPath = location.pathname === '/' ? '/dashboard' : location.pathname;
  const basePath = currentPath.split('/')[1];

  const [openMenu, setOpenMenu] = useState(basePath);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  // Toggle sidebar
  const handleToggle = () => {
    setSidebarOpen((prev) => !prev);
  };

  // Close sidebar
  const handleClose = () => {
    setSidebarOpen(false);
  };

  // Logout
  const handleLogout = async () => {
    try {
      await instance.post('/admin/logout');
      localStorage.removeItem('adminToken');
      setAdmin(null);
      navigate('/auth');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Close sidebar on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setSidebarOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    {
      icon: Camera,
      label: 'Market-Post',
      path: '/market',
      isSubmenu: true,
      children: [
        { label: 'Add banner', path: '/market/banner', icon: Plus },
        { label: 'Post List', path: '/market/list', icon: List }
      ]
    },
    { icon: Grid3X3, label: 'Category', path: '/category' },
    {
      icon: MapPin,
      label: 'LzyCrazy Services',
      path: '/services',
      isSubmenu: true,
      children: [
        { label: 'Add Service', path: '/services/add', icon: Plus },
        { label: 'Service List', path: '/services/list', icon: List }
      ]
    },
    {
      icon: Store,
      label: 'Business Profile',
      path: '/shop',
      isSubmenu: true,
      children: [
        { label: 'Logo', path: '/shop/logo', icon: Camera },
        { label: 'Banner', path: '/shop/banner', icon: Camera },
        { label: 'Category', path: '/shop/category', icon: Grid3X3 },
        { label: 'Card', path: '/shop/card', icon: Boxes }
      ]
    },
    {
      icon: FileText,
      label: 'LzyCrazy News',
      path: '/news',
      isSubmenu: true,
      children: [
        { label: 'Add News', path: '/news/add', icon: Plus },
        { label: 'News List', path: '/news/list', icon: List }
      ]
    },
    { icon: FileBarChart, label: 'We are hiring', path: '/applications' },
    { icon: FileBarChart, label: 'Client Enquiry', path: '/client-enquiry' },
    { icon: LogOut, label: 'Logout', isLogout: true }
  ];

  console.log(sidebarOpen)
  return (
    <>
      {/* Mobile menu toggle button */}
      <button
        onClick={(e) => setSidebarOpen((prev) => !prev )}
        aria-expanded={sidebarOpen}
        className={`fixed top-[75px] left-0 z-30 ${sidebarOpen ?  'hidden' : 'p-2'} bg-white rounded shadow md:hidden`}
      >
        <ChevronRight
          className={`h-5 w-5 text-gray-800 transform transition-transform duration-200`}
        />
      </button>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          style={{backgroundColor: 'rgba(0,0,0,.5)'}}
          className="fixed inset-0 z-10 md:hidden"
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
          }}
        />
      )}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 z-20 h-full w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out pointer-events-auto
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:static md:shadow-none`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="px-6 py-6 border-b">
            <h1 className="text-xl font-bold text-gray-900">
              <span className="text-blue-600">LZY</span> CRAZY
            </h1>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto">
            <nav className="space-y-1">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = currentPath === item.path || currentPath.startsWith(item.path);

                if (item.isLogout) {
                  return (
                    <button
                      key={index}
                      onClick={handleLogout}
                      className={`relative w-full text-left flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                        isActive
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {isActive && <div className="absolute left-0 top-0 h-full w-1 bg-blue-600" />}
                      <Icon className="mr-4 h-5 w-5 flex-shrink-0" />
                      {item.label}
                    </button>
                  );
                }

                if (item.isSubmenu) {
                  const parentKey = item.path.split('/')[1];
                  const isOpen = openMenu === parentKey;
                  const toggleMenu = () =>
                    setOpenMenu(prev => (prev === parentKey ? null : parentKey));

                  return (
                    <div key={index}>
                      <button
                        onClick={toggleMenu}
                        className={`w-full relative flex items-center px-6 py-3 text-sm font-medium transition-colors text-left ${
                          isActive
                            ? 'text-blue-600 bg-blue-50'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {isActive && <div className="absolute left-0 top-0 h-full w-1 bg-blue-600" />}
                        <Icon className="mr-4 h-5 w-5 flex-shrink-0" />
                        {item.label}
                      </button>

                      {/* Submenu Items */}
                      {isOpen && (
                        <div className="ml-10 space-y-1">
                          {item.children.map((sub, subIndex) => {
                            const SubIcon = sub.icon;
                            const subActive = currentPath === sub.path;
                            return (
                              <Link
                                key={subIndex}
                                to={sub.path}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center px-4 py-2 text-sm font-medium transition-colors rounded-md ${
                                  subActive
                                    ? 'text-blue-600 bg-blue-100'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                }`}
                              >
                                <SubIcon className="mr-2 h-4 w-4" />
                                {sub.label}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={index}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`relative flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-0 h-full w-1 bg-blue-600"></div>
                    )}
                    <Icon className="mr-4 h-5 w-5 flex-shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}
