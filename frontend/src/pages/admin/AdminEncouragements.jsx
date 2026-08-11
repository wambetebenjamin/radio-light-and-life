import { useEffect, useState } from "react";
import { api } from "../../lib/api";

const todayStr = () => new Date().toISOString().slice(0, 10);
const emptyForm = { message: "", presenter_id: "", entry_date: todayStr() };

export default function AdminEncouragements() {
  const [entries, setEntries] = useState([]);
  const [presenters, setPresenters] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = () => {
    api.encouragements().then(setEntries).catch(() => {});
    api.presenters().then(setPresenters).catch(() => {});
  };
  useEffect(() => { load(); }, []);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const startEdit = (entry) => {
    setEditingId(entry.id);
    setForm({ message: entry.message, presenter_id: entry.presenter_id || "", entry_date: entry.entry_date });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = { ...form, presenter_id: form.presenter_id ? Number(form.presenter_id) : null };
      if (editingId) {
        await api.updateEncouragement(editingId, payload);
      } else {
        await api.createEncouragement(payload);
      }
      cancelEdit();
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this entry?")) return;
    await api.deleteEncouragement(id);
    load();
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div>
        <h2 className="font-display text-xl font-bold text-forest mb-2">
          {editingId ? "Edit entry" : "Add a Word of the Day"}
        </h2>
        <p className="text-sm text-ink/60 mb-4">
          The site automatically shows whichever entry matches today's date. If nothing is set
          for today, it falls back to the most recent past entry &mdash; so it's fine to add a
          batch ahead of time.
        </p>
        <form onSubmit={submit} className="space-y-4 bg-white/70 rounded-2xl border border-forest/10 p-6">
          <div>
            <label className="block text-sm font-medium text-ink/80 mb-1.5">Date</label>
            <input type="date" required value={form.entry_date} onChange={update("entry_date")}
              className="w-full rounded-xl border border-forest/20 bg-white px-4 py-2.5" />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink/80 mb-1.5">Message</label>
            <textarea rows={4} required value={form.message} onChange={update("message")}
              placeholder="A short word of encouragement or reflection…"
              className="w-full rounded-xl border border-forest/20 bg-white px-4 py-2.5" />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink/80 mb-1.5">From presenter (optional)</label>
            <select value={form.presenter_id} onChange={update("presenter_id")}
              className="w-full rounded-xl border border-forest/20 bg-white px-4 py-2.5">
              <option value="">Station (no specific presenter)</option>
              {presenters.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          {error && <p className="text-sm text-clay">{error}</p>}

          <div className="flex gap-3">
            <button type="submit" disabled={saving}
              className="px-5 py-2.5 rounded-full bg-forest text-cream text-sm font-semibold hover:bg-forest-light disabled:opacity-50">
              {saving ? "Saving…" : editingId ? "Save changes" : "Add entry"}
            </button>
            {editingId && (
              <button type="button" onClick={cancelEdit} className="px-5 py-2.5 rounded-full border border-forest/30 text-forest text-sm font-medium">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div>
        <h2 className="font-display text-xl font-bold text-forest mb-4">All entries</h2>
        <div className="space-y-3">
          {entries.map((e) => (
            <div key={e.id} className="bg-white/70 rounded-xl border border-forest/10 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-xs text-clay">{e.entry_date}</p>
                  <p className="text-sm mt-1">{e.message}</p>
                  {e.presenter_name && <p className="text-xs text-ink/50 mt-1">&mdash; {e.presenter_name}</p>}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => startEdit(e)} className="text-sm text-forest hover:underline">Edit</button>
                  <button onClick={() => remove(e.id)} className="text-sm text-clay hover:underline">Delete</button>
                </div>
              </div>
            </div>
          ))}
          {entries.length === 0 && <p className="text-sm text-ink/60">No entries yet.</p>}
        </div>
      </div>
    </div>
  );
}
