import { useEffect, useState } from "react";
import { api, mediaUrl } from "../../lib/api";
import ImageUploadField from "../../components/ImageUploadField";

const emptyForm = { name: "", role: "", bio: "", photo_url: "", show_name: "" };

export default function AdminPresenters() {
  const [presenters, setPresenters] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = () => api.presenters().then(setPresenters).catch(() => {});
  useEffect(() => { load(); }, []);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const startEdit = (p) => {
    setEditingId(p.id);
    setForm({ name: p.name, role: p.role || "", bio: p.bio || "", photo_url: p.photo_url || "", show_name: p.show_name || "" });
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
      if (editingId) {
        await api.updatePresenter(editingId, form);
      } else {
        await api.createPresenter(form);
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
    if (!confirm("Delete this presenter?")) return;
    await api.deletePresenter(id);
    load();
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div>
        <h2 className="font-display text-xl font-bold text-forest mb-4">
          {editingId ? "Edit presenter" : "Add a presenter"}
        </h2>
        <form onSubmit={submit} className="space-y-4 bg-white/70 rounded-2xl border border-forest/10 p-6">
          <div>
            <label className="block text-sm font-medium text-ink/80 mb-1.5">Name</label>
            <input required value={form.name} onChange={update("name")}
              className="w-full rounded-xl border border-forest/20 bg-white px-4 py-2.5" />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink/80 mb-1.5">Role</label>
            <input value={form.role} onChange={update("role")}
              className="w-full rounded-xl border border-forest/20 bg-white px-4 py-2.5" />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink/80 mb-1.5">Show name</label>
            <input value={form.show_name} onChange={update("show_name")}
              className="w-full rounded-xl border border-forest/20 bg-white px-4 py-2.5" />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink/80 mb-1.5">Bio</label>
            <textarea rows={3} value={form.bio} onChange={update("bio")}
              className="w-full rounded-xl border border-forest/20 bg-white px-4 py-2.5" />
          </div>
          <ImageUploadField
            label="Presenter photo"
            value={form.photo_url}
            onChange={(url) => setForm((f) => ({ ...f, photo_url: url }))}
            destination="Replaces this presenter's face on their profile card (Home page preview, Presenters page, and Schedule)"
            recommendedSize="at least 500 x 500px"
            aspectHint="square, 1:1"
          />

          {error && <p className="text-sm text-clay">{error}</p>}

          <div className="flex gap-3">
            <button type="submit" disabled={saving}
              className="px-5 py-2.5 rounded-full bg-forest text-cream text-sm font-semibold hover:bg-forest-light disabled:opacity-50">
              {saving ? "Saving…" : editingId ? "Save changes" : "Add presenter"}
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
        <h2 className="font-display text-xl font-bold text-forest mb-4">Current presenters</h2>
        <div className="space-y-3">
          {presenters.map((p) => (
            <div key={p.id} className="flex items-center justify-between bg-white/70 rounded-xl border border-forest/10 px-4 py-3">
              <div className="flex items-center gap-3">
                {p.photo_url ? (
                  <img src={mediaUrl(p.photo_url)} alt="" className="h-10 w-10 rounded-full object-cover" />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-forest text-cream flex items-center justify-center text-xs font-bold">
                    {p.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                )}
                <div>
                  <p className="font-medium text-sm">{p.name}</p>
                  <p className="text-xs text-ink/60">{p.show_name}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(p)} className="text-sm text-forest hover:underline">Edit</button>
                <button onClick={() => remove(p.id)} className="text-sm text-clay hover:underline">Delete</button>
              </div>
            </div>
          ))}
          {presenters.length === 0 && <p className="text-sm text-ink/60">No presenters yet.</p>}
        </div>
      </div>
    </div>
  );
}
