import React, { useState } from 'react';
import axios from '../lib/axios/axiosInstance';

const EnquiryForm = ({ serviceId, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post('/v1/users/enquiry', {
        ...formData,
        serviceId
      });
      alert('Enquiry submitted!');
      setFormData({ name: '', email: '', phone: '', message: '' });
      onClose();
    } catch (error) {
      console.error(error);
      alert('Failed to submit enquiry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="name"
        placeholder="Your Name"
        value={formData.name}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />
      <input
        name="email"
        placeholder="Your Email"
        value={formData.email}
        onChange={handleChange}
        type="email"
        className="w-full p-2 border rounded"
      />
      <input
        name="phone"
        placeholder="Your Phone"
        value={formData.phone}
        onChange={handleChange}
        type="tel"
        className="w-full p-2 border rounded"
      />
      <textarea
        name="message"
        placeholder="Your Message"
        value={formData.message}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      ></textarea>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        {loading ? 'Submitting...' : 'Submit Enquiry'}
      </button>
    </form>
  );
};

export default EnquiryForm;
