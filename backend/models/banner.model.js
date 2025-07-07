import mongoose from 'mongoose';

const marketPostSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  position: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['video', 'image'],
    required: true,
  },
  postUrl: {
    type: String,
    required: function() {
      return this.isNew
    },
    trim: true,
  },
  thumbnail: {
    type: String,
    default: '',
    trim: true,
  },
  url: {
    type: String,
    required: true,
    trim: true,
  },
  postDate: {
    type: Date,
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model("Banner", marketPostSchema);
