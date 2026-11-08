import cloudinary from "../config/cloudinary.js";

export const uploadToCloudinary = (file, folder) => {
  return new Promise((resolve, reject) => {
    const resourceType = file.mimetype.startsWith("video/") ? "video" : "image";
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        if (!result) {
          return reject(new Error("Cloudinary returned no result"));
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          resourceType,
        });
      },
    );
    stream.end(file.buffer);
  });
};

export const deleteFromCloudinary = async (
  publicId,
  resourceType = "image",
) => {
  if (!publicId) {
    return;
  }
  await cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
  });
};
