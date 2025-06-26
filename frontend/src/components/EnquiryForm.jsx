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
import ReactDOM from "react-dom";
import image from "../assets/login1.webp";
import axios from "../lib/axios/axiosInstance";

const modalRoot = document.getElementById("modal-root");

const EnquireModal = ({ serviceId, serviceName = "Service", onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!serviceId) {
      alert("Service ID missing. Please try again.");
      return;
    }

    try {
      setLoading(true);
      await axios.post("/v1/users/enquiry", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        service: serviceId,
        serviceTitle: serviceName,
      });

      setSubmitted(true); // Show thank you message
    } catch (err) {
      console.error(err);
      alert("Failed to submit enquiry.");
    } finally {
      setLoading(false);
    }
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="flex w-[850px] max-w-[95%] rounded-xl overflow-hidden shadow-2xl bg-white relative">
        {/* Image Side */}
        <div className="w-1/2 hidden sm:block bg-gray-100">
          <img
            src={image}
            alt="Enquiry"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Form or Thank You Side */}
        <div className="w-full sm:w-1/2 p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-4 text-gray-500 hover:text-gray-700 text-xl"
          >
            &times;
          </button>

          {!submitted ? (
            <>
              <h2 className="text-xl font-semibold mb-2">Enquire About {serviceName}</h2>
              <p className="text-sm text-gray-600 mb-4">
                Fill out the form and our team will get back to you.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                />
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
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <div className="text-4xl text-green-600 mb-3">✅</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Thanks for Reaching Out!</h2>
              <p className="text-sm text-gray-600 mb-6">
                We’ve received your enquiry. Our team will be in touch with you shortly.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>,
    modalRoot
  );
};

export default EnquireModal;
