import { toast } from "react-toastify";
import instance from "../lib/axios/axiosInstance";

function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;

        script.onload = () => {
            resolve(true);
        }

        script.onerror = () => {
            reject(true)
        }

        document.body.appendChild(script);
    })
}


export const initiatePayment = async (fullName, email) => {
    const toastId = toast.loading("Loading...");

    try {
        // load the script of checkout page

        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js")

        if (!res) {
            toast.error("Razorpay SDK failed to load")
            return;
        }

        // initiate the order
        const orderResponse = await instance.post('/v1/payment/capture')

        if (!orderResponse.data.success) {
            throw new Error(orderResponse?.data.message)
        }

        // console.log("Order Response : ", orderResponse);

        // create options object for modal
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY,
            currency: orderResponse?.data.data.currency,
            amount: orderResponse?.data.data.amount,
            order_id: orderResponse?.data.data.id,
            name: "LzyCrazy",
            description: "Thank you for listing the product",
            prefill: {
                name: `${fullName}`,
                email: email,
            },
            handler: function (response) {
                // send successfull mail
                // sendPaymentSuccessEmail(response, orderResponse.data.data.amount, token);
                // verify payment
                verifyPayment({...response, courses}, token, navigate, dispatch)

                console.log(response)
            }
        }

        console.log("Modal options: ", options)

        const paymentObject = new Razorpay(options);
        paymentObject.open();

        paymentObject.on("payment.failed", function(response) {
            toast.error("oops!, payment failed")
            console.log(error);
        })

        console.log("Modal opened")

    } catch (error) {
        console.log("PAYMENT API ERROR.....", error);
        // toast.error("Could not make payment");
        if (!error.response?.data.allowed) {
            toast.error("You can't do this action.");
        }
    }

    toast.dismiss(toastId);
}