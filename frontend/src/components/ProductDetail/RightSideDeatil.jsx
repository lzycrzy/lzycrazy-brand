const RightSideDeatil = ({ data }) => {
  const hasConfig =
    data.configuration &&
    (data.configuration.bedrooms ||
      data.configuration.bathrooms ||
      data.configuration.balconies);
  const hasArea = data.area && (data.area.type || data.area.value);
  const hasPostedBy =
    data.postedBy &&
    (data.postedBy.name ||
      data.postedBy.memberSince ||
      data.postedBy.itemsListed);
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
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1 lg:col-span-2">
              <span className="text-xl font-medium tracking-wide text-slate-500 uppercase">
                Title
              </span>
              <p className="text-lg leading-relaxed text-slate-700">
                {data.title}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xl font-medium tracking-wide text-slate-500 uppercase">
                Price
              </span>
              <p className="text-lg font-bold text-slate-900">
                ₹ {formatToINR(data.price)}
              </p>
            </div>
          </div>
        </div>

        {(hasConfig || hasArea) && (
          <div className="p-4">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {hasConfig && (
                <div className="flex flex-col gap-1 lg:col-span-2">
                  <span className="text-xl font-medium tracking-wide text-slate-500 uppercase">
                    Configuration
                  </span>
                  <p className="text-sm text-slate-700">
                    {data.configuration.bedrooms
                      ? `${data.configuration.bedrooms} Bedrooms, `
                      : ''}
                    {data.configuration.bathrooms
                      ? `${data.configuration.bathrooms} Bathrooms, `
                      : ''}
                    {data.configuration.balconies
                      ? `${data.configuration.balconies} Balconies`
                      : ''}
                  </p>
                </div>
              )}
              {hasArea && (
                <div className="flex flex-col gap-1">
                  <span className="text-xl font-medium tracking-wide text-slate-500 uppercase">
                    Area
                  </span>
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
          <div className="flex w-full items-start justify-between">
            <div className="flex flex-col space-y-1">
              <h3 className="text-xl font-semibold text-slate-900">
                Posted By:{' '}
              </h3>
              {data.postedBy.name && (
                <p className="text-md font-semibold text-slate-900">
                  {data.postedBy.name}
                </p>
              )}
            </div>
            {data.location && (
              <div className="flex flex-col">
                <h2 className="text-xl font-semibold text-slate-900">Location:</h2>
                <h4>
                  {data.location.city} - {data.location.state}
                </h4>
                <h4>{data.location.neighbourhood ? data.location.neighbourhood : ''}</h4>
              </div>
            )}
          </div>

          <button className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border-none bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition-colors duration-300 hover:bg-indigo-700">
            Chat with seller
          </button>
        </div>
      )}

      {hasLocation && (
        <div className="space-y-3 shadow-lg">
          <h3 className="text-xl font-semibold text-slate-900">Posted in</h3>
          <p className="text-sm text-blue-600">{data.location.area}</p>
        </div>
      )}
    </div>
  );
};

export default RightSideDeatil;
