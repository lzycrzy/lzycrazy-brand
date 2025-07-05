import React, { useState } from 'react';
import { Upload,X, Play, Loader2, Loader2Icon} from 'lucide-react';
import { multiInstance } from '../utils/axios';
import Loader from './loader';
export default function UpdateMarketPostList({data,setNewsData,setIsEditing}) {
  const currentData=new Date().toISOString().split('T')[0]
  const[file,setFile]=useState(null)
  const[updateData,setUpdateData]=useState({
    _id:data._id,
    userName:data.userName,
    thumbnail:data?.thumbnail,
    url:data.url,
    type:data.type,
    postUrl:data.postUrl,
    postDate:currentData
  })
  const[isUpdating,setIsUpdating]=useState(false)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleVideoUpload = (e) => {    
    const file = e.target.files[0];
    if (file) {
       const type=file.type?.split('/')[0]
      setFile(file);
      const url = URL.createObjectURL(file);
      setUpdateData({
        ...updateData,
        postUrl:url,
        type:type
      })
    }
  };
  const handleSubmit = async() => {
    const formData=new FormData()
     formData.append("url",updateData.url)
     formData.append("prevPostUrl",data.postUrl)
      formData.append("postDate",updateData.postDate)
       formData.append("file",file)
       setIsUpdating(true)
     const response=await multiInstance.put(`/admin/updatePost/${updateData._id}`,formData)
     if(response.data?.message){
      setIsUpdating(false)
      alert("Update post successfully")
      setIsEditing(prev=>!prev)
     }
  };
  return (
    <div className="fixed w-[100vw] h-[100vh] top-0 right-0 flex justify-center items-center mb-8 rounded-lg  bg-blue-400/5 p-6 shadow-xl">
      <div className="relative w-full bg-white shadow-2xl max-w-[50vw] p-6 rounded-2xl grid grid-cols-1 gap-6 lg:grid-cols-3">
       <X onClick={()=>setIsEditing(prev=>!prev)} className='absolute top-4 right-4 hover:text-red-600'/>
        {/* Video Upload Section */}
        <div className="lg:col-span-1">
          <h3 className="mb-4 text-lg font-semibold text-gray-800">Video/Image</h3>
          <div className="relative">
            {updateData.postUrl?(
              <div className="relative h-48 w-full overflow-hidden rounded-lg bg-gray-100">
                {updateData.type == 'video'? (
                  <video
                    src={updateData.postUrl}
                    thumbnail={updateData?.thumbnail}
                    className="h-full w-full object-cover"
                    controls
                  />
                ) : (
                  <img
                    src={updateData.postUrl}
                    className="h-full w-full object-cover"
                    controls
                  />
                )}
                <div className="absolute top-2 left-2 rounded bg-red-600 px-2 py-1 text-xs font-bold text-white">
                  BREAKING NEWS
                </div>
              </div>
            ) : (
              <div className="relative flex h-48 w-full items-center justify-center overflow-hidden rounded-lg bg-blue-900">
                <div className="absolute inset-0 opacity-20">
                  <div className="h-full w-full bg-gradient-to-r from-blue-800 to-blue-900"></div>
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMSIgZmlsbD0iIzMzNzNkYyIgZmlsbC1vcGFjaXR5PSIwLjMiLz4KPC9zdmc+')] opacity-50"></div>
                </div>
                <div className="absolute top-4 left-4 rounded bg-red-600 px-3 py-1 text-sm font-bold text-white">
                  BREAKING NEWS
                </div>
                <div className="absolute right-4 bottom-4 text-xs text-white opacity-75">
                  gettyimages
                </div>
                <Play className="h-12 w-12 text-white opacity-75" />
              </div>
            )}

            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleVideoUpload}
              className="hidden"
              id="video-upload"
              name='file'
            />
            <label
              htmlFor="video-upload"
              className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 transition-colors hover:bg-gray-50"
            >
              <Upload className="h-4 w-4 text-gray-600" />
              <span className="font-medium text-gray-700">Upload</span>
            </label>
          </div>
        </div>

        {/* Form Fields Section */}
        <div className=" justify-between space-y-6 lg:col-span-2">
          {/* Name section */}
               <div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-4 md:col-span-2">
                <div>
                    <label className="mb-3 block text-lg font-semibold text-gray-800">
              Name
               </label>
                  <input
                    type="text"
                    name="name"
                    value={updateData.userName}
                    // onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    placeholder="Name"
                    required
                  />
                </div>
                 <div>
                   {/* url */}
                  <input
                    type="url"
                    name="url"
                    value={updateData.url}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    placeholder="Past Url..."
                    required
                  />
                </div>
                <div className="relative">
                  <input
                    type="date"
                    name="date"
                    defaultValue={currentData}
                    // value={currentData}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 pr-10 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    placeholder="DD-MM-YYYY"
                    pattern="\d{2}-\d{2}-\d{4}"
                  />
                 
                </div>
              </div>
            </div>
          </div>
          {/* Submit Button */}
          <div className="flex  justify-end">
           {isUpdating?
            <button
              className="cursor-pointer  flex gap-3 rounded-lg bg-blue-300 px-8 py-3 font-semibold text-white"
            >
            <Loader2 className='animate-spin'/>  Updating...
            </button>
           : <button
              onClick={handleSubmit}
              className="cursor-pointer rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
               Submit
            </button>}
          </div>
        </div>
      </div>
    </div>
  );
}
