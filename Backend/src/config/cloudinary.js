import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("Cloudinary Config:", {
  name: process.env.CLOUDINARY_CLOUD_NAME,
  key: process.env.CLOUDINARY_API_KEY ? "Loaded" : "Missing",
  secret: process.env.CLOUDINARY_API_SECRET ? "Loaded" : "Missing",
});

export const deleteFromCloudinary = async (publicIds = []) => {
  if (!publicIds.length) return;

  // auto works for images, pdfs, docs
  await cloudinary.api.delete_resources(publicIds, {
    resource_type: "auto",
  });
};
export default cloudinary;
