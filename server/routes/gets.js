import express from "express";
import User from "../modules/User.js";
import Post from "../modules/Post.js";
import authMiddleware from "../middleware/authMiddleware.js";
import mongoose from "mongoose";
import Like from "../modules/Like.js";
import { sendEmail } from "../utils/sendEmail.js";

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

router.get("/posts/feed", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("following");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const posts = await Post.find({
      author: { $in: user.following },
    })
      .populate("author", "username avatarUrl")
      .sort({ createdAt: -1 });
    const postsWithLikes = await Promise.all(
      posts.map(async (post) => {
        const likesCount = await Like.countDocuments({
          post: post._id,
        });
        return {
          ...post.toObject(),
          likesCount,
        };
      }),
    );
    return res.status(200).json(postsWithLikes);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.get("/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isObjectIdOrHexString(id)) {
      return res.status(400).json({
        message: "Invalid post ID",
      });
    }
    const post = await Post.findById(id).populate(
      "author",
      "username fullname avatarUrl",
    );
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }
    const likesCount = await Like.countDocuments({
      post: id,
    });
    return res.status(200).json({
      post: {
        ...post.toObject(),
        likesCount,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.get("/followers/:id", async (req, res) => {
  try {
    const { id } = req.params ?? {};
    if (!mongoose.isObjectIdOrHexString(id)) {
      return res.status(400).json({
        message: "Invalid post UserID",
      });
    }
    const user = await User.findById(id).populate(
      "followers",
      "username avatarUrl",
    );
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    return res.status(200).json(user.followers);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.get("/following/:id", async (req, res) => {
  try {
    const { id } = req.params ?? {};
    if (!mongoose.isObjectIdOrHexString(id)) {
      return res.status(400).json({
        message: "Invalid post UserID",
      });
    }
    const user = await User.findById(id).populate(
      "following",
      "username avatarUrl",
    );
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    return res.status(200).json(user.following);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "username avatarUrl")
      .sort({ createdAt: -1 });
    const postsWithLikes = await Promise.all(
      posts.map(async (post) => {
        const likesCount = await Like.countDocuments({
          post: post._id,
        });
        return {
          ...post.toObject(),
          likesCount,
        };
      }),
    );
    return res.status(200).json(postsWithLikes);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.get("/posts/:id/likes", async (req, res) => {
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
    const likes = await Like.find({ post: id }).populate(
      "author",
      "username avatarUrl fullname",
    );
    const users = likes
      .filter((like) => like.author)
      .map((like) => like.author);
    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.get("/users/search", async (req, res) => {
  try {
    if (typeof req.query.q !== "string" || !req.query.q.trim()) {
      return res.status(400).json({
        message: "Search query is required",
      });
    }
    const query = req.query.q.trim();
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const users = await User.find({
      $or: [
        {
          username: {
            $regex: escapedQuery,
            $options: "i",
          },
        },
        {
          fullname: {
            $regex: escapedQuery,
            $options: "i",
          },
        },
      ],
    }).select("username fullname avatarUrl");
    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

export default router;
