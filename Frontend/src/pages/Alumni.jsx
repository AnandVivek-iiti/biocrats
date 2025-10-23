import React, { useState } from "react";
import { motion } from "framer-motion";
import { Linkedin, Mail, User, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AlumniDirectory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const navigate = useNavigate();
  const alumniData = [
    {
      id: 1,
      name: "Dr. Anya Sharma",
      year: "2018",
      profession: "Research Scientist",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBbm0jxNqa-RjlqhgNFxDlV2kCT7-wTCema9YtZ35lM-MVo7da-OutSzauxr-L1thgwEf7j8ywXuMlbayEjpdfzHaW3q8YKE8sbwKkpOSGPXS0a3ewX5cigyNXrfbM5cso2Hf3qRwGVHoVMHLlW3Revs4b94OBlElQ7gXMLuvebXaa-b55MwYbKFTaYtGcflo3Ts1wGWqHIHXzKshizpJhqTy6W_PyBsuG94dronL2XAhKK0QsnN_P3yyBPLOAOeY078YzbiCWhpqZ1",
      description:
        "Currently a Research Scientist at a leading biotechnology firm, Dr. Sharma has made significant contributions to cancer research.",
      category: "research",
    },
    {
      id: 2,
      name: "Mr. Rohan Verma",
      year: "2015",
      profession: "CEO & Entrepreneur",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAuxPRLU4gzwAg9zvjs88ljjcRPZEXbWjmZ_kxlbWKw1OE3zN3B-9KNMBPOBfgVOnr1p0uwbXHleP0LHNWtlR5SuJub7bsZG7r8dGA-r3UhFmMacWxN3STu9zx7L2Unf8jvYnIIxr-77cCVO2mrXI5p6_vnwSmyd_HmPB-rxqvK4FFNeGquK6HFBNCQems5TsnUwMQKbLzRMCD4drSwu3IVr0gv5zouxsgfn8dw4m8lfqUdc3ldUvafcFppqiVq3WLySSmRKYLXN35A",
      description:
        "Mr. Verma is the CEO of a successful pharmaceutical startup, focusing on innovative drug delivery systems.",
      category: "industry",
    },
    {
      id: 3,
      name: "Ms. Priya Kapoor",
      year: "2012",
      profession: "University Professor",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuB1yfb4gQ7aY6TDF3ILidVA0oPzbOjwDwWL4uUcTnw1hm1LEN-ER3mL1Xd9PSH-1nk-S6uWORKV0jmGToEBTgCJBF172OIqUUa_F1cN58W-Jy6RwN342n2ispng6RBMHhChOHoXAzoT2x4M0bW0q6oZOVnZHmLJIeiVYOEgnP1MjtNUgr8TtIojpFv2l-mO_NVSSYmYyblIelPcH7DZK3Ve8GCJSyqzlMN-VsRiCd8guVfPyamk_LHUSVE_lO7ccVIwsNV5chASBGCQ",
      description:
        "Ms. Kapoor is a renowned professor in molecular biology at a prestigious university, known for her work in genetic engineering.",
      category: "academia",
    },
    {
      id: 4,
      name: "Mr. Vikram Singh",
      year: "2010",
      profession: "Healthcare Consultant",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAVcdfP3SLajfdu_fW1vfoJPWDU0gVOgC4_3xOQ93YL383XW9pBGkAs5V4581V0do5uwJJwLpz__rdVsiyHuqHCCq2cWhHdtd_FvViPTXufKy_dzMzOzEROOd0ybj9sFiqiwCLngTesQcUS7SFeFt2X3A-N9LOE5JnOdbBA92m3EuCdpUssr8pks6h1j8z4ylSTi_q61QR-3ydutXghrpfoJtfAw4CQlRVqdDVu94aOwy8PEKLGaZAiS9_De18ZwDqCNemEzsaTDrxK",
      description:
        "Mr. Singh is a senior consultant in the healthcare industry, specializing in regulatory affairs and market access.",
      category: "industry",
    },
    {
      id: 5,
      name: "Dr. Neha Patel",
      year: "2008",
      profession: "Bioinformatics Expert",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDSPaKKv1U951E0SuqWvKuHb2Wub9GA9HwlyfUdAYqprSxdXhEWE-swlgybmfZAKWaSHwbw1aBDcGKZO-9AbLjpwUzFVDK7MuPClVbO5WyjIsjte-N0CZlTmhVrMQSrHdbiW8sdUA0gIVz-DOsT5zdcdzp7ulHw34z1dPj2TXTfem3Hii4PCsecGffUUFU0qgBaOiZgLBckPaody1RE2Pmew6MsYN8XbTYJRUaA2P0bRcoTyItk_lhsEbFv7OK941MAvA1mAUwmrGd3",
      description:
        "Dr. Patel is a leading expert in bioinformatics, developing cutting-edge tools for genomic data analysis.",
      category: "research",
    },
  ];

  const filterCategories = [
    { value: "all", label: "All Alumni" },
    { value: "research", label: "Research" },
    { value: "academia", label: "Academia" },
    { value: "industry", label: "Industry" },
  ];

  const filteredAlumni = alumniData.filter((alumni) => {
    const matchesSearch =
      alumni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alumni.profession.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      selectedFilter === "all" || alumni.category === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50"
      style={{ fontFamily: '"Public Sans", "Noto Sans", sans-serif' }}
    >

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
         {/* Go Home Button */}
        <div className="flex justify-center md:justify-end mb-10">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
            className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 hover:text-white hover:bg-blue-600 px-5 py-2 rounded-full shadow-sm transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Go to Home
          </motion.button>
        </div>
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6"></div>
          <h1 className="text-slate-900 text-5xl font-bold leading-tight tracking-tighter mb-4">
            Alumni Directory
          </h1>
          <p className="text-slate-600 text-lg font-normal max-w-2xl mx-auto">
            Connect with our distinguished alumni network and explore their
            remarkable achievements in biotechnology.
          </p>
        </div>


        {/* Search and Filter Section */}
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
            <div
              key={alumni.id}
              className="group bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-20 h-20 rounded-full bg-cover bg-center flex-shrink-0 ring-4 ring-blue-50 group-hover:ring-blue-100 transition-all duration-300"
                  style={{ backgroundImage: `url("${alumni.image}")` }}
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-slate-900 text-xl font-bold leading-tight group-hover:text-blue-600 transition-colors">
                        {alumni.name}
                      </h3>
                      <p className="text-slate-500 text-sm font-medium mt-1">
                        Class of {alumni.year}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">
                      {alumni.category.charAt(0).toUpperCase() +
                        alumni.category.slice(1)}
                    </span>
                  </div>
                  <p className="text-blue-600 text-sm font-semibold mb-3">
                    {alumni.profession}
                  </p>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {alumni.description}
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                  View Profile
                </button>
                <button className="px-4 py-2 border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors">
                  Connect
                </button>
              </div>
            </div>
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
