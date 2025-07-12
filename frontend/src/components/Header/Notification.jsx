import React from 'react'
import { useSocket } from '../../lib/socket/socketConfig'
import { useRef } from 'react';
import { useEffect } from 'react';
import { useBusinessChat } from '../../store/useBusinessChat';
import { useNavigate } from 'react-router';

function Notification({setShowNotification}) {

    const {unseenMessage} = useBusinessChat();
    const notificationRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
      function handleOutsideClick(e) {
        if (notificationRef.current && !notificationRef.current.contains(e.target)) {
          setShowNotification(false);
        }
      }

      document.addEventListener('mousedown', handleOutsideClick);

      return () => document.removeEventListener('mousedown', handleOutsideClick)
    }, [])

  return (
    <div ref={notificationRef} className='absolute bg-white rounded p-1 right-0 z-100 min-w-[250px] min-h-[60px] shadow-lg border border-gray-200'>

        <div className='flex flex-col gap-2 h-full'>
          {unseenMessage?.map((msg, index) => (
            <div key={index} onClick={() => navigate('/business-chat', {state: msg.sender})} className='flex justify-between gap-5 cursor-pointer hover:bg-gray-200 rounded p-1'>
                <li>Message from {msg.sender.fullName}</li>
            </div>
        ))}

        {unseenMessage.length === 0 && <p className='grid place-items-center'>Empty!</p>}
        </div>
        
    </div>
  )
}

export default Notification