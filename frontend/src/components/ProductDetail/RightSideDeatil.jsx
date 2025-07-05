const RightSideDeatil = ({ data }) => {
  const hasConfig = data.configuration && (data.configuration.bedrooms || data.configuration.bathrooms || data.configuration.balconies);
  const hasArea = data.area && (data.area.type || data.area.value);
  const hasPostedBy = data.postedBy && (data.postedBy.name || data.postedBy.memberSince || data.postedBy.itemsListed);
  const hasLocation = data.location?.area;

  const formatToINR = (value) => {
    const number = parseInt(value.replace(/,/g, ''), 10);
    if (isNaN(number)) return '';
    return new Intl.NumberFormat('en-IN').format(number);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="shadow-lg">
        <div className="p-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 flex flex-col gap-1">
              <span className="text-xl text-slate-500 font-medium uppercase tracking-wide">Title</span>
              <p className="text-sm text-slate-700 leading-relaxed">{data.title}</p>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xl text-slate-500 font-medium uppercase tracking-wide">Price</span>
              <p className="text-lg font-bold text-slate-900">₹ {formatToINR(data.price)}</p>
            </div>
          </div>
        </div>

        {(hasConfig || hasArea) && (
          <div className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {hasConfig && (
                <div className="lg:col-span-2 flex flex-col gap-1">
                  <span className="text-xl text-slate-500 font-medium uppercase tracking-wide">Configuration</span>
                  <p className="text-sm text-slate-700">
                    {data.configuration.bedrooms ? `${data.configuration.bedrooms} Bedrooms, ` : ''}
                    {data.configuration.bathrooms ? `${data.configuration.bathrooms} Bathrooms, ` : ''}
                    {data.configuration.balconies ? `${data.configuration.balconies} Balconies` : ''}
                  </p>
                </div>
              )}
              {hasArea && (
                <div className="flex flex-col gap-1">
                  <span className="text-xl text-slate-500 font-medium uppercase tracking-wide">Area</span>
                  <p className="text-sm text-slate-700">
                    {data.area.type} {data.area.value}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {hasPostedBy && (
        <div className="space-y-3 p-4 shadow-lg">
          <h3 className="text-xl font-semibold text-slate-900">Posted By</h3>
          <div className="space-y-1">
            {data.postedBy.name && <p className="text-md font-semibold text-slate-900">{data.postedBy.name}</p>}
            {data.postedBy.memberSince && <p className="text-xs text-slate-500">Member since {data.postedBy.memberSince}</p>}
            {data.postedBy.itemsListed && <p className="text-xs text-slate-500">{data.postedBy.itemsListed} items listed</p>}
          </div>

          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white border-none py-3 px-6 rounded-md text-sm font-medium cursor-pointer transition-colors duration-300 flex items-center justify-center gap-2">
            Chat with seller
          </button>
        </div>
      )}

      {hasLocation && (
        <div className="space-y-3 p-4 shadow-lg">
          <h3 className="text-xl font-semibold text-slate-900">Posted in</h3>
          <p className="text-sm text-blue-600">{data.location.area}</p>
        </div>
      )}
    </div>
  );
};

export default RightSideDeatil;
