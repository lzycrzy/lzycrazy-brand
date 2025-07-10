import instance from '../../lib/axios/axiosInstance';
import { formatDate } from '../../../../backend/utils/formatDate';
import { useNavigate } from 'react-router';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { toast } from 'react-toastify';
import { useProduct } from '../../store/useProduct';
import {
  Download,
  Package,
  Plus,
  Edit,
  User,
} from 'lucide-react';
import { useEffect, useState } from 'react';

function Listings() {

    const [listingResponse, setListingResponse] = useState(null);
  const [listingReported, setListingReported] = useState(null);
  const [activeListing, setActiveListing] = useState(null);
  const [listings, setListings] = useState(null);
  const [totalListing, setTotalListing] = useState(null);
  // const [renewModal, setRenewModal] = useState(false);

  const {
    setIsAddProductModal,
    setIsEditing,
    setEditData,
    renewListing,
    setRenewListing,
    isEditing,
    isAddProductModal
  } = useProduct();

  const user = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user'))
    : null;
  const navigate = useNavigate();

  useEffect(() => {
    async function getMyAddListing() {
      try {
        const response = await instance.get('/v1/listing/my-adds');
        const listing = response.data;
        let updatedListings = listing?.map((item) => ({
          ...item,
          postedBy: {
            ...item.postedBy,
            itemsListed: listing.length,
          },
        }));

        console.log(updatedListings)
        updatedListings = updatedListings.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setListings(updatedListings);
        setTotalListing(updatedListings);

        setListings(updatedListings);
        setTotalListing(updatedListings);

        const listingActive = response.data?.filter(
          (listing) => !listing.isExpired,
        );

        setActiveListing(listingActive);
      } catch (error) {
        console.log(error);
      }
    }

    getMyAddListing();
  }, [isEditing, isAddProductModal,  renewListing]);

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
  }, [isEditing, isAddProductModal, renewListing]);

  const exportToExcel = () => {
    if (listingResponse?.length === 0) {
      toast.error('No Response Received!');
      return;
    }
    if (!listings || listings.length === 0) {
      toast.error('No listings to export!');
      return;
    }
    const flatData = listingResponse.map((item) => ({
      Title: item.title,
      Name: item.response?.name || '',
      PhoneNumber: item.response?.phoneNumber || '',
      Email: item.response?.email || '',
      ResponseDate: item.response?.createdAt ? formatDate(item.response.createdAt) : '',
    }));

    // const flatData = listings.flatMap((item) =>
    //   (item.response || []).map((res) => ({
    //     Title: item.title,
    //     Name: res.name || '',
    //     PhoneNumber: res.phoneNumber || '',
    //     Email: res.email || '',
    //     ResponseDate: res.createdAt ? formatDate(res.createdAt) : '',
    //   }))
    // );
    if (flatData.length === 0) {
      toast.error('No data to export!');
      return;
    }
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
    <div className='flex flex-col gap-4 lg:flex-row'>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-8 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
              <div
                onClick={() => {
                  if (listingResponse?.length === 0) {
                    toast.error('No Response Received!');
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
                    toast.error('No Active Listing!');
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
                    toast.error('No Reported Listings!');
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
                  className="cursor-pointer rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md"
                >
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
                    <div className="flex-shrink-0">
                      <div className="h-fit w-full overflow-hidden rounded-lg bg-gray-100 md:h-24 md:w-32">
                        <img
                          src={property.images ? property.images[0] : null}
                          alt={property.title}
                          className="h-full w-full object-contain transition-transform duration-200 hover:scale-105"
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
                          <span>
                            {property.postedBy.name} ({property.user?.companyId}
                            )
                          </span>
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

                    <div className="flex items-center justify-between gap-4">
                      <div className="flex flex-row-reverse items-center gap-2 text-center">
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
                          setIsAddProductModal(true);
                          setIsEditing(true);
                          setEditData(property);
                        }}
                        className="inline-flex items-center rounded-lg bg-gray-900 px-4 py-2 font-medium text-white transition-colors duration-200 hover:bg-gray-800"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </button>

                      <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setRenewListing(property);
                      }}
                      className={`${new Date(property.expiryDate).getTime() < Date.now()? 'flex' : 'hidden'} items-center rounded-lg bg-red-900 px-4 py-2 font-medium text-white transition-colors duration-200 hover:bg-red-800`}>
                        Renew
                      </button>

                      <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setRenewListing(property);
                      }}
                      className={` items-center rounded-lg bg-red-900 px-4 py-2 font-medium text-white transition-colors duration-200 hover:bg-red-800`}>
                        Delete
                      </button>


                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
    </div>
  )
}

export default Listings