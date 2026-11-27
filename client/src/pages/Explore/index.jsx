import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";

import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

import OtherPostModal from "../OtherPostModal/index.jsx";
import MyPostModal from "../MyPostModal/index.jsx";

import { getPosts } from "../../redux/slices/postsSlice.js";
import { optimizeCloudinaryImage } from "../../utils/cloudinaryImage.js";
import { styles } from "./styles";

function Explore() {
  const dispatch = useDispatch();

  const { posts, loading, error } = useSelector((state) => state.posts);

  const currentUserId = useSelector((state) => state.auth.userId);

  const [searchParams, setSearchParams] = useSearchParams();

  const selectedPostId = searchParams.get("post");

  const selectedPost =
    posts.find((post) => post._id === selectedPostId) ?? null;

  const isOwnPost = selectedPost?.author?._id === currentUserId;

  useEffect(() => {
    dispatch(getPosts());
  }, [dispatch]);

  const openPost = (postId) => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      next.set("post", postId);
      return next;
    });
  };

  const closePost = useCallback(() => {
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        next.delete("post");
        return next;
      },
      { replace: true },
    );
  }, [setSearchParams]);

  useEffect(() => {
    if (!selectedPost) return;

    const handleOutsideClick = (event) => {
      const isInsidePost =
        event.target instanceof Element &&
        event.target.closest("[data-post-modal-content]");

      if (!isInsidePost) {
        event.stopPropagation();
        event.preventDefault();
        closePost();
      }
    };

    document.addEventListener("click", handleOutsideClick, true);

    return () => {
      document.removeEventListener("click", handleOutsideClick, true);
    };
  }, [selectedPost, closePost]);

  return (
    <>
      <Box sx={styles.container}>
        {loading && posts.length === 0 ? (
          <Typography sx={styles.statusText}>Loading posts...</Typography>
        ) : error && posts.length === 0 ? (
          <Typography sx={styles.statusText}>{error}</Typography>
        ) : posts.length === 0 ? (
          <Typography sx={styles.statusText}>No posts yet.</Typography>
        ) : (
          posts.map((post, index) =>
            post.image ? (
              <Box
                key={post._id}
                component="img"
                src={optimizeCloudinaryImage(post.image, 640)}
                alt={post.description || "Post"}
                onClick={() => openPost(post._id)}
                sx={styles.postImage(index)}
              />
            ) : post.video ? (
              <Box
                key={post._id}
                component="video"
                src={post.video}
                muted
                playsInline
                preload="metadata"
                onClick={() => openPost(post._id)}
                sx={styles.postImage(index)}
              />
            ) : null,
          )
        )}
      </Box>

      <Modal open={Boolean(selectedPost)} onClose={closePost}>
        <Box sx={styles.modalContent}>
          {selectedPost &&
            (isOwnPost ? (
              <MyPostModal
                post={selectedPost}
                user={selectedPost.author}
                onClose={closePost}
              />
            ) : (
              <OtherPostModal post={selectedPost} user={selectedPost.author} />
            ))}
        </Box>
      </Modal>
    </>
  );
}

export default Explore;
