const ProductCard = ({ post }) => {
    if (!post) return null; // Safety check

  const formatToINR = (value) => {
    const number = parseInt(value.replace(/,/g, ''), 10);
    if (isNaN(number)) return '';
    return new Intl.NumberFormat('en-IN').format(number);
  };
  
    return (
      <div className="bg-white rounded shadow p-4 hover:shadow-md transition cursor-pointer">
        <img
          src={post?.images?.length > 0? post.images[0] : '/assets/product.jpg'}
          alt={post.title}
          className="w-full h-48 object-cover rounded border"
        />
        <div className='flex justify-between items-center mb-2'>
          <h3 className="mt-2 text-lg font-semibold">{post.title}</h3>
          <p className="text-green-700 font-bold">₹ {formatToINR(post.price)}</p>
        </div>
        <div className='flex gap-2 items-center'>
          <img src="/assets/location.png" width={15} loading="lazy" />
          <p className="text-gray-500 text-sm">{post.location?.state}</p>
        </div>

        <div className='flex mt-2 gap-2 items-center'>
          <img src="/assets/identity.png" width={20} loading="lazy" />
          <p>{post.postedBy.name}</p>
        </div>
      </div>
    );
  };

export default ProductCard;
