import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema({
  date: {
    type: String, // format: DDMMYYYY
    required: true,
    unique: true,
  },
  count: {
    type: Number,
    default: 0,
  },
});

export const Counter = mongoose.model('Counter', counterSchema);
