import React, { useState, useEffect } from 'react';
import Header from '../components/static/Header';
import CategoryPostForm from '../components/CategoryPostForm';
import { toast } from 'react-toastify';
import { useProduct } from '../store/useProduct';
// import ProductCard from './ProductCard';

import Card from '../components/Product/Card';
import instance from '../lib/axios/axiosInstance';
import { ChevronLeft, X } from 'lucide-react';

const AddProduct = () => {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [categories, setCategories] = useState(null);

  useEffect(() => {
      async function getAllCategories() {
        try {
            const res = await instance.get('/v1/categories/public');
            setCategories(res.data.data.categories)
            console.log(res.data.data.categories)
        } catch (err) {
            console.log(err);
        }
      }
      getAllCategories();
  }, [])

  const { setIsAddProductMadal } = useProduct();
  let isExpanded;

  useEffect(() => {
      document.body.classList.add('no-scroll');

      return () => {
        document.body.classList.remove('no-scroll');
      };
  }, []);

  return (
    <div style={{backgroundColor: 'rgb(0,0,0, .5)'}} className="fixed inset-0 z-999 flex items-center justify-center ">
      <div className="relative  md:w-auto w-[90%] rounded-md border-2 border-gray-200 bg-white">
        {/* <Header /> */}
          <div
            className="absolute top-2 right-2 flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-full border bg-gray-300 font-bold"
            onClick={() => setIsAddProductMadal(false)}
          >
          <X />
          
          </div>
          <div className={`mt-3 ml-3 lg:hidden w-[30px] h-[30px] ${selectedCategory !== '' ? 'flex': 'hidden'} justify-center items-center rounded-full border`} onClick={() => {
            if (selectedSubcategory === '') setSelectedCategory('')
            else setSelectedSubcategory('')

          }}>
            <ChevronLeft />
          </div>

        <div className="w-full min-h-[600px] mx-auto lg:h-[700px] md:w-[600px] p-5 overflow-auto">

          {selectedSubcategory === '' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Categories */}
              <aside>
                <h2 className="mb-2 text-lg font-semibold text-gray-800">
                  Choose a Categories
                </h2>

                <ul className={`${selectedCategory !== '' ? 'lg:block hidden' : "block w-full" } space-y-1`}>
                  {categories?.map((category, index) => {
                    
                    return (
                      <li key={index} className="grid">
                        <button
                          onClick={() =>{
                            setExpandedCategory(category.subcategories)
                            setSelectedCategory(category.name);
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
              
              {/* Subcategories */}
              {expandedCategory ? (
                <ul className={`lg:mt-12 ${selectedCategory !== '' ? 'flex' : 'lg:flex hidden'} flex-col gap-2`}>
                  {expandedCategory?.map((sub, idx) => (
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
                        className=" w-full rounded-md px-3 py-2 text-left text-sm font-semibold text-black hover:bg-gray-100"
                      >
                        {sub.name}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
              
            </div>
          )}

          {selectedSubcategory !== '' && (
            <div className='lg:h-auto h-[600px] w-full overflow-auto'>
              <Card setSubCategory={setSelectedSubcategory} selectedCategory={selectedCategory} selectedSubcategory={selectedSubcategory} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
