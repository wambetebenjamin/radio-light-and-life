import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/schedule", label: "Schedule" },
  { to: "/presenters", label: "Presenters" },
  { to: "/news", label: "News" },
  { to: "/about", label: "About" },
  { to: "/apply", label: "Apply" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar({ station }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <header
      className="fixed top-0 left-0 w-full z-50 border-b"
      style={{
        background: "linear-gradient(180deg, rgba(13,13,13,0.97) 0%, rgba(13,13,13,0.9) 100%)",
        backdropFilter: "blur(10px)",
        borderColor: "rgba(255,212,0,0.25)",
      }}
    >
      <div className="max-w-6xl mx-auto px-5 py-2 flex items-center justify-between gap-4 flex-wrap">
        <NavLink to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt={station?.name || "Radio Light and Life"} className="h-14 w-auto" />
        </NavLink>

        <nav className="hidden md:flex items-center gap-7">
          {links.map((l) => {
            const isActive = l.to === "/" ? location.pathname === "/" : location.pathname.startsWith(l.to);
            return (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className="relative pb-1.5 font-display italic font-bold text-sm uppercase tracking-widest text-cream hover:text-gold transition-colors"
              >
                <span className={isActive ? "text-gold" : ""}>{l.label}</span>
                {isActive && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute left-0 right-0 -bottom-0.5 h-0.5 bg-gold"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <NavLink
            to="/"
            className="inline-flex items-center gap-1.5 font-display italic text-xs uppercase text-cream border-2 border-cream/80 rounded-full px-4 py-1.5 hover:bg-clay hover:border-clay transition-colors"
          >
            <span className="text-gold"><Play size={12} fill="currentColor" /></span> Listen Now
          </NavLink>
          <div className="flex gap-2">
            <NavLink
              to="/apply"
              className="font-display italic text-[11px] font-bold uppercase tracking-wide px-4 py-1.5 rounded bg-white/10 border border-white/30 text-cream hover:bg-clay hover:border-clay transition-colors"
            >
              Register
            </NavLink>
            <NavLink
              to="/admin/login"
              className="font-display italic text-[11px] font-bold uppercase tracking-wide px-4 py-1.5 rounded bg-white/10 border border-white/30 text-cream hover:bg-forest hover:border-forest transition-colors"
            >
              Sign In
            </NavLink>
          </div>
        </div>

        <button
          className="md:hidden inline-flex flex-col justify-center gap-1.5 h-10 w-10"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span className={`h-0.5 w-6 bg-cream transition-transform ${open ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`h-0.5 w-6 bg-cream transition-opacity ${open ? "opacity-0" : ""}`} />
          <span className={`h-0.5 w-6 bg-cream transition-transform ${open ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {open && (
        <nav className="md:hidden border-t border-white/10 bg-obsidian px-5 py-3 flex flex-col gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `px-2 py-2 font-display italic font-bold text-sm uppercase tracking-widest ${
                  isActive ? "text-gold" : "text-cream/85"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <div className="flex gap-2 mt-2">
            <NavLink to="/apply" onClick={() => setOpen(false)} className="flex-1 text-center font-display italic text-xs uppercase px-3 py-2 rounded bg-white/10 border border-white/30 text-cream">Register</NavLink>
            <NavLink to="/admin/login" onClick={() => setOpen(false)} className="flex-1 text-center font-display italic text-xs uppercase px-3 py-2 rounded bg-white/10 border border-white/30 text-cream">Sign In</NavLink>
          </div>
        </nav>
      )}
    </header>
  );
}
