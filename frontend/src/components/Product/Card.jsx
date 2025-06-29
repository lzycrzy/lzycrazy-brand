import { useState } from "react"
import ConfirmLocation from './ConfirmLocation'
import Upload from "./Upload"

function Card({setSubCategory}) {

    const [formData, setFormData] = useState({
        brand: "",
        title: "",
        description: "",
        price: "",
        photos: [],
        state: "",
        city: "",
        neighbourhood: ""
    })

    const formatToINR = (value) => {
        const number = parseInt(value.replace(/,/g, ''), 10);
        if (isNaN(number)) return '';
        return new Intl.NumberFormat('en-IN').format(number);
    };

    function handleChange(e) {
        let {name, value} = e.target;

        if (name === 'price') {
            const number = value.replace(/,/g, '')

            if (/^\d*$/.test(number)) {
                setFormData({ ...formData, price: number });
            } else return;

            return;
        }

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    function handleSubmit(data) {

        const {brand, title, description, price, photos, state, city, neighbourhood} = formData;

        if (!brand) {
            setFormData((prev) => ({
                ...prev,
                brand: "empty"
            }))
        }
        if (!title) {
            setFormData((prev) => ({
                ...prev,
                title: "empty"
            }))
        }
        if (!description) {
            setFormData((prev) => ({
                ...prev,
                description: "empty"
            }))
        }
        if (!price) {
            setFormData((prev) => ({
                ...prev,
                price: "empty"
            }))
        }
        if (photos.length === 0) {
            setFormData((prev) => ({
                ...prev,
                photos: ["empty"]
            }))
        }
        if (!state) {
            setFormData((prev) => ({
                ...prev,
                state: "empty"
            }))
        }
        if (!city) {
           setFormData((prev) => ({
                ...prev,
                city: "empty"
            }))
        }
        if (!neighbourhood) {
            setFormData((prev) => ({
                ...prev,
                neighbourhood: "empty"
            }))
        }

        if (!brand || !title || !description || !price || !state || !city || !neighbourhood) {
            return;
        }

        console.log(formData) // api will call from here

        setFormData({
            brand: "",
            title: "",
            description: "",
            price: "",
            photos: [],
            state: "",
            city: "",
            neighbourhood: "",
        })
    }

  return (
    <div className="w-full mx-auto flex justify-center items-center mb-20 px-2">
        <div className="border-2 border-gray-400 rounded-md">
            <div className="">
                <div className="w-full border-b-2 border-b-gray-400 p-4 px-10">
                    <h1 className="text-xl uppercase font-semibold">Select the Category</h1>
                    <div className="flex gap-2 mt-5">
                        <span>Mobiles/Mobile Phones</span>
                        <span className="text-blue-700 underline cursor-pointer" onClick={() => setSubCategory('')}>change</span>
                    </div>
                </div>

                <div className="w-full border-b-2 border-b-gray-400 p-4 px-10 flex flex-col gap-4">
                    <h2 className="text-xl uppercase font-semibold">Include Some Details</h2>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="brand" className="text-[18px]">Brand <span>*</span></label>
                        <select name="brand" id="brand" value={formData.brand !== 'empty' ? formData.brand: ""} className={`rounded-md border-2 ${formData.brand === 'empty'? "border-red-600" : "border-gray-400"} p-2`} onChange={handleChange}>
                            <option value="Select Brand">Select Brand</option>
                            <option value="Villa">Option1</option>
                            <option value="Villa">Option2</option>
                            <option value="Villa">Option3</option>
                            <option value="Villa">Option4</option>
                            <option value="Villa">Option5</option>
                            <option value="Villa">Option6</option>
                            <option value="Villa">Option7</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="title">Title <span>*</span></label>
                        <input maxLength={70} type="text" name="title" id="title" value={formData.title !== 'empty' ? formData.title : ""} className={`rounded-md border-2 ${formData.title === 'empty' ? "border-red-600" : "border-gray-400"} p-2`}  onChange={handleChange} />
                        <div className="flex w-full justify-between -mt-2">
                            <span>some text</span>
                            <span>({formData.title.length}/70)</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="description">Description <span>*</span></label>
                        <textarea maxLength={1000} value={formData.description !== 'empty' ? formData.description: ""} name="description" type="text" id="description" className={`rounded-md border-2 ${formData.description === 'empty' ? "border-red-600" : "border-gray-400"} p-2 resize-none`} rows={3} onChange={handleChange} />
                        <div className="flex w-full justify-between -mt-2">
                            <span>some text</span>
                            <span>({formData.description.length}/1000)</span>
                        </div>
                    </div>
                    
                </div>

                <div className="w-full border-b-2 border-b-gray-400 p-4 px-10 flex flex-col gap-4">
                    <h2 className="text-xl uppercase font-semibold">Set A Price</h2>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="price">Price <span>*</span></label>
                        <div className={`rounded-md border-2 ${formData.price === 'empty' ? "border-red-600" : "border-gray-400"} flex`}>
                            <div className="p-2 px-4 border-r-2 border-gray-400">₹</div>
                            <input type="text" inputMode="numeric" name="price" value={formatToINR(formData.price)} onChange={handleChange} id="price" className="w-full outline-none pl-2"
                            
                            />
                        </div>
                        <span className={`${Number(formData.price) > 700000? "block": "hidden"} text-pink-700`}>The price should be less than 700000</span>
                    </div>
                </div>

                <div className="w-full border-b-2 border-b-gray-400 p-4 px-10 flex flex-col gap-4">
                    <h2 className="text-xl uppercase font-semibold">Upload Photo upto 12 Photos</h2>
                    <Upload formData={formData} />
                </div>

                <ConfirmLocation formData={formData} handleChange={handleChange} />

                <div className="flex justify-center mb-5">
                    <button type="Submit" onClick={handleSubmit} className="px-5 p-2 border-2 rounded-md border-gray-400 hover:bg-gray-400 transition-all duration-200 cursor-pointer">
                        Submit
                    </button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Card