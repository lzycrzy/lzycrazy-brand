// models/hiring.model.js
// import mongoose from 'mongoose';

// const hiringSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, 'Name is required'],
//     trim: true
//   },
//   country: {
//     type: String,
//     required: [true, 'Country is required'],
//     trim: true
//   },
//   state: {
//     type: String,
//     required: [true, 'State is required'],
//     trim: true
//   },
//   city: {
//     type: String,
//     required: [true, 'City is required'],
//     trim: true
//   },
//   education: {
//     type: String,
//     required: [true, 'Education is required'],
//     trim: true
//   },
//   experienceLevel: {
//     type: String,
//     required: [true, 'Experience level is required'],
//     enum: [
//                   'Dream Job',
//                   'Experience',
//                   'First Job',
//                   'Fresher',
//                   'Internship',
//                 ],
//     trim: true
//   },
//   jobCategory: {
//     type: String,
//     required: [true, 'Job category is required'],
//     trim: true
//   },
//   introduction: {
//     type: String,
//     required: [true, 'Introduction is required'],
//     trim: true,
//     validate: {
//       validator: function(v) {
//         const wordCount = v.split(' ').filter(word => word.length > 0).length;
//         return wordCount <= 50;
//       },
//       message: 'Introduction must not exceed 50 words'
//     }
//   },
//   videoUrl: {
//     type: String,
//     required: [true, 'Video is required'],
//     trim: true
//   },
//   videoPublicId: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   status: {
//     type: String,
//     enum: ['pending', 'reviewed', 'shortlisted', 'rejected'],
//     default: 'pending'
//   },
//   submittedAt: {
//     type: Date,
//     default: Date.now
//   }
// }, {
//   timestamps: true
// });

// // Add indexes for better query performance
// hiringSchema.index({ country: 1, state: 1, city: 1 });
// hiringSchema.index({ jobCategory: 1 });
// hiringSchema.index({ experienceLevel: 1 });
// hiringSchema.index({ status: 1 });
// hiringSchema.index({ submittedAt: -1 });

// // Virtual for getting submission age
// hiringSchema.virtual('submissionAge').get(function() {
//   return Math.floor((Date.now() - this.submittedAt) / (1000 * 60 * 60 * 24)); // Days
// });

// const Hiring = mongoose.model('Hiring', hiringSchema);

// export default Hiring;



// models/hiring.model.js
import mongoose from 'mongoose';

const hiringSchema = new mongoose.Schema({
  companyId: {
    type: String,
    required: [true, 'Company ID is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],    
  },  
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    trim: true
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },

  education: {
    type: String,
    required: [true, 'Education is required'],
    trim: true
  },

  experienceLevel: {
    type: String,
    required: [true, 'Experience level is required'],
    enum: [
                  'Dream Job',
                  'Experience',
                  'First Job',
                  'Fresher',
                  'Internship',
                ],
    trim: true
  },

  jobCategory: {
    type: String,
    required: [true, 'Job category is required'],
    trim: true
  },
  introduction: {
    type: String,
    required: [true, 'Introduction is required'],
    trim: true,
    validate: {
      validator: function(v) {
        const wordCount = v.split(' ').filter(word => word.length > 0).length;
        return wordCount <= 50;
      },
      message: 'Introduction must not exceed 50 words'
    }
  },
  videoUrl: {
    type: String,
    required: [true, 'Video is required'],
    trim: true
  },
  videoPublicId: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Reviewed', 'Shortlisted', 'Rejected'],
    default: 'Pending'
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
hiringSchema.index({ country: 1, state: 1, city: 1 });
hiringSchema.index({ jobCategory: 1 });
hiringSchema.index({ experienceLevel: 1 });
hiringSchema.index({ status: 1 });
hiringSchema.index({ submittedAt: -1 });

// Virtual for getting submission age
hiringSchema.virtual('submissionAge').get(function() {
  return Math.floor((Date.now() - this.submittedAt) / (1000 * 60 * 60 * 24)); // Days
});

const Hiring = mongoose.model('Hiring', hiringSchema);

export default Hiring;



