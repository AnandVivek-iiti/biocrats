// import React, { useState, useEffect } from "react";
// import {
//   Upload,
//   FileText,
//   Image,
//   File,
//   X,
//   Plus,
//   User,
//   Trash2,
//   Edit2,
//   Save,
// } from "lucide-react";

// const API_URL = "http://localhost:5000/api";

// function BlogPlatform() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [currentUser, setCurrentUser] = useState(null);
//   const [view, setView] = useState("allBlogs");
//   const [editingBlogId, setEditingBlogId] = useState(null);

//   const [blogForm, setBlogForm] = useState({ title: "", content: "" });
//   const [selectedFiles, setSelectedFiles] = useState([]);
//   const [blogs, setBlogs] = useState([]);
//   const [myBlogs, setMyBlogs] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   // ✅ Fetch current user from token
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) fetchCurrentUser(token);
//   }, []);

//   useEffect(() => {
//     if (isAuthenticated) {
//       fetchAllBlogs();
//       if (view === "myBlogs") fetchMyBlogs();
//     }
//   }, [isAuthenticated, view]);

//   const fetchCurrentUser = async (token) => {
//     try {
//       const res = await fetch(`${API_URL}/profile`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (res.ok) {
//         const data = await res.json();
//         setCurrentUser(data.user);
//         setIsAuthenticated(true);
//       } else localStorage.removeItem("token");
//     } catch (err) {
//       console.error("Error fetching user:", err);
//     }
//   };

//   const handleFileSelect = (e) => {
//     setSelectedFiles([...selectedFiles, ...Array.from(e.target.files)]);
//   };

//   const removeFile = (index) => {
//     setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
//   };

//   const fetchAllBlogs = async () => {
//     try {
//       const res = await fetch(`${API_URL}/blogs`);
//       if (res.ok) {
//         const data = await res.json();
//         setBlogs(data.blogs || []);
//       }
//     } catch (err) {
//       console.error("Fetch blogs error:", err);
//     }
//   };

//   const fetchMyBlogs = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await fetch(`${API_URL}/blogs/my-blogs`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (res.ok) {
//         const data = await res.json();
//         setMyBlogs(data.blogs || []);
//       }
//     } catch (err) {
//       console.error("Fetch my blogs error:", err);
//     }
//   };

//   const handleCreateBlog = async () => {
//     setLoading(true);
//     setError("");
//     setSuccess("");

//     try {
//       const token = localStorage.getItem("token");
//       const formData = new FormData();
//       formData.append("title", blogForm.title);
//       formData.append("content", blogForm.content);
//       selectedFiles.forEach((file) => formData.append("files", file));

//       const res = await fetch(`${API_URL}/blogs`, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}` },
//         body: formData,
//       });

//       const data = await res.json();
//       if (res.ok) {
//         setSuccess("✅ Blog created successfully!");
//         setBlogForm({ title: "", content: "" });
//         setSelectedFiles([]);
//         fetchAllBlogs();
//         setView("allBlogs");
//       } else {
//         setError(data.message || "Failed to create blog");
//       }
//     } catch (err) {
//       setError("Network error. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEditBlog = async (blogId, removeFileIds = []) => {
//     setLoading(true);
//     setError("");
//     setSuccess("");

//     try {
//       const token = localStorage.getItem("token");
//       const formData = new FormData();
//       formData.append("title", blogForm.title);
//       formData.append("content", blogForm.content);
//       formData.append("removeFileIds", JSON.stringify(removeFileIds));
//       selectedFiles.forEach((file) => formData.append("files", file));

//       const res = await fetch(`${API_URL}/blogs/${blogId}`, {
//         method: "PUT",
//         headers: { Authorization: `Bearer ${token}` },
//         body: formData,
//       });

//       const data = await res.json();
//       if (res.ok) {
//         setSuccess("✅ Blog updated successfully!");
//         setEditingBlogId(null);
//         setBlogForm({ title: "", content: "" });
//         setSelectedFiles([]);
//         fetchAllBlogs();
//         fetchMyBlogs();
//       } else setError(data.message);
//     } catch (err) {
//       setError("Network error while updating blog");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteBlog = async (id) => {
//     if (!window.confirm("Delete this blog permanently?")) return;
//     try {
//       const token = localStorage.getItem("token");
//       const res = await fetch(`${API_URL}/blogs/${id}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (res.ok) {
//         setSuccess("🗑️ Blog deleted");
//         fetchAllBlogs();
//         fetchMyBlogs();
//       } else {
//         const data = await res.json();
//         setError(data.message || "Failed to delete blog");
//       }
//     } catch {
//       setError("Server error while deleting");
//     }
//   };

