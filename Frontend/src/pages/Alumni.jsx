import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";
import { alumniData } from "../data/Alumni/Alumni";

const INITIAL_COUNT = 4;
const LOAD_MORE_COUNT = 10;

const AlumniDirectory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  const lastCardRef = useRef(null);

  const filterCategories = [
    { value: "all", label: "All Alumni" },
    { value: "research", label: "Research" },
    { value: "academia", label: "Academia" },
    { value: "industry", label: "Industry" },
  ];

  const filteredAlumni = alumniData.filter((alumni) => {
    const q = searchQuery.toLowerCase();
    return (
      (alumni.name.toLowerCase().includes(q) ||
        alumni.jobRole.toLowerCase().includes(q) ||
        alumni.program.toLowerCase().includes(q)) &&
      (selectedFilter === "all" || alumni.category === selectedFilter)
    );
  });

  /* Reset on search / filter */
  useEffect(() => {
    setVisibleCount(INITIAL_COUNT);
  }, [searchQuery, selectedFilter]);

  /* Smooth scroll after loading more */
  useEffect(() => {
    if (lastCardRef.current) {
      lastCardRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [visibleCount]);

  const getInitials = (name) =>
    name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

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
    return colors[name.charCodeAt(0) % colors.length];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-slate-900">
            Alumni Directory
          </h1>
          <p className="text-slate-600 mt-3">
            Connect with our alumni network
          </p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-6">
          <input
            className="w-full h-12 px-4 rounded-lg border focus:ring-2 focus:ring-blue-600"
            placeholder="Search by name, role, program..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex justify-center flex-wrap gap-3 mb-8">
          {filterCategories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedFilter(cat.value)}
              className={`px-6 py-2 rounded-full text-sm font-medium ${
                selectedFilter === cat.value
                  ? "bg-blue-600 text-white"
                  : "bg-white border text-slate-600"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredAlumni.slice(0, visibleCount).map((alumni, idx) => (
            <motion.div
              key={alumni.id}
              ref={
                idx === visibleCount - LOAD_MORE_COUNT
                  ? lastCardRef
                  : null
              }
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-6 rounded-xl border hover:shadow-lg"
            >
              <div className="flex gap-4">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold ${getAvatarColor(
                    alumni.name
                  )}`}
                >
                  {getInitials(alumni.name)}
                </div>

                <div>
                  <h3 className="text-xl font-semibold">
                    {alumni.name}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {alumni.program} · {alumni.year}
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    <Briefcase className="w-4 h-4 text-blue-600" />
                    <p className="text-sm">{alumni.jobRole}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-10">
          {visibleCount < filteredAlumni.length && (
            <button
              onClick={() =>
                setVisibleCount((prev) =>
                  Math.min(
                    prev + LOAD_MORE_COUNT,
                    filteredAlumni.length
                  )
                )
              }
              className="px-8 py-3 font-bold bg-blue-600 text-white rounded-full"
            >
              See More
            </button>
          )}

          {visibleCount > INITIAL_COUNT && (
            <button
              onClick={() => {
                setVisibleCount(INITIAL_COUNT);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="px-8 py-3 border font-bold rounded-full"
            >
              Show Less
            </button>
          )}
        </div>

        {filteredAlumni.length === 0 && (
          <p className="text-center text-slate-500 mt-12">
            No alumni found
          </p>
        )}
      </div>
    </div>
  );
};

export default AlumniDirectory;
