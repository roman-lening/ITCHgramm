
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import testImage from "../../assets/TestImagePost.svg";
import OtherPostModal from "../OtherPostModal/index.jsx";
import { useState, useEffect } from "react";
import { styles } from "./styles";

function Explore() {
  const [openPost, setOpenPost] = useState(false);

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

  return (
    <>
      <Box sx={styles.container}>
        {Array.from({ length: 18 }, (_, index) => (
          <Box
            key={index}
            component="img"
            src={testImage}
            alt="testImage"
            onClick={() => setOpenPost(true)}
            sx={styles.postImage(index)}
          />
        ))}
      </Box>
      <Modal open={openPost} onClose={() => setOpenPost(false)}>
        <Box sx={styles.modalContent}>
          <OtherPostModal />
        </Box>
      </Modal>
    </>
  );
}

export default Explore;
