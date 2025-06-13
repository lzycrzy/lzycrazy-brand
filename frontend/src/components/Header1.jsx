import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
const Header = () => {
  
  return (
    <header className="bg-white border-b-0.5  px-12 py-4 flex items-center justify-between shadow-2xl">
      {/* Left: Logo */}
      <div className="flex items-center space-x-3">
        {/* Logo Placeholder */}
        
        <Link to="/auth">
            <img
              src={logo}
              alt="Logo"
              className="h-[40px] w-[100px] cursor-pointer object-contain"
            />
          </Link>
      </div>

      {/* Center: Navigation */}
      <nav className="hidden md:flex space-x-8 text-gray-700 font-medium">
        <a href="#about" className="hover:text-blue-500">About Us</a>
        <a href="#services" className="hover:text-blue-500">LzyCrazy Services</a>
        <a href="#marketplace" className="hover:text-blue-500">LzyCrazy Marketplace</a>
        <a href="#careers" className="hover:text-blue-500">We Are Hiring</a>
        <a href="#news" className="hover:text-blue-500">LzyCrazy News</a>
      </nav>

      {/* Right: Placeholder for future icons / login / avatar */}
      <div className="md:hidden">
        {/* You can add a hamburger menu or search icon here for mobile */}
      </div>
    </header>
  );
};

export default Header;
