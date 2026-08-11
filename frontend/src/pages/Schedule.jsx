import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { api } from "../lib/api";
import ScheduleTimeline, { DAYS } from "../components/ScheduleTimeline";
import PageBanner from "../components/PageBanner";

const BANNER_IMAGE = "https://images.unsplash.com/photo-1595520467722-98c9fd0f8fbd?fm=jpg&q=85&w=2000&auto=format&fit=crop";

export default function Schedule() {
  const [schedule, setSchedule] = useState([]);
  const [now, setNow] = useState(null);
  const [day, setDay] = useState(new Date().getDay());

  useEffect(() => {
    api.scheduleAll().then(setSchedule).catch(() => {});
    api.scheduleNow().then(setNow).catch(() => {});
  }, []);

  const showsForDay = schedule.filter((s) => s.day_of_week === day);

  return (
    <div>
      <PageBanner
        image={BANNER_IMAGE}
        eyebrow="Weekly lineup"
        title="Schedule"
        subtitle="Every show, every day. Tap a day below to see what's airing."
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-wrap gap-2">
          {DAYS.map((label, idx) => (
            <button
              key={label}
              onClick={() => setDay(idx)}
              className="relative px-4 py-2 text-sm font-medium rounded-full"
            >
              {day === idx && (
                <motion.span
                  layoutId="day-tab-pill"
                  className="absolute inset-0 rounded-full bg-forest"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className={`relative z-10 ${day === idx ? "text-cream" : "text-ink/70 hover:text-forest"}`}>
                {label}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={day}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              <ScheduleTimeline shows={showsForDay} activeId={day === now?.current?.day_of_week ? now?.current?.id : null} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
