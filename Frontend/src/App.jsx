import "./App.css";
import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Events from "./pages/Events";
import AlumniDirectory from "./pages/Alumni";
import Gallery from "./pages/Gallery";
import BiocratTeamPage from "./pages/Team";
import ContactUs from "./pages/Contact";
import NotFound from "./components/Notfound";
import Footer from "./components/Footer";
import LoginPage from "./pages/Login";
import Signup from "./pages/Signup";
import photo from "./assets/biobg.jpg"
import Blogs from "./pages/Blogs";
function MainPage() {
  useEffect(() => {
    const handleSmoothScroll = (e) => {
      const anchor = e.target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (href && href.startsWith("#")) {
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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/alumni" element={<AlumniDirectory />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
