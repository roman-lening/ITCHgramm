import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Popover from "@mui/material/Popover";

import SentimentSatisfiedAltOutlinedIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import EmojiPicker from "emoji-picker-react";

import itchgram from "../../assets/itchgram.png";
import AddImg from "../../assets/addPostFoto.svg";

import { createPost } from "../../redux/slices/postsSlice.js";
import { getMyProfile } from "../../redux/slices/profileSlice.js";
import { optimizeCloudinaryImage } from "../../utils/cloudinaryImage.js";

import { styles } from "./styles";

const DESCRIPTION_LIMIT = 400;
const IMAGE_LIMIT = 2 * 1024 * 1024;
const VIDEO_LIMIT = 5 * 1024 * 1024;
const VIDEO_DURATION_LIMIT = 5;

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const VIDEO_TYPES = ["video/mp4", "video/webm"];

const getVideoDuration = (file) =>
  new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");

    const finish = (duration) => {
      video.onloadedmetadata = null;
      video.onerror = null;
      URL.revokeObjectURL(url);
      resolve(duration);
    };

    video.preload = "metadata";
    video.onloadedmetadata = () => finish(video.duration);
    video.onerror = () => finish(null);
    video.src = url;
  });

function AddPost() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const profileUser = useSelector((state) => state.profile.myProfile?.user);

  const creating = useSelector((state) => state.posts.creating);

  const [desc, setDesc] = useState("");
  const [media, setMedia] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [emojiAnchor, setEmojiAnchor] = useState(null);
  const [error, setError] = useState("");

  const fileInputRef = useRef(null);
  const textInputRef = useRef(null);
  const previewUrlRef = useRef(null);
  const fileCheckRef = useRef(0);

  const cursorRef = useRef({
    start: 0,
    end: 0,
  });

  useEffect(() => {
    if (!profileUser) {
      dispatch(getMyProfile());
    }
  }, [dispatch, profileUser]);

  useEffect(() => {
    return () => {
      fileCheckRef.current += 1;

      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const charactersCount = Array.from(desc).length;

  const isVideo = media && VIDEO_TYPES.includes(media.type);

  const canShare =
    Boolean(media) &&
    Boolean(desc.trim()) &&
    charactersCount <= DESCRIPTION_LIMIT &&
    !creating;

  const handleDescriptionChange = (event) => {
    const value = event.target.value;

    if (Array.from(value).length > DESCRIPTION_LIMIT) {
      return;
    }

    setDesc(value);
    setError("");
  };

  const handleSelectionChange = (event) => {
    const input = event.target;

    cursorRef.current = {
      start: input.selectionStart,
      end: input.selectionEnd,
    };
  };

  const handleEmojiClick = (emojiData) => {
    const emoji = emojiData.emoji;

    const { start, end } = cursorRef.current;

    const positionStart = Math.min(start, desc.length);
    const positionEnd = Math.min(end, desc.length);

    const newDescription =
      desc.slice(0, positionStart) + emoji + desc.slice(positionEnd);

    if (Array.from(newDescription).length > DESCRIPTION_LIMIT) {
      return;
    }

    setDesc(newDescription);
    setError("");
    setEmojiAnchor(null);

    const newPosition = positionStart + emoji.length;

    cursorRef.current = {
      start: newPosition,
      end: newPosition,
    };

    requestAnimationFrame(() => {
      textInputRef.current?.focus();

      textInputRef.current?.setSelectionRange(newPosition, newPosition);
    });
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file || creating) return;

    const requestId = ++fileCheckRef.current;

    const isImageFile = IMAGE_TYPES.includes(file.type);
    const isVideoFile = VIDEO_TYPES.includes(file.type);

    if (!isImageFile && !isVideoFile) {
      setError("Only JPEG, PNG, WebP, MP4 and WebM files are supported.");
      return;
    }

    if (isImageFile && file.size > IMAGE_LIMIT) {
      setError("Image must not exceed 2 MB.");
      return;
    }

    if (isVideoFile && file.size > VIDEO_LIMIT) {
      setError("Video must not exceed 5 MB.");
      return;
    }

    if (isVideoFile) {
      const duration = await getVideoDuration(file);

      if (requestId !== fileCheckRef.current) {
        return;
      }

      if (
        !Number.isFinite(duration) ||
        duration <= 0 ||
        duration > VIDEO_DURATION_LIMIT
      ) {
        setError("Video duration must not exceed 5 seconds.");
        return;
      }
    }

    if (requestId !== fileCheckRef.current) {
      return;
    }

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }

    const url = URL.createObjectURL(file);

    previewUrlRef.current = url;

    setPreviewUrl(url);
    setMedia(file);
    setError("");
  };

  const handleShare = async () => {
    if (!canShare) return;

    setError("");

    try {
      await dispatch(
        createPost({
          description: desc.trim(),
          image: isVideo ? null : media,
          video: isVideo ? media : null,
        }),
      ).unwrap();

      navigate("/profile");
    } catch (error) {
      setError(
        typeof error === "string"
          ? error
          : error?.message || "Failed to create post.",
      );
    }
  };

  return (
    <Box sx={styles.container}>
      <Box sx={styles.header}>
        <Typography sx={styles.title}>Create new post</Typography>

        <Button
          onClick={handleShare}
          disabled={!canShare}
          sx={styles.shareButton}
        >
          {creating ? "Sharing..." : "Share"}
        </Button>
      </Box>

      <Box sx={styles.content}>
        <Box sx={styles.mediaArea}>
          <Box
            component="input"
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
            onChange={handleFileChange}
            sx={{ display: "none" }}
          />

          {!media && (
            <IconButton
              aria-label="Choose photo or video"
              onClick={() => fileInputRef.current?.click()}
              sx={styles.uploadButton}
            >
              <Box
                component="img"
                src={AddImg}
                alt="Upload media"
                sx={styles.uploadIcon}
              />
            </IconButton>
          )}

          {media && !isVideo && (
            <Box
              component="img"
              src={previewUrl}
              alt="Post preview"
              sx={styles.mediaPreview}
            />
          )}

          {media && isVideo && (
            <Box
              component="video"
              src={previewUrl}
              controls
              playsInline
              preload="metadata"
              sx={styles.mediaPreview}
            />
          )}

          {media && (
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={creating}
              sx={styles.changeButton}
            >
              Change
            </Button>
          )}
        </Box>

        <Box sx={styles.rightPanel}>
          <Box sx={styles.editorPanel}>
            <Box sx={styles.userRow}>
              <Box
                component="img"
                src={optimizeCloudinaryImage(profileUser?.avatarUrl || itchgram, 96)}
                alt={profileUser?.username || "User"}
                sx={styles.avatar}
              />

              <Typography sx={styles.username}>
                {profileUser?.username || "username"}
              </Typography>
            </Box>

            <Box sx={styles.captionRow}>
              <IconButton
                aria-label="Choose emoji"
                onClick={(event) => {
                  setEmojiAnchor(event.currentTarget);
                }}
                sx={styles.emojiButton}
              >
                <SentimentSatisfiedAltOutlinedIcon sx={styles.emojiIcon} />
              </IconButton>

              <TextField
                inputRef={textInputRef}
                multiline
                minRows={1}
                maxRows={15}
                variant="standard"
                placeholder="Write a caption..."
                value={desc}
                onChange={handleDescriptionChange}
                onSelect={handleSelectionChange}
                slotProps={{
                  input: {
                    disableUnderline: true,
                  },
                }}
                sx={styles.captionInput}
              />
            </Box>

            <Typography sx={styles.counter}>
              {charactersCount}/{DESCRIPTION_LIMIT}
            </Typography>

            <Popover
              open={Boolean(emojiAnchor)}
              anchorEl={emojiAnchor}
              onClose={() => setEmojiAnchor(null)}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              <EmojiPicker
                width={320}
                height={350}
                onEmojiClick={handleEmojiClick}
                previewConfig={{ showPreview: false }}
              />
            </Popover>
          </Box>

          <Box sx={styles.lowerPanel}>
            {error && <Typography sx={styles.error}>{error}</Typography>}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default AddPost;
