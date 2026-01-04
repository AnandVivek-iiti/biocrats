

import React, { useEffect, useState } from "react";
import {
  Upload,
  FileText,
  File,
  X,
  Plus,
  Calendar,
  ChevronRight,
  Send,
  Loader2,
  Eye,
  Download,
  Maximize2,
  AlertCircle,
  CheckCircle2,
  Image,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL + "/api";


// Image Preview Modal
const ImagePreviewModal = ({ imageUrl, onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 bg-black/50 rounded-full p-2 backdrop-blur-sm"
      >
        <X className="w-6 h-6" />
      </button>
      <img
        src={imageUrl}
        alt="Preview"
        className="max-w-full max-h-full object-contain rounded-lg"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};

// File Preview Component
const FilePreview = ({ file, index, onRemove, isUploaded = false }) => {
  const [preview, setPreview] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    if (!isUploaded && file.type?.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else if (isUploaded && file.mimetype?.startsWith("image/")) {
      setPreview(file.url);
    }
  }, [file, isUploaded]);

  const getFileIcon = () => {
    const type = isUploaded ? file.mimetype : file.type;
    if (type?.startsWith("image/")) return <Image className="w-5 h-5" />;
    if (type === "application/pdf") return <FileText className="w-5 h-5" />;
    return <File className="w-5 h-5" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const fileName = isUploaded ? file.originalName : file.name;
  const fileSize = isUploaded ? file.size : file.size;
  const isImage = isUploaded
    ? file.mimetype?.startsWith("image/")
    : file.type?.startsWith("image/");

  return (
    <>
      <div className="group relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border-2 border-slate-200 hover:border-indigo-300 transition-all overflow-hidden">
        {preview ? (
          <div className="relative h-32 bg-slate-900">
            <img
              src={preview}
              alt={fileName}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                onClick={() => setPreviewOpen(true)}
                className="bg-white/90 hover:bg-white text-slate-900 p-2 rounded-full transition-all"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
              {isUploaded && (
                <a
                  href={file.url}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white/90 hover:bg-white text-slate-900 p-2 rounded-full transition-all"
                >
                  <Download className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        ) : (
          <div className="h-32 flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
            <div className="text-indigo-400">{getFileIcon()}</div>
          </div>
        )}

        <div className="p-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-700 truncate mb-1">
                {fileName}
              </p>
              <p className="text-xs text-slate-500">
                {formatFileSize(fileSize)}
              </p>
            </div>
            {!isUploaded && (
              <button
                onClick={() => onRemove(index)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition-all flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {!isUploaded && (
          <div className="absolute top-2 right-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Ready
          </div>
        )}
      </div>

      {previewOpen && (
        <ImagePreviewModal
          imageUrl={preview}
          onClose={() => setPreviewOpen(false)}
        />
      )}
    </>
  );
};

export default function BlogPlatform() {
  const [view, setView] = useState("allBlogs");
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [blogForm, setBlogForm] = useState({
    title: "",
    content: "",
    authorName: "",
    authorEmail: "",
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setFetching(true);
    try {
      const res = await fetch(`${API_URL}/blogs`);
      const data = await res.json();
      if (res.ok) setBlogs(data.blogs || []);
      else setError("Failed to load blogs");
    } catch {
      setError("Failed to load blogs. Please check your connection.");
    } finally {
      setFetching(false);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => {
      if (file.size > 10 * 1024 * 1024) {
        setError(`File ${file.name} is too large. Max size is 10MB.`);
        return false;
      }
      return true;
    });
    setSelectedFiles([...selectedFiles, ...validFiles]);
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitBlog = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const { title, content, authorName, authorEmail } = blogForm;
    if (!title || !content || !authorName || !authorEmail) {
      setError("Please fill in all required fields before submitting.");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("authorName", authorName);
      formData.append("authorEmail", authorEmail);
      selectedFiles.forEach((file) => formData.append("files", file));

      const res = await fetch(`${API_URL}/blogs/submit`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("Success! Your blog is now pending admin approval. 🎉");
        setBlogForm({
          title: "",
          content: "",
          authorName: "",
          authorEmail: "",
        });
        setSelectedFiles([]);
        setTimeout(() => {
          setView("allBlogs");
          setSuccess("");
        }, 3000);
      } else {
        setError(data.message || "Submission failed. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 text-slate-900 font-sans">
      {/* Modern Header */}
      <header className="bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  BioCrats Blogs
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  Share Your Knowledge
                </p>
              </div>
            </div>

            <div className="flex gap-2 bg-slate-100 p-1.5 rounded-xl">
              <button
                onClick={() => setView("allBlogs")}
                className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                  view === "allBlogs"
                    ? "bg-white text-indigo-600 shadow-md"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                All Blogs
              </button>
              <button
                onClick={() => setView("create")}
                className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${
                  view === "create"
                    ? "bg-white text-indigo-600 shadow-md"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Plus className="w-4 h-4" />
                Create
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Feedback Messages */}
        {success && (
          <div className="mb-6 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-4 rounded-2xl flex items-center gap-3 shadow-lg shadow-emerald-200">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span className="font-semibold">{success}</span>
          </div>
        )}
        {error && (
          <div className="mb-6 bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-4 rounded-2xl flex items-center gap-3 shadow-lg shadow-red-200">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="font-semibold">{error}</span>
            <button
              onClick={() => setError("")}
              className="ml-auto hover:bg-white/20 p-1 rounded-lg transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {view === "allBlogs" ? (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-5xl font-black text-slate-900 mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Latest Blogs
              </h2>
              <p className="text-slate-600 text-lg">
                Discover insights from our community of bio-enthusiasts 🧬
              </p>
            </div>

            {fetching ? (
              <div className="flex flex-col items-center py-20 text-slate-400">
                <Loader2 className="w-12 h-12 animate-spin mb-4 text-indigo-600" />
                <p className="text-lg font-semibold">Loading blogs...</p>
              </div>
            ) : blogs.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-slate-300 rounded-3xl p-16 text-center">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-10 h-10 text-slate-400" />
                </div>
                <p className="text-slate-500 text-xl font-semibold mb-2">
                  No blogs yet
                </p>
                <p className="text-slate-400 mb-6">
                  Be the first to share your knowledge!
                </p>
                <button
                  onClick={() => setView("create")}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 mx-auto transition-all shadow-lg shadow-indigo-200"
                >
                  Create First Blog <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="grid gap-6">
                {blogs.map((blog) => (
                  <article
                    key={blog._id}
                    className="group bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-200">
                        {blog.authorName?.[0]?.toUpperCase() || "?"}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 leading-none mb-1.5">
                          {blog.authorName}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(blog.createdAt).toLocaleDateString(
                            "en-IN",
                            {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </div>
                      </div>
                    </div>

                    <h3 className="text-3xl font-bold text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors leading-tight">
                      {blog.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed mb-6 line-clamp-3">
                      {blog.content}
                    </p>

                    {blog.files?.length > 0 && (
                      <div className="mt-6">
                        <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-indigo-600" />
                          Attachments ({blog.files.length})
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {blog.files.map((file, i) => (
                            <FilePreview
                              key={i}
                              file={file}
                              index={i}
                              isUploaded={true}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-5xl font-black text-slate-900 mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Share Your Knowledge
              </h2>
              <p className="text-slate-600 text-lg">
                Fill out the details below. Once approved, your blog will be
                published.
              </p>
            </div>

            <div className="bg-white rounded-[2rem] p-10 border-2 border-slate-200 shadow-2xl shadow-indigo-500/10 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">
                    Full Name *
                  </label>
                  <input
                    placeholder="Jane Doe"
                    className="w-full bg-slate-50 border-2 border-slate-200 focus:border-indigo-500 focus:bg-white rounded-2xl px-5 py-3.5 transition-all outline-none font-medium"
                    value={blogForm.authorName}
                    onChange={(e) =>
                      setBlogForm({ ...blogForm, authorName: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    placeholder="jane@example.com"
                    className="w-full bg-slate-50 border-2 border-slate-200 focus:border-indigo-500 focus:bg-white rounded-2xl px-5 py-3.5 transition-all outline-none font-medium"
                    value={blogForm.authorEmail}
                    onChange={(e) =>
                      setBlogForm({
                        ...blogForm,
                        authorEmail: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">
                  Blog Title *
                </label>
                <input
                  type="text"
                  value={blogForm.title}
                  onChange={(e) =>
                    setBlogForm({ ...blogForm, title: e.target.value })
                  }
                  className="w-full bg-slate-50 border-2 border-slate-200 focus:border-indigo-500 focus:bg-white rounded-2xl px-5 py-3.5 transition-all outline-none font-medium"
                  placeholder="Enter an engaging title..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">
                  Content *
                </label>
                <textarea
                  value={blogForm.content}
                  onChange={(e) =>
                    setBlogForm({ ...blogForm, content: e.target.value })
                  }
                  rows={12}
                  className="w-full bg-slate-50 border-2 border-slate-200 focus:border-indigo-500 focus:bg-white rounded-2xl px-5 py-3.5 transition-all outline-none font-medium resize-none"
                  placeholder="Share your thoughts and insights..."
                />
              </div>

              <div className="space-y-4">
                <label className="text-sm font-bold text-slate-700 ml-1">
                  Attachments (Optional)
                </label>
                <div className="border-3 border-dashed border-slate-300 rounded-2xl p-10 text-center hover:border-indigo-400 hover:bg-indigo-50/50 transition-all cursor-pointer">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                    accept="image/*,.pdf,.doc,.docx"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer block">
                    <Upload className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
                    <p className="text-indigo-600 hover:text-indigo-700 font-bold text-lg mb-2">
                      Click to upload files
                    </p>
                    <p className="text-sm text-slate-500">
                      Images, PDFs, Documents • Max 10MB per file
                    </p>
                  </label>
                </div>

                {selectedFiles.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {selectedFiles.map((file, index) => (
                      <FilePreview
                        key={index}
                        file={file}
                        index={index}
                        onRemove={removeFile}
                      />
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={handleSubmitBlog}
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-5 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-300 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit for Approval
                  </>
                )}
              </button>

              <p className="text-center text-sm text-slate-500">
                Your blog will be reviewed by our team before being published
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
