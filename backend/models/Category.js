import mongoose from 'mongoose';

const subcategorySchema = new mongoose.Schema(
  {
    imageData: {
      name: { type: String, required: true, trim: true },
      url: { type: String, required: true, trim: true },
    },
    name: { type: String, required: true, trim: true, maxlength: 100 },
   formStructure: [
      {
        label: { type: String, required: true },
        fieldName: { type: String, required: true },
        type: { type: String, enum: ['text', 'textarea', 'radio', 'checkbox', 'dropdown', 'file'], required: true },
        options: [String], 
        required: { type: Boolean, default: false },
      },
    ],
  },
  { _id: false },
);

const categorySchema = new mongoose.Schema(
  {
    imageData: {
      name: { type: String, required: true, trim: true },
      url: { type: String, required: true, trim: true },
    },
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 100,
    },
    subcategories: [subcategorySchema],
    isActive: { type: Boolean, default: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

categorySchema.index({ name: 1 });
categorySchema.index({ isActive: 1 });
categorySchema.index({ createdAt: -1 });

categorySchema.virtual('subcategoryCount').get(function () {
  return this.subcategories?.length || 0;
});
categorySchema.set('toJSON', { virtuals: true });
categorySchema.set('toObject', { virtuals: true });

const Category = mongoose.model('Category', categorySchema);
export default Category;
