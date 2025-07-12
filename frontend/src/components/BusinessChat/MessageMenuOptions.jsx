import React, { useEffect, useRef } from 'react'
import {useBusinessChat} from '../../store/useBusinessChat'
function MessageMenuOptions({setMessageMenuOptions, messageMenuOptions}) {

    const messageMenuOptionsRef = useRef(null);
    const {deleteMessage} = useBusinessChat();
    useEffect(() => {
        function handleOutsideClick(e) {
            if (messageMenuOptionsRef.current && !messageMenuOptionsRef.current.contains(e.target)) {
                setMessageMenuOptions(false)
            }   
        }

        document.addEventListener('mousedown', handleOutsideClick)

        return  () => document.removeEventListener('mousedown', handleOutsideClick)
    }, [])

    async function handleDeleteMessage(messageId) {
        await deleteMessage(messageId)
        setMessageMenuOptions(null);
    }

  return (
    <div ref={messageMenuOptionsRef} className='absolute bg-white rounded py-1 -bottom-5 right-0 text-black min-w-[150px] border border-gray-200 shadow-lg'>
        <button onClick={() => handleDeleteMessage(messageMenuOptions._id)} className="px-2 p-1 hover:bg-gray-200 w-full text-start rounded cursor-pointer transition-all duration-200">Delete Message</button>
    </div>
  )
}

export default MessageMenuOptions