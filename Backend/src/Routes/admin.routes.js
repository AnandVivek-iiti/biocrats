
import express from "express";
import Blog from "../models/Blog.js";
import adminAuth from "../middleware/adminAuth.js";
import { sendMail } from "../utils/mailer.js";
import { deleteFromCloudinary } from "../config/cloudinary.js";
const router = express.Router();

/* -------- GET ALL BLOGS (ADMIN) -------- */
router.get("/blogs", adminAuth, async (_req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json({ success: true, blogs });
  } catch (err) {
    console.error("Get blogs error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch blogs",
      error: process.env.NODE_ENV === "production" ? err.message : undefined
    });
  }
});

/* -------- EDIT BLOG -------- */
router.put("/blogs/:id", adminAuth, async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required"
      });
    }

    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, content, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found"
      });
    }

    res.json({
      success: true,
      message: "Blog updated successfully",
      blog
    });
  } catch (err) {
    console.error("Update blog error:", err);

    if (err.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid blog ID format"
      });
    }

    res.status(500).json({
      success: false,
      message: "Update failed",
      error: process.env.NODE_ENV === "production" ? err.message : undefined
    });
  }
});

/* -------- DELETE BLOG -------- */
router.delete("/blogs/:id", adminAuth, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found"
      });
    }
  const publicIds = blog.files.map((f) => f.public_id);

    // 1️⃣ Delete from Cloudinary
    await deleteFromCloudinary(publicIds);

    // 2️⃣ Delete from DB
    await blog.deleteOne();
    res.json({
      success: true,
      message: "Blog deleted successfully"
    });
  } catch (err) {
    console.error("Delete blog error:", err);

    if (err.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid blog ID format"
      });
    }

    res.status(500).json({
      success: false,
      message: "Delete failed",
      error: process.env.NODE_ENV === "production" ? err.message : undefined
    });
  }
});

/* -------- APPROVE BLOG -------- */
router.put("/blogs/:id/approve", adminAuth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found"
      });
    }

    blog.status = "approved";
    blog.updatedAt = new Date();
    await blog.save();

    // Send approval email (don't block response if it fails)
    sendMail({
      to: blog.authorEmail,
      subject: "Your blog has been approved 🎉",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">Congratulations!</h2>
          <p>Hi <b>${blog.authorName}</b>,</p>
          <p>Your blog titled <b>"${blog.title}"</b> has been approved and is now live on <b>Biocrats</b>.</p>
          <p>Thank you for contributing to our community!</p>
          <br>
          <p>Best regards,<br>Biocrats Team</p>
        </div>
      `,
    }).catch((err) => console.error("Approval email failed:", err.message));

    res.json({
      success: true,
      message: "Blog approved successfully",
      blog
    });
  } catch (err) {
    console.error("Approve blog error:", err);

    if (err.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid blog ID format"
      });
    }

    res.status(500).json({
      success: false,
      message: "Approval failed",
      error: process.env.NODE_ENV === "production" ? err.message : undefined
    });
  }
});

/* -------- REJECT BLOG -------- */
router.put("/blogs/:id/reject", adminAuth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found"
      });
    }

    blog.status = "rejected";
    blog.updatedAt = new Date();
    await blog.save();

    // Send rejection email (don't block response if it fails)
    sendMail({
      to: blog.authorEmail,
      subject: "Update on your blog submission",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #DC2626;">Blog Submission Update</h2>
          <p>Hi <b>${blog.authorName}</b>,</p>
          <p>Your blog titled <b>"${blog.title}"</b> could not be approved at this time.</p>
          <p>You may revise the content and submit again. Our team is here to help if you have any questions.</p>
          <br>
          <p>Best regards,<br>Biocrats Team</p>
        </div>
      `,
    }).catch((err) => console.error("Rejection email failed:", err.message));

    res.json({
      success: true,
      message: "Blog rejected",
      blog
    });
  } catch (err) {
    console.error("Reject blog error:", err);

    if (err.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid blog ID format"
      });
    }

    res.status(500).json({
      success: false,
      message: "Rejection failed",
      error: process.env.NODE_ENV === "production" ? err.message : undefined
    });
  }
});

export default router;