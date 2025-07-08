import { useForm } from 'react-hook-form';
import ConfirmLocation from './ConfirmLocation';
import Upload from './Upload';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import ConfirmListing from './ConfirmListing';
import PaymentModal from './PaymentModal';
import { useProduct } from '../../store/useProduct';

function Card({ setSubCategory, selectedCategory, selectedSubcategory }) {
  const user = JSON.parse(localStorage.getItem('user'));
  // console.log("User: ",user);
  const { editData, isEditing } = useProduct();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      brand: '',
      title:  '',
      description:  '',
      price: '',
      photos: [],
      state: '',
      city: '',
      neighbourhood: '',
    },
  });

  useEffect(() => {
    if (isEditing && editData && selectedCategory) {
      setValue('title', editData.title);
      setValue('description', editData.description);
      setValue('price', editData.price);
      setValue('photos', editData.images);
      setValue('state', editData.location.state);
      setValue('city', editData.location.city);
      setValue('neighbourhood', editData.location.neighbourhood);

      selectedSubcategory.formStructure?.forEach((item) => {
        // console.log("Edited Features: ", editData.features[item.fieldName]);
        if (item.type === 'file') {
          item.required = false;
        }

        selectedSubcategory.formStructure?.forEach((item) => {
          if (item.type === 'file') {
            item.required = false;
          }

          const value = editData?.features?.[item.fieldName];

          if (value !== undefined) {
            setValue(item.fieldName, value);
          }
        });

        // console.log("SET VALUE: ",getValues(item.fieldName))
      });

      console.log(selectedCategory);
      console.log(selectedSubcategory);
    }
  }, [isEditing, editData, selectedCategory]);

  const watchAll = watch();

  const formatToINR = (value) => {
    const number = parseInt(value.replace(/,/g, ''), 10);
    if (isNaN(number)) return '';
    return new Intl.NumberFormat('en-IN').format(number);
  };

  const onSubmit = async (data) => {
    console.log(data);
    setConfirmListing(null);
    if (data.photos[0] === 'empty') {
      toast.error('Please choose at least 2 images.');
      return;
    }

    if (Number(data.price) > 700000) {
      toast.error('Price exceeds limit');
      return;
    }
    const formData = new FormData();

    const features = {};

    selectedSubcategory.formStructure.map(async (element) => {
      if (element.type === 'file') {
        const file = getValues(element.fieldName)[0];
        formData.append('featureFile', file);
      } else {
        features[element.fieldName] = getValues(element.fieldName);
      }
    });

    // console.log(getValues('photos'));

    data.photos.forEach((photo) => {
      formData.append('file', photo.file);
    });

    formData.append('title', data.title);
    formData.append('description', data.description || '');
    formData.append('brand', data.brand);
    formData.append('price', data.price);
    formData.append('state', data.state);
    formData.append('city', data.city);
    formData.append('neighbourhood', data.neighbourhood);
    formData.append('category', selectedCategory._id);
    formData.append('subCategory', selectedSubcategory.name);
    formData.append('features', JSON.stringify(features));

    if (isEditing) {
      formData.append('listingId', editData._id);
    }

    // formData.forEach((value, key) => {
    //   if (value instanceof File) {
    //     console.log(`${key}: File name = ${value.name}, size = ${value.size}`);
    //   } else {
    //     console.log(`${key}:`, value);
    //   }
    // });

    setConfirmListing(formData);
    // reset();
  };

  const [confirmListing, setConfirmListing] = useState(null);
  const [paymentModal, setPaymentModal] = useState(null);

  return (
    <div className="relative">
      {confirmListing && (
        <ConfirmListing
          data={confirmListing}
          setPaymentModal={setPaymentModal}
          setConfirmListing={setConfirmListing}
        />
      )}

      {paymentModal && (
        <PaymentModal data={paymentModal} setPaymentModal={setPaymentModal} />
      )}

      <div className="mx-auto mb-20 flex w-full items-center justify-center px-2">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-10 w-full rounded-md border-2 border-gray-400"
        >
          <div className="w-full border-b-2 border-b-gray-400 p-4 lg:px-10">
            <h1 className="font-semibold uppercase lg:text-xl">
              Add Product Details
            </h1>
            <div className="mt-5 flex gap-2 text-[12px] lg:text-[14px]">
              <span>
                {selectedCategory.name}/{selectedSubcategory.name}
              </span>
              <span
                className="cursor-pointer text-blue-700 underline"
                onClick={() => setSubCategory('')}
              >
                change
              </span>
            </div>
          </div>

          <div className="flex w-full flex-col gap-4 border-b-2 border-b-gray-400 p-4 lg:px-10">
            <h2 className="font-semibold uppercase lg:text-xl">
              Include Some Details
            </h2>

            <div className="flex flex-col gap-1">
              <label htmlFor="title">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                maxLength={70}
                id="title"
                {...register('title', { required: true })}
                className={`rounded-md border-2 ${errors.title ? 'border-red-600' : 'border-gray-400'} p-2`}
              />
              <div className="flex w-full justify-between text-xs">
                <span>Write a specific title</span>
                <span>({watchAll.title?.length || 0}/70)</span>
              </div>
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">Title is required</p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="description">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                maxLength={1000}
                rows={3}
                id="description"
                {...register('description', { required: true })}
                className={`rounded-md border-2 ${errors.description ? 'border-red-600' : 'border-gray-400'} resize-none p-2`}
              />
              <div className="flex w-full justify-between text-xs">
                <span>Tell about the product</span>
                <span>({watchAll.description?.length || 0}/1000)</span>
              </div>
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  Description is required
                </p>
              )}
            </div>

            {selectedSubcategory.formStructure.map((field, index) => (
              <div key={index} className="mb-4 flex flex-col gap-1">
                <label htmlFor={field.fieldName} className="flex">
                  {field.label}
                  {field.required && (
                    <span className="ml-1 text-red-600">*</span>
                  )}
                </label>

                {/* Dropdown */}
                {field.type === 'dropdown' && (
                  <>
                    <select
                      id={field.fieldName}
                      {...register(field.fieldName, {
                        required: field.required
                          ? `${field.label} is required`
                          : false,
                      })}
                      className={`rounded-md border-2 p-2 ${errors[field.fieldName] ? 'border-red-600' : 'border-gray-400'}`}
                    >
                      <option value="">--- Choose {field.label} ---</option>
                      {field.options.map((item, i) => (
                        <option key={i} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                    {errors[field.fieldName] && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors[field.fieldName].message}
                      </p>
                    )}
                  </>
                )}

                {/* Text Input */}
                {field.type === 'text' && (
                  <>
                    <input
                      id={field.fieldName}
                      type="text"
                      {...register(field.fieldName, {
                        required: field.required
                          ? `${field.label} is required`
                          : false,
                      })}
                      className={`rounded-md border-2 p-2 ${errors[field.fieldName] ? 'border-red-600' : 'border-gray-400'}`}
                    />
                    {errors[field.fieldName] && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors[field.fieldName].message}
                      </p>
                    )}
                  </>
                )}

                {/* Textarea */}
                {field.type === 'textarea' && (
                  <>
                    <textarea
                      id={field.fieldName}
                      {...register(field.fieldName, {
                        required: field.required
                          ? `${field.label} is required`
                          : false,
                      })}
                      className={`rounded-md border-2 p-2 ${errors[field.fieldName] ? 'border-red-600' : 'border-gray-400'}`}
                    />
                    {errors[field.fieldName] && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors[field.fieldName].message}
                      </p>
                    )}
                  </>
                )}

                {/* Radio */}
                {field.type === 'radio' && (
                  <>
                    {field.options.map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          type="radio"
                          id={`${field.fieldName}_${item}`}
                          value={item}
                          {...register(field.fieldName, {
                            required: field.required
                              ? `${field.label} is required`
                              : false,
                          })}
                          className={`rounded-md border-2 p-2 ${errors[field.fieldName] ? 'border-red-600' : 'border-gray-400'}`}
                        />
                        <label htmlFor={`${field.fieldName}_${item}`}>
                          {item}
                        </label>
                      </div>
                    ))}
                    {errors[field.fieldName] && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors[field.fieldName].message}
                      </p>
                    )}
                  </>
                )}

                {/* Checkbox */}
                {field.type === 'checkbox' && (
                  <>
                    {field.options.map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`${field.fieldName}_${item}`}
                          value={item}
                          {...register(field.fieldName, {
                            validate: (value) =>
                              field.required
                                ? (value && value.length > 0) ||
                                  `${field.label} is required`
                                : true,
                          })}
                          className={`rounded-md border-2 p-2 ${errors[field.fieldName] ? 'border-red-600' : 'border-gray-400'}`}
                        />
                        <label htmlFor={`${field.fieldName}_${item}`}>
                          {item}
                        </label>
                      </div>
                    ))}
                    {errors[field.fieldName] && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors[field.fieldName].message}
                      </p>
                    )}
                  </>
                )}

                {/* File input */}
                {field.type === 'file' && (
                  <>
                    <input
                      type="file"
                      id={field.fieldName}
                      {...register(field.fieldName, {
                        required: field.required
                          ? `${field.label} is required`
                          : false,
                      })}
                      className={`rounded-md border-2 p-2 ${errors[field.fieldName] ? 'border-red-600' : 'border-gray-400'}`}
                    />
                    {errors[field.fieldName] && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors[field.fieldName].message}
                      </p>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>

          <div className="flex w-full flex-col gap-4 border-b-2 border-b-gray-400 p-4 lg:px-10">
            <h2 className="font-semibold uppercase lg:text-xl">Set A Price</h2>
            <div className="flex flex-col gap-2">
              <label htmlFor="price">
                Price <span className="text-red-500">*</span>
              </label>
              <div
                className={`rounded-md border-2 ${errors.price ? 'border-red-600' : 'border-gray-400'} flex`}
              >
                <div className="border-r-2 border-gray-400 p-2 px-4">₹</div>
                <input
                  inputMode="numeric"
                  id="price"
                  {...register('price', {
                    required: true,
                    validate: (val) => {
                      const rowVal = val.replace(/,/g, '');
                      return /^\d*$/.test(rowVal);
                    },
                  })}
                  value={formatToINR(watchAll.price || '')}
                  onChange={(e) => {
                    const val = e.target.value.replace(/,/g, '');
                    if (/^\d*$/.test(val)) {
                      setValue('price', val);
                    }
                  }}
                  className="w-full pl-2 outline-none"
                />
              </div>
              <span
                className={`${Number(watchAll.price) > 700000 ? 'block' : 'hidden'} text-pink-700`}
              >
                The price should be less than 700000
              </span>
            </div>
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">price is required</p>
            )}
          </div>

          <div className="flex w-full flex-col gap-4 border-b-2 border-b-gray-400 p-4 lg:px-10">
            <h2 className="font-semibold uppercase lg:text-xl">
              Upload Photo upto 8 Photos
            </h2>
            <Upload
              photos={watchAll.photos}
              setPhotos={(photos) => setValue('photos', photos)}
            />
          </div>

          <ConfirmLocation
            watch={watch}
            register={register}
            setValue={setValue}
            reset={reset}
            errors={errors}
            getValues={getValues}
          />

          <div className="mb-5 flex justify-center">
            <button
              type="submit"
              className="cursor-pointer rounded-md border-2 border-gray-400 p-2 px-5 transition-all duration-200 hover:bg-gray-400"
            >
              {!isEditing ? 'Submit' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Card;