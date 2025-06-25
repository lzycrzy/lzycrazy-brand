// import React, { useState } from 'react';
// import axios from '../lib/axios/axiosInstance';

// const EnquiryForm = ({ serviceId, onClose }) => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     message: ''
//   });
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       await axios.post('/v1/users/enquiry', {
//         ...formData,
//         serviceId
//       });
//       alert('Enquiry submitted!');
//       setFormData({ name: '', email: '', phone: '', message: '' });
//       onClose();
//     } catch (error) {
//       console.error(error);
//       alert('Failed to submit enquiry');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <input
//         name="name"
//         placeholder="Your Name"
//         value={formData.name}
//         onChange={handleChange}
//         required
//         className="w-full p-2 border rounded"
//       />
//       <input
//         name="email"
//         placeholder="Your Email"
//         value={formData.email}
//         onChange={handleChange}
//         type="email"
//         className="w-full p-2 border rounded"
//       />
//       <input
//         name="phone"
//         placeholder="Your Phone"
//         value={formData.phone}
//         onChange={handleChange}
//         type="tel"
//         className="w-full p-2 border rounded"
//       />
//       <textarea
//         name="message"
//         placeholder="Your Message"
//         value={formData.message}
//         onChange={handleChange}
//         required
//         className="w-full p-2 border rounded"
//       ></textarea>
//       <button
//         type="submit"
//         disabled={loading}
//         className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
//       >
//         {loading ? 'Submitting...' : 'Submit Enquiry'}
//       </button>
//     </form>
//   );
// };

// export default EnquiryForm;



import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../lib/axios/axiosInstance"; // Adjust the path
import image from "../assets/login1.webp"; // Adjust as needed

const EnquireForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const serviceName = location.state?.serviceName || "Service";
  const serviceId = location.state?.serviceId;
console.log(serviceId);
  const [formData, setFormData] = useState({
   name:"",
    email: "",
    phone: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!serviceId) {
      alert("Service ID missing. Please try again.");
      return;
    }

   
    try {
      console.log("Submitting payload:", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        service: serviceId,               // renamed to match schema
        serviceTitle: serviceName        // added as required
      });
      await axios.post("/v1/users/enquiry", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        service: serviceId,
        serviceTitle: serviceName
      });
      window.location.href = "https://pawangangwar9.github.io/verify-page/";
    } catch (err) {
      alert("Failed to submit enquiry. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-[#85abb3] to-[#a94c4c] flex items-center justify-center">
      <div className="flex w-[800px] max-w-[95%] rounded-lg shadow-lg overflow-hidden bg-white">
        {/* Image Section */}
        <div className="relative w-1/2 hidden sm:block">
          <img src={image} alt="Service" className="h-full w-full object-cover" />
          <div className="absolute bottom-0 bg-black/50 text-white text-sm p-4">
            {`Thanks for choosing ${serviceName}. Please tell us more about your needs.`}
          </div> 
        </div>

        {/* Form Section */}
        <div className="w-full sm:w-1/2 p-8 relative">
          <button
            onClick={() => navigate("/")}
            className="absolute top-2 right-4 text-gray-500 text-xl"
          >
            &times;
          </button>
          <h2 className="text-xl font-semibold mb-2">Enquire About {serviceName}</h2>
          <p className="text-sm text-gray-600 mb-4">
            Fill out the form and our team will get back to you.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-4">
              {/* <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-1/2 p-2 border border-gray-300 rounded-md text-sm"
              /> */}
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            />
            <textarea
              name="message"
              placeholder={`Message about ${serviceName}`}
              value={formData.message}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md text-sm resize-none h-20"
            ></textarea>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[#1ebddd] to-[#ea2473] text-white font-bold text-base rounded-md"
            >
              {loading ? "Submitting..." : "Submit Enquiry →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EnquireForm;