//   const startEditing = (blog) => {
//     setEditingBlogId(blog._id);
//     setBlogForm({ title: blog.title, content: blog.content });
//   };

//   const cancelEditing = () => {
//     setEditingBlogId(null);
//     setBlogForm({ title: "", content: "" });
//     setSelectedFiles([]);
//   };

//   const getFileIcon = (mimetype) => {
//     if (!mimetype) return <File className="w-4 h-4" />;
//     if (mimetype.startsWith("image/")) return <Image className="w-4 h-4" />;
//     if (mimetype === "application/pdf") return <FileText className="w-4 h-4" />;
//     return <File className="w-4 h-4" />;
//   };

//   const renderBlogCard = (blog) => {
//     const isEditing = editingBlogId === blog._id;
//     const isOwner = blog.author?.id === currentUser?._id;

//     if (isEditing) {
//       return (
//         <div
//           key={blog._id}
//           className="bg-white rounded-xl shadow-md p-6 border-2 border-indigo-500"
//         >
//           <h2 className="text-xl font-bold text-gray-900 mb-4">Edit Blog</h2>
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Title
//               </label>
//               <input
//                 type="text"
//                 value={blogForm.title}
//                 onChange={(e) =>
//                   setBlogForm({ ...blogForm, title: e.target.value })
//                 }
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Content
//               </label>
//               <textarea
//                 value={blogForm.content}
//                 onChange={(e) =>
//                   setBlogForm({ ...blogForm, content: e.target.value })
//                 }
//                 rows={6}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Add New Attachments
//               </label>
//               <input
//                 type="file"
//                 multiple
//                 onChange={handleFileSelect}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
//                 accept="image/*,.pdf,.doc,.docx"
//               />
//               {selectedFiles.length > 0 && (
//                 <div className="mt-2 space-y-1">
//                   {selectedFiles.map((file, index) => (
//                     <div
//                       key={index}
//                       className="flex items-center justify-between bg-gray-50 px-3 py-1 rounded text-sm"
//                     >
//                       <span>{file.name}</span>
//                       <button
//                         type="button"
//                         onClick={() => removeFile(index)}
//                         className="text-red-500"
//                       >
//                         <X className="w-4 h-4" />
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//             <div className="flex gap-3">
//               <button
//                 onClick={() => handleEditBlog(blog._id)}
//                 disabled={loading}
//                 className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
//               >
//                 <Save className="w-4 h-4" />
//                 {loading ? "Saving..." : "Save Changes"}
//               </button>
//               <button
//                 onClick={cancelEditing}
//                 className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       );
//     }
//     return (
//       <div
//         key={blog._id}
//         className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
//       >
//         <div className="flex justify-between items-start mb-4">
//           <div className="flex-1">
//             <h3 className="text-2xl font-bold text-gray-900 mb-2">
//               {blog.title}
//             </h3>
//             <div className="flex items-center gap-2 text-sm text-gray-600">
//               <div className="flex items-center gap-1 bg-indigo-50 px-3 py-1 rounded-full">
//                 <User className="w-4 h-4 text-indigo-600" />
//                 <span className="font-medium text-indigo-700">
//                   {blog.author.name}
//                 </span>
//               </div>
//               <span>•</span>
//               <span>
//                 {new Date(blog.createdAt).toLocaleDateString("en-US", {
//                   year: "numeric",
//                   month: "long",
//                   day: "numeric",
//                 })}
//               </span>
//             </div>
//           </div>
//           {isOwner && (
//             <div className="flex gap-2">
//               <button
//                 onClick={() => startEditing(blog)}
//                 className="text-indigo-600 hover:text-indigo-700 p-2 hover:bg-indigo-50 rounded-lg transition"
//                 title="Edit blog"
//               >
//                 <Edit2 className="w-5 h-5" />
//               </button>
//               <button
//                 onClick={() => handleDeleteBlog(blog._id)}
//                 className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition"
//                 title="Delete blog"
//               >
//                 <Trash2 className="w-5 h-5" />
//               </button>
//             </div>
//           )}
//         </div>

//         <p className="text-gray-700 whitespace-pre-wrap mb-4 leading-relaxed">
//           {blog.content}
//         </p>

