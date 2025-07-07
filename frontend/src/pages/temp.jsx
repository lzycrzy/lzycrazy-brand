import React, { useEffect, useState } from 'react'
import instance from '../lib/axios/axiosInstance';
import { toast } from 'react-toastify';

const Temp = () => {
    const [assets, setAssets] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadedUrls, setUploadedUrls] = useState([]);

    const handleChange = (e) => {
        setAssets(Array.from(e.target.files));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!assets.length) return;
        // console.log("Selected images data:");
        // assets.forEach((file, idx) => {
        //     console.log(`Image ${idx + 1}:`, {
        //         name: file.name,
        //         size: file.size,
        //         type: file.type,
        //     });
        // });
        setUploading(true);
        for (const file of assets) {
            const formData = new FormData();
            formData.append('asset', file);
            try {
                const data = await instance.post(`/v1/assets/upload`, formData);

                if (!data) {
                    toast.error('Media not uploaded.');
                }
            } catch (err) {
                console.error('Upload failed for', file.name, err);
            }
        }
        setUploading(false);
    };

    async function fetchAssets() {
        const res = await instance.get('/v1/assets')

        console.log(res);
        setUploadedUrls(res.data.assets);
    }

    useEffect(() => {
        fetchAssets()
    }, [uploading])

    return (
        <>
           <div className='w-full flex justify-center'>
             <a href="#instructions" className='underline'>Check how to use after uploading media</a>
           </div>
        <div className=' mt-20 flex justify-center items-center'>
            <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
                <h1 className='text-2xl flex flex-col items-center'>Upload Media <span className='text-xs'>Please don't use image which is already uplaoded</span></h1>
                <span>You can choose multiple image at once.</span>
                <input 
                    type="file" 
                    name="asset" 
                    accept="image/*" 
                    multiple onChange={handleChange}
                    className='outline-none border w-[300px] rounded p-2'
                    />
                <button 
                    type="submit" 
                    className='w-full cursor-pointer p-2 rounded bg-blue-500'
                    disabled={!assets.length || uploading}>{uploading ? 'Uploading...' : 'Upload'}</button>
            </form>
            
        </div>

        {uploadedUrls.length > 0 && (
                <div className='px-20'>
                    <h3 className='text-center mb-10 mt-10 text-2xl uppercase underline'>Uploaded Media</h3>
                    <ul className='grid lg:grid-cols-8 grid-cols-2 md:grid-cols-3 gap-4'>
                        {uploadedUrls.map((media, idx) => (
                            <div key={idx} className='flex flex-col items-center gap-2'>
                                <li className='w-32 h-32 rounded flex flex-col justify-center items-center border'>
                                <img src={media.url ? media.url : "/missing.png"} alt={media.name || "Uploaded Media"} className='bg-center object-contain' />
                            </li>
                            <span>{media.name}</span>
                            </div>
                        ))}
                    </ul>
                </div>
            )}

            <div id='instructions' className='mt-20 flex justify-center flex-col items-center mb-20'>
                <h2 className='uppercase text-2xl mb-5 font-bold underline'>Instructions</h2>

                <div className='flex flex-col items-start gap-5'>
                    <div className='flex flex-col gap-2'>
                        <h2 className='text-xl'>1. import this in specific component where you want to uses media</h2>
                        <i>Verify the import - example shows for admin</i>
                        <span className='px-1 py-0.5 bg-gray-800 text-amber-200 rounded'>{`import { useAsset } from '../store/useAsset';`}</span>
                    </div>
                    <div className='flex flex-col gap-2'>

                    <h2>2. Add this line in the component</h2>
                    <span className='px-1 py-0.5 bg-gray-800 text-amber-200 rounded'>
                        {`  const { getAssetUrl, loaded } = useAsset(); `}
                    </span>
                    </div>
                    <div className='flex flex-col gap-2'>

                    <h2>3. Use img element and reference name from above. <br /><strong>Name to be exactly same with spaces, ., extenstions and more (use same in the list.)</strong><br />
                    <i>You can copy and then paste it.</i></h2>
                    <span className='px-1 py-0.5 bg-gray-800 text-amber-200 rounded'>
                        {`  <img src={getAssetUrl('image5.png') ? getAssetUrl('image5.png') : "/missing.png"} alt="Image 5" /> `}
                    </span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Temp;    