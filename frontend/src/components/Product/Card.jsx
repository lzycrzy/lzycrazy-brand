import { useForm } from "react-hook-form";
import ConfirmLocation from './ConfirmLocation';
import Upload from "./Upload";
import { toast } from "react-toastify";

function Card({ setSubCategory, selectedCategory, selectedSubcategory }) {
    console.log(selectedSubcategory)
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      brand: "",
      title: "",
      description: "",
      price: "",
      photos: [],
      state: "",
      city: "",
      neighbourhood: ""
    }
  });

  const watchAll = watch();

  const formatToINR = (value) => {
    const number = parseInt(value.replace(/,/g, ''), 10);
    if (isNaN(number)) return '';
    return new Intl.NumberFormat('en-IN').format(number);
  };

  const onSubmit = (data) => {
    if (data.photos.length <= 1 || data.photos[0] === "empty") {
      toast.error("Please choose images? atleast 2.")
      return;
    }

    if (Number(data.price) > 700000) {
      return;
    }

    data.category = selectedCategory;
    data.subCategory = selectedSubcategory;

    console.log("Submitted:", data);

    reset();
    
  };

  return (
    <div className="w-full mx-auto flex justify-center items-center mb-20 px-2">
      <form onSubmit={handleSubmit(onSubmit)} className="border-2 border-gray-400 rounded-md w-full mt-10">
        <div className="w-full border-b-2 border-b-gray-400 p-4 lg:px-10">
          <h1 className="lg:text-xl uppercase font-semibold">Add Product Details</h1>
          <div className="flex gap-2 mt-5 text-[12px] lg:text-[14px]">
            <span>{selectedCategory}/{selectedSubcategory.name}</span>
            <span className="text-blue-700 underline cursor-pointer" onClick={() => setSubCategory('')}>
              change
            </span>
          </div>
        </div>

        <div className="w-full border-b-2 border-b-gray-400 p-4 lg:px-10 flex flex-col gap-4">
          <h2 className="lg:text-xl uppercase font-semibold">Include Some Details</h2>

          <div className="flex flex-col gap-1">
            <label htmlFor="brand">Brand <span>*</span></label>
            <select
              id="brand"
              {...register("brand", { required: true })}
              className={`rounded-md border-2 ${errors.brand ? "border-red-600" : "border-gray-400"} p-2`}
            >
              <option value="">Select Brand</option>
              <option value="Option1">Option1</option>
              <option value="Option2">Option2</option>
              <option value="Option3">Option3</option>
              <option value="Option4">Option4</option>
            </select>
          </div>

          {selectedSubcategory.formStructure.map((field, index) => (
            <div key={index} className="flex flex-col gap-1">
                <label className="flex" htmlFor={field.fieldName}>{field.label}<span className={`${field.required ? "block text-red-600" : "hidden"}`}>*</span></label>
                {field.type === 'dropdown' &&
                    <select 
                    id={field.fieldName}
                    className={`rounded-md border-2 ${errors[field.fieldName] ? "border-red-600" : "border-gray-400"} p-2`} 
                    name={field.fieldName}
                    {...register(`${field.name}`, {required: `${field.required}`})}
                    >
                        <option value=''>---Choose {field.fieldName} ---</option>
                        {field.options.map((item, index) => (
                            <option key={index} value={item}>{item}</option>
                        ))}
                    </select>
                }
                
                {field.type === 'text' &&   <input 
                        id={field.fieldName}
                        type={field.type}
                        className={`rounded-md border-2 ${errors[field.fieldName] ? "border-red-600" : "border-gray-400"} p-2`}
                        {...register(`${field.fieldName}`, {required: `${field.required}`})}
                    />
                }
                {field.type === 'textarea' &&   <textarea 
                        id={field.fieldName}
                        type={field.type}
                        className={`rounded-md border-2 ${errors[field.fieldName] ? "border-red-600" : "border-gray-400"} p-2`}
                        {...register(`${field.fieldName}`, {required: `${field.required}`})}
                    />
                }
                {field.type === 'radio' && field.options.map((item, index) => (
                    <div key={index} className="flex gap-2 items-center">
                        <input 
                            id={field.fieldName}
                            type={field.type}
                            className={`rounded-md border-2 ${errors[field.fieldName] ? "border-red-600" : "border-gray-400"} p-2`}
                            {...register(`${field.fieldName}`, {required: `${field.required}`})}
                        />
                        <span>{item}</span>
                    </div>
                ))}
                {field.type === 'checkbox' && field.options.map((item, index) => (
                    <div key={index} className="flex gap-2 items-center">
                        <input 
                            id={field.fieldName}
                            type={field.type}
                            className={`rounded-md border-2 ${errors[field.fieldName] ? "border-red-600" : "border-gray-400"} p-2`}
                            {...register(`${field.fieldName}`, {required: `${field.required}`})}
                        />
                        <span>{item}</span>
                    </div>
                ))}
            </div>
          ))}

          <div className="flex flex-col gap-1">
            <label htmlFor="title">Title <span>*</span></label>
            <input
              type="text"
              maxLength={70}
              id="title"
              {...register("title", { required: true })}
              className={`rounded-md border-2 ${errors.title ? "border-red-600" : "border-gray-400"} p-2`}
            />
            <div className="flex w-full justify-between text-xs">
              <span>Write a specific title</span>
              <span>({watchAll.title?.length || 0}/70)</span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="description">Description <span>*</span></label>
            <textarea
              maxLength={1000}
              rows={3}
              id="description"
              {...register("description", { required: true })}
              className={`rounded-md border-2 ${errors.description ? "border-red-600" : "border-gray-400"} p-2 resize-none`}
            />
            <div className="flex w-full justify-between  text-xs">
              <span>Tell about the product</span>
              <span>({watchAll.description?.length || 0}/1000)</span>
            </div>
          </div>
        </div>

        <div className="w-full border-b-2 border-b-gray-400 p-4 lg:px-10 flex flex-col gap-4">
          <h2 className="lg:text-xl uppercase font-semibold">Set A Price</h2>
          <div className="flex flex-col gap-2">
            <label htmlFor="price">Price <span>*</span></label>
            <div className={`rounded-md border-2 ${errors.price ? "border-red-600" : "border-gray-400"} flex`}>
              <div className="p-2 px-4 border-r-2 border-gray-400">₹</div>
              <input
                inputMode="numeric"
                id="price"
                {...register("price", {
                  required: true,
                  validate: val => /^\d+$/.test(val)
                })}
                value={formatToINR(watchAll.price || '')}
                onChange={(e) => {
                  const val = e.target.value.replace(/,/g, '');
                  if (/^\d*$/.test(val)) {
                    setValue("price", val);
                  }
                }}
                className="w-full outline-none pl-2"
              />
            </div>
            <span className={`${Number(watchAll.price) > 700000 ? "block" : "hidden"} text-pink-700`}>
              The price should be less than 700000
            </span>
          </div>
        </div>

        <div className="w-full border-b-2 border-b-gray-400 p-4 lg:px-10 flex flex-col gap-4">
          <h2 className="lg:text-xl uppercase font-semibold">Upload Photo upto 8 Photos</h2>
          <Upload
            photos={watchAll.photos}
            setPhotos={(photos) => setValue("photos", photos)}
          />
        </div>

        <ConfirmLocation
          watch={watch}
          register={register}
          setValue={setValue}
          errors={errors}
        />

        <div className="flex justify-center mb-5">
          <button type="submit" className="px-5 p-2 border-2 rounded-md border-gray-400 hover:bg-gray-400 transition-all duration-200 cursor-pointer">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default Card;
