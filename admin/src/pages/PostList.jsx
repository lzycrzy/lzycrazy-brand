import { Upload, Calendar, User, Eye, Play, X, Camera  } from 'lucide-react';
import React, { useState } from 'react'

export default function PostList() {
    const[selecting,setSelecting]=useState(false)
     const [newsData, setNewsData] = useState([
        {
          id: 1,
          title: 'Breaking News Live Updates: Sri Lanka Speaker Recognises Ranil Wickremesinghe As Prime Minister',
          postDate: '12-06-2025',
          views: '663k',
          userName: 'John Smith',
          type:"video",
          thumbnail: '/api/placeholder/60/40',
          videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'
        },
        
        {
          id: 2,
          title: 'Breaking News Live Updates: Sri Lanka Speaker Recognises Ranil Wickremesinghe As Prime Minister',
          postDate: '11-06-2025',
          views: '663k',
          userName: 'John Smith',
        type:"video",
          thumbnail: '/api/placeholder/60/40',
          videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'
        },
        {
          id: 3,
          title: 'Breaking News Live Updates: Sri Lanka Speaker Recognises Ranil Wickremesinghe As Prime Minister',
          postDate: '10-06-2025',
          views: '663k',
            type:"image",
          userName: 'John Smith',
          thumbnail: '/api/placeholder/60/40',
          imageUrl:"#"
        },
        {
          id: 4,
          title: 'Breaking News Live Updates: Sri Lanka Speaker Recognises Ranil Wickremesinghe As Prime Minister',
          postDate: '09-06-2025',
          views: '663k',
          userName: 'John Smith',
            type:"image",
          thumbnail: '/api/placeholder/60/40',
          imageUrl:"#"
        },
        {
          id: 5,
          title: 'Breaking News Live Updates: Sri Lanka Speaker Recognises Ranil Wickremesinghe As Prime Minister',
          postDate: '08-06-2025',
          views: '663k',
          userName: 'John Smith',
            type:"video",
          thumbnail: '/api/placeholder/60/40',
          videoUrl:"#"
        },
        {
          id: 6,
          title: 'Breaking News Live Updates: Sri Lanka Speaker Recognises Ranil Wickremesinghe As Prime Minister',
          postDate: '07-06-2025',
          views: '663k',
          userName: 'John Smith',
            type:"video",
          thumbnail: '/api/placeholder/60/40',
          videoUrl:"#"
        },
        {
          id: 7,
          title: 'Breaking News Live Updates: Sri Lanka Speaker Recognises Ranil Wickremesinghe As Prime Minister',
          postDate: '06-06-2025',
          views: '663k',
          userName: 'John Smith',
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
      console.log(selectingPost);
          
  return (
    <div>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto space-y-3">
            <div className='space-x-2 font-semibold'>
                 <label className='text-lg' htmlFor='filter-post'>Filter</label>
            <select onChange={filterHandler} className='border-2 border-solid rounded-lg px-3' id="filter-post">
                  <option value="">Select</option>
                <option value="image">Image</option>
                  <option value="video">Video</option>
            </select>
            </div>
            <table className="w-full">
              <thead className="bg-gray-600">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white">Video</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white">Title</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white">Post Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white">Views</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white">User Profile</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white">User Name</th>
                </tr>
              </thead>
              <tbody className="divide-y space-y-2 divide-gray-200">
                {temp.map((item, index) => (
                  <tr onClick={()=>setSelecting(true)} key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="flex gap-3 px-4 py-4">
                      {selecting&&<input value={index} onChange={SelectionHandler} type='checkbox'/>}
                      <div className="relative w-16 h-12 bg-gray-200 rounded overflow-hidden">
                        <div className="w-full h-full bg-blue-900 flex items-center justify-center">
                          <Play className="w-4 h-4 text-white" />
                        </div>
                        <div className="absolute top-0 left-0 bg-red-600 text-white text-xs px-1 py-0.5 rounded-br">
                          LIVE
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900 max-w-xs lg:max-w-md">
                        {item.title}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      {item.postDate}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700 font-medium">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4 text-gray-400" />
                        {item.views}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-600" />
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 font-medium">
                      {item.userName}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
             {selectingPost.length>0&&
                 <button disabled className='flex justify-self-end mr-6 mt-3 mb-3 px-6 py-2 rounded-lg hover:bg-blue-700 bg-blue-600 text-white'>Publish</button>
        }
          </div>
        </div>
    </div>
  )
}
