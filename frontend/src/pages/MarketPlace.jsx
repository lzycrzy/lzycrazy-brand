// import React, { useState,useEffect } from 'react';
// import Header from '../Header';
// import CategoryPostForm from '../CategoryPostForm';
// import { toast } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';
// import { useUser } from '../../context/UserContext';
// import { mockPosts } from '../../data/mockPosts';
// import ProductCard from './ProductCard';

// const categoriesWithSub = {
//   Vehicles: ['Car', 'Bike', 'Bus'],
//   'Real Estate': ['Flat', 'Plot', 'Villa'],
//   Electronics: [],
//   Fashion: [],
//   Jobs: [],
//   Services: [],
//   Pets: [],
//   Furniture: [],
//   Books: [],
// };

// const banners = [
//   {
//     type: 'image',
//     src: 'https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=800&q=80',
//   },
//   {
//     type: 'image',
//     src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
//   },
//   {
//     type: 'video',
//     src: 'https://player.vimeo.com/external/371540223.sd.mp4?s=174cf8c423e50346a6613ab9e2df8774a2bd4173&profile_id=164',
//   },
//   {
//     type: 'video',
//     src: 'https://player.vimeo.com/external/428070005.sd.mp4?s=8e989d6cbf58a63a57f3b271d35a51cf3079f2ce&profile_id=164',
//   },
// ];

// const categoryFormConfig = {
//     Vehicles: {
//       categoryOptions: ['Cars', 'Bikes', 'Bus'],
//       subCategoryOptions: ['Hatchback', 'Sedan', 'SUV', 'Coupe', 'Convertible'],
//       inputFields: [
//         { name: 'brand', placeholder: 'Brand' },
//         { name: 'model', placeholder: 'Model' },
//         { name: 'year', placeholder: 'Year', type: 'number' },
//         { name: 'kmDriven', placeholder: 'Kilometers Driven' },
//         { name: 'price', placeholder: 'Price', type: 'number' },
//         { name: 'title', placeholder: 'Ad Title' },
//         { name: 'description', placeholder: 'Description' },
//       ],
//       checkboxGroups: [
//         {
//           label: 'Fuel Type',
//           name: 'fuel',
//           options: ['Petrol', 'Diesel', 'CNG', 'Electric', 'LPG'],
//         },
//         {
//           label: 'Transmission',
//           name: 'transmission',
//           options: ['Manual', 'Automatic'],
//         },
//         {
//           label: 'Owners',
//           name: 'owners',
//           options: ['1st', '2nd', '3rd', '4+'],
//         },
//       ],
//     },

//     RealEstate: {
//       categoryOptions: ['Flats', 'Plots', 'Villa'],
//       subCategoryOptions: ['1 BHK', '2 BHK', '3 BHK', 'Villa'],
//       inputFields: [
//         { name: 'location', placeholder: 'Location' },
//         { name: 'area', placeholder: 'Area (sq ft)' },
//         { name: 'price', placeholder: 'Price', type: 'number' },
//         { name: 'title', placeholder: 'Title' },
//         { name: 'description', placeholder: 'Description' },
//       ],
//       checkboxGroups: [
//         {
//           label: 'Property Type',
//           name: 'propertyType',
//           options: ['Apartment', 'Villa', 'Independent House'],
//         },
//         {
//           label: 'Furnishing',
//           name: 'furnishing',
//           options: ['Furnished', 'Semi-Furnished', 'Unfurnished'],
//         },
//         {
//           label: 'Possession',
//           name: 'possession',
//           options: ['Ready to move', 'Under Construction'],
//         },
//       ],
//     },

//     Electronics: {
//       categoryOptions: ['Mobiles', 'Laptops', 'Tablets', 'TVs'],
//       subCategoryOptions: ['Apple', 'Samsung', 'Dell', 'HP'],
//       inputFields: [
//         { name: 'brand', placeholder: 'Brand' },
//         { name: 'model', placeholder: 'Model' },
//         { name: 'condition', placeholder: 'Condition (e.g., New, Used)' },
//         { name: 'price', placeholder: 'Price', type: 'number' },
//         { name: 'description', placeholder: 'Description' },
//       ],
//       checkboxGroups: [
//         {
//           label: 'Warranty',
//           name: 'warranty',
//           options: ['Yes', 'No'],
//         },
//       ],
//     },