//         {blog.files?.length > 0 && (
//           <div className="border-t border-gray-200 pt-4 mt-4">
//             <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
//               <FileText className="w-4 h-4" />
//               Attachments ({blog.files.length})
//             </h4>

//             <div className="space-y-4">
//               {blog.files.filter((file) => file.mimetype.startsWith("image/"))
//                 .length > 0 && (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                   {blog.files
//                     .filter((file) => file.mimetype.startsWith("image/"))
//                     .map((file, index) => (
//                       <a
//                         key={index}
//                         href={file.url}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="group relative overflow-hidden rounded-lg border-2 border-gray-200 hover:border-indigo-400 transition-all"
//                       >
//                         <img
//                           src={file.url}
//                           alt={file.originalName}
//                           className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
//                         />
//                         <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
//                           <p className="text-white text-sm font-medium truncate">
//                             {file.originalName}
//                           </p>
//                         </div>
//                       </a>
//                     ))}
//                 </div>
//               )}

//               {blog.files.filter((file) => !file.mimetype.startsWith("image/"))
//                 .length > 0 && (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
//                   {blog.files
//                     .filter((file) => !file.mimetype.startsWith("image/"))
//                     .map((file, index) => (
//                       <a
//                         key={index}
//                         href={file.url}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-lg hover:bg-indigo-50 hover:border-indigo-300 border-2 border-transparent transition-all group"
//                       >
//                         <div className="text-gray-600 group-hover:text-indigo-600 transition-colors">
//                           {getFileIcon(file.mimetype)}
//                         </div>
//                         <div className="flex-1 min-w-0">
//                           <span className="text-sm text-gray-700 font-medium truncate block group-hover:text-indigo-700">
//                             {file.originalName}
//                           </span>
//                         </div>
//                       </a>
//                     ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       <header className="bg-white shadow-md border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
//           <div className="flex justify-between items-center">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
//                 <FileText className="w-6 h-6 text-white" />
//               </div>
//               <h1 className="text-2xl font-bold text-gray-900">
//                 Blog Platform
//               </h1>
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="flex gap-4 mb-8 bg-white p-2 rounded-xl shadow-sm">
//           <button
//             onClick={() => setView("allBlogs")}
//             className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
//               view === "allBlogs"
//                 ? "bg-indigo-600 text-white shadow-md"
//                 : "text-gray-700 hover:bg-gray-100"
//             }`}
//           >
//             All Blogs
//           </button>
//           <button
//             onClick={() => setView("myBlogs")}
//             className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
//               view === "myBlogs"
//                 ? "bg-indigo-600 text-white shadow-md"
//                 : "text-gray-700 hover:bg-gray-100"
//             }`}
//           >
//             My Blogs
//           </button>
//           <button
//             onClick={() => setView("create")}
//             className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
//               view === "create"
//                 ? "bg-indigo-600 text-white shadow-md"
//                 : "text-gray-700 hover:bg-gray-100"
//             }`}
//           >
//             <Plus className="w-5 h-5" />
//             Create Blog
//           </button>
//         </div>

//         {success && (
//           <div className="mb-6 bg-green-50 border-l-4 border-green-500 text-green-700 px-6 py-4 rounded-lg shadow-sm">
//             {success}
//           </div>
//         )}
//         {error && (
//           <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg shadow-sm">
//             {error}
//           </div>
//         )}

