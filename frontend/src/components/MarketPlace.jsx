import React, { useState } from 'react';
import Header from './Header';
import CarPostForm from './CarPostForm';
import CategoryPostForm from './CategoryPostForm';

const categories = [
  'Vehicles',
  'Real Estate',
  'Electronics',
  'Fashion',
  'Jobs',
  'Services',
  'Pets',
  'Furniture',
  'Books',
];

const banners = [
  {
    type: 'image',
    src: 'https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=800&q=80',
  },
  {
    type: 'image',
    src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
  },
  {
    type: 'video',
    src: 'https://player.vimeo.com/external/371540223.sd.mp4?s=174cf8c423e50346a6613ab9e2df8774a2bd4173&profile_id=164',
  },
  {
    type: 'video',
    src: 'https://player.vimeo.com/external/428070005.sd.mp4?s=8e989d6cbf58a63a57f3b271d35a51cf3079f2ce&profile_id=164',
  },
];

const baseConfig = {
  categoryOptions: ['General'],
  subCategoryOptions: ['Option 1', 'Option 2'],
  inputFields: [
    { name: 'title', placeholder: 'Title' },
    { name: 'description', placeholder: 'Description' },
    { name: 'price', placeholder: 'Price', type: 'number' },
  ],
  checkboxGroups: [],
};

const categoryFormConfig = {
  Vehicles: {
    categoryOptions: ['Cars'],
    subCategoryOptions: ['Hatchback', 'Sedan', 'SUV', 'Coupe', 'Convertible'],
    inputFields: [
      { name: 'brand', placeholder: 'Brand' },
      { name: 'year', placeholder: 'Year', type: 'number' },
      { name: 'kmDriven', placeholder: 'KM Driven' },
      { name: 'title', placeholder: 'Ad Title' },
      { name: 'description', placeholder: 'Description' },
      { name: 'price', placeholder: 'Price', type: 'number' },
    ],
    checkboxGroups: [
      {
        label: 'Fuel Type',
        name: 'fuel',
        options: ['CNG & Hybrids', 'Diesel', 'Electric', 'LPG', 'Petrol'],
      },
      {
        label: 'No. of Owners',
        name: 'owners',
        options: ['1st', '2nd', '3rd', '4+'],
      },
      {
        label: 'Transmission',
        name: 'transmission',
        options: ['Automatic', 'Manual'],
      },
    ],
  },
  RealEstate: {
    categoryOptions: ['Flats', 'Plots'],
    subCategoryOptions: ['1 BHK', '2 BHK', '3 BHK', 'Villa'],
    inputFields: [
      { name: 'location', placeholder: 'Location' },
      { name: 'area', placeholder: 'Area (sq ft)' },
      { name: 'price', placeholder: 'Price', type: 'number' },
      { name: 'title', placeholder: 'Title' },
      { name: 'description', placeholder: 'Description' },
    ],
    checkboxGroups: [
      {
        label: 'Property Type',
        name: 'propertyType',
        options: ['Apartment', 'Independent House', 'Villa'],
      },
      {
        label: 'Furnishing',
        name: 'furnishing',
        options: ['Furnished', 'Semi-Furnished', 'Unfurnished'],
      },
    ],
  },
  Electronics: baseConfig,
  Fashion: baseConfig,
  Jobs: baseConfig,
  Services: baseConfig,
  Pets: baseConfig,
  Furniture: baseConfig,
  Books: baseConfig,
};

const MarketplaceHome = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(true);

  const config = categoryFormConfig[selectedCategory.replace(/\s/g, '')];

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow p-4 min-h-screen sticky top-0">
          <h2 className="text-xl font-bold mb-4">Categories</h2>
          <ul className="space-y-2">
            {categories.map((category, index) => (
              <li
                key={index}
                onClick={() => {
                    setSelectedCategory(category);
                    setIsModalOpen(true);
                  }}
                className={`p-2 rounded cursor-pointer text-gray-700 hover:bg-blue-100 ${
                  selectedCategory === category ? 'bg-blue-200 font-semibold' : ''
                }`}
              >
                {category}
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-9 space-y-8">
          {!selectedCategory && (
            <>
              {/* Image Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {banners
                  .filter((banner) => banner.type === 'image')
                  .map((banner, index) => (
                    <div key={index} className="bg-white rounded-lg shadow overflow-hidden">
                      <img
                        src={banner.src}
                        alt={`Banner ${index}`}
                        className="w-full h-64 object-cover"
                      />
                    </div>
                  ))}
              </div>

              {/* Video Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {banners
                  .filter((banner) => banner.type === 'video')
                  .map((banner, index) => (
                    <div key={index} className="bg-white rounded-lg shadow overflow-hidden">
                      <video
                        controls
                        className="w-full h-64 object-cover"
                        src={banner.src}
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  ))}
              </div>
            </>
          )}

          {/* Category-specific Form */}
          {selectedCategory && config ? (
            <CategoryPostForm
              isOpen={isModalOpen}
              onClose={() => {
                setIsModalOpen(false);
                setSelectedCategory('');
              }}
              {...config}
              onSubmit={(data) => {
                console.log('Posted Data:', data);
                setIsModalOpen(false);
              }}
            />
          ) : (
            selectedCategory && (
              <div className="text-center text-gray-600">
                <h2 className="text-xl font-semibold">
                  Posting form for "{selectedCategory}" is under construction.
                </h2>
              </div>
            )
          )}
        </main>
      </div>
    </div>
  );
};

export default MarketplaceHome;
