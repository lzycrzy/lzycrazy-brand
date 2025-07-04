import React, { useEffect, useState } from 'react';
import {
  Download,
  Package,
  Plus,
  Edit,
  Eye,
  Phone,
  Mail,
  User,
} from 'lucide-react';
import Header from '../components/static/Header';
import Sidebar from '../components/Home/Sidebar1';
import instance from '../lib/axios/axiosInstance';
import { formatDate } from '../utils/formatDate';
import { useNavigate } from 'react-router';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { toast } from 'react-toastify';
import { useProduct } from '../store/useProduct';

function AddPage({ setAddPage }) {
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
  const { setIsAddProductModal, setIsEditing, setEditData } = useProduct();

  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  useEffect(() => {
    async function getMyAddListing() {
      try {
        const response = await instance.get('/v1/listing/my-adds');
        const listing = response.data[0].productListed;
        const updatedListings = listing.map((item) => ({
          ...item,
          postedBy: {
            ...item.postedBy,
            itemsListed: listing.length,
          },
        }));
        setListings(updatedListings);
        setTotalListing(updatedListings);

        console.log(updatedListings);
        setListings(updatedListings);
        setTotalListing(updatedListings);

        const listingActive = response.data[0].productListed.filter(
          (listing) => !listing.isExpired,
        );
        setActiveListing(listingActive);

        // console.log(allResponses)
        // console.log(reported)
        // console.log(listingActive)
      } catch (error) {
        console.log(error);
      }
    }

    getMyAddListing();
  }, []);

  useEffect(() => {
    async function getListingReponseAndReported() {
      try {
        const res = await instance.get('/v1/listing/listing-response');

        const allResponses = [];
        const reported = [];

        const updatedListings = res.data.map((item) => ({
          ...item,
          postedBy: {
            ...item.postedBy,
            itemsListed: res.length,
          },
        }));
        updatedListings.forEach((listing) => {
          allResponses.push(...listing.response);
          reported.push(...listing.reported);
        });

        setListingReported(reported);
        setListingResponse(allResponses);
      } catch (error) {
        console.log(error);
      }
    }
    getListingReponseAndReported();
  }, []);

  const exportToExcel = () => {
    
    if (listingResponse.length == 0) {
      toast.error('No Response Recieved !');
      return;
    }

    const flatData = listings.map((item) => ({
      Title: item.title,
      Name: item.response.name,
      PhoneNumber: item.response.phoneNumber,
      Email: item.response.email,
      ResponseDate: formatDate(item.response.createdAt),
    }));

    const worksheet = XLSX.utils.json_to_sheet(flatData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    saveAs(blob, 'listing_Response.xlsx');
  };

  return (
    <>
      <Header></Header>

      <div className="z-1000 min-h-screen bg-[#F3F4F6]">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="hidden w-64 lg:block">
            <Sidebar />
          </div>

          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-8 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
              <div
                onClick={() => {
                  if (listingResponse?.length === 0) {
                    toast.error('No Response Received !');
                    return;
                  }

                  setListings(listingResponse);
                }}
                className="cursor-pointer rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md"
              >
                <div
                  className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-700`}
                >
                  <span className="text-2xl font-bold">
                    {listingResponse?.length}
                  </span>
                </div>
                <h3 className="text-sm font-medium tracking-wide text-gray-500 uppercase">
                  All Response
                </h3>
              </div>

              <div
                onClick={() => {
                  if (activeListing?.length === 0) {
                    toast.error('No Active Listing !');
                    return;
                  }
                  setListings(activeListing);
                }}
                className="cursor-pointer rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md"
              >
                <div
                  className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg`}
                >
                  <span className="text-2xl font-bold">
                    {activeListing?.length}
                  </span>
                </div>
                <h3 className="text-sm font-medium tracking-wide text-gray-500 uppercase">
                  Active Listings
                </h3>
              </div>

              <div
                onClick={() => {
                  if (listingReported?.length === 0) {
                    toast.error('No listing Reported !');
                    return;
                  }
                  setListings(listingReported);
                }}
                className="cursor-pointer rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md"
              >
                <div
                  className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg`}
                >
                  <span className="text-2xl font-bold">
                    {listingReported?.length}
                  </span>
                </div>
                <h3 className="text-sm font-medium tracking-wide text-gray-500 uppercase">
                  Reported
                </h3>
              </div>

              <div
                onClick={() => exportToExcel()}
                className="flex cursor-pointer flex-col items-center rounded-xl bg-white p-6 shadow-sm transition-colors duration-200 hover:shadow-md"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg border">
                  <Download className="h-6 w-6" />
                </div>
                <h3 className="text-center text-sm font-medium tracking-wide text-gray-600 uppercase">
                  Download Response
                </h3>
              </div>

              <div
                onClick={() => setListings(totalListing)}
                className="cursor-pointer rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-sm font-medium tracking-wide text-gray-700 uppercase">
                  Total Listing
                </h3>
              </div>
            </div>

            <div className="mb-6">
              <button
                onClick={() => setIsAddProductModal(true)}
                className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow-sm transition-colors duration-200 hover:bg-blue-700"
              >
                <Plus className="mr-2 h-5 w-5" />
                Add to Package
              </button>
            </div>

            <div className="space-y-4">
              {listings?.map((property) => (
                <div
                  onClick={() =>
                    navigate('/property-view', {
                      state: { data: property, images: property.images },
                    })
                  }
                  key={property._id}
                  className="rounded-xl cursor-pointer border border-gray-100 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md"
                >
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
                    <div className="flex-shrink-0">
                      <div className="md:h-24 md:w-32 w-full h-fit overflow-hidden rounded-lg bg-gray-100">
                        <img
                          src={property.images ? property.images[0] : null}
                          alt={property.title}
                          className="h-full w-full object-cover transition-transform duration-200 hover:scale-105"
                        />
                      </div>
                    </div>

                    <div className="flex-grow space-y-2">
                      <h3 className="text-lg font-semibold text-gray-900 transition-colors duration-200 hover:text-blue-600">
                        {property.title}
                      </h3>
                      <div className="flex gap-3 md:gap-10">
                        <p className="text-sm text-gray-500">
                          Posted on {formatDate(property.createdAt)}
                        </p>
                        <p className="text-sm text-gray-500">
                          Expired on {formatDate(property.expiryDate)}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{property.postedBy.name} ({user.companyId})</span>
                        </div>
                        {/* <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      <span>{user.phone}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      <span>{user.email}</span>
                    </div> */}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 justify-between">
                      <div className="text-center flex items-center flex-row-reverse gap-2">
                        <div className="flex items-center gap-1 text-gray-500">
                          {/* <Eye className="h-4 w-4" /> */}
                          <span className="text-sm">Views</span>
                        </div>
                        <p className="text-xl font-semibold text-gray-900">
                          {property.views?.length}
                        </p>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsEditing(true);
                          setEditData(property);
                        }}
                        className="inline-flex items-center rounded-lg bg-gray-900 px-4 py-2 font-medium text-white transition-colors duration-200 hover:bg-gray-800"
                      >
                        <Edit className="mr-2 h-4 w-4" />
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
