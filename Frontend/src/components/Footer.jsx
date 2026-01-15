import React from "react";
import { Link } from "react-router-dom";
import developerimage from "../assets/core/Anand.jpg";

const Footer = () => {
  const footerLinks = [
    { name: "About Us", href: "#about" },
    { name: "Events", href: "#events" },
    { name: "Team", href: "#team" },
    { name: "Gallery", href: "#gallery" },
    { name: "Blog", href: "#blog" },
    { name: "Contact", href: "#contact" },
  ];

  const socialIcons = [
    {
      name: "Mail",
      link: "mailto:biocrats@iiti.ac.in",
      bg: "bg-blue-600 hover:bg-blue-700",
      svg: (
        <svg
          className="w-5 h-5 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      name: "Instagram",
      link: "https://www.instagram.com/biocrats_iiti/",
      bg: "bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600",
      svg: (
        <svg
          className="w-5 h-5 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      link: "https://www.linkedin.com/in/biocratsclub-iiti/",
      bg: "bg-blue-700 hover:bg-blue-800",
      svg: (
        <svg
          className="w-5 h-5 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
  ];

  const contactInfo = [
    {
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      text: "IIT Indore, Simrol",
    },
    {
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      text: "biocrats@iiti.ac.in",
      link: "mailto:biocrats@iiti.ac.in",
    },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 mb-12">
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Biocrats
              </h3>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              IIT Indore's premier biology and biotechnology community,
              fostering innovation and scientific excellence through research,
              collaboration, and learning.
            </p>

            <div className="space-y-3">
              {contactInfo.map((info, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 text-slate-300"
                >
                  <div className="text-blue-400 mt-0.5">{info.icon}</div>
                  {info.link ? (
                    <a
                      href={info.link}
                      className="text-sm hover:text-blue-400 transition-colors"
                    >
                      {info.text}
                    </a>
                  ) : (
                    <span className="text-sm">{info.text}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-1">
            <h4 className="text-white font-bold mb-6 text-lg flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></div>
              Quick Links
            </h4>
            <ul className="space-y-3">
              {footerLinks.slice(0, 3).map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-slate-300 hover:text-blue-400 text-sm font-medium transition-all duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-blue-400 transition-all duration-200"></span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1">
            <h4 className="text-white font-bold mb-6 text-lg flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></div>
              Resources
            </h4>
            <ul className="space-y-3">
              {footerLinks.slice(3).map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-slate-300 hover:text-blue-400 text-sm font-medium transition-all duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-blue-400 transition-all duration-200"></span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <h4 className="text-white font-bold mb-6 text-lg flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></div>
              Connect
            </h4>

            <div className="flex gap-3 mb-6 flex-wrap">
              {socialIcons.map((item) => (
                <a
                  key={item.name}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${item.bg} w-11 h-11 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 ring-2 ring-white/10 hover:ring-white/30`}
                  aria-label={item.name}
                >
                  {item.svg}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10"></div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-slate-400 text-sm text-center sm:text-left">
            Developed by
            <Link
              to="/developer"
              className="hover:text-blue-400 font-medium ml-1 transition-colors"
            >
              Anand Vivek
            </Link>
          </p>
          <p className="text-slate-400 text-sm text-center sm:text-left">
            © {new Date().getFullYear()} Biocrats Club IIT Indore. All rights
            reserved.
          </p>
        </div>
      </div>

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="absolute bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 group"
        aria-label="Back to top"
      >
        <svg
          className="w-6 h-6 text-white group-hover:-translate-y-1 transition-transform"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </button>
    </footer>
  );
};

export default Footer;
export const DevelopersSection = () => {
  const developer = {
    name: "Anand Vivek",
    role: "Full Stack Developer",
    image: developerimage,
    bio: "Passionate full-stack developer dedicated to creating innovative digital solutions for the biotechnology community. Specializing in modern web technologies and creating seamless user experiences.",
    quote: "Building digital experiences that inspire and innovate",

    social: [
      {
        platform: "LinkedIn",
        url: "https://linkedin.com/in/anandvivek1223",
        color: "bg-blue-700 hover:bg-blue-800",
        icon: (
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        ),
      },
      {
        platform: "GitHub",
        url: "https://github.com/anandvivek-iiti",
        color: "bg-gray-800 hover:bg-gray-900",
        icon: (
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        ),
      },
      {
        platform: "Email",
        url: "mailto:me240003006@iiti.ac.in",
        color: "bg-red-600 hover:bg-red-700",
        icon: (
          <path
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ),
        isStroke: true,
      },
      {
        platform: "Instagram",
        url: "https://instagram.com/anandvivek1223",
        color:
          "bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600",
        icon: (
          <>
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01" />
          </>
        ),
        isStroke: true,
      },
    ],
  };

  return (
    <section className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 min-h-screen flex items-center py-20 overflow-hidden font-sans">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse animation-delay-700"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] animate-pulse animation-delay-1000"></div>
        <div className="absolute top-20 left-20 w-2 h-2 bg-blue-400/50 rounded-full animate-ping"></div>
        <div className="absolute top-40 right-32 w-2 h-2 bg-indigo-400/50 rounded-full animate-ping animation-delay-500"></div>
        <div className="absolute bottom-40 left-40 w-2 h-2 bg-purple-400/50 rounded-full animate-ping animation-delay-1000"></div>

        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 px-5 py-2.5 rounded-full border border-blue-500/20 backdrop-blur-sm">
            <svg
              className="w-5 h-5 text-blue-400 animate-pulse"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              />
            </svg>
            <span className="text-blue-400 text-sm font-semibold tracking-wide">
              MEET THE CREATOR
            </span>
          </div>

          <h2 className="text-5xl md:text-7xl font-extrabold text-white leading-tight">
            Meet the{" "}
            <span className="relative inline-block">
              <span className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 blur-2xl opacity-50"></span>
              <span className="relative bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Developer
              </span>
            </span>
          </h2>

          <p className="mt-6 text-slate-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Designing and engineering the digital backbone of{" "}
            <span className="text-blue-400 font-semibold">
              Biocrats IIT Indore
            </span>
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="group relative bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 lg:p-14 shadow-2xl overflow-hidden hover:border-blue-500/40 transition-all duration-700 hover:shadow-blue-500/20 hover:shadow-3xl">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-600 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-30 transition-all duration-700"></div>

            <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

            <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-5 flex flex-col items-center space-y-8">
                <div className="relative w-72 h-72 md:w-80 md:h-80">
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 via-purple-600 to-indigo-600 rounded-3xl blur-2xl opacity-60 animate-pulse"></div>
                  <div className="absolute inset-0 bg-gradient-to-bl from-indigo-600 to-blue-600 rounded-3xl blur-xl opacity-40 animate-pulse animation-delay-500"></div>

                  <div className="relative w-full h-full p-1.5 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-500 rounded-3xl">
                    <img
                      src={developer.image}
                      alt={developer.name}
                      className="w-full h-full object-cover rounded-[1.3rem] shadow-2xl transform group-hover:scale-[1.03] transition-transform duration-700"
                    />
                  </div>
                  <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-blue-500/50 rounded-tl-2xl"></div>
                  <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-indigo-500/50 rounded-br-2xl"></div>
                </div>

                <div className="relative bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-indigo-500/10 px-6 py-4 rounded-2xl border border-blue-500/20 backdrop-blur-sm max-w-sm">
                  <svg
                    className="absolute top-2 left-2 w-6 h-6 text-blue-400/30"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <p className="text-slate-300 text-sm italic text-center relative z-10 px-4">
                    {developer.quote}
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-4 w-full">
                  {developer.social.map((item, index) => (
                    <a
                      key={index}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`relative w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center text-white shadow-lg transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 ring-2 ring-white/10 hover:ring-white/30 group`}
                      aria-label={item.platform}
                    >
                      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 rounded-2xl transition-colors duration-300"></div>
                      <svg
                        className="w-6 h-6 relative z-10 transform group-hover:scale-110 transition-transform duration-300"
                        fill={item.isStroke ? "none" : "currentColor"}
                        stroke={item.isStroke ? "currentColor" : "none"}
                        strokeWidth={item.isStroke ? "2" : "0"}
                        viewBox="0 0 24 24"
                      >
                        {item.icon}
                      </svg>
                    </a>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-7 space-y-10 text-center lg:text-left">
                <div className="space-y-4">
                  <h3 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
                    {developer.name}
                  </h3>
                  <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-500/15 to-indigo-500/15 border border-blue-500/30 backdrop-blur-sm">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <span className="text-blue-400 font-semibold text-lg tracking-wide">
                      {developer.role}
                    </span>
                  </div>
                </div>
                <p className="text-slate-300 text-lg md:text-xl leading-relaxed">
                  {developer.bio}
                </p>
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-10 bg-gradient-to-b from-blue-500 via-purple-500 to-indigo-500 rounded-full"></div>
                    <h4 className="text-3xl font-bold text-white">
                      Tech Stack
                    </h4>
                  </div>
                  <p className="text-center lg:text-left">
                    <a href="https://skillicons.dev">
                      <img
                        src="https://skillicons.dev/icons?i=cpp,html,css,js,mongodb,express,react,nodejs,nextjs,docker,figma,bootstrap,git,github"
                        alt="Tech Stack"
                        className="inline-block"
                      />
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Home Button */}
        <div className="mt-12 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-full hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
};