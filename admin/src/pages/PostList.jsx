import {  Play } from 'lucide-react';
import { useEffect, useState } from 'react'
import UpdateMarketPostList from '../components/UpdateMarketPostList';
import instance from '../utils/axios';
import Loader from '../components/loader';

export default function PostList() {
    const[isEditing,setIsEditing]=useState(false)
    const[editPostData,setEditPostData]=useState(null)
     const [newsData, setNewsData] = useState([]);
     const[isLoading,setIsLoading]=useState(false)
      const[temp,setTemp]=useState([])
      function filterHandler(event){
      let filterType=event.target.value;
      if(filterType=="All"){
          setNewsData([...temp])
      }
      setNewsData(temp.filter(item=>item.type==filterType))
      } 
    function  postEditHandler(editingData){
         setIsEditing(prev=>!prev)
         setEditPostData(editingData)
      }
      async function deletePost(_id,postUrl){
        const confirm=window.confirm("Are you sure you want to delete post")
        if(confirm){
     const response= await instance.delete(`/admin/deletePost/${_id}`,postUrl)
       if(response.data?.message){
          setNewsData(prev=>prev.filter((item)=>item._id!==_id))
       }
      }  
     }
     async function postListHandler() {
      setIsLoading(true)
      const response=await instance.get('/admin/marketPost')
      if(response.data?.message){
       setIsLoading(false)
      setNewsData([...response?.data.message])
      setTemp([...response?.data.message])
      }
     }
     useEffect(()=>{
     postListHandler()
     },[])
  return (
    <div>
        <div className="scrollbar-hide w-full h-[80vh] lg:max-w-[90vw] flex justify-center py-2 rounded-lg shadow-sm overflow-y-hidden">
          {
            isLoading?<Loader/>:
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
                      {item.postDate?.split('T')[0]}
                    </td>
                     <td className="px-4 py-4 text-sm text-gray-700">
                       <button onClick={()=>postEditHandler(item)} className='bg-blue-600 hover:bg-blue-700 py-1 px-3 rounded-lg text-white text-lg'>Edit</button>
                    </td>
                      <td className="px-4 py-4 flex gap-4 text-sm text-gray-700">
                       {/* <button onClick={()=>postEditHandler(item)} className='bg-blue-600 hover:bg-blue-700 py-1 px-3 rounded-lg text-white text-lg'>Edit</button>  */}
                       <button onClick={()=>deletePost(item._id,item.postUrl)} className='bg-blue-600 hover:bg-blue-700 py-1 px-3 rounded-lg text-white text-lg'>Delete</button>
                    </td>
                   
                  </tr>
                ))}
              </tbody>
            </table>
             {isEditing&&
             <UpdateMarketPostList key={editPostData._id} isEditing={isEditing} setNewsData={setNewsData} setIsEditing={setIsEditing} data={editPostData}/>
             }
             
          </div>}
        </div>
    </div>
  )
}
