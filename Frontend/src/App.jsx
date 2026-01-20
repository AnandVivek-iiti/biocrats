import "./App.css";
import { useEffect } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

/* Layout Components */
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

/* Pages */
import Home from "./pages/Home";
import About from "./pages/About";
import Events from "./pages/Events";
import AlumniDirectory from "./pages/Alumni";
import Gallery from "./pages/Gallery";
import BiocratTeamPage from "./pages/Team";
import ContactUs from "./pages/Contact";
import Blogs from "./pages/Blogs";
import AdminPanel from "./pages/Adminpannel";
import NotFound from "./components/Notfound";

import { DevelopersSection } from "./components/Footer";

/* =========================
   PUBLIC LAYOUT (HOME SITE)
   ========================= */
function PublicLayout() {
  useEffect(() => {
    const handleSmoothScroll = (e) => {
      const anchor = e.target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (href && href.startsWith("#") && !href.startsWith("#/")) {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);

        const navbarHeight = 80;
        if (targetElement) {
          const targetPosition = targetElement.offsetTop - navbarHeight;
          window.scrollTo({ top: targetPosition, behavior: "smooth" });
        }
      }
    };

    document.addEventListener("click", handleSmoothScroll);
    return () => document.removeEventListener("click", handleSmoothScroll);
  }, []);

  return (
    <>
      <Toaster position="top-right" />
      <Navbar />

      <main>
        <section id="home">
          <Home />
        </section>

        <section id="events">
          <Events />
        </section>

        <section id="about">
          <About />
        </section>

        <section id="team">
          <BiocratTeamPage />
        </section>

        <section id="alumni">
          <AlumniDirectory />
        </section>

        <section id="gallery">
          <Gallery />
        </section>

        <section id="blog">
          <Blogs />
        </section>

        <section id="contact">
          <ContactUs />
        </section>
      </main>

      <Footer />
    </>
  );
}

/* =========================
   APP ROUTER
   ========================= */
function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<PublicLayout />} />

        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/developer" element={<DevelopersSection />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
