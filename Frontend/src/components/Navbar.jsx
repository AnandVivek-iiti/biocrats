import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import logo from "../assets/logo.png";
import iiti from "../assets/iiti_logo.png";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("Home");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
              section.charAt(0).toUpperCase() + section.slice(1),
            );
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScrollSpy);
    return () => window.removeEventListener("scroll", handleScrollSpy);
  }, [location.pathname]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "Events", href: "#events" },
    { name: "About Us", href: "#about" },
    { name: "Team", href: "#team" },
    { name: "Alumni", href: "#alumni" },
    { name: "Gallery", href: "#gallery" },
    { name: "Blog", href: "#blog" },
    { name: "Contact Us", href: "#contact" },
  ];

  const scrollToSection = (href) => {
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);
    const navbarHeight = 80;

    if (targetElement) {
      const targetPosition = targetElement.offsetTop - navbarHeight;
      window.scrollTo({ top: targetPosition, behavior: "smooth" });
    }
  };

  const handleNavClick = (item) => {
    setActiveSection(item.name);
    setIsMenuOpen(false);

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => scrollToSection(item.href), 100);
    } else {
      scrollToSection(item.href);
    }
  };

  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const mobileMenuVariants = {
    closed: {
      x: "100%",
      transition: {
        type: "tween",
        duration: 0.3,
        ease: "easeInOut"
      },
    },
    open: {
      x: 0,
      transition: {
        type: "tween",
        duration: 0.3,
        ease: "easeInOut",
        staggerChildren: 0.07,
        delayChildren: 0.2,
      },
    },
  };

  const mobileItemVariants = {
    closed: { x: 50, opacity: 0 },
    open: { x: 0, opacity: 1 },
  };

  const overlayVariants = {
    closed: { opacity: 0 },
    open: { opacity: 1 },
  };

  return (
    <>
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
              <button
                onClick={() => {
                  navigate("/");
                  window.scrollTo(0, 0);
                  setIsMenuOpen(false);
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
              </button>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item)}
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
                </button>
              ))}
            </nav>

            {/* Right side - IITI Logo and Mobile Menu */}
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
                    className="h-8 w-8 sm:h-12 sm:w-12 relative z-10 transition-transform duration-300 group-hover:scale-110"
                    src={iiti}
                    alt="IIT Indore Logo"
                  />
                </div>
              </a>

              {/* Mobile Menu Button */}
              <button
                type="button"
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-all duration-300 hover:scale-110 active:scale-95 z-50"
                aria-label="Toggle menu"
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Full Screen Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              variants={overlayVariants}
              initial="closed"
              animate="open"
              exit="closed"
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Mobile Menu Panel */}
            <motion.div
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed top-0 right-0 bottom-0 w-full sm:w-80 bg-white shadow-2xl z-50 lg:hidden overflow-y-auto"
            >
              <div className="flex flex-col h-full">
                {/* Menu Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                  <div className="flex items-center gap-3">
                    <img
                      src={logo}
                      alt="Biocrats Logo"
                      className="h-10 w-10 object-contain"
                    />
                    <div className="flex flex-col">
                      <span className="text-lg font-bold text-slate-900">
                        BioCrats Club
                      </span>
                      <span className="text-xs font-medium text-slate-500 uppercase">
                        IIT Indore
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
                    aria-label="Close menu"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Menu Items */}
                <nav className="flex-1 p-6">
                  <div className="space-y-2">
                    {navItems.map((item, index) => (
                      <motion.button
                        key={item.name}
                        variants={mobileItemVariants}
                        onClick={() => handleNavClick(item)}
                        className={`w-full text-left px-4 py-4 rounded-xl text-lg font-medium transition-all ${
                          activeSection === item.name
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                            : "text-slate-700 hover:bg-slate-100 active:bg-slate-200"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{item.name}</span>

                        </div>
                      </motion.button>
                    ))}
                  </div>
                </nav>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;