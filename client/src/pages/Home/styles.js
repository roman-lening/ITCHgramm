export const styles = {
  container: {
    display: "flex",
    gap: "11px",
    flexDirection: "column",
    margin: "0 auto",
    width: "848px",
    paddingTop: "58px",
  },

  postsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 404px)",
    gridAutoRows: "max-content",
    gap: "40px",
    height: "1320px",
    minHeight: 0,
    overflowY: "auto",
    overscrollBehavior: "contain",
  },
};
