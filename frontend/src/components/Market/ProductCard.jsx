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
      <div className="bg-white shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] rounded p-2 hover:shadow-[0px_10px_1px_rgba(221,_221,_221,_1),_0_10px_20px_rgba(204,_204,_204,_1)] transition cursor-pointer">
        <img
          src={post?.images?.length > 0 ? post.images[0] : (loaded ? getAssetUrl('product.jpg') : '')}
          alt={post?.title || 'Product Image'}
          className="w-full h-48 object-contain rounded border border-gray-100 bg-white"
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
