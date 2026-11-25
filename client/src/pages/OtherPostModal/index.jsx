import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Popover from "@mui/material/Popover";

import FavoriteIcon from "@mui/icons-material/Favorite";
import SentimentSatisfiedAltOutlinedIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import EmojiPicker from "emoji-picker-react";

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

import {
  getComments,
  createComment,
  likeComment,
  unlikeComment,
} from "../../redux/slices/commentsSlice.js";

import { styles } from "./styles";

const EMPTY_COMMENTS = [];
const MAX_COMMENT_LENGTH = 500;

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
  const [emojiAnchor, setEmojiAnchor] = useState(null);

  const inputRef = useRef(null);
  const cursorRef = useRef(0);

  const currentUserId = useSelector((state) => state.auth.userId);

  const {
    followingIds,
    pendingIds,
    loaded: followingLoaded,
  } = useSelector((state) => state.follow);

  const likesInfo = useSelector((state) =>
    postId ? state.posts.likesByPost[postId] : null,
  );

  const comments = useSelector(
    (state) => state.comments.commentsByPost[postId] ?? EMPTY_COMMENTS,
  );

  const loadingComments = useSelector(
    (state) => state.comments.loadingByPost[postId] ?? false,
  );

  const sendingComment = useSelector(
    (state) => state.comments.sendingByPost[postId] ?? false,
  );

  const commentError = useSelector(
    (state) => state.comments.errorsByPost[postId],
  );

  const pendingCommentLikes = useSelector(
    (state) => state.comments.pendingLikeIds,
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
    dispatch(getComments(postId));
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

  const handleSendComment = async () => {
    const text = commentar.trim();

    if (
      !postId ||
      !text ||
      text.length > MAX_COMMENT_LENGTH ||
      sendingComment ||
      loadingComments
    ) {
      return;
    }

    try {
      await dispatch(
        createComment({
          postId,
          text,
        }),
      ).unwrap();

      setComment("");
      cursorRef.current = 0;
      setEmojiAnchor(null);
    } catch (error) {
      console.error("Failed to create comment:", error);
    }
  };

  const handleCommentLike = (item) => {
    if (!postId || pendingCommentLikes.includes(item._id)) {
      return;
    }

    const data = {
      postId,
      commentId: item._id,
    };

    if (item.isLiked) {
      dispatch(unlikeComment(data));
    } else {
      dispatch(likeComment(data));
    }
  };

  const handleEmojiClick = (emojiData) => {
    const emoji = emojiData.emoji;

    const position = Math.min(cursorRef.current, commentar.length);

    const nextText =
      commentar.slice(0, position) + emoji + commentar.slice(position);

    if (nextText.length > MAX_COMMENT_LENGTH) return;

    setComment(nextText);
    setEmojiAnchor(null);

    const newPosition = position + emoji.length;
    cursorRef.current = newPosition;

    requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(newPosition, newPosition);
    });
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
              {loadingComments && (
                <Typography sx={styles.metaText}>
                  Loading comments...
                </Typography>
              )}

              {!loadingComments && comments.length === 0 && !commentError && (
                <Typography sx={styles.metaText}>No comments yet.</Typography>
              )}

              {comments.map((item) => {
                const commentLikeBusy = pendingCommentLikes.includes(item._id);

                return (
                  <Box key={item._id} sx={styles.commentRow}>
                    <Box sx={styles.commentAuthorRow}>
                      <IconButton
                        aria-label="Comment author"
                        sx={styles.iconButton}
                      >
                        <Box
                          component="img"
                          src={item.author?.avatarUrl || itchgram}
                          alt={item.author?.username || "User"}
                          sx={styles.avatar}
                        />
                      </IconButton>

                      <Box sx={styles.commentDetails}>
                        <Box sx={styles.commentContentRow}>
                          <Typography sx={styles.usernameLink}>
                            {item.author?.username || "unknown"}
                          </Typography>

                          <Typography
                            sx={{
                              ...styles.commentText,
                              whiteSpace: "pre-wrap",
                              overflowWrap: "anywhere",
                            }}
                          >
                            {item.text}
                          </Typography>
                        </Box>

                        <Box sx={styles.commentMetaRow}>
                          <Typography sx={styles.metaText}>
                            {item.createdAt
                              ? new Date(item.createdAt).toLocaleDateString(
                                  "en-US",
                                )
                              : ""}
                          </Typography>

                          <Typography sx={styles.metaText}>
                            Likes: {item.likesCount ?? 0}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    <IconButton
                      aria-label={
                        item.isLiked ? "Unlike comment" : "Like comment"
                      }
                      onClick={() => handleCommentLike(item)}
                      disabled={commentLikeBusy}
                      sx={styles.iconButton}
                    >
                      {item.isLiked ? (
                        <FavoriteIcon
                          sx={{
                            ...styles.commentLikeIcon,
                            color: "#ff3040",
                          }}
                        />
                      ) : (
                        <Box
                          component="img"
                          src={like}
                          alt=""
                          sx={styles.commentLikeIcon}
                        />
                      )}
                    </IconButton>
                  </Box>
                );
              })}
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
            <IconButton
              aria-label="Choose emoji"
              onClick={(event) => setEmojiAnchor(event.currentTarget)}
              sx={styles.emojiButton}
            >
              <SentimentSatisfiedAltOutlinedIcon sx={styles.emojiIcon} />
            </IconButton>

            <TextField
              inputRef={inputRef}
              placeholder="Add comment"
              value={commentar}
              onChange={(event) => {
                setComment(event.target.value);
                cursorRef.current =
                  event.target.selectionStart ?? event.target.value.length;
              }}
              onSelect={(event) => {
                cursorRef.current =
                  event.target.selectionStart ?? commentar.length;
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.nativeEvent.isComposing) {
                  event.preventDefault();
                  handleSendComment();
                }
              }}
              slotProps={{
                htmlInput: {
                  maxLength: MAX_COMMENT_LENGTH,
                },
              }}
              sx={styles.commentInput}
            />

            <Button
              onClick={handleSendComment}
              disabled={!commentar.trim() || sendingComment || loadingComments}
              sx={styles.sendButton}
            >
              {sendingComment ? "Sending..." : "Send"}
            </Button>
          </Box>

          {commentError && (
            <Typography sx={styles.likeError}>{commentError}</Typography>
          )}
        </Box>
      </Box>

      <Popover
        open={Boolean(emojiAnchor)}
        anchorEl={emojiAnchor}
        onClose={() => setEmojiAnchor(null)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        slotProps={{
          paper: {
            "data-post-modal-content": "",
          },
        }}
      >
        <EmojiPicker
          width={300}
          height={340}
          onEmojiClick={handleEmojiClick}
          previewConfig={{
            showPreview: false,
          }}
        />
      </Popover>
    </Box>
  );
}

export default OtherPostModal;
