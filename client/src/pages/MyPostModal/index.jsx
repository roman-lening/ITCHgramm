import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";

import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

import FavoriteIcon from "@mui/icons-material/Favorite";
import SentimentSatisfiedAltOutlinedIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";

import itchgram from "../../assets/itchgram.png";
import like from "../../assets/DrawerSvg/Light/Notification.svg";
import comment from "../../assets/Comment.svg";

import EditPost from "../EditPost";

import {
  deletePost,
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

function MyPostModal({ post, user: postAuthor, onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const postId = post?._id;

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

  const [copyStatus, setCopyStatus] = useState({
    message: "",
    isError: false,
  });

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
              {Array.from({ length: 4 }, (_, index) => (
                <Box key={index} sx={styles.commentRow}>
                  <Box sx={styles.commentAuthorRow}>
                    <IconButton
                      aria-label="Comment on post"
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
    </Box>
  );
}

export default MyPostModal;
