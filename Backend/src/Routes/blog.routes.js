import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import Blog from "../models/Blog.js";
import { sendMail } from "../utils/mailer.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

/* -------- SUBMIT BLOG -------- */
router.post("/submit", upload.array("files"), async (req, res) => {
  try {
    const { title, content, authorName, authorEmail } = req.body;

    if (!title || !content || !authorName || !authorEmail) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const files = [];

    if (req.files?.length) {
      for (const file of req.files) {
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              { folder: "uploads/blogs", resource_type: "auto" },
              (err, result) => {
                if (err) reject(err);
                else resolve(result);
              }
            )
            .end(file.buffer);
        });

        files.push({
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
      files,
    });

    // ✅ Respond FIRST (fast UX)
    res.json({ message: "Blog submitted for admin approval", blog });

    // 📧 Best-effort admin notification (non-blocking)
    sendMail({
      to: process.env.ADMIN_EMAIL,
      subject: "New blog pending approval",
      html: `
        <p>A new blog has been submitted on <b>Biocrats</b>.</p>
        <p><b>Title:</b> ${blog.title}</p>
        <p><b>Author:</b> ${blog.authorName} (${blog.authorEmail})</p>
        <p>Please review it from the admin panel.</p>
      `,
    }).catch((err) =>
      console.error("Admin mail failed:", err.message)
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Submission failed" });
  }
});

/* -------- GET APPROVED BLOGS -------- */
router.get("/", async (_req, res) => {
  const blogs = await Blog.find({ status: "approved" }).sort({
    createdAt: -1,
  });
  res.json({ blogs });
});

export default router;
