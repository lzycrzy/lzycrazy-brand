import mongoose from 'mongoose';

const applicantSchema = new mongoose.Schema({
  lycrazyId: String,
  country: String,
  state: String,
  city: String,
  phone: { type: String, required: true },
  email: { type: String, required: true },
  education: String,
  age: Number,
  height: Number,
  weight: Number,
  jobCategory: String,
  experience: String,
  about: String,
  videoUrl: String, // Path to uploaded video file
});

export default mongoose.model('Applicant', applicantSchema);
