import React, { useState, useEffect } from "react";
import Workshop from "../assets/Events/Workshop.png";
import Sci5 from "../assets/Events/Sci5.png";
import Techexpo from "../assets/Events/Techexpo.png";
import Fusion from "../assets/Events/Fusion.png";
import logo from "../assets/logo.png";

import {
  Calendar,
  MapPin,
  Users,
  ArrowRight,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Plus,
  Edit,
  Trash2,
  Upload,
  Save,
  Clock,
  FileText,
  Image,
  File,
} from "lucide-react";

// API Configuration
const API_URL = "http://localhost:5000/api";

// --- HELPER FUNCTIONS ---

// Function to normalize image URLs
const normalizeImageUrl = (imagePath) => {
  if (!imagePath) return "";

  // If it's already a full URL (Cloudinary or other CDN)
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // If it's a relative path, prepend API URL
  return `${API_URL.replace("/api", "")}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
};

// Function to get icon based on file type
const getFileIcon = (mimeType) => {
  if (mimeType.startsWith("image/")) {
    return <Image className="w-5 h-5 text-green-500" />;
  }
  return <File className="w-5 h-5 text-gray-500" />;
};

// --- HELPER COMPONENTS ---

// Image Gallery Modal Component
const ImageGalleryModal = ({ images, currentIndex, onClose, onNavigate }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onNavigate("prev");
      if (e.key === "ArrowRight") onNavigate("next");
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onNavigate]);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center p-4">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
        aria-label="Close gallery"
      >
        <X className="w-8 h-8" />
      </button>

      {images.length > 1 && (
        <>
          <button
            onClick={() => onNavigate("prev")}
            className="absolute left-4 text-white hover:text-gray-300 transition-colors z-10"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-10 h-10" />
          </button>
          <button
            onClick={() => onNavigate("next")}
            className="absolute right-4 text-white hover:text-gray-300 transition-colors z-10"
            aria-label="Next image"
          >
            <ChevronRight className="w-10 h-10" />
          </button>
        </>
      )}

      <div className="relative w-full h-full flex items-center justify-center">
        <img
          src={normalizeImageUrl(images[currentIndex])}
          alt={`Event ${currentIndex + 1}`}
          className="max-w-full max-h-full object-contain"
          onError={(e) => {
            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23f0f0f0' width='400' height='300'/%3E%3Ctext fill='%23999' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EImage not found%3C/text%3E%3C/svg%3E";
          }}
        />
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black bg-opacity-50 px-4 py-2 rounded-full">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>
    </div>
  );
};

// Event Details Modal Component
const EventDetailsModal = ({ event, onClose, onImageClick }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-40 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={onClose}
        ></div>

        <div className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white p-4 pb-0 flex justify-end z-10 border-b">
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 pt-4 sm:p-8">
            {event.images && event.images.length > 0 && (
              <div
                className={`grid gap-2 mb-6 ${
                  event.images.length === 1
                    ? "grid-cols-1"
                    : event.images.length === 2
                    ? "grid-cols-2"
                    : "grid-cols-2 sm:grid-cols-3"
                }`}
              >
                {event.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative overflow-hidden rounded-lg cursor-pointer group aspect-video"
                    onClick={() => onImageClick(idx)}
                  >
                    <img
                      src={normalizeImageUrl(img)}
                      alt={`${event.title} ${idx + 1}`}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23f0f0f0' width='400' height='300'/%3E%3Ctext fill='%23999' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EImage not available%3C/text%3E%3C/svg%3E";
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                  </div>
                ))}
              </div>
            )}

            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${
                event.status === "Past Event"
                  ? "bg-slate-600 text-white"
                  : "bg-green-500 text-white"
              }`}
            >
              {event.status}
            </span>

            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
              {event.title}
            </h2>

            <p className="text-slate-700 text-base leading-relaxed mb-6 whitespace-pre-line">
              {event.fullDescription || event.description}
            </p>

            <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-lg">
              {event.date && (
                <div className="flex items-start gap-3 text-sm text-slate-700">
                  <Calendar className="w-5 h-5 flex-shrink-0 text-blue-600 mt-0.5" />
                  <span>{event.date}</span>
                </div>
              )}
              {event.location && (
                <div className="flex items-start gap-3 text-sm text-slate-700">
                  <MapPin className="w-5 h-5 flex-shrink-0 text-blue-600 mt-0.5" />
                  <span>{event.location}</span>
                </div>
              )}
              {event.participants && (
                <div className="flex items-start gap-3 text-sm text-slate-700">
                  <Users className="w-5 h-5 flex-shrink-0 text-blue-600 mt-0.5" />
                  <span>{event.participants}</span>
                </div>
              )}
              {(event.speaker || event.Speaker) && (
                <div className="flex items-start gap-3 text-sm text-slate-700">
                  <Users className="w-5 h-5 flex-shrink-0 text-blue-600 mt-0.5" />
                  <span>Speaker: {event.speaker || event.Speaker}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Admin Event Form Modal
const AdminEventForm = ({ event, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: event?.title || "",
    description: event?.description || "",
    fullDescription: event?.fullDescription || "",
    status: event?.status || "Upcoming",
    date: event?.date || "",
    location: event?.location || "",
    participants: event?.participants || "",
    speaker: event?.speaker || event?.Speaker || "",
    category: event?.category || "workshop",
  });
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState(event?.images || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    // Validate file types
    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        setError(`File ${file.name} is not an image`);
      }
      return isImage;
    });

    // Validate file sizes (max 5MB per file)
    const validSizedFiles = validFiles.filter(file => {
      const isValidSize = file.size <= 5 * 1024 * 1024;
      if (!isValidSize) {
        setError(`File ${file.name} is too large (max 5MB)`);
      }
      return isValidSize;
    });

    setImages(validSizedFiles);
  };

  const removeExistingImage = (index) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      existingImages.forEach((img) => {
        data.append("existingImages", img);
      });

      images.forEach((img) => {
        data.append("images", img);
      });

      await onSave(data);
    } catch (err) {
      setError(err.message || "Failed to save event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={onClose}
        ></div>

        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
            <h2 className="text-2xl font-bold text-slate-900">
              {event ? "Edit Event" : "Create New Event"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close form"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Event Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter event title"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Status *
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Upcoming">Upcoming</option>
                  <option value="Past Event">Past Event</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="workshop">Workshop</option>
                  <option value="competition">Competition</option>
                  <option value="symposium">Symposium</option>
                  <option value="seminar">Seminar</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Short Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="3"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Brief description for event card"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Full Description
              </label>
              <textarea
                name="fullDescription"
                value={formData.fullDescription}
                onChange={handleChange}
                rows="6"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Detailed description (optional)"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Date *
                </label>
                <input
                  type="text"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  placeholder="e.g., November 15, 2025"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., Main Auditorium, IIT Indore"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Participants
                </label>
                <input
                  type="text"
                  name="participants"
                  value={formData.participants}
                  onChange={handleChange}
                  placeholder="e.g., 150+ participants expected"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Speaker
                </label>
                <input
                  type="text"
                  name="speaker"
                  value={formData.speaker}
                  onChange={handleChange}
                  placeholder="e.g., Dr. John Doe"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Event Images
              </label>

              {existingImages.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-slate-600 mb-2">
                    Existing Images:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {existingImages.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={normalizeImageUrl(img)}
                          alt={`Event ${idx}`}
                          className="w-full h-24 object-cover rounded"
                          onError={(e) => {
                            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23f0f0f0' width='100' height='100'/%3E%3C/svg%3E";
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(idx)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Remove image"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-indigo-400 transition-colors">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <input
                  type="file"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                  id="file-upload"
                  accept="image/*"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer text-indigo-600 hover:text-indigo-700 font-semibold text-lg"
                >
                  Click to upload images
                </label>
                <p className="text-sm text-gray-500 mt-2">Max 5MB per image</p>
              </div>

              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {images.map((file, idx) => (
                    <div key={idx} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt="Preview"
                        className="w-full h-24 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setImages((prev) => prev.filter((_, i) => i !== idx))
                        }
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                        aria-label="Remove new image"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                {loading ? "Saving..." : "Save Event"}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-6 py-3 border border-slate-300 rounded-lg font-semibold hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Event Card Component
const EventCard = ({
  event,
  onReadMore,
  onImageClick,
  isAdmin,
  onEdit,
  onDelete,
}) => {
  const isPastEvent = event.status === "Past Event";
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % event.images.length);
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex(
      (prev) => (prev - 1 + event.images.length) % event.images.length
    );
  };

  const currentImage = event.images?.[currentImageIndex] || "";

  return (
    <div className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col">
      <div className="relative overflow-hidden h-48 sm:h-56">
        <div
          className="w-full h-full bg-center bg-cover transform group-hover:scale-105 transition-transform duration-500 cursor-pointer"
          style={{
            backgroundImage: `url("${normalizeImageUrl(currentImage)}")`,
            backgroundColor: "#f0f0f0",
          }}
          onClick={() => onImageClick(event, currentImageIndex)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        <div className="absolute top-4 right-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold shadow-lg ${
              isPastEvent
                ? "bg-slate-600 text-white"
                : "bg-green-500 text-white"
            }`}
          >
            {event.status}
          </span>
        </div>

        {event.images && event.images.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-1.5 transition-all"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-1.5 transition-all"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
              {event.images.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    idx === currentImageIndex
                      ? "bg-white w-4"
                      : "bg-white bg-opacity-50"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {isAdmin && (
          <div className="absolute top-4 left-4 flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(event);
              }}
              className="bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 transition-colors shadow-lg"
              aria-label="Edit event"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(event);
              }}
              className="bg-red-600 text-white rounded-full p-2 hover:bg-red-700 transition-colors shadow-lg"
              aria-label="Delete event"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="p-5 sm:p-6 flex flex-col flex-grow">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight pr-2">
            {event.title}
          </h3>
        </div>

        <p className="text-slate-600 text-sm mb-4 leading-relaxed line-clamp-3 flex-grow">
          {event.description}
        </p>

        <div className="space-y-2 mb-4">
          {event.date && (
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
              <Calendar className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{event.date}</span>
            </div>
          )}
          {event.location && (
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
          )}
          {event.participants && (
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
              <Users className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{event.participants}</span>
            </div>
          )}
        </div>

        <button
          onClick={() => onReadMore(event)}
          className={`w-full flex items-center justify-center gap-2 rounded-lg h-11 px-4 text-sm font-semibold transition-all duration-300 ${
            isPastEvent
              ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
              : "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg"
          }`}
        >
          <span>Read More</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Main Component
const BiocatsEventsPage = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const categories = [
    { id: "all", label: "All Categories" },
    { id: "workshop", label: "Workshops" },
    { id: "competition", label: "Competitions" },
    { id: "symposium", label: "Symposiums" },
    { id: "seminar", label: "Seminars" },
  ];

  useEffect(() => {
    fetchEvents();
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsAdmin(false);
         setEvents([]);
        setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setIsAdmin(data.user?.isAdmin || false);
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      console.error("Error checking admin status:", error);
      setIsAdmin(false);
    }
  };

  const fetchEvents = async () => {
    try {
        const token = localStorage.getItem("token");
      if (!token) {
        setEvents([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError("");
      const response = await fetch(`${API_URL}/events`);

      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }

      const data = await response.json();

      if (data.success && Array.isArray(data.events)) {
        setEvents(data.events);
      } else {
        setError("Invalid data format received");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      setError("Failed to load events. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = () => {
    setEditingEvent(null);
    setShowEventForm(true);
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setShowEventForm(true);
  };

  const handleSaveEvent = async (formData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login as admin to perform this action");
        return;
      }

      const url = editingEvent
        ? `${API_URL}/events/${editingEvent._id || editingEvent.id}`
        : `${API_URL}/events`;

      const method = editingEvent ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        alert(data.message || "Event saved successfully");
        setShowEventForm(false);
        setEditingEvent(null);
        await fetchEvents();
      } else {
        throw new Error(data.message || "Failed to save event");
      }
    } catch (error) {
      console.error("Error saving event:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleDeleteEvent = async (event) => {
    if (!window.confirm(`Are you sure you want to delete "${event.title}"?`)) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login as admin to perform this action");
        return;
      }

      const response = await fetch(
        `${API_URL}/events/${event._id || event.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        alert(data.message || "Event deleted successfully");
        await fetchEvents();
      } else {
        throw new Error(data.message || "Failed to delete event");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const filteredEvents = events.filter((event) => {
    const matchesStatus =
      activeFilter === "all" ||
      (activeFilter === "upcoming" && event.status === "Upcoming") ||
      (activeFilter === "past" && event.status === "Past Event");

    const matchesCategory =
      selectedCategory === "all" || event.category === selectedCategory;

    return matchesStatus && matchesCategory;
  });

  const upcomingCount = events.filter((e) => e.status === "Upcoming").length;
  const pastCount = events.filter((e) => e.status === "Past Event").length;

  const handleReadMore = (event) => {
    setSelectedEvent(event);
    setGalleryOpen(false);
  };

  const handleImageClick = (event, index = 0) => {
    setSelectedEvent(event);
    setCurrentImageIndex(index);
    setGalleryOpen(true);
  };

  const handleGalleryNavigate = (direction) => {
    if (!selectedEvent || !selectedEvent.images) return;

    if (direction === "next") {
      setCurrentImageIndex((prev) => (prev + 1) % selectedEvent.images.length);
    } else {
      setCurrentImageIndex(
        (prev) =>
          (prev - 1 + selectedEvent.images.length) % selectedEvent.images.length
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      <div className="absolute inset-0 bg-grid-slate-100 opacity-50 -z-10"></div>

      <main className="relative px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <img
                className="h-16 w-16 sm:h-20 sm:w-20 rounded-full shadow-xl ring-4 ring-blue-100"
                src={logo}
                alt="BioCrats Logo"
              />
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                BioCrats Club Events
              </h1>
            </div>
            <p className="text-base sm:text-lg text-slate-600 max-w-4xl mx-auto leading-relaxed">
              Discover and participate in groundbreaking events organized by the
              Biocrats Club at IIT Indore. From cutting-edge workshops to
              competitive challenges, we foster innovation in biosciences and
              biotechnology. 🧬
            </p>
          </div>

          {/* Admin Panel */}
          {isAdmin && (
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 mb-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-white text-center sm:text-left">
                  <h3 className="text-xl font-bold mb-1">Admin Panel</h3>
                  <p className="text-blue-100 text-sm">Manage your events</p>
                </div>
                <button
                  onClick={handleCreateEvent}
                  className="flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-md"
                >
                  <Plus className="w-5 h-5" />
                  Create New Event
                </button>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8">
              <p className="font-semibold">Error</p>
              <p>{error}</p>
              <button
                onClick={fetchEvents}
                className="mt-2 text-sm underline hover:no-underline"
              >
                Try again
              </button>
            </div>
          )}

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-8 sm:mb-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Filter className="w-5 h-5 text-blue-600" />
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    Filter Events
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setActiveFilter("all")}
                    className={`px-3 sm:px-5 py-2 text-xs sm:text-sm font-semibold rounded-full transition-all duration-300 ${
                      activeFilter === "all"
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    All Events ({events.length})
                  </button>
                  <button
                    onClick={() => setActiveFilter("upcoming")}
                    className={`px-3 sm:px-5 py-2 text-xs sm:text-sm font-semibold rounded-full transition-all duration-300 ${
                      activeFilter === "upcoming"
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    Upcoming ({upcomingCount})
                  </button>
                  <button
                    onClick={() => setActiveFilter("past")}
                    className={`px-3 sm:px-5 py-2 text-xs sm:text-sm font-semibold rounded-full transition-all duration-300 ${
                      activeFilter === "past"
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    Past Events ({pastCount})
                  </button>
                </div>
              </div>

              <div className="lg:border-l lg:pl-6">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    Filter by Category
                  </h3>
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full lg:w-48 px-4 py-2 text-sm font-medium border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {loading ? (
              <div className="col-span-full text-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-slate-600 font-medium">Loading events...</p>
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="col-span-full text-center py-16 bg-white rounded-xl shadow-lg p-8">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-xl font-semibold text-slate-700 mb-2">
                  No events found
                </p>
                <p className="text-slate-500">
                  Try adjusting your filters or check back later.
                </p>
              </div>
            ) : (
              filteredEvents.map((event) => (
                <EventCard
                  key={event._id || event.id}
                  event={event}
                  onReadMore={handleReadMore}
                  onImageClick={handleImageClick}
                  isAdmin={isAdmin}
                  onEdit={handleEditEvent}
                  onDelete={handleDeleteEvent}
                />
              ))
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      {selectedEvent && !galleryOpen && (
        <EventDetailsModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onImageClick={(index) => handleImageClick(selectedEvent, index)}
        />
      )}

      {galleryOpen && selectedEvent && (
        <ImageGalleryModal
          images={selectedEvent.images || []}
          currentIndex={currentImageIndex}
          onClose={() => {
            setGalleryOpen(false);
            setCurrentImageIndex(0);
          }}
          onNavigate={handleGalleryNavigate}
        />
      )}

      {showEventForm && (
        <AdminEventForm
          event={editingEvent}
          onClose={() => {
            setShowEventForm(false);
            setEditingEvent(null);
          }}
          onSave={handleSaveEvent}
        />
      )}
    </div>
  );
};

export default BiocatsEventsPage
