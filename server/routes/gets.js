import express from "express";
import User from "../modules/User.js";
import Post from "../modules/Post.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const posts = await Post.find({
      author: user._id,
    }).sort({ createdAt: -1 });
    const postsCount = await Post.countDocuments({
      author: user._id,
    });
    return res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        fullname: user.fullname,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        postsCount,
        followersCount: user.followers.length,
        followingCount: user.following.length,
      },
      posts,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.get("/profile/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({
      username: username.toLowerCase(),
    }).select("username fullname bio avatarUrl followers following");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const posts = await Post.find({
      author: user._id,
    }).sort({ createdAt: -1 });
    const postsCount = await Post.countDocuments({
      author: user._id,
    });
    return res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        fullname: user.fullname,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        postsCount,
        followersCount: user.followers.length,
        followingCount: user.following.length,
      },
      posts,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

export default router;
