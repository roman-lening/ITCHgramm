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
    position: "relative",
    zIndex: 1400,

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

  searchDrawer: {
    left: `${drawerWidth}px`,
    width: `calc(100% - ${drawerWidth}px)`,

    "& .MuiDrawer-paper": {
      left: `${drawerWidth}px`,
      width: `min(397px, calc(100vw - ${drawerWidth}px))`,
      borderRight: "1px solid #dbdbdb",
      borderRadius: "0 16px 16px 0",
      boxShadow: "4px 0 24px 0 rgba(0, 0, 0, 0.15)",
      background: "#fff",
      paddingTop: "24px",
      paddingLeft: "16px",
      paddingRight: "16px",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      gap: "40px",
      zIndex: 1300,
    },

    "& .MuiBackdrop-root": {
      left: `${drawerWidth}px`,
      backgroundColor: "rgba(0, 0, 0, 0.25)",
    },
  },

  messageDrawer: {
    ...secondaryDrawer(398),
    zIndex: 1200,
  },
};
