import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";

import Button from "@mui/material/Button";
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
  getComments,
  createComment,
  likeComment,
  unlikeComment,
} from "../../redux/slices/commentsSlice.js";

import EditPost from "../EditPost";

import {
  deletePost,
  getPostLikes,
  likePost,
  unlikePost,
} from "../../redux/slices/postsSlice.js";

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

function MyPostModal({ post, user: postAuthor, onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const postId = post?._id;

  const comments = useSelector(
    (state) => state.comments.commentsByPost[postId] ?? EMPTY_COMMENTS,
  );

  const sendingComment = useSelector(
    (state) => state.comments.sendingByPost[postId] ?? false,
  );

  const commentError = useSelector(
    (state) => state.comments.errorsByPost[postId],
  );

  const pendingLikeIds = useSelector((state) => state.comments.pendingLikeIds);

  const profileUser = useSelector((state) => state.profile.myProfile?.user);

  const syncedPost = useSelector((state) => {
    if (!postId) return null;

    return (
      state.profile.myProfile?.posts?.find((item) => item._id === postId) ??
      state.posts.posts.find((item) => item._id === postId) ??
      state.posts.feedPosts.find((item) => item._id === postId) ??
      (state.posts.currentPost?._id === postId ? state.posts.currentPost : null)
    );
  });

  const likesInfo = useSelector((state) =>
    postId ? state.posts.likesByPost[postId] : null,
  );

  const [commentar, setComment] = useState("");
  const [openEditPost, setOpenEditPost] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const [likeBusy, setLikeBusy] = useState(false);
  const [likeError, setLikeError] = useState("");

  const [emojiAnchor, setEmojiAnchor] = useState(null);

  const inputRef = useRef(null);

  const cursorRef = useRef({
    start: 0,
    end: 0,
  });

  const [copyStatus, setCopyStatus] = useState({
    message: "",
    isError: false,
  });

  useEffect(() => {
    if (postId) {
      dispatch(getComments(postId));
    }
  }, [dispatch, postId]);

  useEffect(() => {
    if (!postId) return;

    dispatch(getPostLikes(postId));
  }, [dispatch, postId]);

  const isLiked = likesInfo?.isLiked === true;
  const likesLoaded = typeof likesInfo?.isLiked === "boolean";

  const handleSendComment = async () => {
    const text = commentar.trim();

    if (
      !postId ||
      !text ||
      text.length > MAX_COMMENT_LENGTH ||
      sendingComment
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

      cursorRef.current = {
        start: 0,
        end: 0,
      };
      
      setEmojiAnchor(null);
    } catch (error) {
      console.error("Failed to create comment:", error);
    }
  };

  const handleCommentLike = (item) => {
    if (!postId || pendingLikeIds.includes(item._id)) {
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

    const { start, end } = cursorRef.current;

    const positionStart = Math.min(start, commentar.length);

    const positionEnd = Math.min(end, commentar.length);

    const newText =
      commentar.slice(0, positionStart) + emoji + commentar.slice(positionEnd);

    if (newText.length > MAX_COMMENT_LENGTH) {
      return;
    }

    setComment(newText);
    setEmojiAnchor(null);

    const newPosition = positionStart + emoji.length;

    cursorRef.current = {
      start: newPosition,
      end: newPosition,
    };

    requestAnimationFrame(() => {
      inputRef.current?.focus();

      inputRef.current?.setSelectionRange(newPosition, newPosition);
    });
  };

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

  const handleDelete = async () => {
    if (!postId || isDeleting) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this post? This action cannot be undone.",
    );

    if (!confirmed) return;

    setIsDeleting(true);
    setDeleteError("");

    try {
      await dispatch(deletePost(postId)).unwrap();

      setOpenEditPost(false);
      onClose?.();
    } catch (error) {
      setOpenEditPost(false);

      setDeleteError(
        typeof error === "string"
          ? error
          : error?.message || "Failed to delete post",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCopyLink = async () => {
    if (!postId) return;

    const isTestPage =
      window.location.pathname === "/test" ||
      window.location.pathname.startsWith("/test/");

    const basePath = isTestPage ? "/test" : "";

    const postUrl = new URL(`${basePath}/explore`, window.location.origin);

    postUrl.searchParams.set("post", postId);

    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard is unavailable");
      }

      await navigator.clipboard.writeText(postUrl.toString());

      setCopyStatus({
        message: "Link copied",
        isError: false,
      });
    } catch {
      setCopyStatus({
        message: "Could not copy link",
        isError: true,
      });
    }

    setOpenEditPost(false);
  };

  const handleGoToPost = () => {
    if (!postId) return;

    setOpenEditPost(false);

    navigate(`/explore?post=${encodeURIComponent(postId)}`);
  };

  const currentPost = syncedPost ?? post;

  if (!currentPost) return null;

  const user = profileUser ?? postAuthor;
  const username = user?.username ?? "";
  const avatarUrl = user?.avatarUrl || itchgram;

  const postDate = formatPostDate(currentPost.createdAt);

  const likesText =
    typeof currentPost.likesCount === "number"
      ? `${currentPost.likesCount} likes`
      : "Likes";

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
            <Box sx={styles.headerUser}>
              <IconButton aria-label="User profile" sx={styles.iconButton}>
                <Box
                  component="img"
                  src={avatarUrl}
                  alt={username}
                  sx={styles.avatar}
                />
              </IconButton>

              <NavLink to="/profile" style={styles.usernameLink}>
                {username}
              </NavLink>
            </Box>

            <Button
              onClick={() => setOpenEditPost(true)}
              sx={styles.menuButton}
            >
              •••
            </Button>
          </Box>

          {deleteError && (
            <Typography sx={styles.deleteError}>{deleteError}</Typography>
          )}

          {copyStatus.message && (
            <Typography
              sx={copyStatus.isError ? styles.deleteError : styles.copyStatus}
            >
              {copyStatus.message}
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
                  <NavLink to="/profile" style={styles.usernameLink}>
                    {username}
                  </NavLink>
                  {"  "}
                  {currentPost.description}
                </Typography>

                <Typography sx={styles.metaText}>{postDate}</Typography>
              </Box>
            </Box>

            <Box sx={styles.commentsList}>
              {comments.map((item) => {
                const commentLikeBusy = pendingLikeIds.includes(item._id);

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

                cursorRef.current = {
                  start:
                    event.target.selectionStart ?? event.target.value.length,
                  end: event.target.selectionEnd ?? event.target.value.length,
                };
              }}
              onSelect={(event) => {
                cursorRef.current = {
                  start: event.target.selectionStart ?? commentar.length,
                  end: event.target.selectionEnd ?? commentar.length,
                };
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
              disabled={!commentar.trim() || sendingComment}
              sx={styles.sendButton}
            >
              {sendingComment ? "Sending..." : "Send"}
            </Button>
          </Box>

          {commentError && (
            <Typography sx={styles.deleteError}>{commentError}</Typography>
          )}
        </Box>
      </Box>

      {openEditPost && (
        <Box
          sx={styles.editMenuOverlay}
          data-post-modal-content
          onClick={() => {
            if (!isDeleting) {
              setOpenEditPost(false);
            }
          }}
        >
          <Box onClick={(event) => event.stopPropagation()}>
            <EditPost
              onDelete={handleDelete}
              onCopyLink={handleCopyLink}
              onGoToPost={handleGoToPost}
              onCancel={() => {
                if (!isDeleting) {
                  setOpenEditPost(false);
                }
              }}
            />
          </Box>
        </Box>
      )}

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

export default MyPostModal;
