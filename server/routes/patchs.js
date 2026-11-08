import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../modules/User.js";
import mongoose from "mongoose";
import authMiddleware from "../middleware/authMiddleware.js";
import Post from "../modules/Post.js";
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

router.patch(
  "/posts/:id",
  authMiddleware,
  handleUpload(uploadPost),
  async (req, res) => {
    const uploaded = [];

    try {
      const { id } = req.params;
      const { description } = req.body ?? {};
      const image = req.files?.image?.[0];
      const video = req.files?.video?.[0];

      if (!mongoose.isObjectIdOrHexString(id)) {
        return res.status(400).json({
          message: "Invalid post ID",
        });
      }

      const fileError = validatePostFiles(req.files);

      if (fileError) {
        return res.status(400).json({ message: fileError });
      }

      if (
        description !== undefined &&
        (typeof description !== "string" ||
          !description.trim() ||
          description.trim().length > 400)
      ) {
        return res.status(400).json({
          message: "Invalid description",
        });
      }

      if (description === undefined && !image && !video) {
        return res.status(400).json({
          message: "No data provided",
        });
      }

      const post = await Post.findOne({
        _id: id,
        author: req.userId,
      });

      if (!post) {
        return res.status(404).json({
          message: "Post not found",
        });
      }

      const oldMedia = [];

      if (image) {
        const result = await uploadToCloudinary(image, "itchgramm/posts");

        uploaded.push(result);
        oldMedia.push({
          publicId: post.imagePublicId,
          resourceType: "image",
        });
        post.image = result.url;
        post.imagePublicId = result.publicId;
      }
      if (video) {
        const result = await uploadToCloudinary(video, "itchgramm/posts");
        uploaded.push(result);
        oldMedia.push({
          publicId: post.videoPublicId,
          resourceType: "video",
        });
        post.video = result.url;
        post.videoPublicId = result.publicId;
      }
      if (description !== undefined) {
        post.description = description.trim();
      }
      await post.save();
      await removeMedia(oldMedia);
      return res.status(200).json({
        message: "Post successfully updated",
        post,
      });
    } catch (error) {
      await removeMedia(uploaded);
      console.error(error);
      if (error.name === "ValidationError") {
        return res.status(400).json({
          message: "Invalid post data",
        });
      }
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  },
);

router.patch(
  "/profile",
  authMiddleware,
  handleUpload(uploadAvatar),
  async (req, res) => {
    let uploaded = null;
    let saved = false;

    try {
      const { username, bio } = req.body ?? {};
      const avatar = req.file;

      if (
        (username !== undefined &&
          (typeof username !== "string" || !username.trim())) ||
        (bio !== undefined && typeof bio !== "string")
      ) {
        return res.status(400).json({
          message: "Invalid profile data",
        });
      }

      if (username === undefined && bio === undefined && !avatar) {
        return res.status(400).json({
          message: "No data provided",
        });
      }

      const user = await User.findById(req.userId);

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const oldAvatarId = user.avatarPublicId;

      if (username !== undefined) {
        user.username = username.trim().toLowerCase();
      }

      if (bio !== undefined) {
        user.bio = bio.trim();
      }

      if (avatar) {
        uploaded = await uploadToCloudinary(avatar, "itchgramm/avatars");

        user.avatarUrl = uploaded.url;
        user.avatarPublicId = uploaded.publicId;
      }

      await user.save();
      saved = true;

      if (uploaded && oldAvatarId) {
        await removeMedia([{ publicId: oldAvatarId, resourceType: "image" }]);
      }

      return res.status(200).json({
        message: "Profile successfully updated",
        user: {
          id: user._id,
          username: user.username,
          fullname: user.fullname,
          bio: user.bio,
          avatarUrl: user.avatarUrl,
        },
      });
    } catch (error) {
      if (uploaded && !saved) {
        await removeMedia([uploaded]);
      }
      console.error(error);
      if (error.code === 11000) {
        return res.status(409).json({
          message: "Username already exists",
        });
      }
      if (error.name === "ValidationError" || error.name === "CastError") {
        return res.status(400).json({
          message: "Invalid profile data",
        });
      }
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  },
);

export default router;
