import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "../lib/api";
import PresenterCard from "../components/PresenterCard";
import TiltCard from "../components/TiltCard";
import PageBanner from "../components/PageBanner";

const BANNER_IMAGE = "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?fm=jpg&q=85&w=2000&auto=format&fit=crop";

export default function Presenters() {
  const [presenters, setPresenters] = useState([]);

  useEffect(() => {
    api.presenters().then(setPresenters).catch(() => {});
  }, []);

  return (
    <div>
      <PageBanner
        image={BANNER_IMAGE}
        eyebrow="The voices of 107.3"
        title="Presenters"
        subtitle="Meet the team bringing you news, music, and encouragement every day."
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {presenters.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.06, ease: "easeOut" }}
            >
              <TiltCard>
                <PresenterCard presenter={p} />
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
