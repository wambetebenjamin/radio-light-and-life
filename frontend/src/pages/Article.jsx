import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../lib/api";

export default function Article() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    setArticle(null);
    setError(false);
    api.article(slug).then(setArticle).catch(() => setError(true));
  }, [slug]);

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <p className="text-ink/70">That article couldn&rsquo;t be found.</p>
        <Link to="/news" className="text-forest font-medium hover:underline mt-4 inline-block">&larr; Back to news</Link>
      </div>
    );
  }

  if (!article) {
    return <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-ink/60">Loading&hellip;</div>;
  }

  const date = new Date(article.published_at).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <Link to="/news" className="text-sm font-medium text-clay hover:underline">&larr; Back to news</Link>
      <p className="font-mono text-xs uppercase tracking-widest text-clay mt-6">{date}</p>
      <h1 className="font-display text-4xl font-semibold text-forest mt-2">{article.title}</h1>
      <div className="mt-6 text-ink/80 leading-relaxed whitespace-pre-line">{article.body}</div>
    </article>
  );
}
