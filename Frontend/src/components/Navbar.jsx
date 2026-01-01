import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogOut, ChevronDown } from "lucide-react";
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
  const Backend_Url = "https://biocrats.onrender.com";
  const API_URL = `${Backend_Url}/api`;

  // Scroll detection for Navbar background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll Spy Logic
  useEffect(() => {
    const handleScrollSpy = () => {
      const sections = [
        "home",
        "about",
        "team",
        "gallery",
        "events",
        "alumni",
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
    { name: "Home", href: "#home" },
    { name: "Events", href: "#events" },
    { name: "About Us", href: "#about" },
    { name: "Projects", href: "#projects" },
    { name: "Team", href: "#team" },
    { name: "Alumni", href: "#alumni" },
    { name: "Gallery", href: "#gallery" },
    { name: "Blog", href: "#blog" },
    { name: "Contact Us", href: "#contact" },
  ];

  const handleNavClick = (item, e) => {
    e.preventDefault();
    setIsMenuOpen(false);

    if (item.isRoute) {
      navigate(item.href);
      setActiveSection(item.name);
    } else {
      setActiveSection(item.name);
      if (location.pathname !== "/") {
        navigate("/");
        setTimeout(() => scrollToSection(item.href), 100);
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

  // Auth & Profile Logic
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
    if (token) fetchCurrentUser(token);
  }, [API_URL]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setCurrentUser(null);
    setIsUserMenuOpen(false);
  };

  // --- Animation Variants ---
  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const mobileItemVariants = {
    closed: { x: -20, opacity: 0 },
    open: { x: 0, opacity: 1 },
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`sticky top-0 z-50 w-full transition-all duration-300 border-b ${
        isScrolled
          ? "bg-white/90 backdrop-blur-md border-slate-200 shadow-sm"
          : "bg-white border-transparent shadow-none"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center gap-4">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate("/");
                window.scrollTo(0, 0);
              }}
              className="flex items-center gap-3 group"
            >
              <img
                src={logo}
                alt="Biocrats Logo"
                className="h-10 w-10 md:h-12 md:w-12 object-contain transition-transform group-hover:scale-105"
              />
              <div className="flex flex-col">
                <span className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight leading-none group-hover:text-blue-700 transition-colors">
                  BioCrats Club
                </span>
                <span className="text-[10px] md:text-xs font-medium text-slate-500 tracking-wider uppercase">
                  IIT Indore
                </span>
              </div>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavClick(item, e)}
                className={`relative px-3 py-2 text-m font-medium transition-colors duration-200 rounded-md hover:bg-slate-50 ${
                  activeSection === item.name
                    ? "text-blue-700"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {item.name}
                {activeSection === item.name && (
                  <motion.div
                    layoutId="desktop-navbar-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </a>
            ))}
          </nav>

          {/* Right Section (Auth & Mobile Toggle) */}
          <div className="flex items-center gap-4">
            {/* IIT Logo */}
            <a
              href="https://iiti.ac.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:block opacity-80 hover:opacity-100 transition-opacity"
            >
              <img src={iiti} alt="IIT Indore" className="h-16 w-16" />
            </a>

          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu (Accordion Style) */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="lg:hidden overflow-hidden bg-white border-b border-slate-100 shadow-lg"
          >
            <div className="container mx-auto px-4 py-4 space-y-1">
              {navItems.map((item) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  variants={mobileItemVariants}
                  onClick={(e) => handleNavClick(item, e)}
                  className={`block px-4 py-3 rounded-lg text-base font-medium transition-all ${
                    activeSection === item.name
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-slate-50 hover:pl-6"
                  }`}
                >
                  {item.name}
                </motion.a>
              ))}

              <motion.div
                variants={mobileItemVariants}
                className="pt-4 mt-4 border-t border-slate-100"
              >
                {!isAuthenticated ? (
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => handleAuthClick("/login")}
                      className="w-full py-2.5 text-center text-sm font-semibold text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => handleAuthClick("/signup")}
                      className="w-full py-2.5 text-center text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                    >
                      Sign Up
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 px-2">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                        {currentUser?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {currentUser?.name}
                        </p>
                        <p className="text-xs text-slate-500">Member</p>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
