import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },

    authorName: { type: String, required: true },
    authorEmail: { type: String, required: true },

    files: [
      {
        url: String,
        public_id: String,
        originalName: String,
        mimetype: String,
      },
    ],

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Blog", BlogSchema);
