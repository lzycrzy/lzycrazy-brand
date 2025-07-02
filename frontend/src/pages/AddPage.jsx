import React from 'react';
import { Download, Package, Plus, Edit, Eye, Phone, Mail, User } from 'lucide-react';
import Header from '../components/static/Header';
import Sidebar from '../components/Home/Sidebar1';


function AddPage() {
  const statsData = [
    { label: 'All Response', value: '400', color: 'bg-blue-50 text-blue-700' },
    { label: 'Active Add', value: '102', color: 'bg-green-50 text-green-700' },
    { label: 'Reported', value: '098', color: 'bg-orange-50 text-orange-700' },
  ];

  const propertyListings = [
    {
      id: 1,
      title: '3 Bedroom Apartment For Rent',
      image: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=400',
      postedDate: '1/02/2022',
      owner: 'Sarvesh (Individual)',
      phone: '+91 9578575554',
      email: '124@gmail.com',
      views: 100
    },
    {
      id: 2,
      title: '3 Bedroom Apartment For Rent',
      image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=400',
      postedDate: '1/02/2022',
      owner: 'Sarvesh (Individual)',
      phone: '+91 9578575554',
      email: '124@gmail.com',
      views: 100
    },
    {
      id: 3,
      title: '3 Bedroom Apartment For Rent',
      image: 'https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg?auto=compress&cs=tinysrgb&w=400',
      postedDate: '1/02/2022',
      owner: 'Sarvesh (Individual)',
      phone: '+91 9578575554',
      email: '124@gmail.com',
      views: 100
    }
  ];

  return (
    <>

    <Header></Header>

    <div className="min-h-screen bg-gray-50">
      <div className=' flex flex-col lg:flex-row gap-4'>
        <div className="hidden w-64 lg:block">
          <Sidebar />
        </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
          {statsData.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 ${stat.color}`}>
                <span className="text-2xl font-bold">{stat.value}</span>
              </div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">{stat.label}</h3>
            </div>
          ))}
          
          <div className="bg-gray-900 rounded-xl shadow-sm p-6 hover:bg-gray-800 transition-colors duration-200 cursor-pointer">
            <div className="flex items-center justify-center w-12 h-12 bg-white rounded-lg mb-4">
              <Download className="h-6 w-6 text-gray-900" />
            </div>
            <h3 className="text-sm font-medium text-white uppercase tracking-wide">All Downloading</h3>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer">
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
          {propertyListings.map((property) => (
            <div key={property.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200">
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                <div className="flex-shrink-0">
                  <div className="w-32 h-24 rounded-lg overflow-hidden bg-gray-100">
                    <img 
                      src={property.image} 
                      alt={property.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                </div>

                <div className="flex-grow space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200">
                    {property.title}
                  </h3>
                  <p className="text-sm text-gray-500">Posted on {property.postedDate}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{property.owner}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      <span>{property.phone}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      <span>{property.email}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-gray-500">
                      <Eye className="h-4 w-4" />
                      <span className="text-sm">Views</span>
                    </div>
                    <p className="text-xl font-semibold text-gray-900">{property.views}</p>
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