//     Fashion: {
//       categoryOptions: ['Men', 'Women', 'Kids'],
//       subCategoryOptions: ['Shirts', 'Jeans', 'Dresses', 'Shoes'],
//       inputFields: [
//         { name: 'brand', placeholder: 'Brand' },
//         { name: 'size', placeholder: 'Size' },
//         { name: 'condition', placeholder: 'Condition' },
//         { name: 'price', placeholder: 'Price', type: 'number' },
//         { name: 'description', placeholder: 'Description' },
//       ],
//       checkboxGroups: [],
//     },

//     Jobs: {
//       categoryOptions: ['IT', 'Marketing', 'Finance'],
//       subCategoryOptions: ['Full-time', 'Part-time', 'Internship'],
//       inputFields: [
//         { name: 'jobTitle', placeholder: 'Job Title' },
//         { name: 'company', placeholder: 'Company Name' },
//         { name: 'location', placeholder: 'Job Location' },
//         { name: 'salary', placeholder: 'Salary', type: 'number' },
//         { name: 'description', placeholder: 'Job Description' },
//       ],
//       checkboxGroups: [
//         {
//           label: 'Job Type',
//           name: 'jobType',
//           options: ['Full-time', 'Part-time', 'Internship', 'Remote'],
//         },
//       ],
//     },

//     Services: {
//       categoryOptions: ['Repair', 'Tutoring', 'Cleaning'],
//       subCategoryOptions: ['Electrician', 'Plumber', 'Home Tutor', 'Car Wash'],
//       inputFields: [
//         { name: 'service', placeholder: 'Service Name' },
//         { name: 'location', placeholder: 'Available Location' },
//         { name: 'charges', placeholder: 'Charges', type: 'number' },
//         { name: 'description', placeholder: 'Description' },
//       ],
//       checkboxGroups: [],
//     },

//     Pets: {
//       categoryOptions: ['Dogs', 'Cats', 'Birds'],
//       subCategoryOptions: ['Labrador', 'Persian Cat', 'Parrot'],
//       inputFields: [
//         { name: 'breed', placeholder: 'Breed' },
//         { name: 'age', placeholder: 'Age in Months' },
//         { name: 'price', placeholder: 'Price', type: 'number' },
//         { name: 'description', placeholder: 'Description' },
//       ],
//       checkboxGroups: [
//         {
//           label: 'Vaccinated',
//           name: 'vaccinated',
//           options: ['Yes', 'No'],
//         },
//       ],
//     },

//     Furniture: {
//       categoryOptions: ['Living Room', 'Bedroom', 'Office'],
//       subCategoryOptions: ['Sofa', 'Bed', 'Table', 'Chair'],
//       inputFields: [
//         { name: 'itemName', placeholder: 'Item Name' },
//         { name: 'material', placeholder: 'Material' },
//         { name: 'condition', placeholder: 'Condition' },
//         { name: 'price', placeholder: 'Price', type: 'number' },
//         { name: 'description', placeholder: 'Description' },
//       ],
//       checkboxGroups: [],
//     },

//     Books: {
//       categoryOptions: ['School', 'College', 'Novels'],
//       subCategoryOptions: ['Class 10', 'BTech', 'Fiction', 'Non-fiction'],
//       inputFields: [
//         { name: 'title', placeholder: 'Book Title' },
//         { name: 'author', placeholder: 'Author' },
//         { name: 'edition', placeholder: 'Edition' },
//         { name: 'price', placeholder: 'Price', type: 'number' },
//         { name: 'description', placeholder: 'Description' },
//       ],
//       checkboxGroups: [],
//     },
//   };

// const MarketplaceHome = () => {
//   const [expandedCategory, setExpandedCategory] = useState(null);
//   const [selectedCategory, setSelectedCategory] = useState('');
//   const [isModalOpen, setIsModalOpen] = useState(true);
//   const [selectedSubcategory, setSelectedSubcategory] = useState('');

//   const navigate = useNavigate();
//   const config = categoryFormConfig[selectedCategory.replace(/\s/g, '')];

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <Header />
//       <div className="flex">
//         {/* Sidebar */}
//         <aside className="sticky top-0 min-h-screen w-64 bg-white px-6 py-8 shadow-sm">
//           <h2 className="mb-6 text-lg font-semibold text-gray-800">
//             Categories
//           </h2>

