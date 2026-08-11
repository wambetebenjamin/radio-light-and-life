import { useEffect, useState } from "react";
import { api, mediaUrl } from "../../lib/api";

const TYPE_LABELS = {
  internship: "Internship",
  advert: "Advertising",
  partnership: "Partnership",
  other: "Other",
};

export default function AdminApplications() {
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState("all");

  const load = () => api.applications().then(setApplications).catch(() => {});
  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!confirm("Delete this submission?")) return;
    await api.deleteApplication(id);
    load();
  };

  const filtered = filter === "all" ? applications : applications.filter((a) => a.type === filter);

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        {["all", "internship", "advert", "partnership", "other"].map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              filter === t ? "bg-forest text-cream" : "bg-mist text-ink/70 hover:bg-mist/70"
            }`}
          >
            {t === "all" ? "All" : TYPE_LABELS[t]}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((a) => (
          <div key={a.id} className="bg-white/70 rounded-xl border border-forest/10 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="inline-block text-xs font-mono uppercase tracking-widest text-clay mb-1">
                  {TYPE_LABELS[a.type] || a.type}
                </span>
                <p className="font-medium">{a.name}</p>
                <p className="text-sm text-ink/60">{a.email}{a.phone ? ` · ${a.phone}` : ""}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-ink/50">{new Date(a.created_at).toLocaleDateString()}</p>
                <button onClick={() => remove(a.id)} className="text-sm text-clay hover:underline mt-1">Delete</button>
              </div>
            </div>
            <p className="text-sm text-ink/80 mt-3 whitespace-pre-line">{a.message}</p>
            {a.attachment_url && (
              <a href={mediaUrl(a.attachment_url)} target="_blank" rel="noreferrer" className="inline-block mt-3 text-sm text-forest hover:underline">
                View attachment &rarr;
              </a>
            )}
          </div>
        ))}
        {filtered.length === 0 && <p className="text-sm text-ink/60">No submissions yet.</p>}
      </div>
    </div>
  );
}
