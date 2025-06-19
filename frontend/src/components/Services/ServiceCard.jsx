import React from 'react';

const ServiceCard = ({ service, onEnquireClick }) => {
  return (
    <div className="border rounded-lg shadow-sm p-4 hover:shadow-lg transition duration-200">
      <div className="text-3xl mb-2">{service.icon?.component || '🛠️'}</div>
      <h3 className="text-lg font-bold">{service.title}</h3>
      <p className="text-gray-600 text-sm mb-4">{service.description}</p>
      <button
        onClick={onEnquireClick}
        className="mt-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Enquire
      </button>
    </div>
  );
};

export default ServiceCard;
