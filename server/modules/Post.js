import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    image: {
      type: String,
    },
    imagePublicId: {
      type: String,
    },
    video: {
      type: String,
    },
    videoPublicId: {
      type: String,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 400,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

postSchema.pre("validate", function () {
  if (!this.image && !this.video) {
    this.invalidate("image", "Image or video is required");
  }
});

const Post = mongoose.model("Post", postSchema);

export default Post;
