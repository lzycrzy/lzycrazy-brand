import React, { useState, useEffect } from 'react';
import Header from '../components/static/Header';
import CategoryPostForm from '../components/CategoryPostForm';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import mockPosts from '../data/mockPosts';
import { useProduct } from '../store/useProduct';
// import ProductCard from './ProductCard';

import Card from '../components/Product/Card';

const categoriesWithSub = {
  Vehicles: [],
  RealEstate: [],
  Electronics: [],
  Fashion: [],
  Jobs: [],
  Services: [],
  Pets: [],
  Furniture: [],
  Books: [],
};

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

const categoryFormConfig = {
  Vehicles: {
    categoryOptions: ['Cars', 'Bikes', 'Bus'],
    subCategoryOptions: ['Hatchback', 'Sedan', 'SUV', 'Coupe', 'Convertible'],
    inputFields: [
      { name: 'brand', placeholder: 'Brand' },
      { name: 'model', placeholder: 'Model' },
      { name: 'year', placeholder: 'Year', type: 'number' },
      { name: 'kmDriven', placeholder: 'Kilometers Driven' },
      { name: 'price', placeholder: 'Price', type: 'number' },
      { name: 'title', placeholder: 'Ad Title' },
      { name: 'description', placeholder: 'Description' },
    ],
    checkboxGroups: [
      {
        label: 'Fuel Type',
        name: 'fuel',
        options: ['Petrol', 'Diesel', 'CNG', 'Electric', 'LPG'],
      },
      {
        label: 'Transmission',
        name: 'transmission',
        options: ['Manual', 'Automatic'],
      },
      {
        label: 'Owners',
        name: 'owners',
        options: ['1st', '2nd', '3rd', '4+'],
      },
    ],
  },

  RealEstate: {
    categoryOptions: ['Flats', 'Plots', 'Villa'],
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
        options: ['Apartment', 'Villa', 'Independent House'],
      },
      {
        label: 'Furnishing',
        name: 'furnishing',
        options: ['Furnished', 'Semi-Furnished', 'Unfurnished'],
      },
      {
        label: 'Possession',
        name: 'possession',
        options: ['Ready to move', 'Under Construction'],
      },
    ],
  },

  Electronics: {
    categoryOptions: ['Mobiles', 'Laptops', 'Tablets', 'TVs'],
    subCategoryOptions: ['Apple', 'Samsung', 'Dell', 'HP'],
    inputFields: [
      { name: 'brand', placeholder: 'Brand' },
      { name: 'model', placeholder: 'Model' },
      { name: 'condition', placeholder: 'Condition (e.g., New, Used)' },
      { name: 'price', placeholder: 'Price', type: 'number' },
      { name: 'description', placeholder: 'Description' },
    ],
    checkboxGroups: [
      {
        label: 'Warranty',
        name: 'warranty',
        options: ['Yes', 'No'],
      },
    ],
  },

  Fashion: {
    categoryOptions: ['Men', 'Women', 'Kids'],
    subCategoryOptions: ['Shirts', 'Jeans', 'Dresses', 'Shoes'],
    inputFields: [
      { name: 'brand', placeholder: 'Brand' },
      { name: 'size', placeholder: 'Size' },
      { name: 'condition', placeholder: 'Condition' },
      { name: 'price', placeholder: 'Price', type: 'number' },
      { name: 'description', placeholder: 'Description' },
    ],
    checkboxGroups: [],
  },

  Jobs: {
    categoryOptions: ['IT', 'Marketing', 'Finance'],
    subCategoryOptions: ['Full-time', 'Part-time', 'Internship'],
    inputFields: [
      { name: 'jobTitle', placeholder: 'Job Title' },
      { name: 'company', placeholder: 'Company Name' },
      { name: 'location', placeholder: 'Job Location' },
      { name: 'salary', placeholder: 'Salary', type: 'number' },
      { name: 'description', placeholder: 'Job Description' },
    ],
    checkboxGroups: [
      {
        label: 'Job Type',
        name: 'jobType',
        options: ['Full-time', 'Part-time', 'Internship', 'Remote'],
      },
    ],
  },

  Services: {
    categoryOptions: ['Repair', 'Tutoring', 'Cleaning'],
    subCategoryOptions: ['Electrician', 'Plumber', 'Home Tutor', 'Car Wash'],
    inputFields: [
      { name: 'service', placeholder: 'Service Name' },
      { name: 'location', placeholder: 'Available Location' },
      { name: 'charges', placeholder: 'Charges', type: 'number' },
      { name: 'description', placeholder: 'Description' },
    ],
    checkboxGroups: [],
  },

  Pets: {
    categoryOptions: ['Dogs', 'Cats', 'Birds'],
    subCategoryOptions: ['Labrador', 'Persian Cat', 'Parrot'],
    inputFields: [
      { name: 'breed', placeholder: 'Breed' },
      { name: 'age', placeholder: 'Age in Months' },
      { name: 'price', placeholder: 'Price', type: 'number' },
      { name: 'description', placeholder: 'Description' },
    ],
    checkboxGroups: [
      {
        label: 'Vaccinated',
        name: 'vaccinated',
        options: ['Yes', 'No'],
      },
    ],
  },

  Furniture: {
    categoryOptions: ['Living Room', 'Bedroom', 'Office'],
    subCategoryOptions: ['Sofa', 'Bed', 'Table', 'Chair'],
    inputFields: [
      { name: 'itemName', placeholder: 'Item Name' },
      { name: 'material', placeholder: 'Material' },
      { name: 'condition', placeholder: 'Condition' },
      { name: 'price', placeholder: 'Price', type: 'number' },
      { name: 'description', placeholder: 'Description' },
    ],
    checkboxGroups: [],
  },

  Books: {
    categoryOptions: ['School', 'College', 'Novels'],
    subCategoryOptions: ['Class 10', 'BTech', 'Fiction', 'Non-fiction'],
    inputFields: [
      { name: 'title', placeholder: 'Book Title' },
      { name: 'author', placeholder: 'Author' },
      { name: 'edition', placeholder: 'Edition' },
      { name: 'price', placeholder: 'Price', type: 'number' },
      { name: 'description', placeholder: 'Description' },
    ],
    checkboxGroups: [],
  },
};

