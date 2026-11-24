const secondaryText = {
  fontWeight: 400,
  fontSize: "12px",
  lineHeight: "133%",
  textAlign: "center",
  color: "#737373",
};

export const styles = {
  rightContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "15px",
    width: "100%",
    margin: "0 auto",
    maxWidth: "350px",
  },

  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    gap: "4px",
  },

  fieldError: {
    fontWeight: 400,
    fontSize: "12px",
    lineHeight: "129%",
    color: "#ff0000",
  },

  formError: {
    fontWeight: 400,
    fontSize: "12px",
    lineHeight: "129%",
    textAlign: "center",
    color: "#ed4956",
  },

  registerCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: "30px",
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

  title: {
    fontWeight: 600,
    fontSize: "16px",
    lineHeight: "125%",
    textAlign: "center",
    color: "#737373",
  },

  registerForm: {
    width: "100%",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    gap: "6px",
    paddingTop: "37px",
    paddingBottom: "26px",
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

  termsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },

  contactText: {
    ...secondaryText,
    fontSize: "11.8px",
  },

  termsText: {
    ...secondaryText,
  },

  links: {
    fontWeight: 400,
    fontSize: "12px",
    lineHeight: "133%",
    textAlign: "center",
    color: "#00376b",
  },

  registerButton: {
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
    marginTop: "26px",
  },

  loginCard: {
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

  loginText: {
    fontWeight: 400,
    fontSize: "14px",
    lineHeight: "129%",
    textAlign: "center",
    color: "#000",
  },

  loginLink: {
    fontWeight: 600,
    fontSize: "14px",
    lineHeight: "129%",
    textAlign: "center",
    color: "#0095f6",
  },
};
