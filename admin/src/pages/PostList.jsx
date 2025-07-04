import {  Play } from 'lucide-react';
import { useEffect, useState } from 'react'
import UpdateMarketPostList from '../components/UpdateMarketPostList';
import instance from '../utils/axios';

export default function PostList() {
    const[isEditing,setIsEditing]=useState(false)
    const[editPostData,setEditPostData]=useState(null)
     const [newsData, setNewsData] = useState([
        {
          _id: 1,
          postDate: '12-06-2025',
        
          userName: 'John Smith',
          url:"https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
          type:"image",
          thumbnail: '/api/placeholder/60/40',
          postUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'
        },
        
        {
         _id: 2,
        
          postDate: '11-06-2025',
       
          userName: 'John Smith',
           url:"#",
           type:"video",
          thumbnail: '/api/placeholder/60/40',
          postUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'
        }
        //  {
        //   id: 9,
        
        //   postDate: '12-06-2025',
        
        //   userName: 'John Smith',
        //   url:"https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
        //   type:"image",
        //   thumbnail: '/api/placeholder/60/40',
        //   videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'
        // }, {
        //   id: 10,
        
        //   postDate: '12-06-2025',
        
        //   userName: 'John Smith',
        //   url:"https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
        //   type:"image",
        //   thumbnail: '/api/placeholder/60/40',
        //   videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'
        // },
        
      ]);
      const[temp,setTemp]=useState([...newsData])
      function filterHandler(event){
      let filterType=event.target.value;
      setTemp(newsData.filter(item=>item.type==filterType))
      } 
    function  postEditHandler(editingData){
         setIsEditing(prev=>!prev)
         setEditPostData(editingData)
      }
      function deletePost(id){
        // delete api request
       setTemp(prev=>prev.filter((item)=>item.id!==id))
     }
     async function postListHandler() {
      const response=await instance.get('/admin/marketPost')
      console.log(response)
      setNewsData(prev=>[...prev,...response?.data.message])
     }
     useEffect(()=>{
     postListHandler()
     },[])
     console.log(newsData);
     
  return (
    <div>
        <div className="scrollbar-hide w-full lg:max-w-[90vw] flex justify-center py-2 rounded-lg shadow-sm overflow-y-hidden">
          <div className="overflow-auto space-y-3">
            <div className='space-x-2 font-semibold'>
                 <label className='text-lg' htmlFor='filter-post'>Filter</label>
            <select onChange={filterHandler} className='border-2 border-solid rounded-lg px-3' id="filter-post">
                  <option value="All">Select</option>
                <option value="image">Image</option>
                  <option value="video">Video</option>
            </select>
            </div>
            <table>
              <thead className="bg-gray-600">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white">Video</th>
                   <th className="px-4 py-3 text-left text-sm font-medium text-white">User Name</th>
                     <th className="px-4 py-3 text-left text-sm font-medium flex justify-center text-white">Url</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white">Post Date</th>  
                   <th className="px-4 py-3 text-left text-sm font-medium text-white"><h4>Edit</h4></th>  
                    <th className="px-4 py-3 text-left text-sm font-medium flex justify-center text-white"> <h4>Delete</h4></th> 
                  {/* <th className="flex gap-24 px-4 py-3 text-left text-sm font-medium text-white"><h4>Edit</h4> <h4>Delete</h4></th>              */}
                </tr>
              </thead>
              <tbody className="divide-y space-y-2 divide-gray-200">
                {newsData.map((item, index) => (
                  <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="flex gap-3 px-4 py-4">
                      <div className="relative w-16 h-12 bg-gray-200 rounded overflow-hidden">
                        <div className="w-full h-full bg-blue-900 flex items-center justify-center">
                          <Play className="w-4 h-4 text-white" />
                        </div>
                        <div className="absolute top-0 left-0 bg-red-600 text-white text-xs px-1 py-0.5 rounded-br">
                          LIVE
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 font-medium">
                      {item.userName}
                    </td>
                     <td className="px-4 py-4 text-sm text-gray-900 font-medium">
                      {item.url}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      {item.postDate}
                    </td>
                     <td className="px-4 py-4 text-sm text-gray-700">
                       <button onClick={()=>postEditHandler(item)} className='bg-blue-600 hover:bg-blue-700 py-1 px-3 rounded-lg text-white text-lg'>Edit</button>
                    </td>
                      <td className="px-4 py-4 flex gap-4 text-sm text-gray-700">
                       {/* <button onClick={()=>postEditHandler(item)} className='bg-blue-600 hover:bg-blue-700 py-1 px-3 rounded-lg text-white text-lg'>Edit</button>  */}
                       <button onClick={()=>deletePost(item.id)} className='bg-blue-600 hover:bg-blue-700 py-1 px-3 rounded-lg text-white text-lg'>Delete</button>
                    </td>
                   
                  </tr>
                ))}
              </tbody>
            </table>
             {isEditing&&
             <UpdateMarketPostList key={editPostData.id} setNewsData={setNewsData} setIsEditing={setIsEditing} data={editPostData}/>
             }
          </div>
        </div>
    </div>
  )
}