const AddProduct = () => {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [selectedSubcategory, setSelectedSubcategory] = useState('');

  const navigate = useNavigate();
  const config = categoryFormConfig[selectedCategory.replace(/\s/g, '')];

  const { setIsAddProductMadal } = useProduct();
  let isExpanded;

  useEffect(() => {
      document.body.classList.add('no-scroll');

      return () => {
        document.body.classList.remove('no-scroll');
      };
  }, []);
  
  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center backdrop-blur-[2px]">
      <div className="relative rounded-md border-2 border-gray-200 bg-white">
        {/* <Header /> */}
        <div
          className="absolute top-2 right-2 flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-full border bg-gray-300 font-bold"
          onClick={() => setIsAddProductMadal(false)}
        >
          X
        </div>

        <div className=" w-[80%] h-screen mx-auto lg:h-[700px] lg:w-[700px] overflow-y-scroll p-5">
          {selectedSubcategory === '' && (
            <div className="grid grid-cols-2 gap-5">
              {/* Sidebar */}
              <aside className="h-full">
                <h2 className="mb-6 text-lg font-semibold text-gray-800">
                  Choose a Categories
                </h2>

                <ul className="space-y-1">
                  {Object.entries(categoriesWithSub).map((category) => {
                    return (
                      <li key={category} className="grid">
                        <button
                          onClick={() =>
                            setExpandedCategory(
                              isExpanded
                                ? null
                                : categoryFormConfig[category[0]],
                            )
                          }
                          className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left transition-all ${
                            isExpanded
                              ? 'bg-blue-50 text-blue-700'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <span className="font-medium">{category}</span>
                          <svg
                            className={`h-4 w-4 transform transition-transform duration-200 ${
                              isExpanded ? 'rotate-90' : ''
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
                      </li>
                    );
                  })}
                </ul>
              </aside>

              {/* Main Content */}
              {expandedCategory ? (
                <ul className="mt-12 flex flex-col gap-2">
                  {expandedCategory.categoryOptions.map((sub, idx) => (
                    <li key={idx}>
                      <button
                        onClick={() => {
                          const token = localStorage.getItem('token');
                          if (!token) {
                            toast.error('Please login or signup first');
                            return;
                          }
                          setSelectedSubcategory(sub);
                        }}
                        className="w-full rounded-md px-3 py-2 text-left text-sm font-semibold text-gray-700 hover:bg-gray-100"
                      >
                        {sub}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          )}

          {selectedSubcategory !== '' && (
            <Card setSubCategory={setSelectedSubcategory} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
