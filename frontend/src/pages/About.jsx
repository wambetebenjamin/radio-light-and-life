import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mic, Radio as RadioIcon } from "lucide-react";
import { api, mediaUrl } from "../lib/api";
import TiltCard from "../components/TiltCard";

const FALLBACK_STUDIO = "https://images.unsplash.com/photo-1485579149621-3123dd979885?fm=jpg&q=80&w=1600&auto=format&fit=crop";
const FALLBACK_HILLS = "https://images.unsplash.com/photo-1742106856193-5cc3424ac450?fm=jpg&q=80&w=1600&auto=format&fit=crop";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, ease: "easeOut" },
};

export default function About({ station }) {
  const [studioImage, setStudioImage] = useState(FALLBACK_STUDIO);
  const [hillsImage, setHillsImage] = useState(FALLBACK_HILLS);

  useEffect(() => {
    api.settings().then((s) => {
      if (s.about_studio_image_url) setStudioImage(mediaUrl(s.about_studio_image_url));
      if (s.about_hills_image_url) setHillsImage(mediaUrl(s.about_hills_image_url));
    }).catch(() => {});
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      <div className="grid lg:grid-cols-[1fr_320px] gap-10 items-start">
        <div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-mono text-xs uppercase tracking-[0.2em] text-clay">Who we are</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="font-display text-5xl sm:text-6xl font-extrabold text-forest mt-2">
            More Than <span className="text-clay">Radio</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="font-script text-3xl text-gold mt-1">
            We&rsquo;re a family.
          </motion.p>

          <motion.div {...fadeUp} className="mt-6 space-y-5 text-ink/80 leading-relaxed">
            <p>
              {station?.name} broadcasts on {station?.frequency} from {station?.city}, carrying
              news, music, and messages of hope to homes and businesses across the tea-growing
              hills of Kericho and beyond.
            </p>
            <p>
              Our mission is simple: to be a light in daily life. From the breakfast show that
              starts your morning to the evening programs that close the day in reflection, every
              hour on air is built around the community we serve.
            </p>
          </motion.div>
        </div>

        {/* 3D swaying station ID card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto perspective-1000"
        >
          <div
            className="card-sway w-64 rounded-2xl p-8 text-center text-cream"
            style={{
              background: "linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)",
              border: "2px solid #FFD400",
              boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
            }}
          >
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-forest to-forest-light mx-auto flex items-center justify-center text-gold">
              <Mic size={26} />
            </div>
            <p className="font-display italic text-xl font-bold mt-4">{station?.name}</p>
            <p className="font-display text-4xl font-bold text-clay mt-3">{station?.frequency}</p>
            <p className="font-script text-lg text-gold mt-2">{station?.city}</p>
            <div className="inline-flex items-center gap-2 mt-4 px-4 py-1.5 rounded-full text-xs font-display italic font-bold uppercase tracking-wide" style={{ background: "#D32F2F" }}>
              <span className="h-2 w-2 rounded-full bg-cream pulse-glow" />
              Broadcasting now
            </div>
          </div>
        </motion.div>
      </div>

      <div className="mt-10 grid sm:grid-cols-2 gap-4">
        <motion.div {...fadeUp}>
          <TiltCard className="rounded-2xl overflow-hidden">
            <img src={studioImage} alt="Radio studio microphone" className="rounded-2xl h-56 w-full object-cover" />
          </TiltCard>
        </motion.div>
        <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}>
          <TiltCard className="rounded-2xl overflow-hidden">
            <img src={hillsImage} alt="Kericho tea hills" className="rounded-2xl h-56 w-full object-cover" />
          </TiltCard>
        </motion.div>
      </div>

      <motion.div {...fadeUp} className="mt-5 space-y-5 text-ink/80 leading-relaxed max-w-2xl">
        <p>
          Whether you&rsquo;re tuning in on FM radio or streaming live from this website, thank
          you for listening. We&rsquo;d love to hear from you, reach out on our{" "}
          <a href="/contact" className="text-forest underline underline-offset-4">contact page</a>.
        </p>
      </motion.div>

      <div className="mt-12 grid sm:grid-cols-3 gap-5">
        {[["107.3", "FM frequency"], ["24/7", "Broadcasting"], ["Kericho", "Home base"]].map(([big, small], i) => (
          <motion.div
            key={big}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: i * 0.1, ease: "easeOut" }}
          >
            <TiltCard className="rounded-2xl">
              <div className="rounded-2xl bg-mist/60 p-6 text-center">
                <p className="font-display text-3xl font-bold text-forest">{big}</p>
                <p className="text-sm text-ink/60 mt-1">{small}</p>
              </div>
            </TiltCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
