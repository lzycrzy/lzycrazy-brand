
import { useNavigate } from 'react-router';
import { initiatePayment } from '../../services/Payment'
import { useProduct } from '../../store/useProduct';

function PaymentModal({data, setPaymentModal, }) {

    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();
    const {setIsAddProductModal} = useProduct();

    function makePayment(data) {
        initiatePayment(user.fullName, user.email, data, navigate, setIsAddProductModal);
        setPaymentModal(null);
    }

  return (
    <div style={{backgroundColor: 'rgb(0,0,0,.3)'}} className='fixed inset-0 flex justify-center items-center z-99'>
        <div className='bg-white shadow-lg p-5 min-w-[200px] md:min-w-[300px] rounded flex flex-col gap-5'>
            <span>You have reach your free Trial</span>
            <span className='text-xs md:text-[14px]'>You will need to make payment for this listing</span>
            <div className='flex justify-end gap-2'>
                <button onClick={() => setPaymentModal(null)} className='cursor-pointer p-1 px-2 bg-gray-200 text-black  rounded'>Cancel</button>
                <button onClick={() => makePayment(data)} className='cursor-pointer p-1 px-2 bg-blue-500  text-white rounded'>Proceed to Payment</button>
            </div>
        </div>
    </div>
  )
}

export default PaymentModal