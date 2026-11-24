import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { NavLink } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import itchgram from "../../assets/itchgram.png";
import linkWebImg from "../../assets/linkWeb.svg";
import MyPostModal from "../MyPostModal/index.jsx";
import { getMyProfile } from "../../redux/slices/profileSlice.js";
import { styles } from "./styles";

function MyProfile() {
  const dispatch = useDispatch();

  const { myProfile, loading, error } = useSelector((state) => state.profile);

  const user = myProfile?.user;
  const posts = myProfile?.posts ?? [];

  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const textRef = useRef(null);

  useEffect(() => {
    dispatch(getMyProfile());
  }, [dispatch]);

  useEffect(() => {
    if (!selectedPost) return;

    const handleOutsideClick = (event) => {
      const isInsidePost =
        event.target instanceof Element &&
        event.target.closest("[data-post-modal-content]");

      if (!isInsidePost) {
        event.stopPropagation();
        event.preventDefault();
        setSelectedPost(null);
      }
    };

    document.addEventListener("click", handleOutsideClick, true);

    return () => {
      document.removeEventListener("click", handleOutsideClick, true);
    };
  }, [selectedPost]);

  useEffect(() => {
    const element = textRef.current;

    if (!element) {
      setIsOverflowing(false);
      return;
    }

    const checkOverflow = () => {
      setIsOverflowing(element.scrollHeight > 52);
    };

    const observer = new ResizeObserver(checkOverflow);

    observer.observe(element);
    checkOverflow();

    return () => observer.disconnect();
  }, [user?.bio]);

  if (loading && !myProfile) {
    return (
      <Box sx={styles.container}>
        <Typography sx={styles.statusText}>Loading profile...</Typography>
      </Box>
    );
  }

  if (error && !myProfile) {
    return (
      <Box sx={styles.container}>
        <Typography sx={styles.statusText}>{error}</Typography>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={styles.container}>
        <Typography sx={styles.statusText}>Profile not found.</Typography>
      </Box>
    );
  }

  const website = user.website?.trim() ?? "";

  const websiteHref = (() => {
    if (!website) return null;

    try {
      const url = new URL(
        /^https?:\/\//i.test(website) ? website : `https://${website}`,
      );

      return ["http:", "https:"].includes(url.protocol) ? url.href : null;
    } catch {
      return null;
    }
  })();

  const formatCount = (value) =>
    new Intl.NumberFormat("ru-RU").format(value ?? 0);

  return (
    <Box sx={styles.container}>
      <Box sx={styles.header}>
        <Box
          component="img"
          src={user.avatarUrl || itchgram}
          alt={user.username}
          sx={styles.avatar}
        />

        <Box sx={styles.profileInfo}>
          <Box sx={styles.profileActions}>
            <Typography sx={styles.username}>{user.username}</Typography>

            <Button
              component={NavLink}
              to="/edit-profile"
              sx={styles.messageButton}
            >
              Edit profile
            </Button>
          </Box>

          <Box sx={styles.statistics}>
            <Typography sx={styles.postsCount}>
              {formatCount(user.postsCount ?? posts.length)} posts
            </Typography>

            <Typography sx={styles.statText}>
              {formatCount(user.followersCount)} followers
            </Typography>

            <Typography sx={styles.statText}>
              {formatCount(user.followingCount)} following
            </Typography>
          </Box>

          <Box sx={styles.bioContainer}>
            {user.bio && (
              <Typography ref={textRef} sx={styles.bio(expanded)}>
                {user.bio}
              </Typography>
            )}

            {isOverflowing && (
              <Button
                onClick={() => setExpanded((prev) => !prev)}
                sx={styles.moreButton}
              >
                {expanded ? "less" : "more"}
              </Button>
            )}

            {website && (
              <Box
                component={websiteHref ? "a" : "div"}
                href={websiteHref || undefined}
                target={websiteHref ? "_blank" : undefined}
                rel={websiteHref ? "noopener noreferrer" : undefined}
                sx={styles.websiteContainer}
              >
                <Box
                  component="img"
                  src={linkWebImg}
                  alt="linkWebImg"
                  sx={styles.websiteIcon}
                />

                <Typography sx={styles.websiteText}>
                  {website.replace(/^https?:\/\//i, "")}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      <Box sx={styles.postsGrid}>
        {posts.map((post) =>
          post.image ? (
            <Box
              key={post._id}
              component="img"
              src={post.image}
              alt={post.description || "Post"}
              onClick={() => setSelectedPost(post)}
              sx={styles.postImage}
            />
          ) : (
            <Box
              key={post._id}
              component="video"
              src={post.video}
              muted
              playsInline
              preload="metadata"
              onClick={() => setSelectedPost(post)}
              sx={styles.postImage}
            />
          ),
        )}
      </Box>

      <Modal open={Boolean(selectedPost)} onClose={() => setSelectedPost(null)}>
        <Box sx={styles.modalContent}>
          {selectedPost && <MyPostModal post={selectedPost} />}
        </Box>
      </Modal>
    </Box>
  );
}

export default MyProfile;
