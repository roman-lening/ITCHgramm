import express from "express";
import mongoose from "mongoose";
import User from "../modules/User.js";
import Post from "../modules/Post.js";
import Like from "../modules/Like.js";
import Comment from "../modules/Comment.js";
import authMiddleware from "../middleware/authMiddleware.js";
import optionalAuthMiddleware from "../middleware/optionalAuthMiddleware.js";
import { enrichCommentsWithLikes } from "../utils/enrichCommentsWithLikes.js";

const router = express.Router();

const enrichPostsWithStats = async (posts, userId = null) => {
  if (posts.length === 0) {
    return [];
  }

  const postIds = posts.map((post) => post._id);

  const viewerId = userId ? new mongoose.Types.ObjectId(userId) : null;

  const [likes, comments] = await Promise.all([
    Like.aggregate([
      {
        $match: {
          post: { $in: postIds },
        },
      },
      {
        $group: {
          _id: "$post",
          likesCount: { $sum: 1 },
          isLiked: {
            $max: {
              $eq: ["$author", viewerId],
            },
          },
        },
      },
    ]),
    Comment.aggregate([
      {
        $match: {
          post: { $in: postIds },
        },
      },
      {
        $group: {
          _id: "$post",
          commentsCount: { $sum: 1 },
        },
      },
    ]),
  ]);

  const likesMap = new Map(likes.map((item) => [item._id.toString(), item]));

  const commentsMap = new Map(
    comments.map((item) => [item._id.toString(), item.commentsCount]),
  );

  return posts.map((post) => {
    const postId = post._id.toString();
    const likeData = likesMap.get(postId);

    return {
      ...post.toObject(),
      likesCount: likeData?.likesCount ?? 0,
      isLiked: likeData?.isLiked ?? false,
      commentsCount: commentsMap.get(postId) ?? 0,
    };
  });
};

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

    const postsWithStats = await enrichPostsWithStats(posts, req.userId);

    return res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        fullname: user.fullname,
        bio: user.bio,
        website: user.website,
        avatarUrl: user.avatarUrl,
        postsCount,
        followersCount: user.followers.length,
        followingCount: user.following.length,
      },
      posts: postsWithStats,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.get("/profile/:username", optionalAuthMiddleware, async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({
      username: username.toLowerCase(),
    }).select("username fullname bio website avatarUrl followers following");

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

    const postsWithStats = await enrichPostsWithStats(posts, req.userId);

    return res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        fullname: user.fullname,
        bio: user.bio,
        website: user.website,
        avatarUrl: user.avatarUrl,
        postsCount,
        followersCount: user.followers.length,
        followingCount: user.following.length,
      },
      posts: postsWithStats,
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

    const postsWithStats = await enrichPostsWithStats(posts, req.userId);

    return res.status(200).json(postsWithStats);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.get("/posts/:id", optionalAuthMiddleware, async (req, res) => {
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

    const [postWithStats] = await enrichPostsWithStats([post], req.userId);

    return res.status(200).json({
      post: postWithStats,
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

router.get("/posts", optionalAuthMiddleware, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "username avatarUrl")
      .sort({ createdAt: -1 });

    const postsWithStats = await enrichPostsWithStats(posts, req.userId);

    return res.status(200).json(postsWithStats);
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

router.get("/posts/:id/comments", optionalAuthMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isObjectIdOrHexString(id)) {
      return res.status(400).json({
        message: "Invalid post ID",
      });
    }

    const post = await Post.exists({ _id: id });

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const comments = await Comment.find({ post: id })
      .populate("author", "username fullname avatarUrl")
      .sort({ createdAt: -1 });

    const commentsWithLikes = await enrichCommentsWithLikes(
      comments,
      req.userId,
    );

    return res.status(200).json(commentsWithLikes);
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
