import { toast } from 'react-toastify';
import instance from '../lib/axios/axiosInstance';

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;

    script.onload = () => {
      resolve(true);
    };

    script.onerror = () => {
      reject(true);
    };

    document.body.appendChild(script);
  });
}

export const initiatePayment = async (
  fullName,
  email,
  data,
  navigate,
  setIsAddProductModal,
) => {
  const toastId = toast.loading('Loading...');

  try {
    // load the script of checkout page

    const res = await loadScript(
      'https://checkout.razorpay.com/v1/checkout.js',
    );

    if (!res) {
      toast.error('Razorpay SDK failed to load');
      return;
    }

    // initiate the order
    const orderResponse = await instance.post('/v1/payment/capture');

    if (!orderResponse.data.success) {
      throw new Error(orderResponse?.data.message);
    }

    // create options object for modal
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      currency: orderResponse?.data.data.currency,
      amount: orderResponse?.data.data.amount,
      order_id: orderResponse?.data.data.id,
      name: 'LzyCrazy',
      description: 'Thank you for listing the product',
      prefill: {
        name: `${fullName}`,
        email: email,
      },
      handler: function (response) {
        verifyPayment({ ...response });
        console.log(response);
        createListing(data, navigate, setIsAddProductModal);
      },
    };

    const paymentObject = new Razorpay(options);
    paymentObject.open();

    paymentObject.on('payment.failed', function (response) {
      toast.error('oops!, payment failed');
      console.log(error);
    });

    console.log('Modal opened');
  } catch (error) {
    console.log('PAYMENT API ERROR.....', error);
    if (!error.response?.data.allowed) {
      toast.error("You can't do this action.");
    }
  }

  toast.dismiss(toastId);
};

export async function createListing(formData, navigate, setIsAddProductModal) {
  const toastId = toast.loading('product listing in progress');

  async function uploadImageToCloudinary(imageFiles) {
  const photos = [];

  for (const file of imageFiles) {
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    let attempts = 0;
    let uploaded = false;

    while (attempts < 3 && !uploaded) { 
      try {
        const response = await instance.post('/v1/image/upload', uploadFormData);
        const result = response.data;

        if (result.success && result.url) {
          photos.push(result.url);
          uploaded = true;
        } else {
          console.error(`Upload failed [Attempt ${attempts + 1}]:`, result.message || 'Unknown error');
        }
      } catch (err) {
        console.error(`Upload error [Attempt ${attempts + 1}]:`, err.message || err);
      }

      if (!uploaded) {
        attempts++;
        if (attempts < 3) {
          toast.warning('Failed to upload image - Retrying...')
          console.log(`🔁 Retrying upload for ${file.name} (Attempt ${attempts + 1}/3)...`);
          await new Promise((res) => setTimeout(res, 1000 * attempts));
        }
      }
    }

    if (!uploaded) {
      console.warn(`Failed to upload file after 3 attempts: ${file.name}`);
      toast.error('Product Not listed-You will get your payment back.');
      return;
    }
  }

  return photos;
}


  let photoUrls = [];
  if (formData.getAll('file').length > 0) {
    photoUrls = await uploadImageToCloudinary(formData.getAll('file'));
  }

  let featureUrls = [];
  if (formData.get('featureFile')) {
    featureUrls = await uploadImageToCloudinary([formData.get('featureFile')]);
  }

  const payload = {};
  for (const [key, value] of formData.entries()) {
    if (value instanceof File) continue;

    if (key === 'features') {
      const featuresObj = JSON.parse(value);
      if (featureUrls.length > 0) {
        featuresObj.image = featureUrls[0];
      }
      payload[key] = JSON.stringify(featuresObj);
    } else {
      payload[key] = value;
    }
  }

  if (photoUrls.length > 0) {
    payload.photos = JSON.stringify(photoUrls);
  }

  try {
    const res = await instance.post('/v1/listing/create', payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.data?.success) {
      toast.success('product successfully listed.');
      localStorage.setItem('user', JSON.stringify(res.data?.user));
      setIsAddProductModal(false);
      navigate('/ads');
    } else {
      console.error('Listing creation failed:', res.data.message);
    }
  } catch (err) {
    console.error('Listing failed:', err);
  }
  toast.dismiss(toastId);
}

