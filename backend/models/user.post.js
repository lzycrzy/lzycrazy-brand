import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now },
});

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    text: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    mediaUrls: {
      type: [String],
      default: [],
    },

    mediaTypes: {
      type: [String],
      enum: ["image", "video"],
      default: [],
      validate: {
        validator: function (val) {
          return this.mediaUrls.length === val.length;
        },
        message: "mediaUrls and mediaTypes must be the same length",
      },
    },

    likes: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        likedAt: { type: Date, default: Date.now },
      },
    ],

    comments: {
      type: [commentSchema],
      default: [],
    },

    shares: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },

    shareCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

postSchema.virtual("mediaCount").get(function () {
  return this.mediaUrls.length;
});

postSchema.index({ createdAt: -1 });
postSchema.index({ user: 1 });

export const Post = mongoose.model("Post", postSchema);
