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
  Image,
  File,
} from "lucide-react";
import logo from "../assets/logo.png";

const API_URL = "http://localhost:5000/api";

// --- HELPER COMPONENTS ---
const DEFAULT_EVENT_IMAGE =
  "https://res.cloudinary.com/demo/image/upload/v1690000000/event_fallback.jpg";

const normalizeImageUrl = (imagePath) => {
  if (!imagePath) return DEFAULT_EVENT_IMAGE;

  // Cloudinary or any CDN
  if (imagePath.startsWith("http")) return imagePath;

  // Local backend uploads
  return `${API_URL.replace("/api", "")}/${imagePath.replace(/^\/+/, "")}`;
};

// Function to get icon based on file type
const getFileIcon = (mimeType) => {
  if (mimeType.startsWith("image/")) {
    return <Image className="w-5 h-5 text-green-500" />;
  }
  return <File className="w-5 h-5 text-gray-500" />;
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

  const EventSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse">
    <div className="h-48 bg-slate-200" />
    <div className="p-5 space-y-3">
      <div className="h-4 bg-slate-200 rounded w-3/4" />
      <div className="h-3 bg-slate-200 rounded w-full" />
      <div className="h-3 bg-slate-200 rounded w-5/6" />
      <div className="h-10 bg-slate-200 rounded" />
    </div>
  </div>
);

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
            e.target.src =
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23f0f0f0' width='400' height='300'/%3E%3Ctext fill='%23999' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EImage not found%3C/text%3E%3C/svg%3E";
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

const EventDetailsModal = ({ event, onClose, onImageClick }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);
  return (
    <div className="fixed inset-10 min-h-screen  z-40  overflow-y-auto">
      <div className="flex min-h-screen  items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={onClose}
        ></div>

        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
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

// Event Card Component
const EventCard = ({ event, onReadMore, onImageClick }) => {
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
    <div className="group  bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col">
      <div className="relative overflow-hidden h-48 sm:h-56">
        <img
          src={normalizeImageUrl(currentImage)}
          alt={event.title}
          loading="lazy"
          onClick={() => onImageClick(event, currentImageIndex)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = DEFAULT_EVENT_IMAGE;
          }}
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

const Events = () => {
  const [events, setEvents] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const categories = [
    { id: "all", label: "All Categories" },
    { id: "workshop", label: "Workshops" },
    { id: "competition", label: "Competitions" },
    { id: "symposium", label: "Symposiums" },
    { id: "seminar", label: "Seminars" },
  ];

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
  useEffect(() => {
    fetch(`${API_URL}/events`)
      .then((res) => res.json())
      .then((data) => setEvents(data.events || []));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-6 sm:p-12">
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
        </div>
      </main>

      {/* Events Grid */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
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
                />
              ))
            )}
          </div> */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {filteredEvents.map((e) => (
          <EventCard
            key={e._id}
            event={e}
            onReadMore={setSelectedEvent}
            onImageClick={(ev) => {
              setSelectedEvent(ev);
              setGalleryOpen(true);
            }}
          />
        ))}
      </div>

      {selectedEvent && !galleryOpen && (
        <EventDetailsModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onImageClick={(i) => {
            setCurrentIdx(i);
            setGalleryOpen(true);
          }}
        />
      )}
      {galleryOpen && (
        <ImageGalleryModal
          images={selectedEvent.images}
          currentIndex={currentIdx}
          onClose={() => setGalleryOpen(false)}
          onNavigate={(d) =>
            setCurrentIdx((p) =>
              d === "next"
                ? (p + 1) % selectedEvent.images.length
                : (p - 1 + selectedEvent.images.length) %
                  selectedEvent.images.length
            )
          }
        />
      )}
    </div>
  );
};

export default Events;
