// models/Story.js
import mongoose from 'mongoose';

const storySchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hrs
    },
  });
  

storySchema.pre('save', function (next) {
  this.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24hr expiry
  next();
});

export const Story = mongoose.model('Story', storySchema);
