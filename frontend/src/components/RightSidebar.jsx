const RightSidebar = ({ people }) => (
    <div className="hidden w-full max-w-xs lg:block">
      {/* Box 1: People You May Know */}
      <div className="bg-white rounded-lg p-5 shadow-md">
        <h3 className="mb-4 text-lg font-semibold text-gray-800">People You May Know</h3>
        {people.map((p, i) => (
          <div key={i} className="mb-4 flex items-center">
            <img src={p.image} alt={p.name} className="mr-3 h-12 w-12 rounded-full object-cover" />
            <div className="flex-1">
              <div className="font-medium text-gray-900">{p.name}</div>
              <button
                className={`mt-1 rounded-full border px-3 py-1.5 text-xs font-medium ${
                  p.follow
                    ? 'border-gray-300 text-gray-700'
                    : 'border-blue-600 bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {p.follow ? 'Following' : 'Follow'}
              </button>
            </div>
          </div>
        ))}
      </div>
  
      {/* Spacer */}
      <div className="h-4 bg-gray-100"></div>
  
      {/* Box 2: Invite Your Friends */}
      <div className="bg-white rounded-lg p-5 shadow-md">
        <h3 className="mb-2 text-md font-semibold text-gray-800">Invite Your Friends</h3>
        <input
          type="email"
          placeholder="Enter email address"
          className="w-full rounded-full border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button className="mt-3 w-full rounded-full bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
          Send Invite
        </button>
      </div>
  
      {/* Spacer */}
      <div className="h-4 bg-gray-100"></div>
  
      {/* Box 3: Footer Links */}
      <div className="bg-white rounded-lg p-5 shadow-md text-xs text-gray-500">
        <div>© 2025 LzyCrazy</div>
        <div className="mt-2 flex flex-wrap gap-3">
          <a href="#" className="hover:underline">About</a>
          <a href="#" className="hover:underline">Blog</a>
          <a href="#" className="hover:underline">Contact</a>
          <a href="#" className="hover:underline">More</a>
        </div>
        <div className="mt-2">Languages</div>
      </div>
    </div>
  );
  
  export default RightSidebar;
  