//           <ul className="space-y-1">
//             {Object.entries(categoriesWithSub).map(
//               ([category, subcategories]) => {
//                 const isExpanded = expandedCategory === category;
//                 return (
//                   <li key={category}>
//                     <button
//                       onClick={() =>
//                         setExpandedCategory(isExpanded ? null : category)
//                       }
//                       className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left transition-all ${
//                         isExpanded
//                           ? 'bg-blue-50 text-blue-700'
//                           : 'text-gray-700 hover:bg-gray-100'
//                       }`}
//                     >
//                       <span className="font-medium">{category}</span>
//                       <svg
//                         className={`h-4 w-4 transform transition-transform duration-200 ${
//                           isExpanded ? 'rotate-90' : ''
//                         }`}
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth="2"
//                           d="M9 5l7 7-7 7"
//                         />
//                       </svg>
//                     </button>

//                     {isExpanded && subcategories.length > 0 && (
//                       <ul className="mt-2 ml-4 space-y-1 border-l border-gray-200 pl-2">
//                         {subcategories.map((sub, idx) => (
//                           <li key={idx}>
//                             <button
//                               onClick={() => {
//                                 const token = localStorage.getItem('token');
//                                 if (!token) {
//                                   toast.error('Please login or signup first');
//                                   return;
//                                 }
//                                 setSelectedCategory(category);
//                                 setSelectedSubcategory(sub);
//                                 setIsModalOpen(false);
//                               }}
//                               className="w-full px-3 py-1 text-left text-sm text-gray-600 hover:text-blue-700 hover:underline"
//                             >
//                               {sub}
//                             </button>
//                           </li>
//                         ))}
//                       </ul>
//                     )}
//                   </li>
//                 );
//               },
//             )}
//           </ul>
//         </aside>

//         {/* Main Content */}
//         <main className="flex-1 space-y-8 p-9">
//           {!selectedCategory && (
//             <>
//               {/* Image Row */}
//               <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//                 {banners
//                   .filter((banner) => banner.type === 'image')
//                   .map((banner, index) => (
//                     <div
//                       key={index}
//                       className="overflow-hidden rounded-lg bg-white shadow"
//                     >
//                       <img
//                         src={banner.src}
//                         alt={`Banner ${index}`}
//                         className="h-64 w-full object-cover"
//                       />
//                     </div>
//                   ))}
//               </div>

//               {/* Video Row */}
//               <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
//                 {banners
//                   .filter((banner) => banner.type === 'video')
//                   .map((banner, index) => (
//                     <div
//                       key={index}
//                       className="overflow-hidden rounded-lg bg-white shadow"
//                     >
//                       <video
//                         controls
//                         className="h-64 w-full object-cover"
//                         src={banner.src}
//                       >
//                         Your browser does not support the video tag.
//                       </video>
//                     </div>
//                   ))}
//               </div>
//             </>
//           )}
//           {selectedCategory && selectedSubcategory && (
//   <div className="mt-6">
//     <h2 className="text-xl font-bold mb-4">
//       {selectedCategory} - {selectedSubcategory} Listings
//     </h2>
//     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//       {mockPosts
//         .filter(
//           (post) =>
//             post.category === selectedCategory &&
//             post.subcategory === selectedSubcategory
//         )
//         .map((post) => (
//           <ProductCard key={post.id} post={post} />
//         ))}
//     </div>
//   </div>
// )}
//           {/* Category-specific Form */}
//           {selectedCategory && config ? (
//             <CategoryPostForm
//               isOpen={isModalOpen}
//               selectedCategory
//               onClose={() => {
//                 setIsModalOpen(false);
//                 setSelectedCategory('');
//               }}
//               {...config}
//               onSubmit={(data) => {
//                 console.log('Posted Data:', data);
//                 setIsModalOpen(false);
//               }}
//             />
//           ) : (
//             selectedCategory && (
//               <div className="text-center text-gray-600">
//                 <h2 className="text-xl font-semibold">
//                   Posting form for "{selectedCategory}" is under construction.
//                 </h2>
//               </div>
//             )
//           )}
//         </main>
//       </div>
//     </div>
//   );
// };

// export default MarketplaceHome;

import React, { useEffect, useState } from 'react';
import Header from '../components/static/Header';
import CategoryPostForm from '../components/CategoryPostForm';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import ProductCard from '../components/Market/ProductCard';
import listings from '../data/mockListings.json'; // ✅ Updated to use external data
import AddProduct from './AddProduct';
import { useProduct } from '../store/useProduct';
import instance from '../lib/axios/axiosInstance';
import ProductImage from '../assets/product.jpg';

const categoriesWithSub = Object.keys(listings).reduce((acc, category) => {
  acc[category] = Object.keys(listings[category]);
  return acc;
}, {});

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

