import React, { useEffect, useState } from 'react';
import { Download, Package, Plus, Edit, Eye, Phone, Mail, User } from 'lucide-react';
import Header from '../components/static/Header';
import Sidebar from '../components/Home/Sidebar1';
import instance from '../lib/axios/axiosInstance';
import { formatDate } from '../utils/formatDate';
import { useNavigate } from 'react-router';


function AddPage({setAddPage}) {
  const statsData = [
    { label: 'All Response', value: '400', color: 'bg-blue-50 text-blue-700' },
    { label: 'Active Add', value: '102', color: 'bg-green-50 text-green-700' },
    { label: 'Reported', value: '098', color: 'bg-orange-50 text-orange-700' },
  ];

  const [listingResponse, setListingResponse] = useState(null);
  const [listingReported, setListingReported] = useState(null);
  const [activeListing, setActiveListing] = useState(null);
  const [listings, setListings] = useState(null);
  const [totalListing, setTotalListing] = useState(null);

  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function getMyAddListing() {
      try {
        const response = await instance.get('/v1/listing/my-adds');
        setUser(response.data[0]);
        const listing = response.data[0].productListed;
        const updatedListings = listing.map(item => ({
            ...item,
            postedBy: {
              ...item.postedBy,
              itemsListed: listing.length,
            },
          }));
        setListings(updatedListings);
        setTotalListing(updatedListings)

        console.log(updatedListings)
        
        const allResponses = [];
        const reported = []
        updatedListings.forEach((listing) => {
            allResponses.push(...listing.response);
            reported.push(...listing.reported);
        });

        setListingReported(reported);
        setListingResponse(allResponses)

        const listingActive = response.data[0].productListed.filter((listing) => !listing.isExpired)
        setActiveListing(listingActive);

        console.log(allResponses)
        console.log(reported)
        console.log(listingActive)

      } catch (error) {
          console.log(error);
      }
    }

    getMyAddListing();
  }, [])

  return (
    <>

    <Header></Header>

    <div className="min-h-screen bg-[#F3F4F6] z-1000">
      <div className=' flex flex-col lg:flex-row gap-4'>
        <div className="hidden w-64 lg:block">
          <Sidebar />
        </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
          <div onClick={() => setListings(listingResponse)} className="cursor-pointer bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 bg-blue-50 text-blue-700`}>
              <span className="text-2xl font-bold">{listingResponse?.length}</span>
            </div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">All Response</h3>
          </div>

          <div onClick={() => setListings(activeListing)} className="cursor-pointer bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4`}>
              <span className="text-2xl font-bold">{activeListing?.length}</span>
            </div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide ">Active Listings</h3>
          </div>

          <div onClick={() => setListings(listingReported)} className="cursor-pointer bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4`}>
              <span className="text-2xl font-bold">{listingReported?.length}</span>
            </div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Reported</h3>
          </div>

          
          <div className="bg-gray-900 rounded-xl shadow-sm p-6 hover:bg-gray-800 transition-colors duration-200 cursor-pointer">
            <div className="flex items-center justify-center w-12 h-12 bg-white rounded-lg mb-4">
              <Download className="h-6 w-6 text-gray-900" />
            </div>
            <h3 className="text-sm font-medium text-white uppercase tracking-wide">All Downloading</h3>
          </div>
          
          <div onClick={() => setListings(totalListing)} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-lg mb-4">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wide">Total Listing</h3>
          </div>
        </div>

        <div className="mb-6">
          <button className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm">
            <Plus className="h-5 w-5 mr-2" />
            Add to Package
          </button>
        </div>

        <div className="space-y-4">
          {listings?.map((property) => (
            <div onClick={() => navigate('/property-view', {state: {data:property, images: property.images}})} key={property._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200">
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                <div className="flex-shrink-0">
                  <div className="w-32 h-24 rounded-lg overflow-hidden bg-gray-100">
                    <img 
                      src={property.images? property.images[0] : null} 
                      alt={property.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                </div>

                <div className="flex-grow space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200">
                    {property.title}
                  </h3>
                  <div className='flex gap-10'>
                    <p className="text-sm text-gray-500">Posted on {formatDate(property.createdAt)}</p>
                    <p className="text-sm text-gray-500">Expired on {formatDate(property.expiryDate)}</p>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{property.postedBy.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      <span>{user.phone}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      <span>{user.email}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-gray-500">
                      <Eye className="h-4 w-4" />
                      <span className="text-sm">Views</span>
                    </div>
                    <p className="text-xl font-semibold text-gray-900">{property.views?.length}</p>
                  </div>
                  
                  <button className="inline-flex items-center px-4 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>

    </div>
    </>

  );
}

export default AddPage;