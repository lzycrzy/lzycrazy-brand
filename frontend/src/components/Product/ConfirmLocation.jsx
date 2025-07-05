import React, { useEffect, useState } from 'react';
import { useProduct } from '../../store/useProduct';

function ConfirmLocation({ register, setValue, watch, errors, getValues }) {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const selectedState = watch("state");
  const {isEditing, editData} = useProduct();


  

  console.log(getValues('state'));
  console.log(getValues('city'));

  useEffect(() => {
    const fetchStates = async () => {
      const res = await fetch('https://countriesnow.space/api/v0.1/countries/states', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country: 'India' }),
      });
      const data = await res.json();
      setStates([...data.data.states.map((s) => s.name), "Other"]);
    };
    fetchStates();
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      if (!selectedState) return;
      const res = await fetch('https://countriesnow.space/api/v0.1/countries/state/cities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country: 'India', state: selectedState }),
      });
      const data = await res.json();
      setCities(data.data);
      setValue("city", "");
    };
    fetchCities();
  }, [selectedState, setValue]);

  useEffect(() => {
  const initLocation = async () => {
    if (isEditing && editData) {
      setValue('state', editData.location.state);
      
      const res = await fetch('https://countriesnow.space/api/v0.1/countries/state/cities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country: 'India', state: editData.location.state }),
      });
      const data = await res.json();
      setCities(data.data);

      // Then set city and neighbourhood
      setValue('city', editData.location.city);
      setValue('neighbourhood', editData.location.neighbourhood);
    }
  };

  initLocation();
}, [isEditing, editData, setValue]);


  return (
    <div className="w-full p-4 lg:px-10 flex flex-col gap-4">
      <h2 className="text-xl uppercase font-semibold">Confirm Your Location</h2>

      {/* State */}
      <div className="flex flex-col gap-2">
        <label htmlFor="state">State <span className='text-red-500'>*</span></label>
        <select
          id="state"
          {...register("state", { required: true })}
          className={`rounded-md border-2 ${errors.state ? "border-red-600" : "border-gray-400"} p-2`}
        >
          <option value="">-- Choose State --</option>
          {states.map((state, i) => (
            <option key={i} value={state}>{state}</option>
          ))}
        </select>
        {errors.state && (
                    <p className="mt-1 text-sm text-red-600">
                      state is required
                    </p>
                  )}
      </div>

      {/* City */}
      <div className="flex flex-col gap-2">
        <label htmlFor="city">City <span className='text-red-500'>*</span></label>
        <select
          id="city"
          {...register("city", { required: true })}
          className={`rounded-md border-2 ${errors.city ? "border-red-600" : "border-gray-400"} p-2`}
        >
          <option value="">-- Choose City --</option>
          {cities.map((city, i) => (
            <option key={i} value={city}>{city}</option>
          ))}
        </select>
        {errors.city && (
                    <p className="mt-1 text-sm text-red-600">
                      city is required
                    </p>
                  )}
      </div>

      {/* Neighbourhood */}
      <div className="flex flex-col gap-2">
        <label htmlFor="neighbourhood">Neighbourhood</label>
        <input
          type="text"
          id="neighbourhood"
          {...register("neighbourhood", { required: false })}
          className={`rounded-md border-2 ${errors.neighbourhood ? "border-red-600" : "border-gray-400"} p-2`}
        />
      </div>
    </div>
  );
}

export default ConfirmLocation;
