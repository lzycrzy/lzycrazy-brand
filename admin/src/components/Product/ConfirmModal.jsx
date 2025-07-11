import {toast} from "react-toastify";
import instance from "../../utils/axios";

function ConfirmModal({deleteModal, setDeleteModal, setCategories}) {

      const handleDelete = async (id) => {
          const response = await instance.delete(`/categories/${id}`);
          if (response.data.success) {
            toast.success('category deleted successfully !')
            setCategories(prev => prev.filter(cat => cat.id !== id));
          }

        setDeleteModal(null);
      };

  return (
    <div 
    style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    className='fixed inset-0 flex justify-center items-center  z-20'>
        <div className='bg-white min-w-[350px] rounded p-5  flex flex-col gap-10 shadow-lg opacity-100 z-1000'>
            <div className='text-[18px] flex flex-col justify-start'><span>Are you sure ! </span> <span>Do you want this actions?</span></div>
            <div className='flex flex-row justify-end gap-3'>
                <button className='bg-blue-500 text-white rounded p-2 text-center cursor-pointer' 
                onClick={() => handleDelete(deleteModal)}>Confirm</button>
                <button onClick={() => setDeleteModal('')} className='bg-gray-300 text-black cursor-pointer rounded p-2 text-center'>Cancel</button>
            </div>
        </div>
    </div>
  )
}

export default ConfirmModal