import mongoose from 'mongoose';

const userAboutSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bio: { type: String, default: '', maxlength: 500 },
  email: { 
    type: String, 
    default: '', 
    maxlength: 100,
    match: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, // simple email regex 
  },
  phone: { type: String, default: '', maxlength: 15 },
  gender: { 
    type: String, 
    default: '', 
    enum: ['', 'Male', 'Female', 'Other'],
  },
  country: { type: String, default: '', maxlength: 100 },
  relationshipStatus: { 
    type: String, 
    default: '', 
    enum: ['', 'Single', 'Married', 'In a relationship', 'Divorced', 'Widowed'],
  },
  website: { type: String, default: '', maxlength: 200 },
  bloodGroup: { 
    type: String, 
    default: '', 
    enum: ['', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  },
  hobbies: { type: String, default: '', maxlength: 300 },
  location: { type: String, default: '', maxlength: 200 },
  dateOfBirth: { type: Date, default: null },
  profession: { type: String, default: '', maxlength: 100 },
});

const UserAbout = mongoose.model('UserAbout', userAboutSchema);

export default UserAbout;
