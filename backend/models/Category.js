import mongoose from 'mongoose';

const subcategorySchema = new mongoose.Schema(
  {
    icon: {
      name: { type: String, required: true, trim: true },
      component: { type: String, required: true, trim: true },
    },
    name: { type: String, required: true, trim: true, maxlength: 100 },
  },
  { _id: false },
);

const categorySchema = new mongoose.Schema(
  {
    icon: {
      name: { type: String, required: true, trim: true },
      component: { type: String, required: true, trim: true },
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
