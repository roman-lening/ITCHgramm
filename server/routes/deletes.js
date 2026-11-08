import express from "express";
import bcrypt from "bcrypt";
import User from "../modules/User.js";
import Post from "../modules/Post.js";
import Like from "../modules/Like.js";
import mongoose from "mongoose";
import authMiddleware from "../middleware/authMiddleware.js";
import { uploadPost, uploadAvatar } from "../middleware/upload.js";
import { handleUpload } from "../middleware/handleUpload.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinaryMedia.js";

const IMAGE_LIMIT = 2 * 1024 * 1024;
const validatePostFiles = (files) => {
  const image = files?.image?.[0];
  const video = files?.video?.[0];
  if (image) {
    if (!image.mimetype.startsWith("image/")) {
      return "Invalid image format";
    }
    if (image.size > IMAGE_LIMIT) {
      return "Image must not exceed 2 MB";
    }
  }
  if (video && !video.mimetype.startsWith("video/")) {
    return "Invalid video format";
  }
  return null;
};
const removeMedia = async (items) => {
  const results = await Promise.allSettled(
    items
      .filter((item) => item?.publicId)
      .map((item) => deleteFromCloudinary(item.publicId, item.resourceType)),
  );
  for (const result of results) {
    if (result.status === "rejected") {
      console.error("Cloudinary cleanup failed:", result.reason);
    }
  }
};
const postMedia = (post) => [
  { publicId: post.imagePublicId, resourceType: "image" },
  { publicId: post.videoPublicId, resourceType: "video" },
];

const router = express.Router();

router.delete("/users/:username/follow", authMiddleware, async (req, res) => {
  try {
    const { username } = req.params;
    const targetUser = await User.findOne({
      username: username.toLowerCase(),
    });
    if (!targetUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    if (targetUser._id.equals(req.userId)) {
      return res.status(400).json({
        message: "You cannot unfollow yourself",
      });
    }
    let userExists = false;
    await mongoose.connection.transaction(async (session) => {
      const currentUser = await User.findByIdAndUpdate(
        req.userId,
        {
          $pull: { following: targetUser._id },
        },
        { session },
      );
      if (!currentUser) {
        return;
      }
      userExists = true;
      await User.findByIdAndUpdate(
        targetUser._id,
        {
          $pull: { followers: req.userId },
        },
        { session },
      );
    });
    if (!userExists) {
      return res.status(404).json({
        message: "Current user not found",
      });
    }
    return res.status(200).json({
      message: "Successfully unfollowed user",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.delete("/profile", authMiddleware, async (req, res) => {
  try {
    const { password } = req.body ?? {};
    if (typeof password !== "string" || !password) {
      return res.status(400).json({
        message: "Password is required",
      });
    }
    const user = await User.findById(req.userId).select("+password");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }
    const mediaToDelete = await mongoose.connection.transaction(
      async (session) => {
        const posts = await Post.find({ author: user._id })
          .select("_id imagePublicId videoPublicId")
          .session(session);
        const media = [
          { publicId: user.avatarPublicId, resourceType: "image" },
          ...posts.flatMap(postMedia),
        ];
        const postIds = posts.map((post) => post._id);
        await Like.deleteMany(
          {
            $or: [
              { author: user._id },
              { post: { $in: postIds } },
            ],
          },
          { session },
        );
        await Post.deleteMany({ author: user._id }, { session });
        await User.updateMany(
          { followers: user._id },
          { $pull: { followers: user._id } },
          { session },
        );
        await User.updateMany(
          { following: user._id },
          { $pull: { following: user._id } },
          { session },
        );
        const deletedUser = await User.findByIdAndDelete(
          user._id,
          { session },
        );
        if (!deletedUser) {
          throw new Error("USER_NOT_FOUND");
        }
        return media;
      },
    );
    await removeMedia(mediaToDelete);
    return res.status(200).json({
      message: "Account permanently deleted",
    });
  } catch (error) {
    if (error.message === "USER_NOT_FOUND") {
      return res.status(404).json({
        message: "User not found",
      });
    }
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.delete("/posts/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isObjectIdOrHexString(id)) {
      return res.status(400).json({
        message: "Invalid post ID",
      });
    }
    let deletedPost;
    await mongoose.connection.transaction(async (session) => {
      deletedPost = await Post.findOneAndDelete(
        {
          _id: id,
          author: req.userId,
        },
        { session },
      );
      if (!deletedPost) {
        return;
      }
      await Like.deleteMany({ post: id }, { session });
    });
    if (!deletedPost) {
      return res.status(404).json({
        message: "Post not found",
      });
    }
    await removeMedia(postMedia(deletedPost));
    return res.status(200).json({
      message: "Post successfully deleted",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.delete("/posts/:id/like", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isObjectIdOrHexString(id)) {
      return res.status(400).json({
        message: "Invalid post ID",
      });
    }
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }
    const like = await Like.findOneAndDelete({
      post: id,
      author: req.userId,
    });
    if (!like) {
      return res.status(404).json({
        message: "Like not found",
      });
    }
    return res.status(200).json({
      message: "Like successfully removed",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

export default router;
