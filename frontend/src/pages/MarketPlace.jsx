import React, { useEffect, useState } from 'react';
import Header from '../components/static/Header';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/Market/ProductCard';
import listings from '../data/mockListings.json'; // ✅ External data
import instance from '../lib/axios/axiosInstance';
import AdminPost from '../components/Market/AdminPost';

const MarketplaceHome = () => {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [categories, setCategories] = useState(null);
  const [subCategories, setSubCategories] = useState(null);
  const [subcategoryDetails, setSubCategoryDetails] = useState(null);

  const navigate = useNavigate();

  const handleCardClick = (item) => {
    navigate('/property-view', { state: { data: item, images: item.images } });
  };

  const selectedListings =
    listings[selectedCategory]?.[selectedSubcategory] || [];

  useEffect(() => {
    async function marketPlaceDetails() {
      try {
        const res = await instance.get('/v1/categories/public');
        setCategories(res.data.data.categories);
      } catch (error) {
        console.log(error);
      }
    }

    marketPlaceDetails();
  }, []);

  useEffect(() => {
    async function getSubcategoryDetails() {
      if (!selectedCategory || !selectedSubcategory) return;

      try {
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
  }, [selectedCategory, selectedSubcategory]);

  return (
    <div className="relative min-h-screen w-full bg-gray-100">
      <Header />
      <div className="flex">
        <aside className="sticky top-[58px] h-[calc(100vh-4rem)] w-64 bg-white px-6 py-8 shadow-sm">
          <h2 className="mb-6 text-lg font-semibold text-gray-800">
            Categories
          </h2>
          <ul className="space-y-1">
            {categories?.map((category) => (
              <li key={category._id}>
                <button
                  onClick={() => {
                    if (selectedCategory === category._id && selectedCategory !== '') {
                      setSelectedCategory('');
                      return;
                    }

                    setSelectedCategory(category._id);
                    setSubCategories(category.subcategories);
                    setSelectedSubcategory('');
                    setSubCategoryDetails(null);
                  }}
                  className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left transition-all ${
                    selectedCategory === category._id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className='flex gap-2 items-center'>
                    <img src={category.imageData.url} width={15} />
                    <span className="font-medium">{category.name}</span>
                  </div>
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

                {selectedCategory === category._id && subCategories?.length > 0 && (
                  <ul className="mt-2 ml-4 space-y-1 border-l border-gray-200 pl-2">
                    {subCategories.map((sub) => (
                      <li key={sub._id} className='flex  items-center w-full'>
                        <button
                          onClick={() => setSelectedSubcategory(sub.name)}
                          className="flex gap-2 w-full px-2 py-1 text-left text-sm text-gray-600 hover:text-blue-700 hover:bg-gray-100 rounded"
                        >
                          <img src={sub.imageData.url} width={15} className='bg-center object-contain' />
                          {sub.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </aside>

        <main className="flex-1 space-y-8 overflow-auto p-9">

          {(!selectedCategory || !selectedSubcategory) && <AdminPost />}

          {selectedCategory && selectedSubcategory ? (
            <>
              <div className="mt-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                  {selectedListings.map((post, index) => (
                    <button key={index} onClick={() => handleCardClick(post)}>
                      <ProductCard post={post} />
                    </button>
                  ))}
                </div>
              </div>

              {subcategoryDetails?.length > 0 ? (
                <div className="mt-6">
                  <h2 className="mb-4 text-xs">
                    {subcategoryDetails[0]?.category?.name} / {selectedSubcategory}
                  </h2>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                    {subcategoryDetails.map((post, index) => (
                      <button key={index} onClick={() => handleCardClick(post)}>
                        <ProductCard post={post} />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div>There is not listing for this type of category</div>
              )}
            </>
          ) : (
            <div className={`${(!selectedCategory || !selectedSubcategory) && "hidden"} flex flex-1 justify-center items-center h-full text-lg rounded`}>Please select a category and subcategory to view listings.</div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MarketplaceHome;