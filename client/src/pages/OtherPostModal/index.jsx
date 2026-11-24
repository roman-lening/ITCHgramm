import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

import FavoriteIcon from "@mui/icons-material/Favorite";
import SentimentSatisfiedAltOutlinedIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";

import itchgram from "../../assets/itchgram.png";
import like from "../../assets/DrawerSvg/Light/Notification.svg";
import comment from "../../assets/Comment.svg";

import {
  getFollowing,
  followUser,
  unfollowUser,
} from "../../redux/slices/followSlice.js";

import {
  getPostLikes,
  likePost,
  unlikePost,
} from "../../redux/slices/postsSlice.js";

import { styles } from "./styles";

const formatPostDate = (date) => {
  if (!date) return "";

  const postDate = new Date(date);

  if (Number.isNaN(postDate.getTime())) return "";

  return postDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

function OtherPostModal({ post, user }) {
  const dispatch = useDispatch();

  const postId = post?._id;

  const [commentar, setComment] = useState("");
  const [followError, setFollowError] = useState(null);
  const [likeBusy, setLikeBusy] = useState(false);
  const [likeError, setLikeError] = useState("");

  const currentUserId = useSelector((state) => state.auth.userId);

  const {
    followingIds,
    pendingIds,
    loaded: followingLoaded,
  } = useSelector((state) => state.follow);

  const likesInfo = useSelector((state) =>
    postId ? state.posts.likesByPost[postId] : null,
  );

  const syncedPost = useSelector((state) => {
    if (!postId) return null;

    return (
      state.profile.otherProfile?.posts?.find((item) => item._id === postId) ??
      state.posts.posts.find((item) => item._id === postId) ??
      state.posts.feedPosts.find((item) => item._id === postId) ??
      (state.posts.currentPost?._id === postId ? state.posts.currentPost : null)
    );
  });

  useEffect(() => {
    if (!followingLoaded) {
      dispatch(getFollowing());
    }
  }, [dispatch, followingLoaded]);

  useEffect(() => {
    if (!postId) return;

    dispatch(getPostLikes(postId));
  }, [dispatch, postId]);

  const isLiked = likesInfo?.isLiked === true;

  const likesLoaded = typeof likesInfo?.isLiked === "boolean";

  const handleLike = async () => {
    if (!postId || !likesLoaded || likeBusy) return;

    setLikeBusy(true);
    setLikeError("");

    try {
      if (isLiked) {
        await dispatch(unlikePost(postId)).unwrap();
      } else {
        await dispatch(likePost(postId)).unwrap();
      }
    } catch (error) {
      setLikeError(
        typeof error === "string"
          ? error
          : error?.message || "Failed to update like",
      );

      dispatch(getPostLikes(postId));
    } finally {
      setLikeBusy(false);
    }
  };

  const currentPost = syncedPost ?? post;

  if (!currentPost || !user) return null;

  const userId = user.id ?? user._id;
  const username = user.username;
  const avatarUrl = user.avatarUrl || itchgram;

  const postDate = formatPostDate(currentPost.createdAt);

  const isOwnPost = userId === currentUserId;
  const isFollowing = followingIds.includes(userId);
  const followBusy = pendingIds.includes(userId);

  const profileLink = isOwnPost
    ? "/profile"
    : `/profile/${encodeURIComponent(username)}`;

  const likesText =
    typeof currentPost.likesCount === "number"
      ? `${currentPost.likesCount} likes`
      : "Likes";

  const handleFollow = async () => {
    if (!userId || isOwnPost || !followingLoaded || followBusy) {
      return;
    }

    setFollowError(null);

    const userData = {
      username,
      userId,
    };

    try {
      if (isFollowing) {
        await dispatch(unfollowUser(userData)).unwrap();
      } else {
        await dispatch(followUser(userData)).unwrap();
      }
    } catch (error) {
      setFollowError({
        userId,
        message: typeof error === "string" ? error : "Failed to update follow",
      });
    }
  };

  return (
    <Box sx={styles.container}>
      {currentPost.image ? (
        <Box
          component="img"
          src={currentPost.image}
          alt={currentPost.description || "Post"}
          sx={styles.postImage}
          data-post-modal-content
        />
      ) : currentPost.video ? (
        <Box
          component="video"
          src={currentPost.video}
          controls
          playsInline
          preload="metadata"
          sx={styles.postImage}
          data-post-modal-content
        />
      ) : null}

      <Box sx={styles.rightColumn} data-post-modal-content>
        <Box sx={styles.topSection}>
          <Box sx={styles.header}>
            <IconButton aria-label="User profile" sx={styles.iconButton}>
              <Box
                component="img"
                src={avatarUrl}
                alt={username}
                sx={styles.avatar}
              />
            </IconButton>

            <Box sx={styles.headerInfo}>
              <NavLink to={profileLink} style={styles.usernameLink}>
                {username}
              </NavLink>

              <Divider sx={styles.dot} />

              {!isOwnPost && (
                <Button
                  onClick={handleFollow}
                  disabled={!followingLoaded || followBusy}
                  sx={styles.followButton}
                >
                  {isFollowing ? "Отписаться" : "Подписаться"}
                </Button>
              )}
            </Box>
          </Box>

          {followError?.userId === userId && (
            <Typography sx={styles.followError}>
              {followError.message}
            </Typography>
          )}

          <Box sx={styles.scrollArea}>
            <Box sx={styles.descriptionRow}>
              <IconButton aria-label="User profile" sx={styles.iconButton}>
                <Box
                  component="img"
                  src={avatarUrl}
                  alt={username}
                  sx={styles.avatar}
                />
              </IconButton>

              <Box sx={styles.descriptionBody}>
                <Typography sx={styles.descriptionText}>
                  <NavLink to={profileLink} style={styles.usernameLink}>
                    {username}
                  </NavLink>
                  {"  "}
                  {currentPost.description}
                </Typography>

                <Typography sx={styles.metaText}>{postDate}</Typography>
              </Box>
            </Box>

            <Box sx={styles.commentsList}>
              {Array.from({ length: 4 }, (_, index) => (
                <Box key={index} sx={styles.commentRow}>
                  <Box sx={styles.commentAuthorRow}>
                    <IconButton
                      aria-label="Comment avatar"
                      sx={styles.iconButton}
                    >
                      <Box
                        component="img"
                        src={itchgram}
                        alt="itchgram"
                        sx={styles.avatar}
                      />
                    </IconButton>

                    <Box sx={styles.commentDetails}>
                      <Box sx={styles.commentContentRow}>
                        <Typography sx={styles.usernameLink}>
                          username
                        </Typography>

                        <Typography sx={styles.commentText}>
                          спасибо!!!!
                        </Typography>
                      </Box>

                      <Box sx={styles.commentMetaRow}>
                        <Typography sx={styles.metaText}>17 h.</Typography>

                        <Typography sx={styles.metaText}>Likes: 1</Typography>
                      </Box>
                    </Box>
                  </Box>

                  <IconButton aria-label="Like comment" sx={styles.iconButton}>
                    <Box
                      component="img"
                      src={like}
                      alt="like"
                      sx={styles.commentLikeIcon}
                    />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        <Box sx={styles.bottomSection}>
          <Box>
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
                  <Box
                    component="img"
                    src={like}
                    alt=""
                    sx={styles.actionIcon}
                  />
                )}
              </IconButton>

              <Box
                component="img"
                src={comment}
                alt="comment"
                sx={styles.actionIcon}
              />
            </Box>

            <Box sx={styles.likesInfo}>
              <Typography sx={styles.likesCount}>{likesText}</Typography>

              <Typography sx={styles.postDate}>{postDate}</Typography>

              {likeError && (
                <Typography sx={styles.likeError}>{likeError}</Typography>
              )}
            </Box>
          </Box>

          <Box sx={styles.commentForm}>
            <IconButton aria-label="Choose emoji" sx={styles.emojiButton}>
              <SentimentSatisfiedAltOutlinedIcon sx={styles.emojiIcon} />
            </IconButton>

            <TextField
              placeholder="Add comment"
              value={commentar}
              onChange={(event) => setComment(event.target.value)}
              sx={styles.commentInput}
            />

            <Button sx={styles.sendButton}>Send</Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default OtherPostModal;
