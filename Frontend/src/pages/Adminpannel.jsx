import { useEffect, useState } from "react";
import {
  Check,
  X,
  Trash2,
  Edit2,
  Save,
  FileText,
  Image,
} from "lucide-react";

const API_URL = "http://localhost:5000/api";

export default function AdminPanel() {
  const [secret, setSecret] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", content: "" });

  /* =====================
     FETCH ALL BLOGS
     ===================== */
  const fetchBlogs = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/blogs`, {
        headers: { "x-admin-secret": secret },
      });

      if (!res.ok) throw new Error("Unauthorized");

      const data = await res.json();
      setBlogs(data.blogs || []);
      setAuthorized(true);
      setError("");
    } catch {
      setError("Invalid admin secret");
      setAuthorized(false);
    }
  };

  /* =====================
     STATUS UPDATE
     ===================== */
  const updateStatus = async (id, action) => {
    const res = await fetch(`${API_URL}/admin/blogs/${id}/${action}`, {
      method: "PUT",
      headers: { "x-admin-secret": secret },
    });

    if (!res.ok) return alert("Action failed");

    setBlogs((prev) =>
      prev.map((b) =>
        b._id === id
          ? { ...b, status: action === "approve" ? "approved" : "rejected" }
          : b
      )
    );
  };

  /* =====================
     DELETE BLOG
     ===================== */
  const deleteBlog = async (id) => {
    if (!confirm("Delete this blog permanently?")) return;

    const res = await fetch(`${API_URL}/admin/blogs/${id}`, {
      method: "DELETE",
      headers: { "x-admin-secret": secret },
    });

    if (!res.ok) return alert("Delete failed");

    setBlogs((prev) => prev.filter((b) => b._id !== id));
  };

  /* =====================
     EDIT BLOG
     ===================== */
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

    if (!res.ok) return alert("Update failed");

    const data = await res.json();

    setBlogs((prev) =>
      prev.map((b) => (b._id === id ? data.blog : b))
    );
    setEditingId(null);
  };

  /* =====================
     HELPERS
     ===================== */
  const getIcon = (type) =>
    type?.startsWith("image/") ? (
      <Image className="w-4 h-4" />
    ) : (
      <FileText className="w-4 h-4" />
    );

  const statusStyle = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  /* =====================
     LOGIN VIEW
     ===================== */
  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Admin Access
          </h2>

          <input
            type="password"
            placeholder="Admin Secret"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            className="w-full border px-4 py-3 rounded-lg mb-4"
          />

          <button
            onClick={fetchBlogs}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold"
          >
            Enter
          </button>

          {error && (
            <p className="text-red-500 text-sm mt-3 text-center">
              {error}
            </p>
          )}
        </div>
      </div>
    );
  }

  /* =====================
     DASHBOARD
     ===================== */
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Blog Dashboard</h1>

      {blogs.length === 0 ? (
        <p className="text-gray-600">No blogs found.</p>
      ) : (
        <div className="space-y-6">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white p-6 rounded-xl shadow"
            >
              {/* HEADER */}
              <div className="flex justify-between items-start mb-2">
                {editingId === blog._id ? (
                  <input
                    value={editForm.title}
                    onChange={(e) =>
                      setEditForm({ ...editForm, title: e.target.value })
                    }
                    className="text-xl font-bold border px-3 py-2 rounded w-full"
                  />
                ) : (
                  <h2 className="text-xl font-bold">{blog.title}</h2>
                )}

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle[blog.status]}`}
                >
                  {blog.status.toUpperCase()}
                </span>
              </div>

              <p className="text-sm text-gray-500 mb-3">
                By {blog.authorName} ({blog.authorEmail})
              </p>

              {/* CONTENT */}
              {editingId === blog._id ? (
                <textarea
                  value={editForm.content}
                  onChange={(e) =>
                    setEditForm({ ...editForm, content: e.target.value })
                  }
                  rows={6}
                  className="w-full border px-3 py-2 rounded mb-4"
                />
              ) : (
                <p className="whitespace-pre-wrap mb-4">
                  {blog.content}
                </p>
              )}

              {/* FILES */}
              {blog.files?.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Attachments</h4>
                  <div className="flex flex-wrap gap-3">
                    {blog.files.map((file, i) => (
                      <a
                        key={i}
                        href={file.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg"
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
              <div className="flex flex-wrap gap-3">
                {blog.status !== "approved" && (
                  <button
                    onClick={() => updateStatus(blog._id, "approve")}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg"
                  >
                    <Check className="w-4 h-4" />
                    Approve
                  </button>
                )}

                {blog.status !== "rejected" && (
                  <button
                    onClick={() => updateStatus(blog._id, "reject")}
                    className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                    Reject
                  </button>
                )}

                {editingId === blog._id ? (
                  <button
                    onClick={() => saveEdit(blog._id)}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => startEdit(blog)}
                    className="flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded-lg"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                )}

                <button
                  onClick={() => deleteBlog(blog._id)}
                  className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg"
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
  );
}
