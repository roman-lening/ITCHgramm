
export const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    maxWidth: "390px",
    margin: "0 auto",
    paddingTop: "25px",
    paddingLeft: {
      xs: "20px",
      sm: "45px",
    },
    paddingRight: {
      xs: "20px",
      sm: "45px",
    },
    border: "1px solid #dbdbdb",
    borderRadius: "1px",
  },

  header: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    gap: "14px",
    width: "100%",
  },

  logoCircle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "96px",
    height: "96px",
    border: "2px solid #262626",
    borderRadius: "50%",
  },

  mailIcon: {
    width: "42px",
    height: "42px",
    color: "#262626",
  },

  title: {
    fontWeight: 600,
    fontSize: "16px",
    lineHeight: "125%",
    textAlign: "center",
    color: "#000",
  },

  description: {
    fontWeight: 400,
    fontSize: "14px",
    lineHeight: "129%",
    textAlign: "center",
    color: "#737373",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    gap: "16px",
    paddingTop: "16px",
    paddingBottom: "32px",
  },

  input: {
    width: "100%",
    background: "#fafafa",
    "& .MuiOutlinedInput-root": {
      height: "38px",
    },
    "& .MuiInputBase-input": {
      fontSize: "12px",
      padding: "0 8px",
      "&::placeholder": {
        color: "#c7c7c7",
        opacity: 1,
      },
    },
  },

  verifyButton: {
    width: "100%",
    borderRadius: "8px",
    paddingTop: "7px",
    paddingBottom: "7px",
    background: "#0095f6",
    fontWeight: 600,
    fontSize: "14px",
    lineHeight: "129%",
    textAlign: "center",
    color: "#fff",
    textTransform: "none",
    "&:hover": {
      background: "#1877f2",
    },
    "&.Mui-disabled": {
      background: "#b2dffc",
      color: "#fff",
    },
  },

  errorText: {
    width: "100%",
    fontWeight: 400,
    fontSize: "12px",
    lineHeight: "129%",
    textAlign: "center",
    color: "#ed4956",
  },

  navigation: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    gap: "5px",
    paddingBottom: "55px",
  },

  resendText: {
    fontWeight: 400,
    fontSize: "13px",
    lineHeight: "129%",
    color: "#737373",
  },

resendButton: {
  padding: 0,
  minWidth: 0,
  fontWeight: 600,
  fontSize: "13px",
  lineHeight: "129%",
  color: "#0095f6",
  textTransform: "none",
  "&.Mui-disabled": {
    color: "#737373",
  },
},

  messageText: {
    fontWeight: 400,
    fontSize: "12px",
    lineHeight: "129%",
    textAlign: "center",
    color: "#737373",
    paddingBottom: "16px",
  },

  backToLogin: {
    fontWeight: 600,
    fontSize: "14px",
    lineHeight: "129%",
    textAlign: "center",
    color: "#262626",
    border: "1px solid #dbdbdb",
    background: "#fafafa",
    paddingTop: "13px",
    paddingBottom: "13px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: {
      xs: "calc(100% + 40px)",
      sm: "calc(100% + 90px)",
    },
    textDecoration: "none",
  },
};
