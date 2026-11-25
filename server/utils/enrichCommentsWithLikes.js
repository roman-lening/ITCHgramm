import mongoose from "mongoose";
import CommentLike from "../modules/CommentLike.js";

export const enrichCommentsWithLikes = async (comments, userId = null) => {
  if (!comments.length) {
    return [];
  }

  const commentIds = comments.map((comment) => comment._id);

  const viewerId = userId ? new mongoose.Types.ObjectId(userId) : null;

  const stats = await CommentLike.aggregate([
    {
      $match: {
        comment: { $in: commentIds },
      },
    },
    {
      $group: {
        _id: "$comment",
        likesCount: { $sum: 1 },
        isLiked: {
          $max: {
            $eq: ["$author", viewerId],
          },
        },
      },
    },
  ]);

  const statsMap = new Map(stats.map((item) => [item._id.toString(), item]));

  return comments.map((comment) => {
    const likeData = statsMap.get(comment._id.toString());

    return {
      ...comment.toObject(),
      likesCount: likeData?.likesCount ?? 0,
      isLiked: likeData?.isLiked ?? false,
    };
  });
};
