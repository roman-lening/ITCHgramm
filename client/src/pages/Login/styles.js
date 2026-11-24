export const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    margin: "0 auto",
    paddingTop: "clamp(24px, 3.75vw, 54px)",
    paddingBottom: "clamp(48px, 6.8vw, 98px)",
    paddingLeft: "clamp(16px, 5.97vw, 86px)",
    paddingRight: "clamp(16px, 5.97vw, 86px)",
    gap: "32px",
    width: "max-content",
    maxWidth: "100%",
  },

  loginImage: {
    width: "380px",
    height: "581px",
    objectFit: "contain",
    display: {
      xs: "none",
      md: "block",
    },
  },

  rightContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    width: "100%",
    maxWidth: "350px",
  },

  loginCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: "23px",
    paddingTop: "30px",
    paddingLeft: {
      xs: "16px",
      sm: "40px",
    },
    paddingRight: {
      xs: "16px",
      sm: "40px",
    },
    border: "1px solid #dbdbdb",
    borderRadius: "1px",
    width: "100%",
  },

  logo: {
    width: "190px",
    height: "106px",
    marginLeft: {
      xs: "0px",
      sm: "40px",
    },
    marginRight: {
      xs: "0px",
      sm: "40px",
    },
    objectFit: "contain",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    gap: "6px",
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
        color: "#737373",
        opacity: 1,
      },
    },
  },

  loginButton: {
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
    marginTop: "8px",
  },

  dividerContainer: {
    display: "flex",
    gap: "18px",
    paddingTop: "22px",
    paddingBottom: "70px",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    maxWidth: "350px",
    margin: "0 auto",
  },

  divider: {
    flex: 1,
    background: "#dbdbdb",
  },

  dividerText: {
    fontWeight: 600,
    fontSize: "13px",
    lineHeight: "115%",
    textTransform: "uppercase",
    color: "#737373",
  },

  forgotPassword: {
    fontWeight: 400,
    fontSize: "12px",
    lineHeight: "133%",
    textAlign: "center",
    color: "#00376b",
  },

  signupCard: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid #dbdbdb",
    borderRadius: "1px",
    gap: "2px",
    paddingTop: "22px",
    paddingBottom: "22px",
    width: "100%",
    flexWrap: "wrap",
  },

  signupText: {
    fontWeight: 400,
    fontSize: "14px",
    lineHeight: "129%",
    textAlign: "center",
    color: "#000",
  },

  signupLink: {
    fontWeight: 600,
    fontSize: "14px",
    lineHeight: "129%",
    textAlign: "center",
    color: "#0095f6",
  },

  formError: {
    width: "100%",
    fontWeight: 400,
    fontSize: "12px",
    lineHeight: "129%",
    textAlign: "center",
    color: "#ed4956",
  },

  successText: {
    width: "100%",
    fontWeight: 400,
    fontSize: "12px",
    lineHeight: "129%",
    textAlign: "center",
    color: "#008a45",
  },
};
