import { useAsset } from '../../store/useAsset';
import { formatPrice } from '../../utils/formatPrice';

const ProductCard = ({ post }) => {
    if (!post) return null; // Safety check

  const formatToINR = (value) => {
    const number = parseInt(value.replace(/,/g, ''), 10);
    if (isNaN(number)) return '';
    return new Intl.NumberFormat('en-IN').format(number);
  };
  
  const { getAssetUrl, loaded } = useAsset();
  
    return (
      <div className="bg-white rounded shadow p-4 hover:shadow-md transition cursor-pointer">
        <img
          src={post?.images?.length > 0 ? post.images[0] : (loaded ? getAssetUrl('product.jpg') : '')}
          alt={post?.title || 'Product Image'}
          className="w-full h-48 object-cover rounded border"
        />
        <div className='flex justify-between items-center mb-2'>
          <h3 className="mt-2 text-lg" title={post.title}>{post.title.length > 25 ? post.title.slice(0, 25)+'...' : post.title}</h3>
          <p className="font-bold">₹ {post.price < 100000 ? formatToINR(post.price) : formatPrice(post.price)}</p>
        </div>
        
        <div className='flex items-center justify-between'>
          <div className='flex mt-2 gap-2 items-center'>
          {loaded && <img src={getAssetUrl('identity.png') || "/missing.png"} alt="Identity" width={20} loading="lazy" />}
          <p>{post.postedBy.name}</p>
        </div>
        <div className='flex gap-2 items-center'>
          {loaded && <img src={getAssetUrl('location.png') || "/missing.png"} alt="Location" width={15} loading="lazy" />}
          <p className="text-gray-500 text-sm">{post.location?.state}</p>
        </div>
        </div>

      </div>
    );
  };

export default ProductCard;
