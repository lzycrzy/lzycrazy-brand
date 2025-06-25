// import React, { useState, useEffect } from 'react';
// import ReactDOM from 'react-dom';
// import Header from '../static/Header1';
// import Footer from '../static/Footer1';
// import axios from '../../lib/axios/axiosInstance';

// // Icon packs
// import * as FaIcons from 'react-icons/fa';
// import * as MdIcons from 'react-icons/md';
// import * as AiIcons from 'react-icons/ai';

// // Mapping string to icon component
// const iconPacks = {
//   Fa: FaIcons,
//   Md: MdIcons,
//   Ai: AiIcons,
// };

// const getIconComponent = (iconString) => {
//   if (!iconString) return null;
//   const prefix = iconString.slice(0, 2);
//   const pack = iconPacks[prefix];
//   return pack?.[iconString] || null;
// };

// // Modal Component
// const EnquiryModal = ({ service, onClose }) => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     message: '',
//   });
//   const [success, setSuccess] = useState(false);

//   const handleChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post('/v1/users/enquiry', {
//         ...formData,
//         service: service._id,
//         serviceTitle: service.title,
//       });
//       setSuccess(true);
//     } catch {
//       alert('Submission failed');
//     }
//   };

//   return ReactDOM.createPortal(
//     <div className="fixed inset-0 z-50 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center px-4">
//       <div className="relative w-full max-w-xl z-10 font-sans">
//         {/* Background Glow */}
//         <div
//           className="absolute -inset-10 z-0 rounded-[12px] blur-[120px]"
//           style={{
//             background:
//               'linear-gradient(90deg, rgba(68,132,255,0.6) -0.55%, rgba(68,176,255,0.6) 22.86%, rgba(255,68,236,0.6) 48.36%, rgba(68,165,255,0.6) 73.33%, rgba(242,255,94,0.6) 99.34%)',
//           }}
//         />
//         {/* Modal Card */}
//         <div className="relative bg-white rounded-1xl shadow-xl p-10 z-10">
//           <button
//             onClick={onClose}
//             className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-xl"
//           >
//             &times;
//           </button>
//           <h2 className="text-2xl font-semibold text-gray-800 mb-6 tracking-tight">
//             Enquire about: <span className="text-orange-500">{service.title}</span>
//           </h2>

//           {success ? (
//             <p className="text-green-600 font-semibold text-lg">Thank you! We'll contact you soon.</p>
//           ) : (
//             <form onSubmit={handleSubmit} className="space-y-6">
//               {['name', 'email', 'phone'].map((field) => (
//                 <input
//                   key={field}
//                   type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
//                   name={field}
//                   placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
//                   value={formData[field]}
//                   onChange={handleChange}
//                   required
//                   className="w-full border-0 border-b border-gray-300 focus:outline-none focus:border-blue-500 text-gray-800 text-base placeholder:text-gray-400"
//                 />
//               ))}
//               <textarea
//                 name="message"
//                 placeholder="Message"
//                 value={formData.message}
//                 onChange={handleChange}
//                 required
//                 rows={4}
//                 className="w-full border-0 border-b border-gray-300 focus:outline-none focus:border-blue-500 text-gray-800 text-base placeholder:text-gray-400"
//               ></textarea>
//               <button
//                 type="submit"
//                 className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
//               >
//                 Submit Enquiry
//               </button>
//             </form>
//           )}
//         </div>
//       </div>
//     </div>,
//     document.body
//   );
// };

// const Services = () => {
//   const [selectedService, setSelectedService] = useState(null);
//   const [services, setServices] = useState([]);

//   const handleServiceClick = (index) => {
//     setSelectedService(services[index]);
//   };

//   useEffect(() => {
//     const fetchServices = async () => {
//       try {
//         const response = await axios.get('/v1/services');
//         setServices(response.data);
//       } catch (error) {
//         console.error('Error fetching services:', error);
//       }
//     };

//     fetchServices();
//   }, []);

