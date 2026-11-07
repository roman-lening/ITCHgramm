import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    author: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    post: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  },
  {
    timestamps: true,
  },
);

likeSchema.index({ author: 1, post: 1 }, { unique: true });

const Like = mongoose.model("Like", likeSchema);

export default Like;
