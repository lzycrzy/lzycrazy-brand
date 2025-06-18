const RightSideDeatil = ({ data }) => {
  return (
    <div className="flex flex-col gap-6">
        <div className="shadow-lg">
      <div className=" p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-1">
            <span className="text-xl text-slate-500 font-medium uppercase tracking-wide">Title</span>
            <p className="text-sm text-slate-700 leading-relaxed">{data.title}</p>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xl text-slate-500 font-medium uppercase tracking-wide">Price</span>
            <p className="text-lg font-bold text-slate-900">{data.price}</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-1">
            <span className="text-xl text-slate-500 font-medium uppercase tracking-wide">Configuration</span>
            <p className="text-sm text-slate-700">
              {data.configuration.bedrooms} Bedrooms, {data.configuration.bathrooms} Bathrooms, {data.configuration.balconies} Balconies
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xl text-slate-500 font-medium uppercase tracking-wide">Area</span>
            <p className="text-sm text-slate-700">{data.area.type} {data.area.value}</p>
          </div>
        </div>
      </div>
      </div>

      <div className="space-y-3 p-4 shadow-lg">
        <h3 className=" text-xl font-semibold text-slate-900">Posted By</h3>
        <div className="space-y-1">
          <p className="text-md font-semibold text-slate-900">{data.postedBy.name}</p>
          <p className="text-xs text-slate-500">Member since {data.postedBy.memberSince}</p>
          <p className="text-xs text-slate-500">{data.postedBy.itemsListed} items listed</p>
        </div>
        
        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white border-none py-3 px-6 rounded-md text-sm font-medium cursor-pointer transition-colors duration-300 flex items-center justify-center gap-2">
           Chat with seller
        </button>
      </div>

      <div className="space-y-3 p-4  shadow-lg">
        <h3 className="text-xl font-semibold text-slate-900">Posted in</h3>
        <p className="text-sm text-blue-600">{data.location.area}</p>
      </div>

   
    </div>
  )
}

export default RightSideDeatil