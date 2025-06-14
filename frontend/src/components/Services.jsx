import React, { useState } from 'react';
import Header from '../components/Header';
import Footer   from '../components/Footer1';

const services = [
  {
    title: 'Web Development',
    description:
      'We create responsive, SEO-friendly, and high-performance websites using the latest technologies like React, Next.js, Django, and more. Our goal is to deliver websites that provide smooth user experiences and meet your business objectives.',
    icon: 'https://cdn-icons-png.flaticon.com/512/919/919827.png',
  },
  {
    title: 'Graphic Design',
    description:
      'From logos and branding to posters and social media creatives, our designers deliver compelling visuals that communicate your brand effectively. We follow design trends and maintain visual consistency across all assets.',
    icon: 'https://cdn-icons-png.flaticon.com/512/1828/1828919.png',
  },
  {
    title: 'SEO Optimization',
    description:
      'We help your website rank higher on search engines with smart on-page SEO, quality backlinking, and content strategies. Improve your traffic organically and grow your online visibility with our expert SEO services.',
    icon: 'https://cdn-icons-png.flaticon.com/512/609/609803.png',
  },
  {
    title: 'Content Writing',
    description:
      'Our experienced writers create engaging blogs, landing pages, product descriptions, and marketing copy that converts. We focus on clarity, tone, and keyword optimization for maximum impact.',
    icon: 'https://cdn-icons-png.flaticon.com/512/1828/1828884.png',
  },
  {
    title: 'Social Media Marketing',
    description:
      'Maximize your brand presence with platform-specific strategies for Instagram, LinkedIn, Facebook, and more. From content creation to campaign management, we ensure consistent growth.',
    icon: 'https://cdn-icons-png.flaticon.com/512/733/733547.png',
  },
  {
    title: 'UI/UX Design',
    description:
      'We design intuitive user interfaces and delightful user experiences for websites, mobile apps, and SaaS platforms. Our designs are data-informed, user-tested, and visually aligned with your brand.',
    icon: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
  },
];

const Services = () => {
  const [expanded, setExpanded] = useState(null);

  const toggleExpand = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Heading */}
        <h2 className="text-3xl font-bold text-orange-600 mb-2 text-center">Our Services</h2>
        <div className="w-20 h-1 bg-orange-400 mx-auto mb-8 rounded"></div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow flex items-start gap-4"
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
                  {expanded === index
                    ? service.description
                    : service.description.length > 120
                      ? service.description.slice(0, 120) + '...'
                      : service.description}
                </p>

                {/* Button */}
                {service.description.length > 120 && (
                  <button
                    onClick={() => toggleExpand(index)}
                    className="mt-3 text-xs bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600 transition"
                  >
                    {expanded === index ? 'Show Less' : 'Read More'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
  <Footer/>
    </div>
  );
};

export default Services;