//         {view === "create" && (
//           <div className="bg-white rounded-xl shadow-md p-8 max-w-3xl mx-auto">
//             <h2 className="text-3xl font-bold text-gray-900 mb-6">
//               Create New Blog
//             </h2>
//             <div className="space-y-6">
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Title
//                 </label>
//                 <input
//                   type="text"
//                   value={blogForm.title}
//                   onChange={(e) =>
//                     setBlogForm({ ...blogForm, title: e.target.value })
//                   }
//                   className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//                   placeholder="Enter an engaging title..."
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Content
//                 </label>
//                 <textarea
//                   value={blogForm.content}
//                   onChange={(e) =>
//                     setBlogForm({ ...blogForm, content: e.target.value })
//                   }
//                   rows={10}
//                   className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//                   placeholder="Share your thoughts..."
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Attachments
//                 </label>
//                 <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-indigo-400 transition-colors">
//                   <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                   <input
//                     type="file"
//                     multiple
//                     onChange={handleFileSelect}
//                     className="hidden"
//                     id="file-upload"
//                     accept="image/*,.pdf,.doc,.docx"
//                   />
//                   <label
//                     htmlFor="file-upload"
//                     className="cursor-pointer text-indigo-600 hover:text-indigo-700 font-semibold text-lg"
//                   >
//                     Click to upload files
//                   </label>
//                   <p className="text-sm text-gray-500 mt-2">
//                     Images, PDFs, Documents up to 10MB
//                   </p>
//                 </div>
//                 {selectedFiles.length > 0 && (
//                   <div className="mt-4 space-y-2">
//                     {selectedFiles.map((file, index) => (
//                       <div
//                         key={index}
//                         className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg border border-gray-200"
//                       >
//                         <div className="flex items-center gap-3">
//                           {getFileIcon(file.type)}
//                           <div>
//                             <span className="text-sm font-medium text-gray-700 block">
//                               {file.name}
//                             </span>
//                             <span className="text-xs text-gray-500">
//                               {(file.size / 1024).toFixed(2)} KB
//                             </span>
//                           </div>
//                         </div>
//                         <button
//                           onClick={() => removeFile(index)}
//                           className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded transition"
//                         >
//                           <X className="w-5 h-5" />
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               <button
//                 onClick={handleCreateBlog}
//                 disabled={loading}
//                 className="w-full bg-indigo-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
//               >
//                 {loading ? "Publishing..." : "Publish Blog"}
//               </button>
//             </div>
//           </div>
//         )}

//         {(view === "allBlogs" || view === "myBlogs") && (
//           <div className="space-y-6">
//             {(view === "allBlogs" ? blogs : myBlogs).length === 0 ? (
//               <div className="bg-white rounded-xl shadow-md p-12 text-center">
//                 <FileText className="w-20 h-20 text-gray-300 mx-auto mb-4" />
//                 <h3 className="text-2xl font-bold text-gray-700 mb-2">
//                   No blogs yet
//                 </h3>
//                 <p className="text-gray-500 text-lg">
//                   {view === "myBlogs"
//                     ? "You haven't created any blogs yet. Start writing!"
//                     : "No blogs have been posted yet. Be the first!"}
//                 </p>
//               </div>
//             ) : (
//               (view === "allBlogs" ? blogs : myBlogs).map(renderBlogCard)
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default BlogPlatform;

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logo.png";
import {
  Upload,
  FileText,
  Image as ImageIcon,
  File,
  X,
  Plus,
  User,
  Calendar,
  ChevronRight,
  Send,
  Loader2,
} from "lucide-react";

const API_URL = "http://localhost:5000/api";

