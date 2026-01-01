import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Animation library
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Microscope,
  Users,
  Lightbulb,
  Award,
} from "lucide-react";

// Keep your existing imports
import image1 from "../assets/Images/Image1.JPG";
import image2 from "../assets/Images/Image2.JPG";
import image3 from "../assets/Images/Image3.JPG";
import image4 from "../assets/Images/Image4.JPG";
import image6 from "../assets/Images/Image6.JPG";
import image8 from "../assets/Images/Image8.jpg";

const slides = [image1, image2, image3, image4, image6, image8];
const AUTO_DELAY = 5000;

export default function BiocratsClub() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0); // For slide animation direction
  const timerRef = useRef(null);

  // --- Navigation Logic ---
  const paginate = (newDirection) => {
    setDirection(newDirection);
    setCurrentSlide((prev) => (prev + newDirection + slides.length) % slides.length);
    resetTimer();
  };

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, AUTO_DELAY);
  };

  useEffect(() => {
    resetTimer();
    return () => clearInterval(timerRef.current);
  }, []);

  // --- Animation Variants ---
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 1.2, // Start slightly zoomed in
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1, // Zoom to normal
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.5 },
        scale: { duration: 6, ease: "linear" }, // Ken Burns effect
      },
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.5 },
      },
    }),
  };

  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <div className="relative flex flex-col min-h-screen overflow-x-hidden bg-slate-900 font-sans text-slate-100">

      {/* --- HERO SECTION --- */}
      <section className="relative w-full h-screen overflow-hidden">

        {/* Background Slider */}
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={slides[currentSlide]}
              alt={`Slide ${currentSlide}`}
              className="w-full h-full object-cover brightness-[0.6]" // Darken image slightly via CSS
            />
            {/* Gradient Overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/40"></div>
          </motion.div>
        </AnimatePresence>

        {/* Content Overlay */}
        <div className="absolute inset-0 flex items-center justify-center z-20 px-4">
          <div className="container mx-auto max-w-5xl text-center">

            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.2 } }
              }}
            >

              <motion.h1 variants={textVariants} className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-white mb-6 drop-shadow-2xl">
                The <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Biocrats</span> Club
              </motion.h1>

              <motion.p variants={textVariants} className="text-lg md:text-2xl text-slate-200 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
                Bridging the gap between biology and technology. We foster innovation, research, and collaboration to engineer the future.
              </motion.p>

              <motion.div variants={textVariants} className="flex flex-col sm:flex-row gap-5 justify-center">
                <a
                  href="#projects"
                  className="group relative px-8 py-4 bg-blue-600 rounded-full font-bold text-white overflow-hidden shadow-[0_0_20px_rgba(37,99,235,0.5)] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(37,99,235,0.7)]"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Explore Our Work <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform"/>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </a>

                <a
                  href="#events"
                  className="group px-8 py-4 rounded-full font-bold text-white border border-white/20 bg-white/5 backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/40"
                >
                  Upcoming Events
                </a>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Progress Bar (Bottom) */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10 z-30">
          <motion.div
            key={currentSlide} // Re-animates on slide change
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: AUTO_DELAY / 1000, ease: "linear" }}
            className="h-full bg-blue-500"
          />
        </div>

        {/* Navigation Arrows (Glassmorphism) */}
        <button
          onClick={() => paginate(-1)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-4 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-md border border-white/10 text-white transition-all hover:scale-110 active:scale-95 hidden md:block"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
        <button
          onClick={() => paginate(1)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-4 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-md border border-white/10 text-white transition-all hover:scale-110 active:scale-95 hidden md:block"
        >
          <ChevronRight className="w-8 h-8" />
        </button>

        {/* Dots Navigation */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentSlide ? 1 : -1);
                setCurrentSlide(index);
                resetTimer();
              }}
              className={`h-2 rounded-full transition-all duration-500 ${
                index === currentSlide ? "w-8 bg-blue-500" : "w-2 bg-white/40 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      </section>


    </div>
  );
}
