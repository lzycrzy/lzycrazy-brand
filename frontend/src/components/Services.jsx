import React, { useState } from 'react';
import Header from '../components/Header1';
import Footer from '../components/Footer1';

const services = [
  {
    title: 'Web Development',
    description: 'Responsive, fast websites using React, Next.js, and Django.',
    icon: 'https://cdn-icons-png.flaticon.com/512/919/919827.png',
  },
  {
    title: 'Graphic Design',
    description: 'Creative logos, posters, and social media designs.',
    icon: 'https://cdn-icons-png.flaticon.com/512/1828/1828919.png',
  },
  {
    title: 'SEO Optimization',
    description: 'Improve ranking with smart SEO and keyword strategy.',
    icon: 'https://cdn-icons-png.flaticon.com/512/609/609803.png',
  },
  {
    title: 'Content Writing',
    description: 'Engaging blogs, landing pages, and ad copy.',
    icon: 'https://cdn-icons-png.flaticon.com/512/1828/1828884.png',
  },
  {
    title: 'Social Media Marketing',
    description: 'Growth strategies for Instagram, LinkedIn & more.',
    icon: 'https://cdn-icons-png.flaticon.com/512/733/733547.png',
  },
  {
    title: 'UI/UX Design',
    description: 'Intuitive interfaces for web and mobile apps.',
    icon: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
  },
];

const Services = () => {
  const [selectedService, setSelectedService] = useState(null);

  const handleServiceClick = (index) => {
    setSelectedService(index);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <div className="flex-grow max-w-6x min-h-screen  mx-auto px-4 py-10">
        {/* Heading */}
        <h2 className="text-3xl font-bold text-orange-600 mb-2 text-center">Our Services</h2>
        <div className="w-20 h-1 bg-orange-400 mx-auto mb-8 rounded"></div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
             className="bg-white w-[300px] max-w-sm mx-auto rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow flex items-start gap-4"
            >
              {/* Icon */}
              <img
                src={service.icon}
                alt={service.title}
                className="w-14 h-14 object-contain mt-1"
              />

              {/* Text */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{service.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Placeholder for future form */}
        {selectedService !== null && (
          <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              You selected: {services[selectedService].title}
            </h3>
            <p className="text-sm text-gray-600">[Form will be shown here]</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Services;
