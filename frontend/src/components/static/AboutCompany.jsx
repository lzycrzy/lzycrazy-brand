import React from 'react';
import image1 from '../../assets/1.png';
import image2 from '../../assets/2.png';
import image3 from '../../assets/3.png';
import image4 from '../../assets/4.png';
import Footer   from './Footer1';
import Header from './Header1';

const sections = [
  {
    title: 'About the Company',
    subtitle: 'What drives us',
    text: 'LzyCrazy is an Indian Multi-National Technology company based in Noida, India. It was incorporated on 18th June 2021 in Noida, Uttar Pradesh. We aim at providing all the luxury brands under a single platform. We are developing our brand as a protagonist and also aim at reaching consumer satisfaction by providing outstanding services. We have the best social media platform to connect people all over the world, which is a great benefit for advertisement as well as brand promotion. We help in business development by focusing on consumers needs and ensuring them a great variety of products in a truly unique way. With our new features, users can share new photos, videos, etc.',
    image: image1,
  },
  {
    title: 'Our Team',
    subtitle: 'Who we are',
    text: 'LzyCrazy is a team comprised of dedicated and experienced professionals with relevant experience in their respective fields. We ensure the delivery of our best and most efficient services to consumers that can make their lives more effortless, gracious, and elated. LzyCrazy believes in providing the best platform for people to connect, sell their products, share ideas, promote business, develop websites, and so on. We also tend to provide a source of income to people for their better lifestyle. Our motive is to emerge as one of the best leading brands in the global world. Keeping up with the latest technology, we endeavor to keep our consumers at the center of our business universe. Infused with our creativity, LzyCrazy’s distinct aim is to provide the world a better future.',
    image: image2,
  },
  {
    title: 'Our Vision',
    subtitle: 'Looking ahead',
    text: 'The vision is to emerge as the largest networking site in the global world by empowering people with convenient access and the greatest platform to connect them extensively.',
    image: image3,
  },
  {
    title: 'Our Values',
    subtitle: 'What we believe',
    text: 'LzyCrazy has acquired 29 members from each state of India to provide efficient services to people.',
    image: image4,
  },
];

const AboutUs = () => {
  return (
    <div className="w-full">
        <Header/>
      {sections.map((section, index) => {
        if (index === 2) {
          // CUSTOM SECTION FOR "OUR VISION"
          return (
            <div
              key={index}
              className="relative h-[600px] flex items-center justify-center bg-center bg-cover text-white"
              style={{ backgroundImage: `url(${section.image})` }}
            >
              {/* White triangular overlay */}
              <div className="absolute inset-0 bg-white opacity-90 clip-triangle z-10"></div>

              {/* Text content */}
              <div className="relative z-20 px-6 text-center max-w-3xl">
                <h2 className="text-4xl font-bold text-gray-900">{section.title}</h2>
                <h3 className="text-xl mt-2 text-gray-700">{section.subtitle}</h3>
                <p className="mt-4 text-gray-600">{section.text}</p>
              </div>
            </div>
          );
        }

        // DEFAULT SECTION
        return (
          <div
            key={index}
            className={`flex flex-col h-[700px] md:flex-row items-center justify-center gap-10 px-8 md:px-20 py-16 ${
              index % 2 === 1 ? 'bg-blue-50' : 'bg-white'
            }`}
          >
            {/* Image */}
            <div
              className={`w-full md:w-1/2 flex justify-center ${
                index % 2 === 1 ? 'md:order-1' : 'md:order-2'
              }`}
            >
              <img
                src={section.image}
                alt={section.title}
                className="max-w-full h-[350px] object-contain rounded-lg "
              />
            </div>

            {/* Text */}
            <div
              className={`w-full md:w-1/2 ${
                index % 2 === 1 ? 'md:order-2' : 'md:order-1'
              }`}
            >
              <h2 className="text-3xl font-bold text-gray-800">{section.title}</h2>
              <h3 className="text-lg font-semibold text-gray-600 mt-2">{section.subtitle}</h3>
              <p className="mt-4 text-gray-700 leading-relaxed">{section.text}</p>
            </div>
          </div>
        );
      })}
      <Footer/>
    </div>
  );
};

export default AboutUs;
