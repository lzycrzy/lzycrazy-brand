// import React from 'react';
// import { Link } from 'react-router-dom';

// const Footer = () => {
//   return (
//     <footer className="bg-white text-gray-700 text-sm py-25 shadow-[0_-2px_6px_rgba(0,0,0,0.05)]">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-6">

//           {/* About */}
//           <div>
//             <h4 className="mb-2 font-semibold text-gray-800">About Us</h4>
//             <ul className="space-y-1">
//               <li><Link to="/hiring" className="hover:underline">We Are Hiring</Link></li>
//               <li><Link to="/news" className="hover:underline">LzyCrazy News</Link></li>
//               <li><Link to="/market" className="hover:underline">Marketplace</Link></li>
//             </ul>
//           </div>

//           {/* Services */}
//           <div>
//             <h4 className="mb-2 font-semibold text-gray-800">Services</h4>
//             <ul className="space-y-1">
//               <li><Link to="/services" className="hover:underline">Business</Link></li>
//               <li><Link to="/services" className="hover:underline">Shopping</Link></li>
//               <li><Link to="/services" className="hover:underline">Entertainment</Link></li>
//             </ul>
//           </div>

//           {/* Policies */}
//           <div>
//             <h4 className="mb-2 font-semibold text-gray-800">Site Terms & Policies</h4>
//             <ul className="space-y-1">
//               <li><Link to="/privacy" className="hover:underline">Privacy Policy</Link></li>
//               <li><Link to="/terms" className="hover:underline">Terms</Link></li>
//               <li><Link to="/cookie-policy" className="hover:underline">Cookie Policy</Link></li>
//             </ul>
//           </div>

//           {/* Support */}
//           <div>
//             <h4 className="mb-2 font-semibold text-gray-800">Support Center</h4>
//             <ul className="space-y-1">
//               <li><Link to="/business-profile" className="hover:underline">Business Profile</Link></li>
//               <li><Link to="/advertising" className="hover:underline">Advertising</Link></li>
//               <li><Link to="/feedback" className="hover:underline">Feedback</Link></li>
//             </ul>
//           </div>

//           {/* Address */}
//           <div>
//             <h4 className="mb-2 font-semibold text-gray-800">Our Address</h4>
//             <p className="text-sm text-gray-600 leading-5">
//               LzyCrazy<br />
//               Sector 27, Noida<br />
//               Pin No 201303
//             </p>
//           </div>
//         </div>

//         {/* Bottom copyright */}
//         <div className="mt-28 text-center text-xs text-gray-500">
//           © {new Date().getFullYear()} LzyCrazy • All rights reserved.
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;



// new responsive code
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white text-gray-700 text-sm py-12 shadow-[0_-2px_6px_rgba(0,0,0,0.05)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {/* About */}
          <div>
            {/* <h4 className="mb-2 font-semibold text-gray-800">About Us</h4> */}
            <ul className="space-y-1">
              <li><Link to="/about" className="hover:underline">About Us</Link></li>
              <li><Link to="/hiring" className="hover:underline">We Are Hiring</Link></li>
              <li><Link to="/news" className="hover:underline">LzyCrazy News</Link></li>
              <li><Link to="/market" className="hover:underline">Marketplace</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="mb-2 font-semibold text-gray-800">Services</h4>
            <ul className="space-y-1">
              <li><Link to="/services" className="hover:underline">Business</Link></li>
              <li><Link to="/services" className="hover:underline">Shopping</Link></li>
              <li><Link to="/services" className="hover:underline">Entertainment</Link></li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="mb-2 font-semibold text-gray-800">Site Terms & Policies</h4>
            <ul className="space-y-1">
              <li><Link to="/privacy" className="hover:underline">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:underline">Terms</Link></li>
              <li><Link to="/cookie-policy" className="hover:underline">Cookie Policy</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="mb-2 font-semibold text-gray-800">Support Center</h4>
            <ul className="space-y-1">
              <li><Link to="/business-profile" className="hover:underline">Business Profile</Link></li>
              <li><Link to="/advertising" className="hover:underline">Advertising</Link></li>
              <li><Link to="/feedback" className="hover:underline">Feedback</Link></li>
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
        <div className="mt-12 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} LzyCrazy • All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

