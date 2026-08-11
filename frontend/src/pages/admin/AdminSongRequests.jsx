import { useEffect, useState } from "react";
import { api } from "../../lib/api";

export default function AdminSongRequests() {
  const [requests, setRequests] = useState([]);

  const load = () => api.songRequests().then(setRequests).catch(() => {});
  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    await api.deleteSongRequest(id);
    load();
  };

  return (
    <div>
      <p className="text-sm text-ink/60 mb-6">
        Requests submitted from the "Request a Song" panel on the Home page.
      </p>
      <div className="space-y-3">
        {requests.map((r) => (
          <div key={r.id} className="flex items-center justify-between bg-white/70 rounded-xl border border-forest/10 px-4 py-3">
            <div>
              <p className="font-medium text-sm">
                {r.song_title}{r.artist ? <span className="text-ink/60"> &mdash; {r.artist}</span> : null}
              </p>
              <p className="text-xs text-ink/50">
                {r.requester_name || "Anonymous"} &middot; {new Date(r.created_at).toLocaleString()}
              </p>
            </div>
            <button onClick={() => remove(r.id)} className="text-sm text-clay hover:underline shrink-0">Clear</button>
          </div>
        ))}
        {requests.length === 0 && <p className="text-sm text-ink/60">No song requests yet.</p>}
      </div>
    </div>
  );
}