export async function updateListing(formData, navigate, setIsAddProductModal) {
  const toastId = toast.loading('listing update in progress');

  async function uploadImageToCloudinary(imageFiles) {
    const photos = [];
    const validFiles = imageFiles.filter(
      (file) => file instanceof File && file !== undefined,
    );

    for (const file of validFiles) {
      console.log('Uploading file:', file.name, file.size);

      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      let attempt = 0;
      const maxAttempts = 2;

      while (attempt < maxAttempts) {
        try {
          const response = await instance.post(
            '/v1/image/upload',
            uploadFormData,
          );
          const result = response.data;

          if (result.success && result.url) {
            photos.push(result.url);
            break;
          } else {
            console.warn(`Attempt ${attempt + 1} failed:`, result.message);
          }
        } catch (err) {
          console.error(`Attempt ${attempt + 1} error:`, err.message || err);
        }

        attempt++;
      }
    }

    return photos;
  }

  //upload images to cloudinary
  let photoUrls = [];
  if (formData.getAll('file').length > 0) {
    photoUrls = await uploadImageToCloudinary(formData.getAll('file'));
  }

  // upload features photo if any
  let featureUrls = [];
  if (formData.get('featureFile')) {
    featureUrls = await uploadImageToCloudinary([formData.get('featureFile')]);
  }

  const payload = {};

  for (const [key, value] of formData.entries()) {
    if (value === undefined || value === null || value instanceof File) {
      continue;
    }

    if (key === 'features') {
      try {
        const featuresObj = JSON.parse(value);

        if (featureUrls?.length > 0) {
          featuresObj.image = featureUrls[0];
        }

        payload[key] = JSON.stringify(featuresObj);
      } catch (err) {
        console.warn(`Failed to parse features JSON:`, value);
        payload[key] = '{}';
      }
    } else {
      payload[key] = value;
    }
  }

  // Handle photoUrls if available
  if (photoUrls?.length > 0) {
    payload.photos = JSON.stringify(photoUrls);
  }

  try {
    const res = await instance.put('/v1/listing/update', payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.data?.success) {
      toast.success('product successfully updated.');
      setIsAddProductModal(false);
      navigate('/ads');
    } else {
      console.error('Listing updation failed:', res.data.message);
    }
  } catch (err) {
    console.error('update failed:', err);
  }

  toast.dismiss(toastId);
}

export const initiatePaymentForRenew = async (
  fullName,
  email,
  data,
  navigate,
  setRenewListing,
) => {
  const toastId = toast.loading('Loading...');

  try {
    // load the script of checkout page

    const res = await loadScript(
      'https://checkout.razorpay.com/v1/checkout.js',
    );

    if (!res) {
      toast.error('Razorpay SDK failed to load');
      return;
    }

    // initiate the order
    const orderResponse = await instance.post('/v1/payment/capture', data);

    if (!orderResponse.data.success) {
      throw new Error(orderResponse?.data.message);
    }
    // create options object for modal
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      currency: orderResponse?.data.data.currency,
      amount: orderResponse?.data.data.amount,
      order_id: orderResponse?.data.data.id,
      name: 'LzyCrazy',
      description: 'Thank you for listing the product',
      prefill: {
        name: `${fullName}`,
        email: email,
      },
      handler: function (response) {
        verifyPayment({ ...response });
        console.log(response);
        renewListing(data, navigate, setRenewListing);
      },
    };

    const paymentObject = new Razorpay(options);
    paymentObject.open();

    paymentObject.on('payment.failed', function (response) {
      toast.error('oops!, payment failed');
      console.log(error);
    });

    console.log('Modal opened');
  } catch (error) {
    console.log('PAYMENT API ERROR.....', error);
    if (!error.response?.data.allowed) {
      toast.error("You can't do this action.");
    }
  }

  toast.dismiss(toastId);
};

export const renewListing = async (data, navigate, setRenewListing) => {
  const toastId = toast.loading('listing extending...');
  try {
    const res = await instance.put(`/v1/listing/renew/${data.id}`, data);

    if (res?.data.success) {
      toast.success('listing extended...');
      setTimeout(() => {
        setRenewListing(null);
        navigate('/ads');
      }, [2000]);
    }
  } catch (error) {
    console.log(error);
    toast.error('listing not extended!');
  }

  toast.dismiss(toastId);
};

async function verifyPayment(bodyData) {
  const toastId = toast.loading('Verifying payment...');

  try {
    const response = await instance.post('/v1/payment/verify', bodyData);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success('Payment verification success');
    console.log('Payment verified', response.data);
  } catch (error) {
    console.log('PAYMENT VERIFY ERROR....', error);
    toast.error('Payment verification Failed');
  }

  toast.dismiss(toastId);
}
