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

  features: {
    type: mongoose.Schema.Types.Mixed, // Dynamic fields
    default: {}
  },



  postedBy: {
    name: String,
    memberSince: String,
    itemsListed: Number
  },

  location: {
    area: String,
    coordinates: {
      type: [Number], // [lat, lng]
      validate: {
        validator: (v) => Array.isArray(v) && v.length === 2,
        message: 'Coordinates must be [lat, lng]'
      }
    }
  },

  images: [String],

  createdAt: { type: Date, default: Date.now }
});
const ListModel=mongoose.model('Listing', listingSchema);
export default ListModel
