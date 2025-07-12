import { useEffect, useRef } from "react"
import { useBusinessChat } from "../../store/useBusinessChat";
import { useNavigate } from "react-router";


function MenuOptions({setMenuOptions, menuOptions}) {

    const menuOptionRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        function handleOutsideClick(e) {
            if (menuOptionRef.current && !menuOptionRef.current.contains(e.target)) {
                setMenuOptions(false)
            }   
        }

        document.addEventListener('mousedown', handleOutsideClick)

        return  () => document.removeEventListener('mousedown', handleOutsideClick)
    }, [])

    const {blockUser} = useBusinessChat();

  return (
    <div ref={menuOptionRef} className='absolute -bottom-11 min-w-[150px] py-1 right-0 bg-white border border-gray-200 shadow-lg'>
        <button className="px-2 p-1 hover:bg-gray-200 w-full text-start rounded cursor-pointer transition-all duration-200" onClick={() => blockUser(menuOptions, navigate)}>Block</button>
    </div>
  )
}

export default MenuOptions