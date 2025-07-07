import mongoose from 'mongoose';

const assetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  url: {
    type: String,
    required: true,
  },
});

const Asset = mongoose.model('Asset', assetSchema);

export default Asset;   