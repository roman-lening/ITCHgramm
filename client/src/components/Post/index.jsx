import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { NavLink } from "react-router-dom";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import itchgram from "../../assets/itchgram.png";
import like from "../../assets/DrawerSvg/Light/Notification.svg";
import comment from "../../assets/Comment.svg";

import {
  getPostLikes,
  likePost,
  unlikePost,
} from "../../redux/slices/postsSlice.js";

import { followUser, unfollowUser } from "../../redux/slices/followSlice.js";

import { styles } from "./styles";

const formatPostTime = (date) => {
  if (!date) return "";

  const timestamp = new Date(date).getTime();
  if (Number.isNaN(timestamp)) return "";

  const difference = Math.max(0, Date.now() - timestamp);

  const minutes = Math.floor(difference / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;
  if (days < 30) return `${weeks}w`;
  if (days < 365) return `${months}mo`;

  return `${Math.floor(days / 365)}y`;
};

function Post({ post, onOpenComments }) {
  const dispatch = useDispatch();

  const [likeBusy, setLikeBusy] = useState(false);
  const [likeError, setLikeError] = useState("");
  const [followError, setFollowError] = useState("");

  const postId = post?._id;
  const authorId = post?.author?._id;

  const currentUserId = useSelector((state) => state.auth.userId);

  const likesInfo = useSelector((state) =>
    postId ? state.posts.likesByPost[postId] : null,
  );

  const {
    followingIds,
    pendingIds,
    loaded: followingLoaded,
  } = useSelector((state) => state.follow);

  useEffect(() => {
    if (!postId) return;

    dispatch(getPostLikes(postId));
  }, [dispatch, postId]);

  if (!post) return null;

  const author = post.author;
  const username = author?.username ?? "unknown";
  const avatarUrl = author?.avatarUrl || itchgram;

  const isOwnPost = authorId === currentUserId;
  const isFollowing = followingIds.includes(authorId);
  const followBusy = pendingIds.includes(authorId);

  const profileLink = isOwnPost
    ? "/profile"
    : `/profile/${encodeURIComponent(username)}`;

  const isLiked = likesInfo?.isLiked === true;

  const likesLoaded = typeof likesInfo?.isLiked === "boolean";

  const likesText =
    typeof post.likesCount === "number" ? `${post.likesCount} likes` : "Likes";

  const handleLike = async () => {
    if (!likesLoaded || likeBusy) return;

    setLikeBusy(true);
    setLikeError("");

    try {
      if (isLiked) {
        await dispatch(unlikePost(postId)).unwrap();
      } else {
        await dispatch(likePost(postId)).unwrap();
      }
    } catch (error) {
      setLikeError(typeof error === "string" ? error : "Failed to update like");

      dispatch(getPostLikes(postId));
    } finally {
      setLikeBusy(false);
    }
  };

  const handleFollow = async () => {
    if (!authorId || isOwnPost || !followingLoaded || followBusy) {
      return;
    }

    setFollowError("");

    const userData = {
      username,
      userId: authorId,
    };

    try {
      if (isFollowing) {
        await dispatch(unfollowUser(userData)).unwrap();
      } else {
        await dispatch(followUser(userData)).unwrap();
      }
    } catch (error) {
      setFollowError(
        typeof error === "string" ? error : "Failed to update follow",
      );
    }
  };

  return (
    <Box sx={styles.container}>
      <Box sx={styles.header}>
        <NavLink to={profileLink} style={styles.profileLink}>
          <Box
            component="img"
            src={avatarUrl}
            alt={username}
            sx={styles.avatar}
          />

          <Typography sx={styles.username}>{username}</Typography>
        </NavLink>

        <Box sx={styles.postInfo}>
          <Divider sx={styles.dot} />

          <Typography sx={styles.postTime}>
            {formatPostTime(post.createdAt)}
          </Typography>

          <Divider sx={styles.dot} />
        </Box>

        {!isOwnPost && authorId && (
          <Button
            onClick={handleFollow}
            disabled={!followingLoaded || followBusy}
            sx={styles.followButton}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </Button>
        )}
      </Box>

      {post.image ? (
        <Box
          component="img"
          src={post.image}
          alt={post.description || "Post"}
          sx={styles.postImage}
        />
      ) : post.video ? (
        <Box
          component="video"
          src={post.video}
          controls
          playsInline
          preload="metadata"
          sx={styles.postImage}
        />
      ) : null}

      <Box sx={styles.content}>
        <Box sx={styles.actions}>
          <IconButton
            aria-label={isLiked ? "Unlike post" : "Like post"}
            onClick={handleLike}
            disabled={!likesLoaded || likeBusy}
            sx={styles.iconButton}
          >
            {isLiked ? (
              <FavoriteIcon sx={styles.activeLikeIcon} />
            ) : (
              <Box component="img" src={like} alt="" sx={styles.actionIcon} />
            )}
          </IconButton>

          <IconButton
            aria-label="Comment on post"
            onClick={() => onOpenComments?.(postId)}
            sx={styles.iconButton}
          >
            <Box component="img" src={comment} alt="" sx={styles.actionIcon} />
          </IconButton>
        </Box>

        <Typography sx={styles.likes}>{likesText}</Typography>

        {likeError && (
          <Typography sx={styles.likeError}>{likeError}</Typography>
        )}

        {followError && (
          <Typography sx={styles.likeError}>{followError}</Typography>
        )}

        <Box sx={styles.caption}>
          <Typography sx={styles.username}>{username}</Typography>

          <Typography sx={styles.description}>{post.description}</Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default Post;
