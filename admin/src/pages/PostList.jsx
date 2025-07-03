import { Upload, Calendar, User, Eye, Play, X, Camera  } from 'lucide-react';
import React, { useState } from 'react'
import UpdateMarketPostList from '../components/UpdateMarketPostList';

export default function PostList() {
    const[isEditing,setIsEditing]=useState(false)
    const[editPostData,setEditPostData]=useState(null)
     const [newsData, setNewsData] = useState([
        {
          id: 1,
        
          postDate: '12-06-2025',
        
          userName: 'John Smith',
          url:"https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
          type:"video",
          thumbnail: '/api/placeholder/60/40',
          videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'
        },
        
        {
          id: 2,
        
          postDate: '11-06-2025',
       
          userName: 'John Smith',
            url:"#",
        type:"video",
          thumbnail: '/api/placeholder/60/40',
          videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'
        },
         {
          id: 1,
        
          postDate: '12-06-2025',
        
          userName: 'John Smith',
          url:"https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
          type:"video",
          thumbnail: '/api/placeholder/60/40',
          videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'
        }, {
          id: 1,
        
          postDate: '12-06-2025',
        
          userName: 'John Smith',
          url:"https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
          type:"video",
          thumbnail: '/api/placeholder/60/40',
          videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'
        },
        {
          id: 3,
         
          postDate: '10-06-2025',
        
            type:"image",
          userName: 'John Smith',
            url:"#",
          thumbnail: '/api/placeholder/60/40',
          imageUrl:"#"
        },
        {
          id: 4,
       
          postDate: '09-06-2025',
        
          userName: 'John Smith',
            url:"#",
            type:"image",
          thumbnail: '/api/placeholder/60/40',
          imageUrl:"#"
        },
         {
          id: 1,
        
          postDate: '12-06-2025',
        
          userName: 'John Smith',
          url:"https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
          type:"video",
          thumbnail: '/api/placeholder/60/40',
          videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'
        },
         {
          id: 1,
        
          postDate: '12-06-2025',
        
          userName: 'John Smith',
          url:"https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
          type:"video",
          thumbnail: '/api/placeholder/60/40',
          videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'
        },
        {
          id: 5,
       
          postDate: '08-06-2025',
         
          userName: 'John Smith',
            url:"#",
            type:"video",
          thumbnail: '/api/placeholder/60/40',
          videoUrl:"#"
        },
        {
          id: 6,
       
          postDate: '07-06-2025',
       
          userName: 'John Smith',
            url:"#",
            type:"video",
          thumbnail: '/api/placeholder/60/40',
          videoUrl:"#"
        },
        {
          id: 7,
      
          postDate: '06-06-2025',
         
          userName: 'John Smith',
            url:"#",
            type:"image",
          thumbnail: '/api/placeholder/60/40',
          imageUrl:"#"
        }
      ]);
      const[selectingPost,setSelectingPost]=useState([])
      const[temp,setTemp]=useState([...newsData])
      function filterHandler(event){
    let filterType=event.target.value;
    setTemp(newsData.filter(item=>item.type==filterType))
      } 
      function SelectionHandler(){
        let newValue=event.target.value
        if(selectingPost.includes(newValue)){
          setSelectingPost(prev=>prev.filter(items=>items!==newValue))
        }else{
           setSelectingPost(prev=>[...prev,newValue])
        }
      } 
    function  postEditHandler(editingData){
         setIsEditing(prev=>!prev)
         setEditPostData(editingData)
      }
    
  return (
    <div>
        <div className="scrollbar-hide w-full lg:max-w-[90vw] flex justify-center py-2 rounded-lg shadow-sm overflow-y-hidden">
          <div className="overflow-auto space-y-3">
            <div className='space-x-2 font-semibold'>
                 <label className='text-lg' htmlFor='filter-post'>Filter</label>
            <select onChange={filterHandler} className='border-2 border-solid rounded-lg px-3' id="filter-post">
                  <option value="">Select</option>
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
                    <th className="px-4 py-3 text-left text-sm font-medium text-white"> <h4>Delete</h4></th> 
                  {/* <th className="flex gap-24 px-4 py-3 text-left text-sm font-medium text-white"><h4>Edit</h4> <h4>Delete</h4></th>              */}
                </tr>
              </thead>
              <tbody className="divide-y space-y-2 divide-gray-200">
                {temp.map((item, index) => (
                  <tr onClick={()=>postEditHandler(item)} key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
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
                       <button className='bg-blue-600 hover:bg-blue-700 py-1 px-3 rounded-lg text-white text-lg'>Edit</button>
                    </td>
                      <td className="px-4 py-4 text-sm text-gray-700">
                       <button className='bg-blue-600 hover:bg-blue-700 py-1 px-3 rounded-lg text-white text-lg'>Delete</button>
                    </td>
                     {/* <td className="px-4 py-4 space-x-12 text-sm text-gray-700">
                    <button className='bg-blue-600 hover:bg-blue-700 py-1 px-3 rounded-lg text-white text-lg'>Edit</button>
                    <button className='bg-blue-600 hover:bg-blue-700 py-1 px-3 rounded-lg text-white text-lg'>Delete</button>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
             {isEditing&&
             <UpdateMarketPostList setNewsData={setNewsData} data={editPostData}/>
             }
          </div>
        </div>
    </div>
  )
}
