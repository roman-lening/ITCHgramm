
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { styles } from "./styles";

function EditPost({
  onDelete,
  onEdit,
  onGoToPost,
  onCopyLink,
  onCancel,
}) {
  return (
    <Box sx={styles.container}>
      <Button sx={styles.deleteButton} onClick={onDelete}>
        Delete
      </Button>

      <Button sx={styles.button} onClick={onEdit}>
        Edit
      </Button>

      <Button sx={styles.button} onClick={onGoToPost}>
        Go to post
      </Button>

      <Button sx={styles.button} onClick={onCopyLink}>
        Copy link
      </Button>

      <Button sx={styles.cancelButton} onClick={onCancel}>
        Cancel
      </Button>
    </Box>
  );
}

export default EditPost;
