import React, { useState, useEffect } from "react";
import {
  Calendar,
  MapPin,
  Users,
  ArrowRight,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Clock,
} from "lucide-react";
import logo from "../assets/logo.png";

const API_URL = "http://localhost:5000/api";

// Helper: Normalize URLs for Cloudinary or Local Server
const normalizeImageUrl = (imagePath) => {
  if (!imagePath) return "";
  if (imagePath.startsWith("http")) return imagePath;
  return `${API_URL.replace("/api", "")}${
    imagePath.startsWith("/") ? "" : "/"
  }${imagePath}`;
};

// --- Sub-Components ---
const ImageGalleryModal = ({ images, currentIndex, onClose, onNavigate }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center p-4">
      <button onClick={onClose} className="absolute top-4 right-4 text-white">
        <X className="w-8 h-8" />
      </button>
      {images.length > 1 && (
        <>
          <button
            onClick={() => onNavigate("prev")}
            className="absolute left-4 text-white"
          >
            <ChevronLeft className="w-10 h-10" />
          </button>
          <button
            onClick={() => onNavigate("next")}
            className="absolute right-4 text-white"
          >
            <ChevronRight className="w-10 h-10" />
          </button>
        </>
      )}
      <img
        src={normalizeImageUrl(images[currentIndex])}
        className="max-w-full max-h-full object-contain"
        alt="Event"
      />
    </div>
  );
};

const EventDetailsModal = ({ event, onClose, onImageClick }) => (
  <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black bg-opacity-50">
    <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500"
      >
        <X className="w-6 h-6" />
      </button>
      <div className="grid grid-cols-2 gap-2 mb-6">
        {event.images?.map((img, idx) => (
          <img
            key={idx}
            src={normalizeImageUrl(img)}
            onClick={() => onImageClick(idx)}
            className="rounded-lg cursor-pointer hover:opacity-80 h-40 w-full object-cover"
          />
        ))}
      </div>
      <h2 className="text-3xl font-bold mb-4">{event.title}</h2>
      <p className="text-slate-700 whitespace-pre-line mb-6">
        {event.fullDescription || event.description}
      </p>
      <div className="bg-slate-50 p-4 rounded-lg space-y-2">
        <div className="flex gap-2">
          <Calendar className="w-5 h-5 text-blue-600" /> {event.date}
        </div>
        <div className="flex gap-2">
          <MapPin className="w-5 h-5 text-blue-600" /> {event.location}
        </div>
      </div>
    </div>
  </div>
);

const EventCard = ({ event, onReadMore, onImageClick }) => {
  const isPast = event.status === "Past Event";
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col h-full">
      <div
        className="h-48 overflow-hidden relative cursor-pointer"
        onClick={() => onImageClick(event, 0)}
      >
        <img
          src={normalizeImageUrl(event.images?.[0])}
          className="w-full h-full object-cover"
          alt={event.title}
        />
        <span
          className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold text-white ${
            isPast ? "bg-slate-600" : "bg-green-500"
          }`}
        >
          {event.status}
        </span>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold mb-2">{event.title}</h3>
        <p className="text-slate-600 text-sm mb-4 line-clamp-3 flex-grow">
          {event.description}
        </p>
        <button
          onClick={() => onReadMore(event)}
          className="w-full h-11 bg-blue-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-blue-700"
        >
          Read More <ArrowRight className="w-4 h-4" />
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

  useEffect(() => {
    fetch(`${API_URL}/events`)
      .then((res) => res.json())
      .then((data) => setEvents(data.events || []));
  }, []);

  const filtered = events.filter((e) =>
    activeFilter === "all"
      ? true
      : activeFilter === "upcoming"
      ? e.status === "Upcoming"
      : e.status === "Past Event"
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 sm:p-12">
      <header className="text-center mb-12">
        <img src={logo} className="h-20 mx-auto mb-4" alt="Logo" />
        <h1 className="text-4xl font-black text-blue-600">BioCrats Events</h1>
      </header>

      {/* Filter Bar */}
      <div className="flex gap-4 justify-center mb-10">
        {["all", "upcoming", "past"].map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-6 py-2 rounded-full capitalize ${
              activeFilter === f ? "bg-blue-600 text-white" : "bg-white"
            }`}
          >
            {f} Events
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {filtered.map((e) => (
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
