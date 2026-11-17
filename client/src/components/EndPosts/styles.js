const textBase = {
  fontWeight: 400,
  lineHeight: "129%",
  textAlign: "center",
};

export const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "10.77px",
    width: "100%",
    maxWidth: "404px",
    margin: "0 auto",
    paddingBottom: "56.85px",
    paddingTop: "27.56px",
  },

  image: {
    width: "82px",
    height: "82px",
    objectFit: "contain",
  },

  textContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },

  title: {
    ...textBase,
    fontSize: "16px",
    color: "#000",
  },

  description: {
    ...textBase,
    fontSize: "12px",
    color: "#737373",
  },
};
