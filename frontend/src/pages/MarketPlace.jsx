import React, { useEffect, useRef, useState } from 'react';
import Header from '../components/static/Header';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/Market/ProductCard';
import listings from '../data/mockListings.json';
import instance from '../lib/axios/axiosInstance';
import AdminPost from '../components/Market/AdminPost';
import { GrClose, GrMenu } from 'react-icons/gr';
import MobileNav from '../components/Home/MobileNav';
import { FaChevronDown, FaUser } from 'react-icons/fa';
import Partner from '../components/Market/Partner';

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

  const selectedListings = listings[selectedCategory]?.[selectedSubcategory] || [];

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

  const [openMenu, setOpenMenu] = useState(false);
  const menuModalRef = useRef(null);

  function openSidebar() {
    setOpenMenu(true);
  }

  useEffect(() => {
    function handleOutsideClick(e) {
      if (menuModalRef.current && !menuModalRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    }

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
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
    <div className="relative min-h-screen scrollbar-hide w-full bg-gray-100">
      <Header />

      {/* Overlay for mobile */}
      {openMenu && (
        <div
          className="fixed inset-0 bg-opacity-30 z-30 lg:hidden"
          style={{backgroundColor: 'rgba(0,0,0,.5)'}}
          onClick={() => setOpenMenu(false)}
        />
      )}

      <div className="flex relative">
       {!openMenu && <GrMenu
          className="fixed top-15 left-1 z-50 cursor-pointer lg:hidden"
          onClick={openSidebar}
        />}
       {openMenu && <GrClose 
          className="fixed top-15 left-3 z-50 cursor-pointer lg:hidden"
          onClick={() => setOpenMenu(false)}
        />}

        <aside
          ref={menuModalRef}
          className={`z-40 fixed lg:sticky top-[58px] h-[calc(100vh-4.7rem)] w-64 bg-white px-6 py-8 shadow-sm transform transition-transform duration-300 ease-in-out
            ${openMenu ? 'translate-x-0' : '-translate-x-full'} 
            lg:translate-x-0 lg:block`}
        >
          <h2 className="mb-6 text-2xl font-semibold text-gray-800">Categories</h2>
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
                  <div className="flex gap-2 items-center">
                    <img src={category.imageData.url ? category.imageData.url : "/missing.png"} alt={category.name || "Category"} width={15} loading="lazy" />
                    <span className="font-medium text-[16px]">{category.name}</span>
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

                {/* Subcategories */}
                {selectedCategory === category._id && subCategories?.length > 0 && (
                  <ul className="mt-2 ml-4 space-y-1 border-l border-gray-200 pl-2">
                    {subCategories.map((sub) => (
                      <li key={sub._id} className="flex items-center w-full">
                        <button
                          onClick={() => {
                            setOpenMenu(false); // close sidebar on mobile
                            setSelectedSubcategory(sub.name);
                          }}
                          className="flex text-[14px] gap-2 w-full px-2 py-1 text-left text-gray-600 hover:text-blue-700 hover:bg-gray-100 rounded"
                        >
                          <img
                            src={sub.imageData.url}
                            width={15}
                            className="bg-center object-contain"
                            loading="lazy"
                          />
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

        {/* Main content */}
        <main className="flex-1 overflow-auto p-2">
          {(!selectedCategory || !selectedSubcategory) && <AdminPost />}

          {selectedCategory && selectedSubcategory ? (
            <>
              <div className="">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                  {selectedListings.map((post, index) => (
                    <button key={index} onClick={() => handleCardClick(post)}>
                      <ProductCard post={post} />
                    </button>
                  ))}
                </div>
              </div>

              {subcategoryDetails?.length > 0 ? (
                <div className="mt-2">
                
                  <Partner />

                  <div className='w-full flex justify-between items-center mt-5'>
                    <h2 className="mb-4 text-lg">
                      {subcategoryDetails[0]?.category?.name} / {selectedSubcategory}
                    </h2>
                    <select className='w-20 -mt-3 text-lg'>
                      <option value="Dealer">Dealer</option>
                      <option value="Owner">Owner</option>
                      <option value="Recent">Recent</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                    {subcategoryDetails.map((post, index) => (
                      <button key={index} onClick={() => handleCardClick(post)}>
                        <ProductCard post={post} />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div>There is no listing for this type of category</div>
              )}
            </>
          ) : (
             <div className={`${(!selectedCategory || !selectedSubcategory) && "hidden"} flex flex-1 justify-center items-center h-full text-lg rounded`}>Please select a category and subcategory to view listings.</div>
          )}
        </main>
      </div>

      {/* Bottom Navbar for small screens */}
        <div className="fixed right-0 bottom-0 left-0 z-50 flex h-14 items-center justify-around border-t border-gray-300 bg-white shadow-md lg:hidden">
          <MobileNav />
        </div>
    </div>
  );
};

export default MarketplaceHome;