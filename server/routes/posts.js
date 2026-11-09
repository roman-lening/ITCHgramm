import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../modules/User.js";
import mongoose from "mongoose";
import Like from "../modules/Like.js";
import authMiddleware from "../middleware/authMiddleware.js";
import Post from "../modules/Post.js";
import { uploadPost, uploadAvatar } from "../middleware/upload.js";
import { handleUpload } from "../middleware/handleUpload.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinaryMedia.js";
import { sendEmail, sendWelcomeEmail } from "../utils/sendEmail.js";
import crypto from "node:crypto";
import {
  forgotPasswordLimiter,
  resetPasswordLimiter,
} from "../middleware/rateLimit.js";

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

router.post("/register", async (req, res) => {
  try {
    const { username, password, email, fullname } = req.body ?? {};
    if (
      [username, password, email, fullname].some(
        (value) => typeof value !== "string" || !value.trim(),
      )
    ) {
      return res.status(400).json({
        message: "All fields must be non-empty strings",
      });
    }
    const normalizedUsername = username.trim().toLowerCase();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedFullname = fullname.trim();
    if (normalizedUsername.length < 3 || normalizedUsername.length > 30) {
      return res.status(400).json({
        message: "Username must contain 3-30 characters",
      });
    }
    if (!/^[a-z0-9_.]+$/.test(normalizedUsername)) {
      return res.status(400).json({
        message:
          "Username can contain only letters, numbers, underscores and dots",
      });
    }
    if (password.length < 8 || Buffer.byteLength(password, "utf8") > 72) {
      return res.status(400).json({
        message:
          "Password must contain at least 8 characters and fit bcrypt's 72-byte limit",
      });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }
    const existingUser = await User.findOne({
      $or: [{ username: normalizedUsername }, { email: normalizedEmail }],
    });
    if (existingUser) {
      return res.status(409).json({
        message: "Username or email already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username: normalizedUsername,
      password: hashedPassword,
      email: normalizedEmail,
      fullname: normalizedFullname,
    });

    try {
      await sendWelcomeEmail(newUser.email, newUser.username);
    } catch (mailError) {
      console.error("Welcome email failed:", mailError);
    }
    return res.status(201).json({
      message: "User successfully registered",
      userId: newUser._id,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Username or email already exists",
      });
    }
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Invalid registration data",
      });
    }
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password, email } = req.body ?? {};
    if (
      typeof password !== "string" ||
      !password ||
      (typeof username !== "string" && typeof email !== "string")
    ) {
      return res.status(400).json({
        message: "Valid username/email and password are required",
      });
    }
    const login = (typeof email === "string" && email.trim() ? email : username)
      ?.trim()
      .toLowerCase();
    if (!login) {
      return res.status(400).json({
        message: "Username or email is required",
      });
    }
    const user = await User.findOne({
      $or: [{ username: login }, { email: login }],
    }).select("+password");
    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }
    const token = jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_SECRET,
      { algorithm: "HS256", expiresIn: "1h" },
    );
    return res.status(200).json({
      message: "Login successful",
      userId: user._id,
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.post("/users/:username/follow", authMiddleware, async (req, res) => {
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
        message: "You cannot follow yourself",
      });
    }
    await mongoose.connection.transaction(async (session) => {
      const currentUser = await User.findByIdAndUpdate(
        req.userId,
        {
          $addToSet: { following: targetUser._id },
        },
        { session },
      );
      if (!currentUser) {
        throw new Error("CURRENT_USER_NOT_FOUND");
      }
      const updatedTarget = await User.findByIdAndUpdate(
        targetUser._id,
        {
          $addToSet: { followers: req.userId },
        },
        { session },
      );
      if (!updatedTarget) {
        throw new Error("TARGET_USER_NOT_FOUND");
      }
    });
    return res.status(200).json({
      message: "Successfully followed user",
    });
  } catch (error) {
    if (error.message === "CURRENT_USER_NOT_FOUND") {
      return res.status(404).json({
        message: "Current user not found",
      });
    }
    if (error.message === "TARGET_USER_NOT_FOUND") {
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

router.post(
  "/profile/newpost",
  authMiddleware,
  handleUpload(uploadPost),
  async (req, res) => {
    const uploaded = [];
    try {
      const { description } = req.body ?? {};
      const image = req.files?.image?.[0];
      const video = req.files?.video?.[0];
      const fileError = validatePostFiles(req.files);
      if (fileError) {
        return res.status(400).json({ message: fileError });
      }
      if (
        typeof description !== "string" ||
        !description.trim() ||
        description.trim().length > 400 ||
        (!image && !video)
      ) {
        return res.status(400).json({
          message: "Valid description and image or video are required",
        });
      }
      const user = await User.exists({ _id: req.userId });
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }
      const media = {};
      if (image) {
        const result = await uploadToCloudinary(image, "itchgramm/posts");
        uploaded.push(result);
        media.image = result.url;
        media.imagePublicId = result.publicId;
      }
      if (video) {
        const result = await uploadToCloudinary(video, "itchgramm/posts");
        uploaded.push(result);
        media.video = result.url;
        media.videoPublicId = result.publicId;
      }
      const post = await Post.create({
        ...media,
        description: description.trim(),
        author: req.userId,
      });
      return res.status(201).json({
        message: "Post created successfully",
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

router.post("/posts/:id/like", authMiddleware, async (req, res) => {
  try {
    const userExists = await User.exists({ _id: req.userId });
    if (!userExists) {
      return res.status(401).json({
        message: "User no longer exists",
      });
    }
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
    const like = await Like.create({
      post: id,
      author: req.userId,
    });
    return res.status(201).json({
      message: "Post successfully liked",
      like,
    });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Post already liked",
      });
    }
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Invalid like data",
      });
    }
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.post("/forgot-password", forgotPasswordLimiter, async (req, res) => {
  try {
    const { email } = req.body ?? {};
    if (typeof email !== "string" || !email.trim()) {
      return res.status(400).json({
        message: "Valid email is required",
      });
    }
    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+resetPasswordCode +resetPasswordExpires");
    const successMessage = {
      message: "If the email exists, a reset code has been sent",
    };
    if (!user) {
      return res.status(200).json(successMessage);
    }
    const code = crypto.randomInt(100000, 1000000).toString();
    const hashedCode = await bcrypt.hash(code, 10);
    user.resetPasswordCode = hashedCode;
    user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    try {
      await sendEmail(
        user.email,
        "ITCHgram - Password Reset",
        `<p>Your password reset code is:</p>
         <h2>${code}</h2>
         <p>This code expires in 10 minutes.</p>`,
      );
    } catch (mailError) {
      console.error("Password reset email failed:", mailError);
      await User.updateOne(
        {
          _id: user._id,
          resetPasswordCode: hashedCode,
        },
        {
          $unset: {
            resetPasswordCode: "",
            resetPasswordExpires: "",
          },
        },
      );
    }
    return res.status(200).json(successMessage);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.post("/reset-password", resetPasswordLimiter, async (req, res) => {
  try {
    const { email, code, newPassword } = req.body ?? {};
    if (typeof email !== "string" || !email.trim()) {
      return res.status(400).json({
        message: "Valid email is required",
      });
    }
    if (typeof code !== "string" || !/^\d{6}$/.test(code)) {
      return res.status(400).json({
        message: "Valid 6-digit code is required",
      });
    }
    if (
      typeof newPassword !== "string" ||
      newPassword.length < 8 ||
      Buffer.byteLength(newPassword, "utf8") > 72
    ) {
      return res.status(400).json({
        message:
          "Password must contain at least 8 characters and fit bcrypt's 72-byte limit",
      });
    }
    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+password +resetPasswordCode +resetPasswordExpires");
    if (!user || !user.resetPasswordCode || !user.resetPasswordExpires) {
      return res.status(400).json({
        message: "Invalid or expired reset code",
      });
    }
    if (user.resetPasswordExpires <= new Date()) {
      return res.status(400).json({
        message: "Invalid or expired reset code",
      });
    }
    const isCodeValid = await bcrypt.compare(code, user.resetPasswordCode);
    if (!isCodeValid) {
      return res.status(400).json({
        message: "Invalid or expired reset code",
      });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const result = await User.updateOne(
      {
        _id: user._id,
        resetPasswordCode: user.resetPasswordCode,
        resetPasswordExpires: { $gt: new Date() },
      },
      {
        $set: {
          password: hashedPassword,
        },
        $unset: {
          resetPasswordCode: "",
          resetPasswordExpires: "",
        },
      },
    );
    if (result.modifiedCount === 0) {
      return res.status(400).json({
        message: "Invalid or expired reset code",
      });
    }
    return res.status(200).json({
      message: "Password successfully reset",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

export default router;
