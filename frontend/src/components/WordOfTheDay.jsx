import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api, mediaUrl } from "../lib/api";

export default function WordOfTheDay() {
  const [entry, setEntry] = useState(null);

  useEffect(() => {
    api.encouragementToday().then(setEntry).catch(() => setEntry(null));
  }, []);

  if (!entry) return null;

  const initials = entry.presenter_name
    ? entry.presenter_name.split(" ").map((n) => n[0]).join("").slice(0, 2)
    : "";

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="max-w-6xl mx-auto px-4 sm:px-6 pb-20"
    >
      <div className="relative overflow-hidden rounded-2xl bg-forest text-cream p-8 sm:p-10 shadow-lift">
        <div
          className="absolute -right-10 -top-10 h-48 w-48 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #E3A73E 0%, transparent 70%)" }}
          aria-hidden="true"
        />
        <p className="font-mono text-xs uppercase tracking-widest text-gold-light">Word of the day</p>
        <p className="mt-4 font-display text-2xl sm:text-3xl font-semibold leading-snug max-w-2xl relative z-10">
          &ldquo;{entry.message}&rdquo;
        </p>
        {entry.presenter_name && (
          <div className="mt-6 flex items-center gap-3 relative z-10">
            <div className="h-10 w-10 rounded-full bg-cream/15 flex items-center justify-center text-sm font-bold">
              {entry.presenter_photo ? (
                <img src={mediaUrl(entry.presenter_photo)} alt="" className="h-full w-full rounded-full object-cover" />
              ) : (
                initials
              )}
            </div>
            <p className="text-sm text-cream/85">{entry.presenter_name}</p>
          </div>
        )}
      </div>
    </motion.section>
  );
}
