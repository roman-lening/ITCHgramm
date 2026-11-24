const titleText = {
  fontWeight: 700,
  fontSize: "20px",
  lineHeight: "125%",
  color: "#000",
};

const blueButton = {
  borderRadius: "8px",
  height: "32px",
  background: "#0095f6",
  fontWeight: 600,
  fontSize: "14px",
  lineHeight: "129%",
  textAlign: "center",
  color: "#fff",
  textTransform: "none",
};

const inputBorder = {
  "& .MuiOutlinedInput-notchedOutline": {
    border: "1px solid #dbdbdb",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#dbdbdb",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "1px solid #dbdbdb",
  },
};

const textInput = (fontWeight, color) => ({
  width: "610px",
  background: "#fff",
  "& .MuiOutlinedInput-root": {
    height: "42px",
    borderRadius: "12px",
    ...inputBorder,
    "& .MuiInputBase-input": {
      fontWeight,
      fontSize: "14px",
      lineHeight: "129%",
      color,
    },
  },
});

export const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "33px",
    margin: "0 auto",
    width: "610px",
    paddingTop: "48px",
    paddingBottom: "117px",
  },

  title: {
    ...titleText,
  },

  profilePreview: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: "20px",
    background: "#efefef",
    paddingLeft: "16px",
    paddingRight: "16px",
  },

  profileInfo: {
    display: "flex",
    gap: "16px",
    alignItems: "center",
  },

  avatar: {
    width: "56px",
    height: "56px",
    border: "1px solid black",
    borderRadius: "50%",
  },

  profileDetails: {
    display: "flex",
    flexDirection: "column",
    gap: "9px",
    paddingTop: "16px",
    paddingBottom: "8px",
    width: "270px",
  },

  profileUsername: {
    fontWeight: 700,
    fontSize: "16px",
    lineHeight: "125%",
    color: "#000",
  },

  profileDescription: {
    fontWeight: 400,
    fontSize: "14px",
    lineHeight: "129%",
    color: "#737373",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },

  newPhotoButton: {
    ...blueButton,
    width: "114px",
  },

  fileInput: {
    display: "none",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    paddingTop: "11px",
    gap: "21px",
    width: "100%",
  },

  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  usernameInput: textInput(400, "#000"),

  websiteInput: textInput(600, "#00376b"),

  linkIcon: {
    width: "10px",
    height: "10px",
  },

  aboutContainer: {
    position: "relative",
    width: "610px",
  },

  aboutInput: {
    width: "100%",
    background: "#fff",
    "& .MuiOutlinedInput-root": {
      minHeight: "42px",
      maxHeight: "62px",
      borderRadius: "12px",
      padding: "4px 75px 4px 12px",
      boxSizing: "border-box",
      overflow: "hidden",
      ...inputBorder,
    },
    "& .MuiInputBase-inputMultiline": {
      fontWeight: 400,
      fontSize: "14px",
      lineHeight: "129%",
      color: "#000",
      padding: "0 !important",
      overflowY: "auto !important",
    },
  },

  aboutCounter: {
    position: "absolute",
    right: "12px",
    bottom: "9px",
    fontWeight: 400,
    fontSize: "12px",
    color: "#737373",
    pointerEvents: "none",
  },

  saveButton: {
    ...blueButton,
    width: "268px",
    marginTop: "46px",
  },

  fieldError: {
    fontWeight: 400,
    fontSize: "12px",
    lineHeight: "129%",
    color: "#ed4956",
  },

  statusText: {
    fontWeight: 400,
    fontSize: "14px",
    lineHeight: "129%",
    color: "#737373",
  },
};
