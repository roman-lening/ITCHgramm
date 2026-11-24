
const button = {
  fontWeight: 400,
  fontSize: "14px",
  lineHeight: "150%",
  textAlign: "center",
  color: "#000",
  width: "400px",
  height: "48px",
  textTransform: "none",
  borderBottom: "1px solid #dbdbdb",
};

export const styles = {
  container: {
    display: "flex",
    margin: "0 auto",
    width: "400px",
    height: "240px",
    borderRadius: "12px",
    flexDirection: "column",
    background: "#fff",
    overflow: "hidden",
  },

  button: {
    ...button,
  },

  deleteButton: {
    ...button,
    fontWeight: 700,
    color: "#ed4956",
    width: "100%",
  },

  cancelButton: {
    ...button,
    borderBottom: "none",
  },
};
