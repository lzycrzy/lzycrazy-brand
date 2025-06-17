import Enquiry from '../models/Enquiry.js';

export const createEnquiry = async (req, res) => {
  try {
    const { name, email, phone, message, service, serviceTitle } = req.body;

    if (!name || !message || !service || !serviceTitle) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const enquiry = new Enquiry({
      name,
      email,
      phone,
      message,
      service,
      serviceTitle
    });

    await enquiry.save();

    res.status(201).json({ message: 'Enquiry submitted successfully' });
  } catch (error) {
    console.error('Error creating enquiry:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
