import Service from '../models/Service.js';

//  Get all services
export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Get a single service by ID
export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Create a new service
export const createService = async (req, res) => {
  console.log("call create Services");
  const { title, description, icon } = req.body;
  console.log(title, description, icon)

  if (!title || !description || !icon?.name || !icon?.component) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const newService = new Service({ title, description, icon });
    await newService.save();
    res.status(201).json(newService);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Update service
export const updateService = async (req, res) => {
  const { title, description, icon } = req.body;

  try {
    const updated = await Service.findByIdAndUpdate(
      req.params.id,
      { title, description, icon },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Service not found' });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Delete service
export const deleteService = async (req, res) => {
  try {
    const deleted = await Service.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Service not found' });
    res.status(200).json({ message: 'Service deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Toggle service status
export const toggleServiceStatus = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });

    service.active = !service.active;
    await service.save();

    res.status(200).json({ message: 'Service status updated', service });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Stats (example: total count)
export const getServiceStats = async (req, res) => {
  try {
    const total = await Service.countDocuments();
    const active = await Service.countDocuments({ active: true });
    const inactive = total - active;

    res.status(200).json({
      totalServices: total,
      activeServices: active,
      inactiveServices: inactive
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
