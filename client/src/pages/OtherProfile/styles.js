
const statText = {
  fontWeight: 600,
  fontSize: "16px",
  lineHeight: "113%",
  color: "#000",
};

const actionButton = {
  borderRadius: "8px",
  height: "32px",
  fontWeight: 600,
  fontSize: "14px",
  lineHeight: "129%",
  textAlign: "center",
  textTransform: "none",
};

export const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "46px",
    width: "100%",
    maxWidth: "935px",
    minWidth: 0,
    margin: "0 auto",
    paddingLeft: "170px",
    paddingTop: "38px",
  },

  header: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    gap: "94px",
  },

  avatar: {
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    border: "1px solid black",
    objectFit: "cover",
    objectPosition: "center",
    flexShrink: 0,
  },

  profileInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  profileActions: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: "20px",
  },

  username: {
    fontWeight: 400,
    fontSize: "19px",
    lineHeight: "126%",
    color: "#000",
  },

  buttons: {
    display: "flex",
    gap: "8px",
  },

  followButton: {
    ...actionButton,
    width: "132px",
    color: "#fff",
    background: "#0095f6",
  },

  messageButton: {
    ...actionButton,
    width: "190px",
    color: "#000",
    background: "#efefef",
  },

  statistics: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: "40px",
  },

  postsCount: {
    ...statText,
    paddingRight: "51px",
  },

  statText: {
    ...statText,
  },

  bioContainer: {},

  bio: (expanded) => ({
    fontWeight: 400,
    fontSize: "14px",
    lineHeight: "129%",
    color: "#000",
    maxHeight: expanded ? "none" : "52px",
    overflow: "hidden",
    overflowWrap: "anywhere",
  }),

  moreButton: {
    padding: 0,
    minWidth: 0,
    fontSize: "14px",
    color: "#737373",
    textTransform: "none",
  },

  websiteContainer: {
    display: "flex",
    gap: "7px",
    alignItems: "center",
    textDecoration: "none",
  },

  websiteIcon: {
    width: "12px",
    height: "12px",
  },

  websiteText: {
    fontWeight: 600,
    fontSize: "14px",
    lineHeight: "129%",
    color: "#00376b",
  },

  postsGrid: {
    display: "grid",
    justifyContent: "center",
    gridTemplateColumns: "repeat(3, 307px)",
    gridAutoRows: "307px",
    gap: "4px",
    width: "929px",
    height: "618px",
    minHeight: 0,
    overflowY: "auto",
    overflowX: "hidden",
  },

  postImage: {
    width: "307px",
    height: "307px",
    objectFit: "cover",
    objectPosition: "center",
    cursor: "pointer",
  },

  modalContent: {
    width: "100%",
    margin: "0 auto",
  },

  statusText: {
    fontWeight: 400,
    fontSize: "14px",
    lineHeight: "129%",
    color: "#737373",
  },
};
