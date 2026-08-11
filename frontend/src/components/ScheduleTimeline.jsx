import { motion } from "framer-motion";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function ScheduleTimeline({ shows, activeId }) {
  if (!shows?.length) {
    return <p className="text-ink/60">No shows scheduled for this day yet.</p>;
  }

  return (
    <ol className="relative border-l-2 border-mist pl-6 space-y-8">
      {shows.map((show, i) => {
        const isActive = show.id === activeId;
        return (
          <motion.li
            key={show.id}
            className="relative"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: i * 0.06, ease: "easeOut" }}
          >
            <span
              className={`absolute -left-[31px] top-1 h-3.5 w-3.5 rounded-full border-2 border-cream ${
                isActive ? "bg-clay pulse-glow" : "bg-forest"
              }`}
              aria-hidden="true"
            />
            <div className="flex flex-wrap items-baseline gap-x-3">
              <span className="font-mono text-sm text-forest">
                {show.start_time}&ndash;{show.end_time}
              </span>
              {isActive && (
                <span className="font-mono text-[10px] uppercase tracking-widest bg-clay text-cream px-2 py-0.5 rounded-full">
                  On air
                </span>
              )}
            </div>
            <p className="font-display text-xl font-semibold mt-1">{show.show_name}</p>
            {show.presenter_name && (
              <p className="text-sm text-ink/70">with {show.presenter_name}</p>
            )}
            {show.description && (
              <p className="text-sm text-ink/60 mt-1 max-w-prose">{show.description}</p>
            )}
          </motion.li>
        );
      })}
    </ol>
  );
}

export { DAYS };
