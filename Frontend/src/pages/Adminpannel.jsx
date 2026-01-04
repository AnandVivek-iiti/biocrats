import { useState, useEffect } from "react";
import {
  Check,
  X,
  Trash2,
  Edit2,
  Plus,
  Save,
  Eye,
  EyeOff,
  FileText,
  Lock,
  Image,
  Home,
  LogOut,
  XCircle,
} from "lucide-react";
import AdminEventForm from "./createEvent";
import toast from "react-hot-toast";

const API_URL =    import.meta.env.MODE === "production"
      ? "https://biocrats.onrender.com"
      : "http://localhost:5000/api"

export default function AdminPanel() {
  const [secret, setSecret] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState("events");
  const [showPassword, setShowPassword] = useState(false);

  const [blogs, setBlogs] = useState([]);
  const [events, setEvents] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", content: "" });

  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  /* -----------------------
     FETCH FUNCTIONS
  ----------------------- */
  const fetchBlogs = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/blogs`, {
        headers: { "x-admin-secret": secret },
      });

      if (!res.ok) throw new Error();
      const data = await res.json();
      setBlogs(data.blogs || []);
    } catch {
      toast.error("Failed to load blogs");
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${API_URL}/events`, {
        headers: { "x-admin-secret": secret },
      });

      const data = await res.json();
      setEvents(data.events || []);
    } catch {
      toast.error("Failed to load events");
    }
  };

  const login = async () => {
    if (!secret.trim()) {
      setError("Admin secret required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API_URL}/admin/blogs`, {
        headers: { "x-admin-secret": secret },
      });

      if (!res.ok) throw new Error();
      setAuthorized(true);
    } catch {
      setAuthorized(false);
      setError("Invalid admin secret");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setAuthorized(false);
    setSecret("");
    setBlogs([]);
    setEvents([]);
    setActiveTab("events");
  };

  useEffect(() => {
    if (!authorized) return;
    fetchBlogs();
    fetchEvents();
  }, [authorized]);

  /* -----------------------
     BLOG ACTIONS
  ----------------------- */
  const updateStatus = async (id, action) => {
    const prevBlogs = [...blogs];
    const newStatus = action === "approve" ? "approved" : "rejected";

    // Optimistic update
    setBlogs((prev) =>
      prev.map((b) => (b._id === id ? { ...b, status: newStatus } : b))
    );

    toast.success(`Blog ${action}d successfully`);

    try {
      const res = await fetch(`${API_URL}/admin/blogs/${id}/${action}`, {
        method: "PUT",
        headers: { "x-admin-secret": secret },
      });

      if (!res.ok) throw new Error();
    } catch {
      setBlogs(prevBlogs);
      toast.error(`Failed to ${action} blog`);
    }
  };

  const deleteBlog = async (id) => {
    if (!confirm("Are you sure you want to delete this blog permanently?"))
      return;

    const prevBlogs = [...blogs];

    // Optimistic remove
    setBlogs((prev) => prev.filter((b) => b._id !== id));
    toast.success("Blog deleted successfully");

    try {
      const res = await fetch(`${API_URL}/admin/blogs/${id}`, {
        method: "DELETE",
        headers: { "x-admin-secret": secret },
      });

      if (!res.ok) throw new Error();
    } catch {
      setBlogs(prevBlogs);
      toast.error("Failed to delete blog");
    }
  };

  const startEdit = (blog) => {
    setEditingId(blog._id);
    setEditForm({ title: blog.title, content: blog.content });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ title: "", content: "" });
  };

  const saveEdit = async (id) => {
    if (!editForm.title.trim() || !editForm.content.trim()) {
      toast.error("Title and content are required");
      return;
    }

    const prevBlogs = [...blogs];

    // Optimistic update
    setBlogs((prev) =>
      prev.map((b) => (b._id === id ? { ...b, ...editForm } : b))
    );

    setEditingId(null);
    toast.success("Blog updated successfully");

    try {
      const res = await fetch(`${API_URL}/admin/blogs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": secret,
        },
        body: JSON.stringify(editForm),
      });

      if (!res.ok) throw new Error();
    } catch {
      setBlogs(prevBlogs);
      setEditingId(id);
      toast.error("Failed to update blog");
    }
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
    if (!confirm("Are you sure you want to delete this event permanently?"))
      return;

    const prevEvents = [...events];

    // Optimistic remove
    setEvents((prev) => prev.filter((e) => e._id !== id));
    toast.success("Event deleted successfully");

    try {
      const res = await fetch(`${API_URL}/events/${id}`, {
        method: "DELETE",
        headers: { "x-admin-secret": secret },
      });

      if (!res.ok) throw new Error();
    } catch {
      setEvents(prevEvents);
      toast.error("Failed to delete event");
    }
  };

  const handleSaveEvent = async (formData) => {
    const isEdit = Boolean(editingEvent);
    const prevEvents = [...events];

    try {
      // Optimistic update for new events
      if (!isEdit) {
        const tempEvent = {
          _id: `temp-${Date.now()}`,
          title: formData.get("title"),
          date: formData.get("date"),
          description: formData.get("description"),
        };
        setEvents((prev) => [tempEvent, ...prev]);
      } else {
        // Optimistic update for edited events
        setEvents((prev) =>
          prev.map((e) =>
            e._id === editingEvent._id
              ? {
                  ...e,
                  title: formData.get("title"),
                  date: formData.get("date"),
                  description: formData.get("description"),
                }
              : e
          )
        );
      }

      toast.success(isEdit ? "Event updated" : "Event created");

      const url = isEdit
        ? `${API_URL}/events/${editingEvent._id}`
        : `${API_URL}/events`;
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "x-admin-secret": secret },
        body: formData,
      });

      if (!res.ok) throw new Error();

      // Refetch to sync with server
      await fetchEvents();
    } catch {
      setEvents(prevEvents);
      toast.error(isEdit ? "Failed to update event" : "Failed to create event");
    } finally {
      setShowEventForm(false);
      setEditingEvent(null);
    }
  };

  const goToHome = () => {
    window.location.href = "/";
  };

  /* -----------------------
     UTILITY FUNCTIONS
  ----------------------- */
  const getIcon = (type) =>
    type?.startsWith("image/") ? (
      <Image className="w-4 h-4" />
    ) : (
      <FileText className="w-4 h-4" />
    );

  const statusStyle = {
    pending: "bg-yellow-100 text-yellow-800 border border-yellow-300",
    approved: "bg-green-100 text-green-800 border border-green-300",
    rejected: "bg-red-100 text-red-800 border border-red-300",
  };

  /* -----------------------
     LOGIN SCREEN
  ----------------------- */
  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Admin Access</h2>
            <p className="text-gray-500 mt-2">
              Enter your secret key to continue
            </p>
          </div>

          <div className="space-y-2 mb-4 ">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={secret}
                onChange={(e) => {
                  setSecret(e.target.value);
                  setError("");
                }}
                onKeyUp={(e) => e.key === "Enter" && login()}
                required
                className="w-full pl-11 pr-12 py-3 border border-gray-300   rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                placeholder="Enter admin secret"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <button
            onClick={login}
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg"
          >
            {loading ? "Verifying..." : "Enter Dashboard"}
          </button>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <XCircle className="w-5 h-5" />
              <p className="text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* -----------------------
     DASHBOARD
  ----------------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <div className="flex gap-3">
            <button
              onClick={goToHome}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition font-medium text-gray-700"
            >
              <Home className="w-4 h-4" />
              Home
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition font-medium"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-2 mb-8">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("events")}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition ${
                activeTab === "events"
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Events ({events.length})
            </button>

            <button
              onClick={() => setActiveTab("blogs")}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition ${
                activeTab === "blogs"
                  ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Blogs ({blogs.length})
            </button>
          </div>
        </div>

        {/* EVENTS TAB */}
        {activeTab === "events" && (
          <div>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">
                Manage Events
              </h2>
              <button
                onClick={handleCreateEvent}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl flex flex-2 font-bold hover:from-blue-700 hover:to-blue-800 transition shadow-lg"
              >
<Plus  />
                 Create New Event
              </button>
            </div>

            {events.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <p className="text-gray-500 text-lg">
                  No events yet. Create your first event!
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {events.map((event) => (
                  <div
                    key={event._id}
                    className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-xl text-gray-800 mb-2">
                          {event.title}
                        </h3>
                        <p className="text-sm text-gray-500 font-medium">
                          📅 {event.date}
                        </p>
                        {event.description && (
                          <p className="text-gray-600 mt-2 text-sm">
                            {event.description}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditEvent(event)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg transition"
                          title="Edit Event"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event._id)}
                          className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition"
                          title="Delete Event"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* BLOGS TAB */}
        {activeTab === "blogs" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Manage Blog Posts
            </h2>

            {blogs.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <p className="text-gray-500 text-lg">
                  No blog submissions yet.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {blogs.map((blog) => (
                  <div
                    key={blog._id}
                    className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition"
                  >
                    {/* HEADER */}
                    <div className="flex justify-between items-start mb-3">
                      {editingId === blog._id ? (
                        <input
                          value={editForm.title}
                          onChange={(e) =>
                            setEditForm({ ...editForm, title: e.target.value })
                          }
                          className="text-xl font-bold border-2 border-indigo-300 px-3 py-2 rounded-lg flex-1 focus:border-indigo-600 focus:outline-none"
                          placeholder="Blog title"
                        />
                      ) : (
                        <h2 className="text-xl font-bold text-gray-800">
                          {blog.title}
                        </h2>
                      )}

                      <span
                        className={`ml-4 px-4 py-1.5 rounded-full text-xs font-bold ${
                          statusStyle[blog.status]
                        }`}
                      >
                        {blog.status.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-sm text-gray-500 mb-4 flex items-center gap-2">
                      <span className="font-medium">✍️ {blog.authorName}</span>
                      <span>•</span>
                      <span>{blog.authorEmail}</span>
                    </p>

                    {/* CONTENT */}
                    {editingId === blog._id ? (
                      <textarea
                        value={editForm.content}
                        onChange={(e) =>
                          setEditForm({ ...editForm, content: e.target.value })
                        }
                        rows={6}
                        className="w-full border-2 border-indigo-300 px-3 py-2 rounded-lg mb-4 focus:border-indigo-600 focus:outline-none"
                        placeholder="Blog content"
                      />
                    ) : (
                      <p className="whitespace-pre-wrap text-gray-700 mb-4 leading-relaxed">
                        {blog.content}
                      </p>
                    )}

                    {/* FILES */}
                    {blog.files?.length > 0 && (
                      <div className="mb-4 bg-gray-50 p-4 rounded-xl">
                        <h4 className="font-semibold mb-3 text-gray-700">
                          📎 Attachments ({blog.files.length})
                        </h4>
                        <div className="flex flex-wrap gap-3">
                          {blog.files.map((file, i) => (
                            <a
                              key={i}
                              href={file.url}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-2 rounded-lg hover:border-indigo-400 hover:shadow transition"
                            >
                              {getIcon(file.mimetype)}
                              <span className="text-sm truncate max-w-[160px]">
                                {file.originalName}
                              </span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ACTIONS */}
                    <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                      {blog.status !== "approved" && (
                        <button
                          onClick={() => updateStatus(blog._id, "approve")}
                          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition font-medium"
                        >
                          <Check className="w-4 h-4" />
                          Approve
                        </button>
                      )}

                      {blog.status !== "rejected" && (
                        <button
                          onClick={() => updateStatus(blog._id, "reject")}
                          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition font-medium"
                        >
                          <X className="w-4 h-4" />
                          Reject
                        </button>
                      )}

                      {editingId === blog._id ? (
                        <>
                          <button
                            onClick={() => saveEdit(blog._id)}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition font-medium"
                          >
                            <Save className="w-4 h-4" />
                            Save Changes
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="flex items-center gap-2 bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition font-medium"
                          >
                            <X className="w-4 h-4" />
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => startEdit(blog)}
                          className="flex items-center gap-2 bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition font-medium"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </button>
                      )}

                      <button
                        onClick={() => deleteBlog(blog._id)}
                        className="flex items-center gap-2 bg-black hover:bg-gray-900 text-white px-4 py-2 rounded-lg transition font-medium ml-auto"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Event Form Modal */}
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
