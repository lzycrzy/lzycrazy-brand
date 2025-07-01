import React from 'react'

function ConfirmListing({confirmListing, onSubmit, setConfirmListing}) {
  return (
    <div style={{backgroundColor: 'rgb(0,0,0,.3)'}} className='fixed inset-0 flex justify-center items-center z-99'>
        <div className='bg-white shadow-lg p-5 min-w-[300px] rounded flex flex-col gap-5'>
            <span>Are you confirm?</span>
            <div className='flex justify-end gap-2'>
                <button onClick={() => onSubmit(confirmListing)} className='cursor-pointer p-1 px-2 bg-blue-500 text-white rounded'>Submit</button>
                <button onClick={() => setConfirmListing(null)} className='cursor-pointer p-1 px-2 bg-gray-200 text-black rounded'>Cancel</button>
            </div>
        </div>
    </div>
  )
}

export default ConfirmListing