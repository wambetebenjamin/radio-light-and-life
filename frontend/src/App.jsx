import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { api } from "./lib/api";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Schedule from "./pages/Schedule";
import Presenters from "./pages/Presenters";
import News from "./pages/News";
import Article from "./pages/Article";
import About from "./pages/About";
import Apply from "./pages/Apply";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";

const fallbackStation = {
  name: "Radio Light and Life",
  frequency: "107.3 FM",
  tagline: "Changing Lives",
  city: "Kericho, Kenya",
  streamUrl: "",
};

function RequireAdmin({ children }) {
  if (!api.isLoggedIn()) return <Navigate to="/admin/login" replace />;
  return children;
}

function SiteRoutes({ station }) {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col font-body">
      <Navbar station={station} />
      <main className="flex-1 pt-[76px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <Routes location={location}>
              <Route path="/" element={<Home station={station} />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/presenters" element={<Presenters />} />
              <Route path="/news" element={<News />} />
              <Route path="/news/:slug" element={<Article />} />
              <Route path="/about" element={<About station={station} />} />
              <Route path="/apply" element={<Apply />} />
              <Route path="/contact" element={<Contact station={station} />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer station={station} />
    </div>
  );
}

export default function App() {
  const [station, setStation] = useState(fallbackStation);

  useEffect(() => {
    api.station().then(setStation).catch(() => {});
  }, []);

  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <AdminDashboard />
          </RequireAdmin>
        }
      />
      <Route path="/*" element={<SiteRoutes station={station} />} />
    </Routes>
  );
}
