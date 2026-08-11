import { Link } from "react-router-dom";
import { mediaUrl } from "../lib/api";

export default function NewsCard({ article }) {
  const date = new Date(article.published_at).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Link
      to={`/news/${article.slug}`}
      className="block bg-white/70 rounded-2xl overflow-hidden border border-forest/10 h-full"
    >
      {article.cover_image_url && (
        <div className="h-36 w-full bg-mist overflow-hidden">
          <img src={mediaUrl(article.cover_image_url)} alt="" className="h-full w-full object-cover" />
        </div>
      )}
      <div className="p-6">
        <p className="font-mono text-xs uppercase tracking-widest text-clay">{date}</p>
        <p className="mt-2 font-display text-xl font-bold leading-snug">{article.title}</p>
        {article.excerpt && <p className="mt-2 text-sm text-ink/70">{article.excerpt}</p>}
        <span className="mt-4 inline-block text-sm font-medium text-forest">Read more &rarr;</span>
      </div>
    </Link>
  );
}
