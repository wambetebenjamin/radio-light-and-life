import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Music2, Send } from "lucide-react";
import { api } from "../lib/api";

export default function OnAirBar({ current, next }) {
  const [form, setForm] = useState({ requester_name: "", song_title: "", artist: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [error, setError] = useState("");

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.song_title.trim()) return;
    setStatus("sending");
    setError("");
    try {
      await api.submitSongRequest(form);
      setStatus("sent");
      setForm({ requester_name: "", song_title: "", artist: "" });
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      setStatus("error");
      setError(err.message);
    }
  };

  return (
    <div className="relative z-10 bg-obsidian border-t-[3px] border-forest-light">
      <div className="max-w-6xl mx-auto grid sm:grid-cols-3 min-h-[92px]">
        {/* Playing Now */}
        <div className="flex items-center gap-4 px-6 py-4" style={{ background: "#1a1a2e" }}>
          <div>
            <p className="font-display italic font-bold uppercase text-xs tracking-widest text-gold">Playing now</p>
          </div>
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-[50px] w-[50px] rounded-md bg-gradient-to-br from-forest to-clay border border-gold/25 flex items-center justify-center shrink-0">
              <span className="h-2 w-2 rounded-full bg-gold pulse-glow" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="font-display italic font-bold text-cream text-base truncate">
                {current?.show_name || "Music & ministry"}
              </p>
              {current?.presenter_name && (
                <p className="text-xs text-cream/55 truncate">with {current.presenter_name}</p>
              )}
            </div>
          </div>
        </div>

        {/* Up Next */}
        <div className="px-6 py-3 flex flex-col justify-center" style={{ background: "#222240" }}>
          <span className="self-start px-3.5 py-0.5 text-cream text-[11px] font-display italic font-bold uppercase tracking-wide mb-1.5" style={{ background: "#9b30ff" }}>
            Up next
          </span>
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="font-bold text-cream text-sm truncate">{next?.show_name || "Check the schedule"}</p>
              <p className="text-xs text-cream/50 truncate">{next?.start_time || "See full lineup"}</p>
            </div>
            <Link
              to="/schedule"
              aria-label="View full schedule"
              className="h-9 w-9 rounded-full bg-white/10 border border-white/25 text-cream flex items-center justify-center text-sm hover:bg-forest-light hover:border-forest-light transition-colors shrink-0"
            >
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Request a Song */}
        <div className="px-6 py-4" style={{ background: "#1a1a2e" }}>
          <p className="font-display italic font-bold text-cream text-lg uppercase tracking-wide">Request a Song</p>
          <p className="text-xs text-cream/50 mt-0.5">Tell the presenter what to play next.</p>

          {status === "sent" ? (
            <p className="text-sm text-gold-light mt-2.5">Got it &mdash; thanks for the request!</p>
          ) : (
            <form onSubmit={submit} className="mt-2.5 space-y-2">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cream/40" aria-hidden="true"><Music2 size={14} /></span>
                <input
                  required
                  value={form.song_title}
                  onChange={update("song_title")}
                  placeholder="Search for a song to request it"
                  className="w-full bg-white/8 border border-white/20 rounded-md pl-9 pr-3 py-2 text-sm text-cream placeholder:text-cream/35 focus:outline-none focus:border-gold transition-colors"
                />
              </div>
              <div className="flex gap-2">
                <input
                  value={form.artist}
                  onChange={update("artist")}
                  placeholder="Artist (optional)"
                  className="flex-1 bg-white/8 border border-white/20 rounded-md px-3 py-1.5 text-sm text-cream placeholder:text-cream/35 focus:outline-none focus:border-gold transition-colors"
                />
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="px-4 py-1.5 rounded-md bg-gold text-ink text-sm font-display italic font-bold hover:bg-gold-light transition-colors disabled:opacity-50 shrink-0"
                >
                  {status === "sending" ? "…" : <Send size={16} />}
                </button>
              </div>
              {status === "error" && <p className="text-xs text-clay">{error}</p>}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
