// src/components/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white  text-gray-700 text-sm py-25 shadow-[0_-2px_6px_rgba(0,0,0,0.05)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-6">
          {/* About */}
          <div>
            <h4 className="mb-2 font-semibold text-gray-800">About Us</h4>
            <ul className="space-y-1">
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
            <h4 className="mb-2 font-semibold text-gray-800">Site Terms & Policies</h4>
            <ul className="space-y-1">
              <li><a href="#" className="hover:underline">Privacy Policy</a></li>
              <li><a href="#" className="hover:underline">Terms</a></li>
              <li><a href="#" className="hover:underline">Cookie Policy</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="mb-2 font-semibold text-gray-800">Support Center</h4>
            <ul className="space-y-1">
              <li><a href="#" className="hover:underline">Business Profile</a></li>
              <li><a href="#" className="hover:underline">Advertising</a></li>
              <li><a href="#" className="hover:underline">Feedback</a></li>
            </ul>
          </div>

          {/* Address */}
          <div>
            <h4 className="mb-2 font-semibold text-gray-800">Our Address</h4>
            <p className="text-sm text-gray-600 leading-5">
              LzyCrazy<br />
              Sector 27, Noida<br />
              Pin No 201303
            </p>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-28 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} LzyCrazy • All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
