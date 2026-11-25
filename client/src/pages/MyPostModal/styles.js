export const styles = {
  container: {
    display: "flex",
    width: "100%",
    maxWidth: "1000px",
    minWidth: 0,
    margin: "0 auto",
    paddingLeft: "100px",
    paddingTop: "47px",
  },

  copyStatus: {
    fontWeight: 400,
    fontSize: "11px",
    lineHeight: "129%",
    color: "#737373",
    padding: "8px 13px",
  },

  activeLikeIcon: {
    width: "20.34px",
    height: "20.34px",
    color: "#ff3040",
  },

  likeError: {
    fontWeight: 400,
    fontSize: "10px",
    lineHeight: "133%",
    color: "#ed4956",
  },

  deleteError: {
    fontWeight: 400,
    fontSize: "11px",
    lineHeight: "129%",
    color: "#ed4956",
    padding: "8px 13px",
  },

  postImage: {
    width: "577px",
    height: "722px",
    objectFit: "cover",
    objectPosition: "center",
  },

  rightColumn: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "722px",
    minHeight: 0,
    borderLeft: "0.85px solid #efefef",
    borderRadius: "0 3px 3px 0",
    paddingRight: "11px",
    background: "white",
    paddingTop: "12px",
  },

  topSection: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minHeight: 0,
    overflow: "hidden",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    flexShrink: 0,
    borderBottom: "0.85px solid #efefef",
    gap: "7px",
    alignItems: "center",
    paddingLeft: "13px",
  },

  headerUser: {
    display: "flex",
    gap: "7px",
    alignItems: "center",
  },

  iconButton: {
    padding: 0,
  },

  avatar: {
    width: "27px",
    height: "27px",
    border: "1px solid black",
    borderRadius: "50%",
  },

  headerInfo: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: "7px",
    paddingBottom: "7px",
    gap: "7px",
  },

  usernameLink: {
    fontWeight: 600,
    fontSize: "11px",
    lineHeight: "129%",
    color: "#262626",
  },

  dot: {
    width: "2.5px",
    height: "2.5px",
    minWidth: "2.5px",
    borderRadius: "50%",
    backgroundColor: "black",
    border: "none",
  },

  followButton: {
    fontWeight: 600,
    fontSize: "11px",
    lineHeight: "129%",
    textAlign: "center",
    color: "#0095f6",
    textTransform: "none",
    paddingLeft: 0,
  },

  scrollArea: {
    flex: 1,
    minHeight: 0,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },

  descriptionRow: {
    display: "flex",
    alignItems: "flex-start",
    flexShrink: 0,
    paddingBottom: "7px",
    paddingTop: "7px",
    gap: "7px",
    justifyContent: "center",
    paddingLeft: "13px",
  },

  descriptionBody: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    justifyContent: "flex-start",
  },

  menuButton: {
    minWidth: 0,
    width: "20px",
    height: "20px",
    padding: 0,
    color: "#000",
    fontSize: "16px",
    lineHeight: 1,
    textAlign: "center",
  },

  editMenuOverlay: {
    position: "fixed",
    top: 0,
    right: 0,
    bottom: 0,
    left: "245px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(0, 0, 0, 0.25)",
    zIndex: 1400,
  },

  descriptionText: {
    fontWeight: 400,
    fontSize: "11px",
    lineHeight: "129%",
    color: "#262626",
  },

  metaText: {
    fontWeight: 400,
    fontSize: "10px",
    lineHeight: "133%",
    color: "#737373",
  },

  commentsList: {
    display: "flex",
    flexDirection: "column",
    gap: "12.71px",
    paddingLeft: "13px",
    width: "100%",
    paddingTop: "10px",
    flex: 1,
    minHeight: 0,
    overflowY: "auto",
    overscrollBehavior: "contain",
  },

  commentRow: {
    display: "flex",
    justifyContent: "space-between",
    flexShrink: 0,
  },

  commentAuthorRow: {
    display: "flex",
    justifyContent: "flex-start",
    gap: "7px",
  },

  commentDetails: {
    display: "flex",
    gap: "7px",
    alignItems: "flex-start",
    flexDirection: "column",
  },

  commentContentRow: {
    display: "flex",
    gap: "6px",
    justifyContent: "flex-start",
  },

  commentText: {
    fontWeight: 400,
    fontSize: "11px",
    lineHeight: "129%",
    color: "#00376b",
  },

  commentMetaRow: {
    display: "flex",
    gap: "6px",
    justifyContent: "flex-start",
  },

  commentLikeIcon: {
    width: "10px",
    height: "10px",
  },

  bottomSection: {
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
    alignItems: "flex-start",
    paddingLeft: "13px",
    borderTop: "0.85px solid #efefef",
  },

  actions: {
    display: "flex",
    gap: "13.5px",
    paddingTop: "12.71px",
    paddingBottom: "14px",
  },

  actionIcon: {
    width: "20.34px",
    height: "20.34px",
  },

  likesInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "2.5px",
    paddingBottom: "11px",
  },

  likesCount: {
    fontWeight: 600,
    fontSize: "11px",
    lineHeight: "129%",
    color: "#000",
  },

  postDate: {
    fontWeight: 400,
    fontSize: "10px",
    lineHeight: "133%",
    letterSpacing: "0.02em",
    color: "#737373",
  },

  commentForm: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "calc(100% + 13px)",
    marginLeft: "-13px",
    borderTop: "0.85px solid #dbdbdb",
    paddingLeft: "13px",
  },

  emojiButton: {
    padding: 0,
    color: "#000",
  },

  emojiIcon: {
    width: "24px",
    height: "24px",
  },

  commentInput: {
    flex: 1,
    minWidth: 0,
    "& .MuiOutlinedInput-root": {
      height: "33px",
      "& .MuiOutlinedInput-notchedOutline": {
        border: "none",
      },
    },
    "& .MuiInputBase-input": {
      fontSize: "12px",
      padding: "0 8px",
      "&::placeholder": {
        color: "#737373",
        opacity: 1,
      },
    },
  },

  sendButton: {
    fontWeight: 600,
    fontSize: "11px",
    lineHeight: "129%",
    textAlign: "center",
    color: "#0095f6",
    textTransform: "none",
  },
};
