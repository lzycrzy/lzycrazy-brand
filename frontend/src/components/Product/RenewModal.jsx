import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { initiatePaymentForRenew } from '../../services/Payment';
import { useProduct } from '../../store/useProduct';

function RenewModal() {

    const [plan, setPlan] = useState(1);
    const {renewListing, setRenewListing} = useProduct();
    console.log(renewListing);

    useEffect(() => {
        document.body.classList.add('no-scroll')

        return () => {
            document.body.classList.remove('no-scroll')
        }
    }, [])

    const user = localStorage.getItem('user')? JSON.parse(localStorage.getItem('user')) : null;
    const navigate = useNavigate();

    async function handleRenew() {
        if (!user) {
            toast.error('login required!');
            navigate('/');
        }

        const payload = {
            id: renewListing._id, 
            plan: plan
        }

        await initiatePaymentForRenew(user.fullName, user.email, payload, navigate, setRenewListing);
    }

  return (
    <div style={{backgroundColor: 'rgba(0,0,0,0.5)'}} className='fixed inset-0 h-screen w-screen z-100 flex justify-center items-center'>
        <div className='w-[700px] h-[300px] rounded bg-white flex items-center flex-col p-10 gap-5'>
            <h2 className='text-2xl'>Choose your plan</h2>

            <div className='flex gap-3'>
                <div onClick={() => setPlan(1)} className={`${plan === 1 ? 'bg-blue-100 font-bold' : ''} cursor-pointer p-5 rounded border-2 border-gray-400 shadow-lg flex flex-col gap-2 justify-center items-center`}>
                    <span>1</span>
                    <p>Month</p>
                </div>
                <div onClick={() => setPlan(3)} className={`${plan === 3 ? 'bg-blue-100 font-bold' : ''} cursor-pointer p-5 rounded border-2 border-gray-400 shadow-lg flex flex-col gap-2 justify-center items-center'`}>
                    <span>3</span>
                    <p>Months</p>
                </div>
                <div  onClick={() => setPlan(6)} className={`${plan === 6 ? 'bg-blue-100 font-bold' : ''} cursor-pointer p-5 rounded border-2 border-gray-400 shadow-lg flex flex-col gap-2 justify-center items-center`}>
                    <span>6</span>
                    <p>Months</p>
                </div>

                <div  onClick={() => setPlan(12)} className={`${plan === 12 ? 'bg-blue-100 font-bold' : ''} cursor-pointer p-5 rounded border-2 border-gray-400 shadow-lg flex flex-col gap-2 justify-center items-center`}>
                    <span>12</span>
                    <p>Months</p>
                </div>
            </div>
            
            <div className='flex gap-4 justify-end w-full h-full items-end'>
                <button className='bg-gray-200 text-black rounded px-4 p-1 cursor-pointer' onClick={() => setRenewListing(null)}>Cancel</button>
                <button onClick={handleRenew} className='bg-blue-600 text-white rounded px-4 p-1 cursor-pointer'>Pay</button>
            </div>

        </div>
    </div>
  )
}

export default RenewModal