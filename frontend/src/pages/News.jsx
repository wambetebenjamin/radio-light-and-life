import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "../lib/api";
import NewsCard from "../components/NewsCard";
import TiltCard from "../components/TiltCard";
import PageBanner from "../components/PageBanner";

const BANNER_IMAGE = "https://images.unsplash.com/photo-1742106856193-5cc3424ac450?fm=jpg&q=85&w=2000&auto=format&fit=crop";

export default function News() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    api.news().then(setArticles).catch(() => {});
  }, []);

  return (
    <div>
      <PageBanner
        image={BANNER_IMAGE}
        eyebrow="Updates"
        title="News"
        subtitle="Station announcements, new shows, and stories from the community."
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.06, ease: "easeOut" }}
            >
              <TiltCard>
                <NewsCard article={a} />
              </TiltCard>
            </motion.div>
          ))}
          {articles.length === 0 && <p className="text-ink/60">No articles yet.</p>}
        </div>
      </div>
    </div>
  );
}
