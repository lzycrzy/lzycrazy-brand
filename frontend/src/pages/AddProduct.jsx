import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { useProduct } from '../store/useProduct';
import Card from '../components/Product/Card';
import instance from '../lib/axios/axiosInstance';
import { ChevronLeft, X } from 'lucide-react';

const AddProduct = () => {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [categories, setCategories] = useState(null);
  const { setIsAddProductModal, isEditing, editData, setEditData, setIsEditing } = useProduct();

  useEffect(() => {
    async function getAllCategories() {
      try {
        const res = await instance.get('/v1/categories/public');
        setCategories(res.data.data.categories);
        // console.log(res.data.data.categories);
      } catch (err) {
        console.log(err);
      }
    }
    getAllCategories();
  }, []);

  useEffect(() => {
    document.body.classList.add('no-scroll');
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, []);

  useEffect(() => {
    if (isEditing) {
      setSelectedCategory(editData.category);
      const subCategoryForEditing = editData.category.subcategories.filter((item) => item.name === editData.subcategory);
      // console.log(subCategoryForEditing)
      if (subCategoryForEditing !== undefined) {
        setSelectedSubcategory(subCategoryForEditing[0]);
      }
    }
  }, [])

  return (
    <div
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      className="fixed inset-0 z-[999] flex items-center justify-center overflow-auto p-4"
    >
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-hidden rounded-md border border-gray-200 bg-white shadow-md">
        
        {/* Sticky Header for Close & Back */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white p-3">
          {/* Back Button - Only on mobile & when category is selected */}
          <div className={`${selectedCategory ? 'flex' : 'hidden'} lg:hidden`}>
            <button
              className="flex items-center justify-center rounded-full border p-1"
              onClick={() => {
                if (selectedSubcategory === '') setSelectedCategory('');
                else setSelectedSubcategory('');
              }}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          </div>

          <div className="ml-auto">
            <button
              className="flex items-center justify-center rounded-full border bg-gray-300 p-1"
              onClick={() => {
                if (isEditing) {
                  setSelectedCategory(null)
                  setSelectedSubcategory('');
                  setIsEditing(false);
                  setEditData(null);
                }
                setIsAddProductModal(false)
              }}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-52px)] p-4 sm:p-6">
          {selectedSubcategory === '' ? (
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Categories */}
              <aside className="w-full lg:w-1/2">
                <h2 className="mb-2 text-base font-semibold text-gray-800">Choose a Category</h2>
                <ul className={`${selectedCategory ? 'lg:block hidden' : 'block w-full'} space-y-1`}>
                  {categories?.map((category, index) => (
                    <li key={index}>
                      <button
                        onClick={() => {
                          setExpandedCategory(category.subcategories);
                          setSelectedCategory(category);
                        }}
                        className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left transition-all ${
                          selectedCategory?.name === category.name
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <div className='flex gap-2 items-center '>
                          <img src={category.imageData?.url ? category.imageData?.url : "/missing.png"} alt={category.name || "Category"} width={15} className='rounded-full' loading="lazy" />
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <svg
                          className="h-4 w-4 transform transition-transform duration-200"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              </aside>

              {/* Subcategories */}
              {expandedCategory && (
                <ul className={`mt-4 lg:mt-12 ${selectedCategory ? 'flex' : 'lg:flex hidden'} flex-col gap-2 w-full lg:w-1/2`}>
                  {expandedCategory.map((sub, idx) => (
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
                        className="flex gap-2 w-full rounded-md px-3 py-2 text-left text-sm font-semibold text-black hover:bg-gray-100"
                      >
                        <img src={sub.imageData.url ? sub.imageData.url : "/missing.png"} alt={sub.name || "Subcategory"} width={15} height={15} className='bg-center object-contain rounded-full' loading="lazy" />
                        {sub.name}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <div className="h-[600px] lg:h-auto w-full overflow-auto">
              <Card
                setSubCategory={setSelectedSubcategory}
                selectedCategory={selectedCategory}
                selectedSubcategory={selectedSubcategory}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
