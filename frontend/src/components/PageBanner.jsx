import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function PageBanner({ image, eyebrow, title, subtitle }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.3]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-obsidian h-[300px] sm:h-[360px] flex items-end">
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${image})`, y }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(13,13,13,0.55) 0%, rgba(13,13,13,0.35) 40%, rgba(13,13,13,0.9) 100%)",
        }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bokeh-glow opacity-60" aria-hidden="true" />

      <motion.div
        style={{ opacity }}
        className="relative max-w-6xl mx-auto px-4 sm:px-6 pb-8 w-full"
      >
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="font-mono text-xs uppercase tracking-[0.2em] text-gold"
        >
          {eyebrow}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-display text-5xl sm:text-6xl font-extrabold text-cream mt-2"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-3 text-cream/75 max-w-prose"
          >
            {subtitle}
          </motion.p>
        )}
      </motion.div>
    </section>
  );
}
