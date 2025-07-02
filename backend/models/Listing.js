import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: String, required: true },
  description: { type: String },

  // Link to category and subcategory
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  subcategory: {
    type: String, // name of the subcategory (embedded in category)
    required: true
  },

  response: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  reported: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  features: {
    type: mongoose.Schema.Types.Mixed, // Dynamic fields
    default: {}
  },



  postedBy: {
    name: String,
    memberSince: String,
  },

  location: {
    area: String,
    coordinates: {
      latitude: String,
      longitude: String
    }
  },

  isExpired: {
    type: Boolean,
  },
  expiryDate: {
    type: Date,
    required: true,
  },

  images: [String],
    views: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      viewedAt: {
        type: Date,
        default: Date.now,
      }
  }],

  createdAt: { type: Date, default: Date.now }
});
const ListModel=mongoose.model('Listing', listingSchema);
export default ListModel
