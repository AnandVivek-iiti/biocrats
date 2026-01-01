import { useState, useEffect } from "react";
import {
  Check,
  X,
  Trash2,
  Edit2,
  Save,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import AdminEventForm from "./createEvent";

/* -----------------------
   API CONFIG
----------------------- */
const API_URL =
  import.meta.env.MODE === "production"
    ? "https://biocrats.vercel.app/api"
    : "http://localhost:5000/api";

export default function AdminPanel() {
  const [secret, setSecret] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState("events");

  const [blogs, setBlogs] = useState([]);
  const [events, setEvents] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", content: "" });

  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  /* -----------------------
     LOGIN + BLOG FETCH
  ----------------------- */
  const fetchBlogs = async () => {
    if (!secret) return setError("Admin secret required");

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/admin/blogs`, {
        headers: { "x-admin-secret": secret },
      });

      if (!res.ok) throw new Error();
      const data = await res.json();

      setBlogs(data.blogs || []);
      setAuthorized(true);
      setError("");
    } catch {
      setAuthorized(false);
      setError("Invalid admin secret");
    } finally {
      setLoading(false);
    }
  };

  /* -----------------------
     FETCH EVENTS
  ----------------------- */
  const fetchEvents = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/events`, {
        headers: { "x-admin-secret": secret },
      });

      const data = await res.json();
      setEvents(data.events || []);
    } catch {
      console.error("Failed to fetch events");
    }
  };

  useEffect(() => {
    if (authorized) {
      fetchBlogs();
      fetchEvents();
    }
  }, [authorized]);

  /* -----------------------
     BLOG ACTIONS
  ----------------------- */
  const updateStatus = async (id, action) => {
    await fetch(`${API_URL}/admin/blogs/${id}/${action}`, {
      method: "PUT",
      headers: { "x-admin-secret": secret },
    });

    setBlogs((prev) =>
      prev.map((b) =>
        b._id === id
          ? { ...b, status: action === "approve" ? "approved" : "rejected" }
          : b
      )
    );
  };

  const deleteBlog = async (id) => {
    if (!confirm("Delete this blog permanently?")) return;

    await fetch(`${API_URL}/admin/blogs/${id}`, {
      method: "DELETE",
      headers: { "x-admin-secret": secret },
    });

    setBlogs((prev) => prev.filter((b) => b._id !== id));
  };

  const startEdit = (blog) => {
    setEditingId(blog._id);
    setEditForm({ title: blog.title, content: blog.content });
  };

  const saveEdit = async (id) => {
    const res = await fetch(`${API_URL}/admin/blogs/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-admin-secret": secret,
      },
      body: JSON.stringify(editForm),
    });

    const data = await res.json();
    setBlogs((prev) => prev.map((b) => (b._id === id ? data.blog : b)));
    setEditingId(null);
  };

  /* -----------------------
     EVENT ACTIONS
  ----------------------- */
  const handleCreateEvent = () => {
    setEditingEvent(null);
    setShowEventForm(true);
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setShowEventForm(true);
  };

  const handleDeleteEvent = async (id) => {
    if (!confirm("Delete this event permanently?")) return;

    await fetch(`${API_URL}/admin/events/${id}`, {
      method: "DELETE",
      headers: { "x-admin-secret": secret },
    });

    setEvents((prev) => prev.filter((e) => e._id !== id));
  };

  const handleSaveEvent = async (formData) => {
    const url = editingEvent
      ? `${API_URL}/admin/events/${editingEvent._id}`
      : `${API_URL}/admin/events`;

    const method = editingEvent ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "x-admin-secret": secret },
      body: formData,
    });

    await fetchEvents();
    setShowEventForm(false);
    setEditingEvent(null);
  };

  /* -----------------------
     LOGIN SCREEN
  ----------------------- */
  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-6 text-center">Admin Access</h2>

          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            className="w-full border px-4 py-3 rounded-lg mb-4"
            placeholder="Admin Secret"
          />

          <button
            onClick={fetchBlogs}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold"
          >
            Enter Dashboard
          </button>

          {error && (
            <p className="text-red-500 text-sm mt-4 text-center">{error}</p>
          )}
        </div>
      </div>
    );
  }

  /* -----------------------
     DASHBOARD
  ----------------------- */
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* TABS */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab("events")}
          className={`px-6 py-2 rounded-lg font-semibold ${
            activeTab === "events"
              ? "bg-blue-600 text-white"
              : "bg-white border"
          }`}
        >
          Events
        </button>
        <button
          onClick={() => setActiveTab("blogs")}
          className={`px-6 py-2 rounded-lg font-semibold ${
            activeTab === "blogs"
              ? "bg-blue-600 text-white"
              : "bg-white border"
          }`}
        >
          Blogs
        </button>
      </div>

      {/* EVENTS TAB */}
      {activeTab === "events" && (
        <>
          <button
            onClick={handleCreateEvent}
            className="mb-6 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Create New Event
          </button>

          <div className="grid md:grid-cols-2 gap-4">
            {events.map((event) => (
              <div
                key={event._id}
                className="bg-white p-4 rounded-xl shadow flex justify-between items-start"
              >
                <div>
                  <h3 className="font-bold">{event.title}</h3>
                  <p className="text-sm text-gray-500">{event.date}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditEvent(event)}
                    className="bg-indigo-600 text-white p-2 rounded"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteEvent(event._id)}
                    className="bg-red-600 text-white p-2 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* BLOGS TAB */}
      {activeTab === "blogs" && (
        <div className="space-y-6">
          {blogs.map((blog) => (
            <div key={blog._id} className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-xl font-bold">{blog.title}</h2>
              <p className="text-sm text-gray-500 mb-4">
                {blog.authorName} ({blog.authorEmail})
              </p>

              <p className="mb-4">{blog.content}</p>

              <div className="flex gap-3">
                <button
                  onClick={() => updateStatus(blog._id, "approve")}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Approve
                </button>
                <button
                  onClick={() => updateStatus(blog._id, "reject")}
                  className="bg-red-600 text-white px-4 py-2 rounded"
                >
                  Reject
                </button>
                <button
                  onClick={() => deleteBlog(blog._id)}
                  className="bg-black text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
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
}
