
import productImage from '../../assets/product.jpg'
import location from '../../assets/location.png'
import avatar from '../../assets/identity.png'
const ProductCard = ({ post }) => {
    if (!post) return null; // Safety check
  
    return (
      <div className="bg-white rounded shadow p-4 hover:shadow-md transition cursor-pointer">
        <img
          src={post?.images?.length > 0? post.images[0] : productImage}
          alt={post.title}
          className="w-full h-48 object-cover rounded border"
        />
        <div className='flex justify-between items-center mb-2'>
          <h3 className="mt-2 text-lg font-semibold">{post.title}</h3>
          <p className="text-green-700 font-bold">₹ {post.price}</p>
        </div>
        <div className='flex gap-2 items-center'>
          <img src={location} width={15} />
          <p className="text-gray-500 text-sm">{post.location?.state}</p>
        </div>

        <div className='flex mt-2 gap-2 items-center'>
          <img src={avatar} width={20} />
          <p>{post.postedBy.name}</p>
        </div>
      </div>
    );
  };

export default ProductCard;
