import multer from "multer";

export const handleUpload = (middleware) => {
  return (req, res, next) => {
    middleware(req, res, (error) => {
      if (!error) {
        return next();
      }
      if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
          return res.status(413).json({
            message: "File is too large",
          });
        }
        return res.status(400).json({
          message: error.message,
        });
      }
      return res.status(400).json({
        message: error.message,
      });
    });
  };
};
