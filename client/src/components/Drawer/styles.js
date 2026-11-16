const drawerWidth = 245;

const secondaryDrawer = (width) => ({
  "& .MuiDrawer-paper": {
    left: `${drawerWidth}px`,
    width: `min(${width}px, calc(100vw - ${drawerWidth}px))`,
  },
});

export const styles = {
  container: {
    display: "flex",
  },

  mainDrawer: {
    width: drawerWidth,
    flexShrink: 0,
    "& .MuiDrawer-paper": {
      width: drawerWidth,
      boxSizing: "border-box",
      display: "flex",
      alignItems: "flex-start",
      paddingTop: "28px",
      paddingLeft: "25px",
      gap: "22px",
      borderRight: "1px solid #dbdbdb",
    },
  },

  logo: {
    width: "97px",
    height: "55px",
    objectFit: "contain",
  },

  item: {
    display: "flex",
    justifyContent: "flex-start",
    gap: "16px",
    paddingLeft: "12px",
    paddingBottom: "12px",
    paddingTop: "12px",
  },

  icon: {
    width: "24px",
    height: "24px",
  },

  profileIcon: {
    borderRadius: "12px",
    width: "24px",
    height: "24px",
    background: "#fafafa",
  },

  text: (fontWeight) => ({
    fontWeight,
    fontSize: "16px",
    lineHeight: "125%",
    color: "#000",
    alignSelf: "flex-end",
  }),

  searchDrawer: secondaryDrawer(397),

  messageDrawer: secondaryDrawer(398),
};
