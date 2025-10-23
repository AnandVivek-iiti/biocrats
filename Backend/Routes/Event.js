import express from "express";
import Event from "../models/Event.js";
import { authenticateAdmin } from "../middleware/auth.js";
import { uploadEventImages } from "../middleware/upload.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

// Helper function to extract image URLs
const extractImageUrls = (images) => {
  if (!images || !Array.isArray(images)) return [];
  return images.map((img) => (typeof img === "object" && img.url ? img.url : img));
};

// Helper function to transform event for response
const transformEvent = (event) => {
  const eventObj = event.toObject ? event.toObject() : event;
  return {
    ...eventObj,
    id: eventObj._id.toString(),
    _id: eventObj._id.toString(),
    images: extractImageUrls(eventObj.images),
  };
};

// GET all events (Public route)
router.get("/", async (req, res) => {
  try {
    const { status, category } = req.query;
    let query = {};

    if (status && status !== "all") {
      query.status = status === "upcoming" ? "Upcoming" : "Past Event";
    }

    if (category && category !== "all") {
      query.category = category;
    }

    const events = await Event.find(query).sort({ createdAt: -1 }).lean();

    const transformedEvents = events.map((event) => ({
      ...event,
      id: event._id.toString(),
      _id: event._id.toString(),
      images: extractImageUrls(event.images),
    }));

    res.json({ success: true, events: transformedEvents });
  } catch (error) {
    console.error("Get events error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch events",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
});

// GET single event by ID (Public route)
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).lean();

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    const transformedEvent = {
      ...event,
      id: event._id.toString(),
      _id: event._id.toString(),
      images: extractImageUrls(event.images),
    };

    res.json({ success: true, event: transformedEvent });
  } catch (error) {
    console.error("Get event error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID format"
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to fetch event",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
});

// CREATE new event (Admin only)
router.post(
  "/",
  authenticateAdmin,
  uploadEventImages.array("images", 10),
  async (req, res) => {
    try {
      const {
        title,
        description,
        fullDescription,
        status,
        date,
        location,
        participants,
        speaker,
        category,
      } = req.body;

      // Validation
      if (!title || !description || !date) {
        return res.status(400).json({
          success: false,
          message: "Title, description, and date are required",
        });
      }

      if (title.length > 200) {
        return res.status(400).json({
          success: false,
          message: "Title must be less than 200 characters",
        });
      }

      // Process uploaded images
      const images = req.files && req.files.length > 0
        ? req.files.map((file) => ({
            url: file.path,
            publicId: file.filename,
          }))
        : [];

      // Create event
      const event = new Event({
        title: title.trim(),
        description: description.trim(),
        fullDescription: fullDescription ? fullDescription.trim() : "",
        status: status || "Upcoming",
        date: date.trim(),
        location: location ? location.trim() : "",
        participants: participants ? participants.trim() : "",
        speaker: speaker ? speaker.trim() : "",
        Speaker: speaker ? speaker.trim() : "",
        category: category || "workshop",
        images,
        createdBy: req.user.userId,
      });

      await event.save();

      const transformedEvent = transformEvent(event);

      res.status(201).json({
        success: true,
        event: transformedEvent,
        message: "Event created successfully",
      });
    } catch (error) {
      console.error("Create event error:", error);

      // Clean up uploaded images if event creation fails
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          try {
            await cloudinary.uploader.destroy(file.filename);
          } catch (cleanupError) {
            console.error("Error cleaning up image:", cleanupError);
          }
        }
      }

      res.status(500).json({
        success: false,
        message: "Failed to create event",
        error: process.env.NODE_ENV === "development" ? error.message : undefined
      });
    }
  }
);

// UPDATE event (Admin only)
router.put(
  "/:id",
  authenticateAdmin,
  uploadEventImages.array("images", 10),
  async (req, res) => {
    try {
      const event = await Event.findById(req.params.id);

      if (!event) {
        return res.status(404).json({
          success: false,
          message: "Event not found"
        });
      }

      const {
        title,
        description,
        fullDescription,
        status,
        date,
        location,
        participants,
        speaker,
        category,
        existingImages,
      } = req.body;

      // Validation
      if (title && title.length > 200) {
        return res.status(400).json({
          success: false,
          message: "Title must be less than 200 characters",
        });
      }

      // Handle existing images
      let images = [];
      const oldImages = [...event.images]; // Keep reference for cleanup

      if (existingImages) {
        const existing = Array.isArray(existingImages)
          ? existingImages
          : [existingImages];

        // Keep only existing images that are still in the list
        images = event.images.filter((img) => {
          const imgUrl = typeof img === "object" ? img.url : img;
          return existing.includes(imgUrl);
        });
      }

      // Add new uploaded images
      if (req.files && req.files.length > 0) {
        const newImages = req.files.map((file) => ({
          url: file.path,
          publicId: file.filename,
        }));
        images = [...images, ...newImages];
      }

      // Delete removed images from Cloudinary
      const removedImages = oldImages.filter((oldImg) => {
        const oldImgUrl = typeof oldImg === "object" ? oldImg.url : oldImg;
        return !images.some((img) => {
          const imgUrl = typeof img === "object" ? img.url : img;
          return imgUrl === oldImgUrl;
        });
      });

      for (const img of removedImages) {
        try {
          const publicId = typeof img === "object" ? img.publicId : img;
          if (publicId) {
            await cloudinary.uploader.destroy(publicId);
          }
        } catch (err) {
          console.error("Error deleting image from Cloudinary:", err);
        }
      }

      // Update fields
      if (title) event.title = title.trim();
      if (description) event.description = description.trim();
      if (fullDescription !== undefined) event.fullDescription = fullDescription.trim();
      if (status) event.status = status;
      if (date) event.date = date.trim();
      if (location !== undefined) event.location = location.trim();
      if (participants !== undefined) event.participants = participants.trim();
      if (speaker !== undefined) {
        event.speaker = speaker.trim();
        event.Speaker = speaker.trim();
      }
      if (category) event.category = category;

      event.images = images;
      event.updatedAt = new Date();

      await event.save();

      const transformedEvent = transformEvent(event);

      res.json({
        success: true,
        event: transformedEvent,
        message: "Event updated successfully",
      });
    } catch (error) {
      console.error("Update event error:", error);

      if (error.name === "CastError") {
        return res.status(400).json({
          success: false,
          message: "Invalid event ID format"
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to update event",
        error: process.env.NODE_ENV === "development" ? error.message : undefined
      });
    }
  }
);

// DELETE event (Admin only)
router.delete("/:id", authenticateAdmin, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    // Delete images from Cloudinary
    if (event.images && event.images.length > 0) {
      for (const img of event.images) {
        try {
          const publicId = typeof img === "object" ? img.publicId : img;
          if (publicId) {
            await cloudinary.uploader.destroy(publicId);
          }
        } catch (err) {
          console.error("Error deleting image from Cloudinary:", err);
          // Continue with deletion even if image removal fails
        }
      }
    }

    await Event.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Event deleted successfully"
    });
  } catch (error) {
    console.error("Delete event error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID format"
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to delete event",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
});

export default router;