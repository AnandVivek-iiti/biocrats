import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X, User, LogOut, ChevronDown } from "lucide-react";
import logo from "../assets/logo.png";
import iiti from "../assets/iiti_logo.png";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeSection, setActiveSection] = useState("Home");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const API_URL = "http://localhost:5000/api";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll spy - only for main page sections
  useEffect(() => {
    if (location.pathname !== "/") {
      // Set active section based on current route
      if (location.pathname === "/alumni") {
        setActiveSection("Alumni");
      }
      return;
    }

    const handleScrollSpy = () => {
      const sections = [
        "home",
        "about",
        "team",
        "gallery",
        "events",
        "blog",
        "contact",
      ];
      const navbarHeight = 80;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (
            rect.top <= navbarHeight + 50 &&
            rect.bottom >= navbarHeight + 50
          ) {
            setActiveSection(
              section.charAt(0).toUpperCase() + section.slice(1)
            );
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScrollSpy);
    return () => window.removeEventListener("scroll", handleScrollSpy);
  }, [location.pathname]);

  const navItems = [
    { name: "Home", href: "#home", isRoute: false },
    { name: "About Us", href: "#about", isRoute: false },
    { name: "Team", href: "#team", isRoute: false },
    { name: "Alumni", href: "/alumni", isRoute: true },
    { name: "Gallery", href: "#gallery", isRoute: false },
    { name: "Events", href: "#events", isRoute: false },
    { name: "Blog", href: "#blog", isRoute: false },
    { name: "Contact Us", href: "#contact", isRoute: false },
  ];

  const handleNavClick = (item, e) => {
    e.preventDefault();
    setIsMenuOpen(false);

    if (item.isRoute) {
      // Router navigation for Alumni
      navigate(item.href);
      setActiveSection(item.name);
    } else {
      // Hash navigation for other sections
      setActiveSection(item.name);

      if (location.pathname !== "/") {
        navigate("/");
        setTimeout(() => {
          scrollToSection(item.href);
        }, 100);
      } else {
        scrollToSection(item.href);
      }
    }
  };

  const scrollToSection = (href) => {
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);
    const navbarHeight = 80;

    if (targetElement) {
      const targetPosition = targetElement.offsetTop - navbarHeight;
      window.scrollTo({ top: targetPosition, behavior: "smooth" });
    }
  };

  const handleAuthClick = (path) => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
    navigate(path);
  };

  const fetchCurrentUser = async (token) => {
    try {
      const response = await fetch(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data.user);
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem("token");
      }
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchCurrentUser(token);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setCurrentUser(null);
    setIsUserMenuOpen(false);
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    navigate("/");
    setActiveSection("Home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-lg shadow-lg"
          : "bg-white/80 backdrop-blur-md shadow-sm"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between py-4">
          {/* Left Logo and Title */}
          <div className="flex items-center gap-3 sm:gap-6">
            <a
              href="/"
              onClick={handleLogoClick}
              className="flex items-center gap-2 sm:gap-3 group cursor-pointer"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-[#1173d4]/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <img
                  className="h-8 w-8 sm:h-12 sm:w-12 relative z-10 transition-transform duration-300 group-hover:scale-110 "
                  src={logo}
                  alt="BioCrats Logo"
                />
              </div>
              <h1 className="text-base sm:text-xl font-bold tracking-tight text-slate-900 group-hover:text-[#1173d4] transition-colors duration-300">
                BioCrats Club
              </h1>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavClick(item, e)}
                className={`px-3 xl:px-4 py-2 rounded-lg text-sm 2xl:text-base font-medium transition-all duration-300 relative group cursor-pointer ${
                  activeSection === item.name
                    ? "text-[#1173d4]"
                    : "text-slate-700 hover:text-[#1173d4]"
                }`}
              >
                {item.name}
                <span
                  className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#1173d4] to-[#0d5aa7] transform origin-left transition-transform duration-300 ${
                    activeSection === item.name
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </a>
            ))}
          </nav>

          {/* Right side - IITI Logo and Auth */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* IITI Logo */}
            <a
              href="https://iiti.ac.in"
              target="_blank"
              rel="noopener noreferrer"
              className="group cursor-pointer"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-[#1173d4]/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <img
                  className="h-8 w-8 sm:h-12 sm:w-12 relative z-10 transition-transform duration-300 group-hover:scale-110 "
                  src={iiti}
                  alt="IIT Indore Logo"
                />
              </div>
            </a>

            {/* Desktop Auth Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              {!isAuthenticated ? (
                <>
                  <button
                    onClick={() => handleAuthClick("/login")}
                    className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-[#1173d4] transition-all duration-300 relative group"
                  >
                    Login
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#1173d4] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                  </button>
                  <button
                    onClick={() => handleAuthClick("/signup")}
                    className="px-5 py-2 bg-gradient-to-r from-slate-800 to-slate-700 text-white text-sm font-semibold rounded-lg hover:from-[#1173d4] hover:to-[#0d5aa7] transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-0.5 hover:scale-105"
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-[#1173d4]"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-[#1173d4] to-[#0d5aa7] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {currentUser?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-gray-700">
                      {currentUser?.name}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-600 transition-transform duration-300 ${
                        isUserMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* User Dropdown */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 animate-fadeIn">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors duration-200"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-all duration-300 hover:scale-110 active:scale-95"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X
                  size={24}
                  className="transition-transform duration-300 rotate-90"
                />
              ) : (
                <Menu size={24} className="transition-transform duration-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? "max-h-[600px] pb-4 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="flex flex-col gap-1 pt-2">
            {navItems.map((item, index) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavClick(item, e)}
                style={{ animationDelay: `${index * 50}ms` }}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer ${
                  activeSection === item.name
                    ? "bg-gradient-to-r from-[#1173d4] to-[#0d5aa7] text-white shadow-md"
                    : "text-slate-700 hover:bg-slate-100 hover:translate-x-1"
                } ${isMenuOpen ? "animate-slideIn" : ""}`}
              >
                {item.name}
              </a>
            ))}

            {/* Auth buttons mobile */}
            {!isAuthenticated ? (
              <div className="flex flex-col gap-2 mt-3 px-4">
                <button
                  onClick={() => handleAuthClick("/login")}
                  className="w-full py-2.5 text-sm font-semibold text-slate-700 border-2 border-slate-300 rounded-lg hover:border-[#1173d4] hover:text-[#1173d4] transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  Login
                </button>
                <button
                  onClick={() => handleAuthClick("/signup")}
                  className="w-full py-2.5 bg-gradient-to-r from-slate-800 to-slate-700 text-white text-sm font-semibold rounded-lg hover:from-[#1173d4] hover:to-[#0d5aa7] transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
                >
                  Sign Up
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 mt-3 px-4">
                <div className="flex items-center gap-3 bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 rounded-lg border border-gray-200">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#1173d4] to-[#0d5aa7] rounded-full flex items-center justify-center text-white font-semibold">
                    {currentUser?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium text-gray-700">
                    {currentUser?.name}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full py-2.5 flex items-center justify-center gap-2 text-red-600 border-2 border-red-200 rounded-lg hover:bg-red-50 transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            )}
          </nav>
        </div>
      </div>


      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
        }
      `}</style>
    </header>
  );
};

export default Navbar;