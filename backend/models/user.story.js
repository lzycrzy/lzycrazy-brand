// // models/Story.js
// import mongoose from 'mongoose';

// const viewSchema = new mongoose.Schema({
//     user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//     viewedAt: { type: Date, default: Date.now },
//   });

// const storySchema = new mongoose.Schema({
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     image: {
//       type: String,
//       required: true,
//     },
//     createdAt: {
//       type: Date,
//       default: Date.now,
//     },
//     expiresAt: {
//       type: Date,
//       default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hrs
//     },
//     views: [viewSchema],
//   });
  

// storySchema.pre('save', function (next) {
//   this.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24hr expiry
//   next();
// });


// export const Story = mongoose.model('Story', storySchema);
// export const View = mongoose.model('View', viewSchema);



import mongoose from 'mongoose';

const viewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  viewedAt: { type: Date, default: Date.now },
});

const storySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // Photo URL (if type is photo)
  image: {
    type: String,
  },
  // Video URL (if type is video)
  video: {
    type: String,
  },
  // Text story fields (if type is text)
  text: {
    content: { type: String },
    backgroundColor: { type: String, default: '#ffffff' },
    fontStyle: { type: String, default: 'sans-serif' },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hrs from creation
  },
  views: [viewSchema],
});

// Middleware to reset expiry on save (optional)
storySchema.pre('save', function (next) {
  this.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  next();
});

export const Story = mongoose.model('Story', storySchema);
export const View = mongoose.model('View', viewSchema);
