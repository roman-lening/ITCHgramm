import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import itchgram from "../../assets/itchgram.png";
import testImage from "../../assets/TestImagePost.svg";
import { useState, useRef, useEffect } from "react";
import OtherPostModal from "../OtherPostModal/index.jsx";
import { styles } from "./styles";
import linkWebImg from "../../assets/linkWeb.svg";

function OtherProfile() {
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [openPost, setOpenPost] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    if (!openPost) return;

    const handleOutsideClick = (event) => {
      const isInsidePost =
        event.target instanceof Element &&
        event.target.closest("[data-post-modal-content]");

      if (!isInsidePost) {
        event.stopPropagation();
        event.preventDefault();
        setOpenPost(false);
      }
    };

    document.addEventListener("click", handleOutsideClick, true);

    return () => {
      document.removeEventListener("click", handleOutsideClick, true);
    };
  }, [openPost]);

  useEffect(() => {
    const element = textRef.current;
    if (!element) return;

    const checkOverflow = () => {
      setIsOverflowing(element.scrollHeight > 52);
    };

    const observer = new ResizeObserver(checkOverflow);
    observer.observe(element);
    checkOverflow();

    return () => observer.disconnect();
  }, []);

  return (
    <Box sx={styles.container}>
      <Box sx={styles.header}>
        <Box component="img" src={itchgram} alt="itchgram" sx={styles.avatar} />

        <Box sx={styles.profileInfo}>
          <Box sx={styles.profileActions}>
            <Typography sx={styles.username}>username</Typography>

            <Box sx={styles.buttons}>
              <Button sx={styles.followButton}>Follow</Button>

              <Button sx={styles.messageButton}>Message</Button>
            </Box>
          </Box>

          <Box sx={styles.statistics}>
            <Typography sx={styles.postsCount}>129 posts</Typography>

            <Typography sx={styles.statText}>9 993 followers</Typography>

            <Typography sx={styles.statText}>59 following</Typography>
          </Box>

          <Box sx={styles.bioContainer}>
            <Typography ref={textRef} sx={styles.bio(expanded)}>
              • Гарантия помощи с трудоустройством в ведущие IT-компании •
              Выпускники зарабатывают от 45к евро БЕСПЛАТНАЯ • Гарантия помощи с
              трудоустройством в ведущие IT-компании • Выпускники зарабатывают
              от 45к евро БЕСПЛАТНАЯ • Гарантия помощи с трудоустройством в
              ведущие IT-компании • Выпускники зарабатывают от 45к евро
              БЕСПЛАТНАЯ • Гарантия помощи с трудоустройством в ведущие
              IT-компании • Выпускники зарабатывают от 45к евро БЕСПЛАТНАЯ •
              Гарантия помощи с трудоустройством в ведущие IT-компании •
              Выпускники зарабатывают от 45к евро БЕСПЛАТНАЯ • Гарантия помощи с
              трудоустройством в ведущие IT-компании • Выпускники зарабатывают
              от 45к евро БЕСПЛАТНАЯ • Гарантия помощи с трудоустройством в
              ведущие IT-компании • Выпускники зарабатывают от 45к евро
              БЕСПЛАТНАЯ • Гарантия помощи с трудоустройством в ведущие
              IT-компании • Выпускники зарабатывают от 45к евро БЕСПЛАТНАЯ
            </Typography>

            {isOverflowing && (
              <Button
                onClick={() => setExpanded((prev) => !prev)}
                sx={styles.moreButton}
              >
                {expanded ? "less" : "more"}
              </Button>
            )}
             <Box
        sx={{
          display: "flex",
          gap: "7px",
          alignItems: "center",
        }}
      >
        <Box
          component="img"
          src={linkWebImg}
          alt="linkWebImg"
          sx={{
            width: "12px",
            height: "12px",
          }}
        ></Box>
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: "14px",
            lineHeight: "129%",
            color: "#00376b",
          }}
        >
          bit.ly/3rpiIbh
        </Typography>
      </Box>
          </Box>
        </Box>
      </Box>

      <Box sx={styles.postsGrid}>
        {Array.from({ length: 18 }, (_, index) => (
          <Box
            key={index}
            component="img"
            src={testImage}
            alt="itchgram"
            onClick={() => setOpenPost(true)}
            sx={styles.postImage}
          />
        ))}
      </Box>
     
      <Modal open={openPost} onClose={() => setOpenPost(false)}>
        <Box sx={styles.modalContent}>
          <OtherPostModal />
        </Box>
      </Modal>
    </Box>
  );
}

export default OtherProfile;
