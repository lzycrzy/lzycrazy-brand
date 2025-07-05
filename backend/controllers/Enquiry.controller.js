// import Enquiry from '../models/Enquiry.js';

// export const createEnquiry = async (req, res) => {
//   try {
//     const { name, email, phone, message, service, serviceTitle } = req.body;

//     if (!name || !message || !service || !serviceTitle) {
//       return res.status(400).json({ message: 'Missing required fields' });
//     }

//     const enquiry = new Enquiry({
//       name,
//       email,
//       phone,
//       message,
//       service,
//       serviceTitle
//     });

//     await enquiry.save();

//     res.status(201).json({ message: 'Enquiry submitted successfully' });
//   } catch (error) {
//     console.error('Error creating enquiry:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };



// export const getAllEnquiries = async (req, res) => {
//   try {
//     const enquiries = await Enquiry.find()
//       .sort({ createdAt: -1 }) // Optional: show newest first
//       .populate('service', 'title') // Optional: if `service` is a ref and you want to show title
//       .lean();

//     res.status(200).json(enquiries);
//   } catch (error) {
//     console.error('Error fetching enquiries:', error);
//     res.status(500).json({ message: 'Server error while fetching enquiries' });
//   }
// };




import Enquiry from '../models/Enquiry.js';

// CREATE new enquiry
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
      serviceTitle,
      status: 'Pending' // default status
    });

    await enquiry.save();

    res.status(201).json({ message: 'Enquiry submitted successfully' });
  } catch (error) {
    console.error('Error creating enquiry:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET all enquiries (admin)
export const getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find()
      .sort({ createdAt: -1 })
      .populate('service', 'title') // if needed
      .lean();

    res.status(200).json(enquiries);
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    res.status(500).json({ message: 'Server error while fetching enquiries' });
  }
};

// UPDATE enquiry status
export const updateEnquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!['Pending', 'Responded', 'Not Interested', 'Follow Up'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const updated = await Enquiry.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Enquiry not found' });
    }

    res.status(200).json({ message: 'Status updated', enquiry: updated });
  } catch (error) {
    console.error('Error updating enquiry status:', error);
    res.status(500).json({ message: 'Server error while updating status' });
  }
};

// DELETE enquiry
export const deleteEnquiry = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Enquiry.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Enquiry not found' });
    }

    res.status(200).json({ message: 'Enquiry deleted successfully' });
  } catch (error) {
    console.error('Error deleting enquiry:', error);
    res.status(500).json({ message: 'Server error while deleting enquiry' });
  }
};
