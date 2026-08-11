import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Laptop, Smartphone, Radio as RadioIcon, ArrowRight } from "lucide-react";
import { api, mediaUrl } from "../lib/api";
import ListenLiveButton from "../components/ListenLiveButton";
import PresenterCard from "../components/PresenterCard";
import NewsCard from "../components/NewsCard";
import TiltCard from "../components/TiltCard";
import WordOfTheDay from "../components/WordOfTheDay";
import OnAirBar from "../components/OnAirBar";

const FALLBACK_HERO_IMAGES = [
  "https://images.unsplash.com/photo-1485579149621-3123dd979885?fm=jpg&q=85&w=2200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1613031729579-ace1feefda4c?fm=jpg&q=85&w=2200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1742106856193-5cc3424ac450?fm=jpg&q=85&w=2200&auto=format&fit=crop",
];

export default function Home({ station }) {
  const [now, setNow] = useState(null);
  const [presenters, setPresenters] = useState([]);
  const [news, setNews] = useState([]);
  const [heroImages, setHeroImages] = useState(FALLBACK_HERO_IMAGES);
  const [heroIndex, setHeroIndex] = useState(0);
  const heroRef = useRef(null);
  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);
  const springX = useSpring(mvX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mvY, { stiffness: 60, damping: 20 });
  const bgX = useTransform(springX, [-0.5, 0.5], ["-2%", "2%"]);
  const bgY = useTransform(springY, [-0.5, 0.5], ["-2%", "2%"]);

  const handleHeroMove = (e) => {
    const el = heroRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mvX.set((e.clientX - rect.left) / rect.width - 0.5);
    mvY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  useEffect(() => {
    api.scheduleNow().then(setNow).catch(() => setNow(null));
    api.presenters().then((p) => setPresenters(p.slice(0, 4))).catch(() => {});
    api.news().then((n) => setNews(n.slice(0, 3))).catch(() => {});
    api.settings().then((s) => s.hero_image_url && setHeroImages([mediaUrl(s.hero_image_url), ...FALLBACK_HERO_IMAGES.slice(1)])).catch(() => {});
  }, []);

  // Rotate the hero background photo every 6 seconds
  useEffect(() => {
    const id = setInterval(() => {
      setHeroIndex((i) => (i + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(id);
  }, [heroImages.length]);

  return (
    <div>
      {/* Dark hero: bokeh glow, split layout, photo on the right, floating pulsing Listen Live button */}
      <section
        ref={heroRef}
        onMouseMove={handleHeroMove}
        className="relative overflow-hidden bg-obsidian min-h-[85vh] flex items-center"
      >
        <AnimatePresence mode="sync">
          <motion.div
            key={heroImages[heroIndex]}
            className="absolute inset-0 bg-cover"
            style={{ backgroundImage: `url(${heroImages[heroIndex]})`, backgroundPosition: "center right", x: bgX, y: bgY }}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1.06 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 1.4, ease: "easeInOut" }, scale: { duration: 6, ease: "linear" } }}
            aria-hidden="true"
          />
        </AnimatePresence>
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(13,23,18,0.97) 0%, rgba(13,23,18,0.92) 25%, rgba(13,23,18,0.8) 40%, rgba(31,77,60,0.4) 65%, rgba(227,167,62,0.3) 80%, rgba(13,23,18,0.7) 100%)",
          }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bokeh-glow" aria-hidden="true" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 grid lg:grid-cols-[55%_45%] gap-10 w-full min-h-[75vh] items-center">
          <div className="pr-0 lg:pr-8">
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="font-display italic font-bold uppercase text-4xl sm:text-6xl leading-[1.08] text-cream tracking-wide"
            >
              Real music.<br /><span className="text-gold">Real hope.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
              className="mt-4 text-cream/85 italic max-w-md leading-relaxed"
            >
              {station?.tagline || "Changing Lives"} on {station?.frequency}. We broadcast hope,
              music, and community from the heart of {station?.city} &mdash; request a song,
              catch the schedule, and listen from anywhere.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            >
              <Link
                to="/schedule"
                className="inline-flex items-center gap-2 mt-7 px-9 py-3.5 rounded-md bg-gradient-to-br from-gold to-clay text-ink font-display italic font-semibold text-lg hover:brightness-110 hover:-translate-y-0.5 transition-all shadow-lift"
              >
                View the Schedule <span aria-hidden="true">&rarr;</span>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45, ease: "easeOut" }}
              className="relative mt-9 pl-9 max-w-sm"
            >
              <span className="absolute left-0 -top-3 font-display text-6xl text-gold/70" aria-hidden="true">&ldquo;</span>
              <p className="text-sm italic text-cream/60 leading-relaxed">
                Playing the best in gospel, Afrobeat, and community voices &mdash; breaking new
                Kericho stories every day.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
              className="flex items-center gap-3 mt-9"
            >
              <span className="flex items-center gap-3 text-cream/50" aria-hidden="true">
                <Laptop size={18} />
                <Smartphone size={18} />
                <RadioIcon size={18} />
              </span>
              <span className="text-sm text-cream/65">Listen on any device</span>
            </motion.div>
          </div>

          {/* Right column: kept empty of extra UI, like the reference — the photo shows through, button floats bottom-right */}
          <div className="hidden lg:block" aria-hidden="true" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.7, ease: "easeOut" }}
          className="absolute bottom-8 right-4 sm:right-8 z-10"
        >
          <ListenLiveButton station={station} />
        </motion.div>

        <div className="absolute bottom-8 left-4 sm:left-8 z-10 flex gap-2">
          {heroImages.map((img, i) => (
            <button
              key={img}
              onClick={() => setHeroIndex(i)}
              aria-label={`Show background photo ${i + 1}`}
              className={`h-2 rounded-full transition-all ${i === heroIndex ? "w-6 bg-gold" : "w-2 bg-cream/40 hover:bg-cream/70"}`}
            />
          ))}
        </div>
      </section>

      {/* Playing Now / Up Next / Request a Song */}
      <OnAirBar current={now?.current} next={now?.next} />

      <WordOfTheDay />

      {presenters.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20 pt-4">
          <div className="flex items-end justify-between mb-6">
            <h2 className="font-display italic text-4xl font-extrabold text-forest">On the air</h2>
            <Link to="/presenters" className="text-sm font-medium text-clay hover:underline">See all &rarr;</Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {presenters.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.08, ease: "easeOut" }}
              >
                <TiltCard>
                  <PresenterCard presenter={p} />
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {news.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
          <div className="flex items-end justify-between mb-6">
            <h2 className="font-display italic text-4xl font-extrabold text-forest">Latest news</h2>
            <Link to="/news" className="text-sm font-medium text-clay hover:underline">See all &rarr;</Link>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {news.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.08, ease: "easeOut" }}
              >
                <TiltCard>
                  <NewsCard article={a} />
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
