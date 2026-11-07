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
      (image !== undefined &&
        (typeof image !== "string" || !image.trim())) ||
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
      }
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
    if (
      error.name === "ValidationError" ||
      error.name === "CastError"
    ) {
      return res.status(400).json({
        message: "Invalid post data",
      });
    }
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

export default router;

