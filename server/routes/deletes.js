import express from "express";
import bcrypt from "bcrypt";
import User from "../modules/User.js";
import Post from "../modules/Post.js";
import mongoose from "mongoose";
import authMiddleware from "../middleware/authMiddleware.js";

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
    await User.findByIdAndUpdate(req.userId, {
      $pull: { following: targetUser._id },
    });
    await User.findByIdAndUpdate(targetUser._id, {
      $pull: { followers: req.userId },
    });
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
    await mongoose.connection.transaction(async (session) => {
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
      await User.findByIdAndDelete(user._id, { session });
    });
    return res.status(200).json({
      message: "Account permanently deleted",
    });
  } catch (error) {
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
    const post = await Post.findOneAndDelete({
      _id: id,
      author: req.userId,
    });
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }
    return res.status(200).json({
      message: "Post successfully deleted",
      post,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});


export default router;
