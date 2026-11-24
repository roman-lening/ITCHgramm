
export const styles = {
  container: {
    display: "flex",
    margin: "0 auto",
    marginTop: "148px",
    width: "913px",
    marginRight: "137px",
    marginBottom: "476px",
    height: "564px",
    flexDirection: "column",
    border: "1px solid #dbdbdb",
    borderRadius: "12px",
    backgroundColor: "#fff",
    overflow: "hidden",
  },

  header: {
    display: "flex",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "44px",
    minHeight: "44px",
    borderBottom: "1px solid #dbdbdb",
  },

  title: {
    fontWeight: 600,
    fontSize: "16px",
    lineHeight: "150%",
    textAlign: "center",
    color: "#000",
  },

  shareButton: {
    position: "absolute",
    right: "16px",
    top: "50%",
    transform: "translateY(-50%)",
    fontWeight: 600,
    fontSize: "14px",
    lineHeight: "129%",
    textAlign: "right",
    color: "#0095f6",
    textTransform: "none",
    minWidth: 0,
    padding: 0,

    "&.Mui-disabled": {
      color: "#b2dffc",
    },
  },

  content: {
    display: "flex",
    flex: 1,
    minHeight: 0,
    width: "100%",
  },

  mediaArea: {
    display: "flex",
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    width: "573px",
    height: "100%",
    borderBottom: "1px solid #dbdbdb",
    backgroundColor: "#fafafa",
    overflow: "hidden",
  },

  uploadButton: {
    width: "153px",
    height: "153px",
    padding: 0,
    borderRadius: 0,
  },

  uploadIcon: {
    width: "153px",
    height: "153px",
    objectFit: "contain",
  },

  mediaPreview: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center",
  },

  changeButton: {
    position: "absolute",
    top: "12px",
    right: "12px",
    borderRadius: "8px",
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    color: "#000",
    textTransform: "none",
    fontWeight: 600,
    fontSize: "12px",
    padding: "5px 12px",

    "&:hover": {
      backgroundColor: "#fff",
    },
  },

  rightPanel: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    width: "339px",
    minWidth: 0,
    height: "100%",
    borderLeft: "1px solid #dbdbdb",
  },

  editorPanel: {
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
    minHeight: "260px",
    maxHeight: "100%",
    paddingTop: "18px",
    paddingLeft: "16px",
    paddingRight: "12px",
    paddingBottom: "14px",
    overflowY: "auto",
  },

  userRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexShrink: 0,
  },

  avatar: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    border: "1px solid black",
    objectFit: "cover",
    flexShrink: 0,
  },

  username: {
    fontWeight: 600,
    fontSize: "14px",
    lineHeight: "129%",
    color: "#000",
  },

  captionRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: "8px",
    width: "100%",
    marginTop: "18px",
  },

  emojiButton: {
    width: "24px",
    height: "24px",
    padding: 0,
    flexShrink: 0,
  },

  emojiIcon: {
    width: "20px",
    height: "20px",
    color: "#737373",
  },

  captionInput: {
    flex: 1,
    minWidth: 0,

    "& .MuiInputBase-root": {
      width: "100%",
      alignItems: "flex-start",
    },

    "& .MuiInputBase-input": {
      fontWeight: 400,
      fontSize: "14px",
      lineHeight: "20px",
      color: "#000",
      padding: 0,
    },

    "& textarea": {
      resize: "none",
      overflowY: "auto",
    },

    "& textarea::placeholder": {
      color: "#737373",
      opacity: 1,
    },
  },

  counter: {
    alignSelf: "flex-end",
    fontWeight: 400,
    fontSize: "12px",
    lineHeight: "133%",
    color: "#c7c7c7",
    marginTop: "16px",
  },

  lowerPanel: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minHeight: 0,
    borderTop: "1px solid #dbdbdb",
  },

  error: {
    padding: "12px 16px",
    fontWeight: 400,
    fontSize: "12px",
    lineHeight: "150%",
    color: "#ed4956",
    overflowWrap: "anywhere",
  },
};
