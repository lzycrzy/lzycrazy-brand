import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema(
    {
      title: { type: String, required: true },
      profileName: { type: String, required: true },
      date: { type: String, required: true },
      video: {
        url: { type: String, required: true } // ✅ only url required
      },
      profileImage: {
        url: { type: String, required: true } // ✅ only url required
      }
    },
    { timestamps: true }
  );
const News = mongoose.model('News', newsSchema);
export default News