const MarketplaceHome = () => {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [selectedSubcategory, setSelectedSubcategory] = useState('');

  const navigate = useNavigate();
  const handleCardClick = (item) => {
    navigate('/property-view', { state: { data: item, images: item.images } });
  };

  const selectedListings =
    listings[selectedCategory]?.[selectedSubcategory] || [];

  const [categories, setCategories] = useState(null);
  const [subCategories, setSubCategories] = useState(null);
  const [subcategoryDetails, setSubCategoryDetails] = useState(null);
  const [categoryDetails, setCategoryDetails] = useState(null);
  useEffect(() => {
    async function marketPlaceDetails() {
      try {
        const res = await instance.get('/v1/categories/public');
        console.log('Category Details: ', res.data.data);
        console.log('Category: ', res.data.data.categories);
        setCategories(res.data.data.categories);
      } catch (error) {
        console.log(error);
      }
    }

    marketPlaceDetails();
  }, []);

  useEffect(() => {
    async function getSubcategoryDetails() {

      if(!selectedCategory || !selectedSubcategory) return;

      try {
        console.log(selectedCategory, selectedSubcategory);
        const res = await instance.get('/v1/categories/subcategories', {
          params: {
            category: selectedCategory,
            subcategory: selectedSubcategory,
          },
        });

        setSubCategoryDetails(res.data);
      } catch (error) {
        console.log(error);
      }
    }
    getSubcategoryDetails();
  }, [selectedSubcategory]);

  console.log(subcategoryDetails);
  return (
    <div className="relative min-h-screen w-full bg-gray-100">
      <Header />
      <div className="flex">
        <aside className="sticky top-[58px] h-[calc(100vh-4rem)] w-64 bg-white px-6 py-8 shadow-sm">
          <h2 className="mb-6 text-lg font-semibold text-gray-800">
            Categories
          </h2>
          <ul className="space-y-1">
            {categories?.map((category, index) => {
              return (
                <li key={index}>
                  <button
                    onClick={() => {
                      setSelectedCategory(category._id);
                      setSubCategories(category.subcategories);
                    }}
                    className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left transition-all ${
                      selectedCategory === category.name
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="font-medium">{category.name}</span>
                    <svg
                      className={`h-4 w-4 transform transition-transform duration-200 ${
                        selectedCategory === category._id ? 'rotate-90' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>

                  {selectedCategory === category._id &&
                    subCategories?.length > 0 && (
                      <ul className="mt-2 ml-4 space-y-1 border-l border-gray-200 pl-2">
                        {subCategories.map((sub, idx) => (
                          <li key={idx}>
                            <button
                              onClick={() => {
                                setSelectedSubcategory(sub.name);
                                setIsModalOpen(false);
                              }}
                              className="w-full px-3 py-1 text-left text-sm text-gray-600 hover:text-blue-700 hover:underline"
                            >
                              {sub.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                </li>
              );
            })}
          </ul>
        </aside>

        <main className="flex-1 space-y-8 overflow-auto p-9">
          {!selectedSubcategory && 
            <>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {banners
                  .filter((banner) => banner.type === 'image')
                  .map((banner, index) => (
                    <div
                      key={index}
                      className="overflow-hidden rounded-lg bg-white shadow"
                    >
                      <img
                        src={banner.src}
                        alt={`Banner ${index}`}
                        className="h-64 w-full object-cover"
                      />
                    </div>
                  ))}
              </div>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {banners
                  .filter((banner) => banner.type === 'video')
                  .map((banner, index) => (
                    <div
                      key={index}
                      className="overflow-hidden rounded-lg bg-white shadow"
                    >
                      <video
                        controls
                        className="h-64 w-full object-cover"
                        src={banner.src}
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  ))}
              </div>
            </>
          }

          {selectedCategory && selectedSubcategory && (
            <div className="mt-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                {selectedListings.map((post, index) => (
                  <button onClick={() => handleCardClick(post)}>
                    <ProductCard key={index} post={post} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedCategory && selectedSubcategory && subcategoryDetails?.length > 0 ? (
            <>
              <div className="mt-6">
                <h2 className="mb-4 text-xs">
                  {subcategoryDetails[0]?.category?.name} / {selectedSubcategory}
                </h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                  {Array.isArray(subcategoryDetails) &&
                    subcategoryDetails.map((post, index) => (
                      <button key={index} onClick={() => handleCardClick(post)}>
                        <ProductCard post={post} />
                      </button>
                    ))}
                </div>
              </div>
            </>
          ) : (
            <div>There is not listing for this types of category</div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MarketplaceHome;