//   const closeModal = () => {
//     setSelectedService(null);
//   };

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-50">
//       <Header />

//       <div className="flex-grow mt-15 max-w-6xl min-h-screen mx-auto px-4 py-10">
//         <h2 className="text-3xl font-bold text-orange-600 mb-2 text-center">
//           Our Services
//         </h2>
//         <div className="w-20 h-1 bg-orange-400 mx-auto mb-8 rounded"></div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {services.map((service, index) => (
//             <div
//               key={index}
//               onClick={() => handleServiceClick(index)}
//               className="bg-white w-[300px] max-w-sm mx-auto rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow flex items-start gap-4 cursor-pointer"
//             >
//               {service.icon?.component ? (
//   <img
//     src={service.icon.component}
//     alt={service.title}
//     className="w-14 h-14 object-contain mt-1"
//   />
// ) : (
//   <span className="text-gray-400 text-sm">No Icon</span>
// )}

//               <div className="flex-1">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-1">{service.title}</h3>
//                 <p className="text-sm text-gray-600 leading-relaxed">
//                   {service.description}
//                 </p>
//               </div>
//             </div>
//           ))}

//           <div className="bg-white w-[300px] max-w-sm mx-auto rounded-lg shadow-md p-6 flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-300">
//             <span className="text-4xl">🚧</span>
//             <h3 className="text-lg font-bold text-gray-700 mt-2">Coming Soon</h3>
//             <p className="text-sm text-gray-500 mt-1">Exciting new service on the way!</p>
//           </div>
//         </div>
//       </div>

//       {selectedService && (
//         <EnquiryModal
//           service={selectedService}
//           onClose={closeModal}
//         />
//       )}

//       <Footer />
//     </div>
//   );
// };

// export default Services;




//new inter code
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../../lib/axios/axiosInstance";

import * as FaIcons from "react-icons/fa";
import * as MdIcons from "react-icons/md";
import * as AiIcons from "react-icons/ai";

// Icon packs map
const iconPacks = {
  Fa: FaIcons,
  Md: MdIcons,
  Ai: AiIcons,
};

// Get icon component from string
const getIconComponent = (iconName) => {
  if (!iconName) return null;
  const prefix = iconName.slice(0, 2);
  const pack = iconPacks[prefix];
  return pack?.[iconName] || null;
};

export default function Services() {
  const [services, setServices] = useState([]);
  const radius = 200;

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get("/v1/services");
        console.log(res.data)
        setServices(res.data);
      } catch (err) {
        console.error("Error fetching services:", err);
      }
    };
    fetchServices();
  }, []);

  const count = services.length;

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-100 overflow-hidden">
      <div className="bg-white text-orange-600 text-xl font-bold px-4 py-2 rounded shadow-lg mb-4">
        Our Services
      </div>

      <div className="relative w-[600px] h-[600px] rounded-full group">
        {/* Center title */}
        <div className="absolute top-1/2 left-1/2 z-10 transform -translate-x-1/2 -translate-y-1/2 text-orange-600 text-xl font-bold px-4 py-2 rounded">
          Our Services
        </div>

        {/* Rotating icons */}
        <div className="absolute inset-0 animate-spin-slow group-hover:animate-none transition-all duration-500">
          {services.map((service, index) => {
            const angle = (360 / count) * index;
            const x = radius * Math.cos((angle * Math.PI) / 180);
            const y = radius * Math.sin((angle * Math.PI) / 180);
            const Icon = getIconComponent(service.icon?.component);

            return (
              <div
                key={service._id || index}
                className="absolute flex flex-col items-center"
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <Link
                  to="/enquire"
                  state={{ serviceName: service.title, serviceId: service._id }}
                  className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-white hover:scale-110 transition duration-300 shadow-lg"
                >
                  {Icon ? <Icon className="w-6 h-6" /> : "🚧"}
                </Link>
                <div className="mt-2 text-xs bg-white px-2 py-1 rounded shadow text-black text-center max-w-[80px]">
                  {service.title}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
