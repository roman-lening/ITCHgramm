const textBase = {
  fontSize: "12px",
  lineHeight: "129%",
  color: "#000",
};

export const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    maxWidth: "404px",
    minWidth: 0,
    margin: "0 auto",
    borderBottom: "0.86px solid #dbdbdb",
    paddingBottom: "16px",
  },

  header: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    paddingBottom: "12px",
    gap: "3px",
  },

  profileLink: {
    display: "flex",
    width: "max-content",
    height: "max-content",
    justifyContent: "center",
    alignItems: "center",
    gap: "6px",
  },

  avatar: {
    width: "27px",
    height: "27px",
    objectFit: "cover",
    flexShrink: 0,
  },

  username: {
    ...textBase,
    fontWeight: 600,
  },

  postInfo: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "3px",
  },

  dot: {
    width: "2.5px",
    height: "2.5px",
    minWidth: "2.5px",
    borderRadius: "50%",
    backgroundColor: "#737373",
    border: "none",
  },

  postTime: {
    ...textBase,
    fontWeight: 400,
    color: "#737373",
  },

  followButton: {
    fontWeight: 600,
    fontSize: "12px",
    lineHeight: "129%",
    textAlign: "center",
    color: "#0095f6",
    textTransform: "none",
  },

  postImage: {
    display: "block",
    width: "100%",
    height: "auto",
    aspectRatio: "402 / 503",
    objectFit: "cover",
  },

  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "7px",
    paddingTop: "10px",
    width: "100%",
    minWidth: 0,
  },

  actions: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: "13.78px",
  },

  iconButton: {
    padding: 0,
  },

  actionIcon: {
    display: "block",
    width: "20.67px",
    height: "20.67px",
  },

  likes: {
    ...textBase,
    fontWeight: 600,
  },

  caption: {
    display: "flex",
    alignItems: "flex-start",
    gap: "6px",
    width: "100%",
    minWidth: 0,
  },

  description: {
    ...textBase,
    fontWeight: 400,
    flex: 1,
    minWidth: 0,
    overflowWrap: "anywhere",
  },
};
