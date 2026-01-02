import express from "express";
import Blog from "../models/Blog.js";
import adminAuth from "../middleware/adminAuth.js";
import { sendMail } from "../utils/mailer.js";

const router = express.Router();

/* -------- GET ALL BLOGS (ADMIN) -------- */
router.get("/blogs", adminAuth, async (_req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json({ blogs });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch blogs" });
  }
});

/* -------- EDIT BLOG -------- */
router.put("/blogs/:id", adminAuth, async (req, res) => {
  try {
    const { title, content } = req.body;

    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true }
    );

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json({ message: "Blog updated", blog });
  }
  
  catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});
/* -------- DELETE BLOG -------- */
router.delete("/blogs/:id", adminAuth, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json({ message: "Blog deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

/* -------- APPROVE BLOG -------- */
router.put("/blogs/:id/approve", adminAuth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    blog.status = "approved";
    await blog.save();

   sendMail({
  to: blog.authorEmail,
  subject: "Your blog has been approved 🎉",
  html: `
    <p>Hi <b>${blog.authorName}</b>,</p>
    <p>Your blog titled <b>${blog.title}</b> has been approved and is now live on <b>Biocrats</b>.</p>
    <p>Thank you for contributing!</p>
  `,
}).catch((err) =>
      console.error("Mail failed (approve):", err.message)
    );

    res.json({ message: "Blog approved" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Approval failed" });
  }
});

/* -------- REJECT BLOG -------- */
router.put("/blogs/:id/reject", adminAuth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    blog.status = "rejected";
    await blog.save();

    sendMail({
  to: blog.authorEmail,
  subject: "Update on your blog submission",
  html: `
    <p>Hi <b>${blog.authorName}</b>,</p>
    <p>Your blog titled <b>${blog.title}</b> could not be approved at this time.</p>
    <p>You may revise the content and submit again.</p>
  `,
}).catch((err) =>
      console.error("Mail failed (reject):", err.message)
    );

    res.json({ message: "Blog rejected" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Rejection failed" });
  }
});

export default router;
