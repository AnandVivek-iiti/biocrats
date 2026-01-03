// import cloudinary from "../config/cloudinary.js";

// export const uploadToCloudinary = async (file, folder = "biocrats/events") => {
//   return cloudinary.uploader.upload(
//     `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
//     {
//       folder,
//       resource_type: "image",
//     }
//   );
// };
// export const uploadToCloudinaryBlogs = async (file, folder = "biocrats/events") => {
//   return cloudinary.uploader.upload(
//     `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
//     {
//       folder,
//       resource_type: "image",
//     }
//   );
// };

import cloudinary from "../config/cloudinary.js";

export const uploadToCloudinary = (file) => {
  let folder = "biocrats/others";
  let resource_type = "auto";

  if (file.mimetype.startsWith("image/")) {
    folder = "biocrats/images";
  } else if (file.mimetype === "application/pdf") {
    folder = "biocrats/pdfs";
  } else {
    folder = "biocrats/docs";
  }

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { folder, resource_type },
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      )
      .end(file.buffer);
  });
};
