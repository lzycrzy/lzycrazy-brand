import {razorpayInstance} from "../utils/razorpay.js";
import { createListing } from "./listing.controller.js";
import crypto from 'crypto'

export const capturePayment = async (req, res) => {

  const plan = Number(req.body.plan);

  let checkout = 0;

  if (isNaN(plan)) {
    checkout = 49 * 100;
  } else {
    switch (plan) {
      case 1:
        checkout = 1 * 49 * 100;
        break;
      case 3:
        checkout = 3 * 40 * 100;
        break;
      case 6:
        checkout = 6 * 30 * 100;
        break;
      case 12:
        checkout = 12 * 24 * 100;
        break;
      default:
        checkout = 49 * 100;
    }
  }
  const options = {
    amount: checkout,
    currency: 'INR',
    receipt: Math.random(Date.now()).toString(),
  };

  try {
    const paymentResponse = await razorpayInstance.orders.create(options);

    res.status(200).json({
      success: true,
      message: 'Payment done',
      data: paymentResponse,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Could not initiate order',
      error: error.message
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const razorpay_order_id = req.body?.razorpay_order_id;
    const razorpay_payment_id = req.body?.razorpay_payment_id;
    const razorpay_signature = req.body?.razorpay_signature;
    const userId = req.user._id;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !userId
    ) {
      return res.status(200).json({
        success: false,
        message: 'Payment Failed',
      });
    }

    let body = razorpay_order_id + '|' + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET)
      .update(body.toString())
      .digest('hex');
      if (expectedSignature === razorpay_signature) {
        return res.status(200).json({
          success: true,
          message: 'Payment verified',
        });
      }

    return res.status(200).json({
      success: false,
      message: 'Payment Failed',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Payment Verification Failed',
      error: error.message,
    });
  }
};