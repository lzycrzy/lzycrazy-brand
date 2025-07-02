// import React from 'react';
// import { Link } from 'react-router-dom';
// import logo from '../../assets/logo.png';

// const Header = () => {
//   return (
//     <header className="fixed top-0 left-0 w-full bg-white z-50 px-12 py-4 flex items-center justify-between  border-b border-gray-200">
      
//       {/* Left: Logo */}
//       <div className="flex items-center space-x-3">
//         <Link to="/">
//           <img
//             src={logo}
//             alt="Logo"
//             className="h-[40px] w-[100px] cursor-pointer object-contain"
//           />
//         </Link>
//       </div>

//       {/* Center: Navigation */}
//       <nav className="hidden md:flex space-x-8 text-gray-700 font-medium">
//         <Link to="/about" className="hover:text-blue-500">About Us</Link>
//         <Link to="/services" className="hover:text-blue-500">LzyCrazy Services</Link>
//         <Link to="/market" className="hover:text-blue-500">LzyCrazy Marketplace</Link>
//         <Link to="/careers" className="hover:text-blue-500">We Are Hiring</Link>
//         <Link to="/news" className="hover:text-blue-500">LzyCrazy News</Link>
//       </nav>

//       {/* Right: Placeholder for future icons / login / avatar */}
//       <div className="md:hidden">
//         {/* Add hamburger/search icons here for mobile */}
//       </div>
//     </header>
//   );
// };

// export default Header;


import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { Menu, X } from 'lucide-react'; // optional icon library

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0  w-full bg-white z-50 border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-12 py-3">
        {/* Left: Logo */}
        <Link to="/">
          <img
            src={logo}
            alt="Logo"
            className="h-10 w-auto object-contain"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-6 text-gray-700 font-medium">
          <Link to="/about" className="hover:text-blue-500">About Us</Link>
          <Link to="/services" className="hover:text-blue-500">Services</Link>
          <Link to="/market" className="hover:text-blue-500">Marketplace</Link>
          <Link to="/careers" className="hover:text-blue-500">We Are Hiring</Link>
          <Link to="/news" className="hover:text-blue-500">News</Link>
        </nav>

        {/* Hamburger Button */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-700 focus:outline-none">
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 py-4 space-y-3 text-gray-700 font-medium shadow-lg">
          <Link to="/about" onClick={() => setMenuOpen(false)} className="block">About Us</Link>
          <Link to="/services" onClick={() => setMenuOpen(false)} className="block">Services</Link>
          <Link to="/market" onClick={() => setMenuOpen(false)} className="block">Marketplace</Link>
          <Link to="/careers" onClick={() => setMenuOpen(false)} className="block">We Are Hiring</Link>
          <Link to="/news" onClick={() => setMenuOpen(false)} className="block">News</Link>
        </div>
      )}
    </header>
  );
};

export default Header;

