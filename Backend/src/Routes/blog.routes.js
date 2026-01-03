// import express from "express";
// import multer from "multer";
// import cloudinary from "../config/cloudinary.js";
// import Blog from "../models/Blog.js";
// import { sendMail } from "../utils/mailer.js";
// import { uploadBlogfiles } from "../middleware/upload.js";
// import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";
// import adminAuth from "../middleware/adminAuth.js";

// const router = express.Router();

// /* -------- SUBMIT BLOG -------- */
// router.post(
//   "/submit",
//   uploadBlogfiles.array("files"),
//   async (req, res) => {

//   try {
//     const { title, content, authorName, authorEmail } = req.body;

//     if (!title || !content || !authorName || !authorEmail) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     const files = [];

//     if (req.files?.length) {
//       for (const file of req.files) {
//         const result = await new Promise((resolve, reject) => {
//           cloudinary.uploader
//             .upload_stream(
//               { folder: "uploads/blogs", resource_type: "auto" },
//               (err, result) => {
//                 if (err) reject(err);
//                 else resolve(result);
//               }
//             )
//             .end(file.buffer);
//         });

//         files.push({
//           url: result.secure_url,
//           public_id: result.public_id,
//           originalName: file.originalname,
//           mimetype: file.mimetype,
//         });
//       }
//     }

//     const blog = await Blog.create({
//       title,
//       content,
//       authorName,
//       authorEmail,
//       files,
//     });

//     res.json({ message: "Blog submitted for admin approval", blog });

//     sendMail({
//       to: process.env.ADMIN_EMAIL,
//       subject: "New blog pending approval",
//       html: `
//         <p>A new blog has been submitted on <b>Biocrats</b>.</p>
//         <p><b>Title:</b> ${blog.title}</p>
//         <p><b>Author:</b> ${blog.authorName} (${blog.authorEmail})</p>
//         <p>Please review it from the admin panel.</p>
//       `,
//     }).catch((err) =>
//       console.error("Admin mail failed:", err.message)
//     );
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Submission failed" });
//   }
//   // error handling middleware for multer errors
// router.use((err, req, res, next) => {
//   if (err instanceof multer.MulterError) {
//     return res.status(400).json({ message: err.message });
//   }
//   if (err) {
//     return res.status(400).json({ message: err.message });
//   }
//   next();
// });

// /* -------- GET APPROVED BLOGS -------- */
// router.get("/", async (_req, res) => {
//   const blogs = await Blog.find({ status: "approved" }).sort({
//     createdAt: -1,
//   });
//   res.json({ blogs });
// });
// });
// export default router;

import express from "express";
import Blog from "../models/Blog.js";
import { uploadBlogfiles } from "../middleware/upload.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";
import { sendMail } from "../utils/mailer.js";

const router = express.Router();

router.post(
  "/submit",
 uploadBlogfiles.array("files", 5),
  async (req, res) => {
    try {
      const { title, content, authorName, authorEmail } = req.body;

      if (!title || !content || !authorName || !authorEmail) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const uploadedFiles = [];

      if (req.files?.length) {
        for (const file of req.files) {
          const result = await uploadToCloudinary(file);

          uploadedFiles.push({
            url: result.secure_url,
            public_id: result.public_id,
            originalName: file.originalname,
            mimetype: file.mimetype,
          });
        }
      }

      const blog = await Blog.create({
        title,
        content,
        authorName,
        authorEmail,
        files: uploadedFiles,
      });

      res.json({ message: "Blog submitted", blog });
    sendMail({
      to: process.env.ADMIN_EMAIL,
      subject: "New blog pending approval",
      html: `
        <p>A new blog has been submitted on <b>Biocrats</b>.</p>
        <p><b>Title:</b> ${blog.title}</p>
        <p><b>Author:</b> ${blog.authorName} (${blog.authorEmail})</p>
        <p>Please review it from the admin panel.</p>
      `,
    }).catch(() => {});
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  }
);
// error handling middleware for multer errors
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: err.message });
  }
  if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
});

/* -------- GET APPROVED BLOGS -------- */
router.get("/", async (_req, res) => {
  const blogs = await Blog.find({ status: "approved" }).sort({
    createdAt: -1,
  });
  res.json({ blogs });
});
export default router;
