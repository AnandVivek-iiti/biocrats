import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      required: [true, "Event description is required"],
      trim: true,
    },
    fullDescription: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ["Upcoming", "Past Event"],
        message: "{VALUE} is not a valid status",
      },
      default: "Upcoming",
    },
    date: {
      type: String,
      required: [true, "Event date is required"],
      trim: true,
    },
    location: {
      type: String,
      default: "",
      trim: true,
    },
    participants: {
      type: String,
      default: "",
      trim: true,
    },
    speaker: {
      type: String,
      default: "",
      trim: true,
    },
    Speaker: {
      type: String,
      default: "",
      trim: true,
    },
    category: {
      type: String,
      enum: {
        values: ["workshop", "competition", "symposium", "seminar"],
        message: "{VALUE} is not a valid category",
      },
      default: "workshop",
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        publicId: {
          type: String,
          required: true,
        },
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true, 
  }
);

// Index for better query performance
eventSchema.index({ status: 1, category: 1 });
eventSchema.index({ createdAt: -1 });

// Virtual for id field (for compatibility)
eventSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtuals are included in JSON
eventSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    return ret;
  },
});

eventSchema.set("toObject", {
  virtuals: true,
});

// Pre-save middleware to sync speaker fields
eventSchema.pre("save", function (next) {
  if (this.speaker && !this.Speaker) {
    this.Speaker = this.speaker;
  } else if (this.Speaker && !this.speaker) {
    this.speaker = this.Speaker;
  }
  next();
});

// Static method to find upcoming events
eventSchema.statics.findUpcoming = function () {
  return this.find({ status: "Upcoming" }).sort({ createdAt: -1 });
};

// Static method to find past events
eventSchema.statics.findPast = function () {
  return this.find({ status: "Past Event" }).sort({ createdAt: -1 });
};

// Instance method to mark as past
eventSchema.methods.markAsPast = function () {
  this.status = "Past Event";
  return this.save();
};

const Event = mongoose.model("Event", eventSchema);

export default Event;