import { useEffect, useState } from "react";
import { api } from "../../lib/api";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const emptyForm = { day_of_week: 1, start_time: "", end_time: "", show_name: "", presenter_id: "", description: "" };

export default function AdminSchedule() {
  const [entries, setEntries] = useState([]);
  const [presenters, setPresenters] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [dayFilter, setDayFilter] = useState(1);

  const load = () => {
    api.scheduleAll().then(setEntries).catch(() => {});
    api.presenters().then(setPresenters).catch(() => {});
  };
  useEffect(() => { load(); }, []);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const startEdit = (s) => {
    setEditingId(s.id);
    setForm({
      day_of_week: s.day_of_week,
      start_time: s.start_time,
      end_time: s.end_time,
      show_name: s.show_name,
      presenter_id: s.presenter_id || "",
      description: s.description || "",
    });
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
      const payload = {
        ...form,
        day_of_week: Number(form.day_of_week),
        presenter_id: form.presenter_id ? Number(form.presenter_id) : null,
      };
      if (editingId) {
        await api.updateScheduleEntry(editingId, payload);
      } else {
        await api.createScheduleEntry(payload);
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
    if (!confirm("Delete this schedule entry?")) return;
    await api.deleteScheduleEntry(id);
    load();
  };

  const filtered = entries.filter((e) => e.day_of_week === dayFilter);

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div>
        <h2 className="font-display text-xl font-bold text-forest mb-4">
          {editingId ? "Edit schedule entry" : "Add a schedule entry"}
        </h2>
        <form onSubmit={submit} className="space-y-4 bg-white/70 rounded-2xl border border-forest/10 p-6">
          <div>
            <label className="block text-sm font-medium text-ink/80 mb-1.5">Day</label>
            <select value={form.day_of_week} onChange={update("day_of_week")}
              className="w-full rounded-xl border border-forest/20 bg-white px-4 py-2.5">
              {DAYS.map((d, i) => <option key={d} value={i}>{d}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-ink/80 mb-1.5">Start time</label>
              <input type="time" required value={form.start_time} onChange={update("start_time")}
                className="w-full rounded-xl border border-forest/20 bg-white px-4 py-2.5" />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink/80 mb-1.5">End time</label>
              <input type="time" required value={form.end_time} onChange={update("end_time")}
                className="w-full rounded-xl border border-forest/20 bg-white px-4 py-2.5" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink/80 mb-1.5">Show name</label>
            <input required value={form.show_name} onChange={update("show_name")}
              className="w-full rounded-xl border border-forest/20 bg-white px-4 py-2.5" />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink/80 mb-1.5">Presenter</label>
            <select value={form.presenter_id} onChange={update("presenter_id")}
              className="w-full rounded-xl border border-forest/20 bg-white px-4 py-2.5">
              <option value="">No presenter assigned</option>
              {presenters.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink/80 mb-1.5">Description</label>
            <textarea rows={2} value={form.description} onChange={update("description")}
              className="w-full rounded-xl border border-forest/20 bg-white px-4 py-2.5" />
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
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-bold text-forest">Schedule</h2>
          <select value={dayFilter} onChange={(e) => setDayFilter(Number(e.target.value))}
            className="rounded-lg border border-forest/20 bg-white px-3 py-1.5 text-sm">
            {DAYS.map((d, i) => <option key={d} value={i}>{d}</option>)}
          </select>
        </div>
        <div className="space-y-3">
          {filtered.map((s) => (
            <div key={s.id} className="flex items-center justify-between bg-white/70 rounded-xl border border-forest/10 px-4 py-3">
              <div>
                <p className="font-mono text-xs text-clay">{s.start_time}&ndash;{s.end_time}</p>
                <p className="font-medium text-sm">{s.show_name}</p>
                {s.presenter_name && <p className="text-xs text-ink/60">with {s.presenter_name}</p>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(s)} className="text-sm text-forest hover:underline">Edit</button>
                <button onClick={() => remove(s.id)} className="text-sm text-clay hover:underline">Delete</button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <p className="text-sm text-ink/60">Nothing scheduled for this day yet.</p>}
        </div>
      </div>
    </div>
  );
}
