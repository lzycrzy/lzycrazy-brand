import React, { useEffect, useState } from 'react'

function ConfirmLocation({ formData, handleChange }) {

    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedState, setSelectedState] = useState("");

    useEffect(() => {
        fetch('https://countriesnow.space/api/v0.1/countries/states', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ country: 'India' })
        })  .then(res => res.json())
            .then(data => setStates(data.data.states.map(s => s.name)))

            setStates([...states, "Other"])
    }, []);

    useEffect(() => {
        if (selectedState) {
            fetch('https://countriesnow.space/api/v0.1/countries/state/cities', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ country: 'India', state: selectedState })
            })
            .then(res => res.json())
            .then(data => setCities(data.data));
        }
    }, [selectedState]);

    function handleChangeEvent(e) {
        handleChange(e);
        setSelectedState(e.target.value)
    }

  return (
    <div className="w-full p-4 px-10 flex flex-col gap-4">

        <h2 className="text-xl uppercase font-semibold">Confirm Your Location</h2>

        <div className="flex flex-col gap-2">
            <label htmlFor="state">State <span>*</span></label>

            <select name="state" value={formData.state} id="state" className={`rounded-md border-2 ${formData.state === 'empty' ? "border-red-600" : "border-gray-400"} p-2`}
             onChange={handleChangeEvent}>
                
                <option value="">-- Choose State --</option>
                {states.map((state, index) => (
                    <option value={state} key={index}>{state}</option>
                ))}

            </select>
        </div>

        <div className="flex flex-col gap-2">
            <label htmlFor="city">City <span>*</span></label>

            <select name="city" id="city" className={`rounded-md border-2 ${formData.city === 'empty' ? "border-red-600" : "border-gray-400"} p-2`}
            value={formData.city} 
            onChange={handleChange}>

                <option value="">-- Choose City --</option>
                {cities.map((city,idx) => (
                    <option key={idx} value={city}>
                    {city}
                    </option>
                ))}
            </select>
        </div>


        <div className="flex flex-col gap-2">
            <label htmlFor="neighbourhood">Neighbourhood <span>*</span></label>
            <input type="text" name='neighbourhood' value={formData.neighbourhood !== 'empty' ? formData.neighbourhood : ""} onChange={handleChange} id='neighbourhood' className={`rounded-md border-2 ${formData.neighbourhood === 'empty' ? "border-red-600" : "border-gray-400"} p-2`}/>
        </div>
    </div>
  )
}

export default ConfirmLocation