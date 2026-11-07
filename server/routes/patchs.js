import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../modules/User.js";
import mongoose from "mongoose";
import authMiddleware from "../middleware/authMiddleware.js";
import Post from "../modules/Post.js";

const router = express.Router();

router.patch("/posts/:id", authMiddleware, async (req, res) => {
  try {
    const { image, description } = req.body ?? {};
    if (
      (image !== undefined && (typeof image !== "string" || !image.trim())) ||
      (description !== undefined &&
        (typeof description !== "string" || !description.trim()))
    ) {
      return res.status(400).json({
        message: "Invalid image or description",
      });
    }
    if (image === undefined && description === undefined) {
      return res.status(400).json({
        message: "No data provided",
      });
    }
    const updates = {};
    if (image !== undefined) {
      updates.image = image.trim();
    }
    if (description !== undefined) {
      updates.description = description.trim();
    }
    const post = await Post.findOneAndUpdate(
      {
        _id: req.params.id,
        author: req.userId,
      },
      {
        $set: updates,
      },
      {
        new: true,
        runValidators: true,
      },
    );
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }
    return res.status(200).json({
      message: "Post successfully updated",
      post,
    });
  } catch (error) {
    console.error(error);
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid post data",
      });
    }
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});


router.patch("/profile", authMiddleware, async (req, res) => {
  try {
    const { avatarUrl, username, bio } = req.body ?? {};
    if (
      (avatarUrl !== undefined && typeof avatarUrl !== "string") ||
      (bio !== undefined && typeof bio !== "string") ||
      (username !== undefined &&
        (typeof username !== "string" || !username.trim()))
    ) {
      return res.status(400).json({
        message: "Invalid profile data",
      });
    }
    if (
      avatarUrl === undefined &&
      bio === undefined &&
      username === undefined
    ) {
      return res.status(400).json({
        message: "No data provided",
      });
    }
    const updates = {};
    if (avatarUrl !== undefined) {
      updates.avatarUrl = avatarUrl.trim();
    }
    if (bio !== undefined) {
      updates.bio = bio.trim();
    }
    if (username !== undefined) {
      updates.username = username.trim().toLowerCase();
    }
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: updates },
      {
        new: true,
        runValidators: true,
      }
    ).select("username fullname bio avatarUrl");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    return res.status(200).json({
      message: "Profile successfully updated",
      user,
    });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Username already exists",
      });
    }
    if (
      error.name === "ValidationError" ||
      error.name === "CastError"
    ) {
      return res.status(400).json({
        message: "Invalid profile data",
      });
    }
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});


export default router;
