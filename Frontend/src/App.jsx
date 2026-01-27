import "./App.css";
import { useEffect, lazy, Suspense } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PageLoader from "./components/PageLoader";

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Events = lazy(() => import("./pages/Events"));
const AlumniDirectory = lazy(() => import("./pages/Alumni"));
const Gallery = lazy(() => import("./pages/Gallery"));
const BiocratTeamPage = lazy(() => import("./pages/Team"));
const ContactUs = lazy(() => import("./pages/Contact"));
const Blogs = lazy(() => import("./pages/Blogs"));
const AdminPanel = lazy(() => import("./pages/Adminpannel"));
const NotFound = lazy(() => import("./components/Notfound"));
const DevelopersSection = lazy(() =>
  import("./components/Footer").then((m) => ({
    default: m.DevelopersSection,
  }))
);

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
          window.scrollTo({
            top: targetElement.offsetTop - navbarHeight,
            behavior: "smooth",
          });
        }
      }
    };

    document.addEventListener("click", handleSmoothScroll);
    return () =>
      document.removeEventListener("click", handleSmoothScroll);
  }, []);

  return (
    <>
      <Toaster position="top-right" />
      <Navbar />

      <main>
        <Suspense fallback={<PageLoader />}>
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
        </Suspense>
      </main>

      <Footer />
    </>
  );
}
function App() {
  return (
    <HashRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<PublicLayout />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/developer" element={<DevelopersSection />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </HashRouter>
  );
}

export default App;
