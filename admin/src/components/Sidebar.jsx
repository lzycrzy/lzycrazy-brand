import { Link, useLocation } from 'react-router';
import { 
  LayoutDashboard, 
  Grid3X3, 
  MapPin, 
  Store, 
  FileText, 
  Package, 
  FileBarChart, 
  Users, 
  LogOut, 
  Camera
} from 'lucide-react';

export function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname === '/' ? '/dashboard' : location.pathname;

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Camera, label: 'Market-Post', path: '/market' },
    { icon: Grid3X3, label: 'Category', path: '/category' },
    { icon: MapPin, label: 'Address', path: '/address' },
    { icon: Store, label: 'Shop', path: '/shop' },
    { icon: FileText, label: 'News', path: '/news' },
    { icon: Package, label: 'Products', path: '/products' },
    { icon: FileBarChart, label: 'Client Enquiry', path: '/client-enquiry' },
    { icon: Users, label: 'Join Team', path: '/join-team' },
    { icon: LogOut, label: 'Logout', path: '/logout' },
  ];

  return (
    <div className="flex h-full w-64 flex-col bg-white">
      {/* Header */}
      <div className="px-6 py-6">
        <h1 className="text-xl font-bold text-gray-900">
          <span className="text-blue-600">LZY</span> CRAZY
        </h1>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto">
        <nav className="space-y-1">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            return (
              <Link
                key={index}
                to={item.path}
                className={`relative flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {/* Blue left border for active item */}
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
  );
}