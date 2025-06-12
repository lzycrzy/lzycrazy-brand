// src/components/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white h-[] t-gray-600 text-sm py-18            h-[350px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {/* About */}
          <div>
            <h4 className="mb-2 font-semibold text-gray-800">Footer</h4>      
            <ul className="space-y-1">
              <li><a href="#" className="hover:underline">About us</a></li>
              <li><a href="#" className="hover:underline">We Are Hiring</a></li>
              <li><a href="#" className="hover:underline">LzyCrazy News</a></li>
              <li><a href="#" className="hover:underline">Marketplace</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="mb-2 font-semibold text-gray-800">Services</h4>
            <ul className="space-y-1">
              <li><a href="#" className="hover:underline">Business</a></li>
              <li><a href="#" className="hover:underline">Shopping</a></li>
              <li><a href="#" className="hover:underline">Entertainment</a></li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="mb-2 font-semibold text-gray-800">Site terms and policies</h4>
            <ul className="space-y-1">
              <li><a href="#" className="hover:underline">Privacy policy</a></li>
              <li><a href="#" className="hover:underline">Terms</a></li>
              <li><a href="#" className="hover:underline">Cookie policy</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="mb-2 font-semibold text-gray-800">Support Centro</h4>
            <ul className="space-y-1">
              <li><a href="#" className="hover:underline">Business Profile</a></li>
              <li><a href="#" className="hover:underline">Advertising</a></li>
              <li><a href="#" className="hover:underline">Feedback</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-20 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} LzyCrazy • All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
