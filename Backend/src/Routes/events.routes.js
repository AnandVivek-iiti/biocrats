
import express from "express";
import Event from "../models/Event.js";
import { uploadEventImages } from "../middleware/upload.js";
import adminAuth from "../middleware/adminAuth.js";
import cloudinary from "../config/cloudinary.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";

const router = express.Router();

/* ---------------- HELPERS ---------------- */

const toClientEvent = (event) => ({
  ...event,
  id: event._id.toString(),
  _id: event._id.toString(),
  images: event.images.map((img) => img.url),
});

/* ---------------- GET ALL EVENTS ---------------- */

router.get("/", async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 }).lean();
    res.json({
      success: true,
      events: events.map(toClientEvent),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ---------------- GET SINGLE EVENT ---------------- */

router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).lean();
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }
    res.json({ success: true, event: toClientEvent(event) });
  } catch (err) {
    res.status(400).json({ success: false, message: "Invalid event ID" });
  }
});

/* ---------------- CREATE EVENT ---------------- */

router.post(
  "/",
  adminAuth,
  uploadEventImages.array("images", 10),
  async (req, res) => {
    try {
      const { title, description, date } = req.body;

      if (!title || !description || !date) {
        return res.status(400).json({
          success: false,
          message: "Title, description and date are required",
        });
      }

      const uploadedImages = [];

      for (const file of req.files || []) {
        const result = await uploadToCloudinary(file);
        uploadedImages.push({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }

      const event = await Event.create({
        ...req.body,
        images: uploadedImages,
        createdBy: req.user?.userId,
      });

      res.status(201).json({
        success: true,
        event: toClientEvent(event.toObject()),
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

/* ---------------- UPDATE EVENT ---------------- */

router.put(
  "/:id",
  adminAuth,
  uploadEventImages.array("images", 10),
  async (req, res) => {
    try {
      const event = await Event.findById(req.params.id);
      if (!event) {
        return res.status(404).json({ success: false, message: "Event not found" });
      }

      const keepImages = Array.isArray(req.body.existingImages)
        ? req.body.existingImages
        : req.body.existingImages
        ? [req.body.existingImages]
        : [];

      // Delete removed images
      for (const img of event.images) {
        if (!keepImages.includes(img.url)) {
          await cloudinary.uploader.destroy(img.publicId);
        }
      }

      // Upload new images
      const newImages = [];
      for (const file of req.files || []) {
        const result = await uploadToCloudinary(file);
        newImages.push({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }

      event.images = [
        ...event.images.filter((img) => keepImages.includes(img.url)),
        ...newImages,
      ];

      Object.assign(event, req.body);
      await event.save();

      res.json({
        success: true,
        event: toClientEvent(event.toObject()),
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

/* ---------------- DELETE EVENT ---------------- */

router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    for (const img of event.images) {
      await cloudinary.uploader.destroy(img.publicId);
    }

    await event.deleteOne();

    res.json({ success: true, message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
