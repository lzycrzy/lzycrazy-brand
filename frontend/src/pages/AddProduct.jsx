// import React, { useState, useEffect } from 'react';
// import Header from '../components/static/Header';
// import CategoryPostForm from '../components/CategoryPostForm';
// import { toast } from 'react-toastify';
// import { useProduct } from '../store/useProduct';
// // import ProductCard from './ProductCard';

// import Card from '../components/Product/Card';
// import instance from '../lib/axios/axiosInstance';
// import { ChevronLeft, X } from 'lucide-react';

// const AddProduct = () => {
//   const [expandedCategory, setExpandedCategory] = useState(null);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [selectedSubcategory, setSelectedSubcategory] = useState('');
//   const [categories, setCategories] = useState(null);

//   useEffect(() => {
//       async function getAllCategories() {
//         try {
//             const res = await instance.get('/v1/categories/public');
//             setCategories(res.data.data.categories)
//         } catch (err) {
//             console.log(err);
//         }
//       }
//       getAllCategories();
//   }, [])

//   const { setIsAddProductMadal } = useProduct();
//   let isExpanded;

//   useEffect(() => {
//       document.body.classList.add('no-scroll');

//       return () => {
//         document.body.classList.remove('no-scroll');
//       };
//   }, []);

//   return (
//     <div style={{backgroundColor: 'rgb(0,0,0, .5)'}} className="fixed inset-0 z-999 flex items-center justify-center ">
//       <div className="relative  md:w-auto w-[90%] rounded-md border-2 border-gray-200 bg-white">
//         {/* <Header /> */}
//           <div
//             className="absolute top-2 right-2 flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-full border bg-gray-300 font-bold"
//             onClick={() => setIsAddProductMadal(false)}
//           >
//           <X />
          
//           </div>
//           <div className={`mt-3 ml-3 lg:hidden w-[30px] h-[30px] ${selectedCategory ? 'flex': 'hidden'} justify-center items-center rounded-full border`} onClick={() => {
//             if (selectedSubcategory === '') setSelectedCategory('')
//             else setSelectedSubcategory('')

//           }}>
//             <ChevronLeft />
//           </div>

//         <div className="w-full min-h-[600px] mx-auto lg:h-[700px] md:w-[600px] p-5 overflow-auto">

//           {selectedSubcategory === '' && (
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
//               {/* Categories */}
//               <aside>
//                 <h2 className="mb-2 text-lg font-semibold text-gray-800">
//                   Choose a Categories
//                 </h2>

//                 <ul className={`${selectedCategory ? 'lg:block hidden' : "block w-full" } space-y-1`}>
//                   {categories?.map((category, index) => {
                    
//                     return (
//                       <li key={index} className="grid">
//                         <button
//                           onClick={() =>{
//                             setExpandedCategory(category.subcategories)
//                             setSelectedCategory(category);
//                           }}
//                           className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left transition-all ${
//                             selectedCategory === category.name
//                               ? 'bg-blue-50 text-blue-700'
//                               : 'text-gray-700 hover:bg-gray-100'
//                           }`}
//                         >
//                           <span className="font-medium">{category.name}</span>
//                           <svg
//                             className={`h-4 w-4 transform transition-transform duration-200 ${
//                               isExpanded ? 'rotate-90' : ''
//                             }`}
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth="2"
//                               d="M9 5l7 7-7 7"
//                             />
//                           </svg>
//                         </button>
//                       </li>
//                     );
//                   })}
//                 </ul>
//               </aside>
              
//               {/* Subcategories */}
//               {expandedCategory ? (
//                 <ul className={`lg:mt-12 ${selectedCategory !== '' ? 'flex' : 'lg:flex hidden'} flex-col gap-2`}>
//                   {expandedCategory?.map((sub, idx) => (
//                     <li key={idx}>
//                       <button
//                         onClick={() => {
//                           const token = localStorage.getItem('token');
//                           if (!token) {
//                             toast.error('Please login or signup first');
//                             return;
//                           }
//                           setSelectedSubcategory(sub);
//                         }}
//                         className=" w-full rounded-md px-3 py-2 text-left text-sm font-semibold text-black hover:bg-gray-100"
//                       >
//                         {sub.name}
//                       </button>
//                     </li>
//                   ))}
//                 </ul>
//               ) : null}
              
//             </div>
//           )}

//           {selectedSubcategory !== '' && (
//             <div className='lg:h-auto h-[600px] w-full overflow-auto'>
//               <Card setSubCategory={setSelectedSubcategory} selectedCategory={selectedCategory} selectedSubcategory={selectedSubcategory} />
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddProduct;


// new update code with full responsiveness for all devices
import React, { useState, useEffect } from 'react';
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

  const { setIsAddProductMadal } = useProduct();

  useEffect(() => {
    async function getAllCategories() {
      try {
        const res = await instance.get('/v1/categories/public');
        setCategories(res.data.data.categories);
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

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 px-2 py-4 overflow-y-auto scrollbar-hide">
      <div className="relative w-full max-w-[95%] md:max-w-[80%] lg:max-w-[600px] rounded-lg border border-gray-200 bg-white shadow-lg">
        
        {/* Scrollable Modal Content */}
        <div className="w-full max-h-[90vh] overflow-y-auto scrollbar-hide p-4 md:p-5">
          
          {/* Buttons Row */}
          <div className="flex items-center justify-between mb-4">
            {/* Back Button (Mobile only) */}
            {selectedCategory && (
              <button
                className="h-8 w-8 flex items-center justify-center rounded-full border bg-white lg:hidden"
                onClick={() => {
                  if (selectedSubcategory === '') setSelectedCategory('');
                  else setSelectedSubcategory('');
                }}
              >
                <ChevronLeft />
              </button>
            )}

            <div className="flex-1" />

            {/* Close Button */}
            <button
              className="h-8 w-8 flex items-center justify-center rounded-full border bg-gray-300 hover:bg-gray-400 transition"
              onClick={() => setIsAddProductMadal(false)}
            >
              <X />
            </button>
          </div>

          {/* Main Content */}
          {selectedSubcategory === '' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Category List */}
              <aside>
                <h2 className="mb-2 text-base md:text-lg font-semibold text-gray-800">
                  Choose a Category
                </h2>
                <ul
                  className={`${
                    selectedCategory ? 'hidden lg:block' : 'block'
                  } space-y-2`}
                >
                  {categories?.map((category, index) => (
                    <li key={index}>
                      <button
                        onClick={() => {
                          setExpandedCategory(category.subcategories);
                          setSelectedCategory(category);
                        }}
                        className={`w-full flex items-center justify-between rounded-md px-3 py-2 text-left transition ${
                          selectedCategory === category.name
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <span className="font-medium">{category.name}</span>
                        <svg
                          className="h-4 w-4 transform transition-transform duration-200"
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
                  ))}
                </ul>
              </aside>

              {/* Subcategory List */}
              {expandedCategory && (
                <ul
                  className={`mt-4 lg:mt-12 flex flex-col gap-2 ${
                    selectedCategory ? 'block' : 'hidden lg:block'
                  }`}
                >
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
                        className="w-full rounded-md px-3 py-2 text-left text-sm font-medium text-black hover:bg-gray-100"
                      >
                        {sub.name}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <div className="w-full flex justify-center">
              <div className="w-full max-w-[500px]">
                <Card
                  setSubCategory={setSelectedSubcategory}
                  selectedCategory={selectedCategory}
                  selectedSubcategory={selectedSubcategory}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddProduct;

