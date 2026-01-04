
import React, { useState, useEffect } from "react";
import {
  MapPin,
  Users,
  ArrowRight,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Clock,
  Calendar,
  Image as ImageIcon,
  AlertCircle,
} from "lucide-react";
import logo from "../assets/logo.png";
const API_URL = import.meta.env.VITE_API_URL + "/api";


// Default fallback image as data URL (a gradient placeholder)
const DEFAULT_IMAGE =
  "https://res.cloudinary.com/dqsycukrp/image/upload/v1761218076/uploads/blogs/sajbg3tpfvzdytrhl0ue.jpg";

// Function to normalize image URLs for Cloudinary or local paths
const normalizeImageUrl = (imagePath) => {
  if (!imagePath) return DEFAULT_IMAGE;

  // If it's already a full URL (Cloudinary, CDN, etc.)
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // If it's a relative path, prepend API URL
  const baseUrl = API_URL.replace("/api", "");
  return `${baseUrl}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
};

// Image component with error handling and loading state
const SafeImage = ({ src, alt, className, onClick, showPlaceholder = true }) => {
  const [imgSrc, setImgSrc] = useState(normalizeImageUrl(src));
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setImgSrc(normalizeImageUrl(src));
    setLoaded(false);
  }, [src]);

  return (
    <div className="relative w-full h-full">
      {!loaded && showPlaceholder && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 animate-pulse flex items-center justify-center">
          <ImageIcon className="w-10 h-10 text-blue-400" />
        </div>
      )}

      <img
        src={imgSrc}
        alt={alt}
        onClick={onClick}
        onLoad={() => setLoaded(true)}
        onError={() => setImgSrc(DEFAULT_IMAGE)}
        className={`${className} ${loaded ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}
      />
    </div>
  );
};


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
        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10 bg-black bg-opacity-50 rounded-full p-2"
        aria-label="Close gallery"
      >
        <X className="w-6 h-6" />
      </button>

      {images.length > 1 && (
        <>
          <button
            onClick={() => onNavigate("prev")}
            className="absolute left-4 text-white hover:bg-white hover:bg-opacity-20 transition-all z-10 bg-black bg-opacity-50 rounded-full p-3"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button
            onClick={() => onNavigate("next")}
            className="absolute right-4 text-white hover:bg-white hover:bg-opacity-20 transition-all z-10 bg-black bg-opacity-50 rounded-full p-3"
            aria-label="Next image"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </>
      )}

      <div className="relative w-full h-full flex items-center justify-center">
        <SafeImage
          src={images[currentIndex]}
          alt={`Event image ${currentIndex + 1}`}
          className="max-w-full max-h-full object-contain rounded-lg"
          showPlaceholder={true}
        />
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black bg-opacity-70 px-4 py-2 rounded-full backdrop-blur-sm">
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
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        ></div>

        <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white p-4 flex justify-between items-center z-10 border-b border-gray-100 rounded-t-2xl">
            <span
              className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold ${
                event.status === "Past Event"
                  ? "bg-slate-600 text-white"
                  : "bg-green-500 text-white"
              }`}
            >
              {event.status}
            </span>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all rounded-full p-2"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {event.images && event.images.length > 0 && (
            <div className="relative h-64 sm:h-80 bg-gradient-to-br from-blue-50 to-purple-50">
              <SafeImage
                src={event.images[0]}
                alt={event.title}
                className="w-full h-full object-cover cursor-pointer"
              onClick={() => onImageClick(event, 0)}

                showPlaceholder={true}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              {event.images.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white text-sm px-3 py-1.5 rounded-full backdrop-blur-sm flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  {event.images.length} Photos
                </div>
              )}
            </div>
          )}

          <div className="p-6 sm:p-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 leading-tight">
              {event.title}
            </h2>

            <p className="text-slate-700 text-base sm:text-lg leading-relaxed mb-6 whitespace-pre-line">
              {event.fullDescription || event.description}
            </p>

            <div className="space-y-3 mb-6 bg-gradient-to-br from-blue-50 to-purple-50 p-5 rounded-xl border border-blue-100">
              {event.date && (
                <div className="flex items-start gap-3 text-sm sm:text-base text-slate-700">
                  <Calendar className="w-5 h-5 flex-shrink-0 text-blue-600 mt-0.5" />
                  <span className="font-medium">{event.date}</span>
                </div>
              )}
              {event.location && (
                <div className="flex items-start gap-3 text-sm sm:text-base text-slate-700">
                  <MapPin className="w-5 h-5 flex-shrink-0 text-blue-600 mt-0.5" />
                  <span>{event.location}</span>
                </div>
              )}
              {event.participants && (
                <div className="flex items-start gap-3 text-sm sm:text-base text-slate-700">
                  <Users className="w-5 h-5 flex-shrink-0 text-blue-600 mt-0.5" />
                  <span>{event.participants}</span>
                </div>
              )}
              {(event.speaker || event.Speaker) && (
                <div className="flex items-start gap-3 text-sm sm:text-base text-slate-700">
                  <Users className="w-5 h-5 flex-shrink-0 text-blue-600 mt-0.5" />
                  <span>
                    <span className="font-semibold">Speaker:</span>{" "}
                    {event.speaker || event.Speaker}
                  </span>
                </div>
              )}
            </div>

            {event.images && event.images.length > 1 && (
              <div className="mt-6">
                <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-blue-600" />
                  Event Gallery
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
                  {event.images.slice(0, 8).map((img, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-square cursor-pointer group overflow-hidden rounded-lg"
                     onClick={() => onImageClick(event, idx)}

                    >
                      <SafeImage
                        src={img}
                        alt={`${event.title} - Image ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        showPlaceholder={true}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all" />
                    </div>
                  ))}
                  {event.images.length > 8 && (
                    <div
                      className="relative aspect-square cursor-pointer group overflow-hidden rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"
                      onClick={() => onImageClick(8)}
                    >
                      <div className="text-white text-center">
                        <span className="text-2xl font-bold block">
                          +{event.images.length - 8}
                        </span>
                        <span className="text-xs">more</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Event Card Component
const EventCard = ({ event, onReadMore, onImageClick }) => {
  const isPastEvent = event.status === "Past Event";
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
const images =
  Array.isArray(event.images) && event.images.length > 0
    ? event.images
    : [DEFAULT_IMAGE];

const handleNextImage = (e) => {
  e.stopPropagation();
  setCurrentImageIndex((prev) => (prev + 1) % images.length);
};

const handlePrevImage = (e) => {
  e.stopPropagation();
  setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
};


const currentImage = images[currentImageIndex];


  return (
    <div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col border border-gray-100">
      <div className="relative overflow-hidden h-52 sm:h-60 bg-gradient-to-br from-blue-50 to-purple-50">

        <SafeImage
          src={currentImage}
          alt={event.title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 cursor-pointer"
          onClick={() => onImageClick(event, currentImageIndex)}
          showPlaceholder={true}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        <div className="absolute top-4 right-4">
          <span
            className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm ${
              isPastEvent
                ? "bg-slate-700 text-white"
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
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-60 hover:bg-opacity-80 text-white rounded-full p-2 transition-all backdrop-blur-sm"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-60 hover:bg-opacity-80 text-white rounded-full p-2 transition-all backdrop-blur-sm"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1.5">
              {event.images.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === currentImageIndex
                      ? "bg-white w-6"
                      : "bg-white bg-opacity-50 w-1.5"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="p-5 sm:p-6 flex flex-col flex-grow">
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight mb-3 line-clamp-2">
          {event.title}
        </h3>

        <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 flex-grow mb-4">
          {event.description}
        </p>

        <div className="space-y-2.5 mb-5">
          {event.date && (
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
              <Calendar className="w-4 h-4 flex-shrink-0 text-blue-600" />
              <span className="truncate font-medium">{event.date}</span>
            </div>
          )}
          {event.location && (
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
              <MapPin className="w-4 h-4 flex-shrink-0 text-blue-600" />
              <span className="truncate">{event.location}</span>
            </div>
          )}
          {event.participants && (
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
              <Users className="w-4 h-4 flex-shrink-0 text-blue-600" />
              <span className="truncate">{event.participants}</span>
            </div>
          )}
        </div>

        <button
          onClick={() => onReadMore(event)}
          className={`w-full flex items-center justify-center gap-2 rounded-xl h-11 px-4 text-sm font-bold transition-all duration-300 ${
            isPastEvent
              ? "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
              : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-xl"
          }`}
        >
          <span>Read More</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Main Events Component
const Events = () => {
  const [events, setEvents] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const categories = [
    { id: "all", label: "All Categories" },
    { id: "workshop", label: "Workshops" },
    { id: "competition", label: "Competitions" },
    { id: "symposium", label: "Symposiums" },
    { id: "seminar", label: "Seminars" },
  ];

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/events`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch events");
        return res.json();
      })
      .then((data) => {
        setEvents(data.events || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <main className="relative px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
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
            <p className="text-base sm:text-lg text-slate-700 max-w-3xl mx-auto leading-relaxed">
              Discover and participate in groundbreaking events organized by the
              Biocrats Club at IIT Indore. From cutting-edge workshops to
              competitive challenges, we foster innovation in biosciences and
              biotechnology 🧬
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-7 mb-8 sm:mb-12 border border-gray-100">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="w-5 h-5 text-blue-600" />
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    Filter by Status
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  <button
                    onClick={() => setActiveFilter("all")}
                    className={`px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all duration-300 ${
                      activeFilter === "all"
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md scale-105"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                    }`}
                  >
                    All Events ({events.length})
                  </button>
                  <button
                    onClick={() => setActiveFilter("upcoming")}
                    className={`px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all duration-300 ${
                      activeFilter === "upcoming"
                        ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md scale-105"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                    }`}
                  >
                    Upcoming ({upcomingCount})
                  </button>
                  <button
                    onClick={() => setActiveFilter("past")}
                    className={`px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all duration-300 ${
                      activeFilter === "past"
                        ? "bg-gradient-to-r from-slate-600 to-slate-700 text-white shadow-md scale-105"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                    }`}
                  >
                    Past Events ({pastCount})
                  </button>
                </div>
              </div>

              <div className="lg:border-l lg:border-gray-200 lg:pl-6">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    Category
                  </h3>
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full lg:w-52 px-4 py-2.5 text-sm font-semibold border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white hover:border-slate-300 transition-all"
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
              <div className="col-span-full text-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
                <p className="text-slate-600 font-semibold text-lg">
                  Loading amazing events...
                </p>
              </div>
            ) : error ? (
              <div className="col-span-full text-center py-16 bg-white rounded-2xl shadow-lg p-8 border border-red-100">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <p className="text-xl font-semibold text-slate-700 mb-2">
                  Oops! Something went wrong
                </p>
                <p className="text-slate-500">{error}</p>
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="col-span-full text-center py-20 bg-white rounded-2xl shadow-lg p-8">
                <div className="text-7xl mb-4">🔍</div>
                <p className="text-2xl font-bold text-slate-700 mb-2">
                  No events found
                </p>
                <p className="text-slate-500 text-lg">
                  Try adjusting your filters or check back later for new events.
                </p>
              </div>
            ) : (
              filteredEvents.map((event) => (
                <EventCard
                  key={event._id || event.id}
                  event={event}
                  onReadMore={handleReadMore}
                  onImageClick={handleImageClick}
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
  onImageClick={handleImageClick}
/>

      )}

   {galleryOpen && selectedEvent && (
  <ImageGalleryModal
    images={
      selectedEvent.images && selectedEvent.images.length > 0
        ? selectedEvent.images
        : [DEFAULT_IMAGE]
    }
    currentIndex={currentImageIndex}
    onClose={() => setGalleryOpen(false)}
    onNavigate={handleGalleryNavigate}
  />
)}

    </div>
  );
};

export default Events;
