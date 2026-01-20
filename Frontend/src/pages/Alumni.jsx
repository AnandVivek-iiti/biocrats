import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, User, Briefcase, GraduationCap } from "lucide-react";
import { alumniData } from "../data/Alumni/Alumni";
const AlumniDirectory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const filterCategories = [
    { value: "all", label: "All Alumni" },
    { value: "research", label: "Research" },
    { value: "academia", label: "Academia" },
    { value: "industry", label: "Industry" },
  ];

  const filteredAlumni = alumniData.filter((alumni) => {
    const matchesSearch =
      alumni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alumni.jobRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alumni.program.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      selectedFilter === "all" || alumni.category === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name) => {
    const colors = [
      "bg-blue-500",
      "bg-purple-500",
      "bg-green-500",
      "bg-orange-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
      "bg-red-500",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50"
      style={{ fontFamily: '"Public Sans", "Noto Sans", sans-serif' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-slate-900 text-5xl font-bold leading-tight tracking-tighter mb-4">
            Alumni Directory
          </h1>
          <p className="text-slate-600 text-lg font-normal max-w-2xl mx-auto">
            Connect with our distinguished alumni network and explore their
            remarkable achievements in biotechnology.
          </p>
        </div>

        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                className="w-full h-12 pl-12 pr-4 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900 placeholder:text-slate-500"
                placeholder="Search alumni by name or profession..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-3">
            {filterCategories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedFilter(category.value)}
                className={`px-6 py-2 rounded-full font-medium text-sm transition-all duration-200 ${
                  selectedFilter === category.value
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-center">
          <p className="text-slate-600 text-sm">
            Showing{" "}
            <span className="font-semibold text-blue-600">
              {filteredAlumni.length}
            </span>{" "}
            {filteredAlumni.length === 1 ? "alumnus" : "alumni"}
          </p>
        </div>

        {/* Alumni Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredAlumni.map((alumni) => (
            <motion.div
              key={alumni.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="group bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start gap-4">
                {/* Avatar with Initials */}
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center flex-shrink-0 ring-4 ring-blue-50 group-hover:ring-blue-100 transition-all duration-300 ${getAvatarColor(alumni.name)} text-white text-xl font-bold`}
                >
                  {getInitials(alumni.name)}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-slate-900 text-xl font-bold leading-tight group-hover:text-blue-600 transition-colors">
                        {alumni.name}
                      </h3>
                      <p className="text-slate-500 text-sm font-medium mt-1">
                        {alumni.program} - Class of {alumni.year}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">
                      {alumni.category.charAt(0).toUpperCase() +
                        alumni.category.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <Briefcase className="w-4 h-4 text-blue-600" />
                    <p className="text-slate-700 text-sm font-medium line-clamp-2">
                      {alumni.jobRole}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
                <a
                  href={`mailto:${alumni.email}`}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors text-center"
                >
                  Send Email
                </a>
                <a
                  href={alumni.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                  Connect
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Results Message */}
        {filteredAlumni.length === 0 && (
          <div className="text-center py-12">
            <svg
              className="w-16 h-16 text-slate-300 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <h3 className="text-slate-900 text-xl font-semibold mb-2">
              No alumni found
            </h3>
            <p className="text-slate-500 text-sm">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlumniDirectory;
