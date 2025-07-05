
import { useLocation } from 'react-router-dom';
import PropertyListing from '../components/ProductDetail/ProductListing';
import { useEffect } from 'react';
import instance from '../lib/axios/axiosInstance';

const PropertyViewPage = () => {
  const { state } = useLocation();

  if (!state?.data) {
    return (
      <div className="text-center mt-10 text-xl text-red-600">
        No Property Data Provided
      </div>
    );
  }

  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')): null;
  // console.log(user);

  useEffect(() => {
    async function updateViews() {

      if (user?._id === state.data.user._id) return;

      try {
        const res = await instance.post(`/v1/listing/views/${state.data._id}`)
      } catch(error) {
        console.log(error);
      }
    }
    updateViews()
  }, [])

  return <PropertyListing data={state.data} images={state.images || []} />;
};

export default PropertyViewPage;