// Animation Variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } },
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
    } catch {
      setError("Failed to load blogs. Please check your connection.");
    } finally {
      setFetching(false);
    }
  };

  const handleFileSelect = (e) => {
    setSelectedFiles([...selectedFiles, ...Array.from(e.target.files)]);
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (mimetype) => {
    if (mimetype?.startsWith("image/"))
      return <ImageIcon className="w-4 h-4" />;
    if (mimetype === "application/pdf") return <FileText className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  const handleSubmitBlog = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const { title, content, authorName, authorEmail } = blogForm;
    if (!title || !content || !authorName || !authorEmail) {
      setError("Please fill in all fields before submitting.");
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

      if (res.ok) {
        setSuccess("Success! Your blog is now pending admin approval.");
        setBlogForm({
          title: "",
          content: "",
          authorName: "",
          authorEmail: "",
        });
        setSelectedFiles([]);
        setTimeout(() => setView("allBlogs"), 2000);
      } else {
        const data = await res.json();
        setError(data.message || "Submission failed");
      }
    } catch {
      setError("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-700">
      {/* Modern Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-400 blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <img
                className="h-10 w-10 rounded-xl relative shadow-sm"
                src={logo}
                alt="Logo"
              />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">
              BioCrats<span className="text-indigo-600">Blogs</span>
            </h1>
          </div>

          <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setView("allBlogs")}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                view === "allBlogs"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Explore
            </button>
            <button
              onClick={() => setView("create")}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                view === "create"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Submit Post
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Feedback Messages */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl flex items-center gap-3"
            >
              <div className="bg-emerald-500 text-white p-1 rounded-full">
                <Plus className="w-4 h-4 rotate-45" />
              </div>
              {success}
            </motion.div>
          )}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3"
            >
              <div className="bg-red-500 text-white p-1 rounded-full">
                <X className="w-4 h-4" />
              </div>
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {view === "allBlogs" ? (
            <motion.div
              key="list"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-8"
            >
              <div className="flex flex-col gap-2 mb-10">
                <h2 className="text-4xl font-extrabold text-slate-900">
                  Latest Stories
                </h2>
                <p className="text-slate-500">
                  Discover insights from our community of bio-enthusiasts.
                </p>
              </div>

              {fetching ? (
                <div className="flex flex-col items-center py-20 text-slate-400">
                  <Loader2 className="w-10 h-10 animate-spin mb-4" />
                  <p>Loading the latest updates...</p>
                </div>
              ) : blogs.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-20 text-center">
                  <p className="text-slate-400 text-lg">
                    No approved blogs yet. Be the first to contribute!
                  </p>
                  <button
                    onClick={() => setView("create")}
                    className="mt-4 text-indigo-600 font-semibold flex items-center gap-2 mx-auto hover:gap-3 transition-all"
                  >
                    Submit a blog <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                blogs.map((blog) => (
                  <motion.div
                    variants={fadeInUp}
                    key={blog._id}
                    className="group bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
                        {/* {blog.authorName[0].toUpperCase()} */}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 leading-none mb-1">
                          {blog.authorName}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium uppercase tracking-wider">
                          <Calendar className="w-3 h-3" />
                          {new Date(blog.createdAt).toLocaleDateString(
                            "en-IN",
                            { month: "short", day: "numeric", year: "numeric" }
                          )}
                        </div>
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors">
                      {blog.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed mb-8 line-clamp-4">
                      {blog.content}
                    </p>

                    {blog.files?.length > 0 && (
                      <div className="flex flex-wrap gap-3">
                        {blog.files.map((file, i) => (
                          <a
                            key={i}
                            href={file.url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 bg-slate-50 hover:bg-indigo-50 px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-indigo-600 border border-slate-100 transition-all"
                          >
                            {getFileIcon(file.mimetype)}
                            <span className="max-w-[120px] truncate">
                              {file.originalName}
                            </span>
                          </a>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-2xl mx-auto"
            >
              <div className="text-center mb-10">
                <h2 className="text-4xl font-extrabold text-slate-900 mb-3">
                  Share Your Knowledge
                </h2>
                <p className="text-slate-500">
                  Fill out the form below. Once approved, your blog will be
                  visible to everyone.
                </p>
              </div>

              <form
                onSubmit={handleSubmitBlog}
                className="bg-white rounded-[2rem] p-10 border border-slate-200 shadow-2xl shadow-indigo-500/10 space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">
                      Full Name
                    </label>
                    <input
                      placeholder="Jane Doe"
                      className="w-full bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 rounded-2xl px-5 py-3.5 transition-all outline-none"
                      value={blogForm.authorName}
                      onChange={(e) =>
                        setBlogForm({ ...blogForm, authorName: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="jane@example.com"
                      className="w-full bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 rounded-2xl px-5 py-3.5 transition-all outline-none"
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
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={blogForm.title}
                    onChange={(e) =>
                      setBlogForm({ ...blogForm, title: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    placeholder="Enter an engaging title..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Content
                  </label>
                  <textarea
                    value={blogForm.content}
                    onChange={(e) =>
                      setBlogForm({ ...blogForm, content: e.target.value })
                    }
                    rows={10}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    placeholder="Share your thoughts..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Attachments
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-indigo-400 transition-colors">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <input
                      type="file"
                      multiple
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-upload"
                      accept="image/*,.pdf,.doc,.docx"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer text-indigo-600 hover:text-indigo-700 font-semibold text-lg"
                    >
                      Click to upload files
                    </label>
                    <p className="text-sm text-gray-500 mt-2">
                      Images, PDFs, Documents up to 10MB
                    </p>
                  </div>
                  {selectedFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {selectedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg border border-gray-200"
                        >
                          <div className="flex items-center gap-3">
                            {getFileIcon(file.type)}
                            <div>
                              <span className="text-sm font-medium text-gray-700 block">
                                {file.name}
                              </span>
                              <span className="text-xs text-gray-500">
                                {(file.size / 1024).toFixed(2)} KB
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded transition"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleSubmitBlog}
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-2xl font-bold text-lg shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                  {loading ? "Submitting..." : "Submit for Approval"}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
