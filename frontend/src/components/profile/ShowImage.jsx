import React, { useEffect, useRef } from 'react'

function ShowImage({img, setShowImage}) {

    const imageModalRef = useRef(null);

    useEffect(() => {
        function handleOutsideClick(event) {
            console.log(event.target)
            if (imageModalRef.current && !imageModalRef.current.contains(event.target)) {
                setShowImage(null);
            }
        }

        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick)
        }
    }, [])
    
  return (
    <div style={{backgroundColor: 'rgba(0,0,0,0.5)'}} className='fixed inset-0 w-screen h-screen z-100 flex justify-center items-center'>
        <div  ref={imageModalRef} className='bg-white w-[450px] h-[350px] rounded overflow-hidden flex justify-center items-center'>
            <img src={img} alt="Profile Image" className='bg-center object-contain rounded' />
        </div>
    </div>
  )
}

export default ShowImage