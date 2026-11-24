export const styles = {
  container: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 317px)",
    gridTemplateRows: "repeat(4, 317px)",
    gridAutoRows: "317px",
    gridAutoFlow: "row dense",
    gap: "4px",
    width: "1082px",
    margin: "0 auto",
    height: "1280px",
    paddingTop: "89px",
    paddingBottom: "89px",
    paddingLeft: "123px",
    minHeight: 0,
    overflowY: "auto",
    overscrollBehavior: "contain",
  },

  postImage: (index) => ({
    width: "100%",
    height: "100%",
    objectFit: "cover",
    gridRow: index === 2 || index === 5 ? "span 2" : "span 1",
    cursor: "pointer",
  }),

  modalContent: {
    width: "100%",
    margin: "0 auto",
  },

  statusText: {
    gridColumn: "1 / -1",
    fontWeight: 400,
    fontSize: "14px",
    lineHeight: "129%",
    color: "#737373",
  },
};
