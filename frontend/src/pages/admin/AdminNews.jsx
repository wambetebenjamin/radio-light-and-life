import { useEffect, useState } from "react";
import { api, mediaUrl } from "../../lib/api";
import ImageUploadField from "../../components/ImageUploadField";

const emptyForm = { title: "", excerpt: "", body: "", cover_image_url: "" };

export default function AdminNews() {
  const [articles, setArticles] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = () => api.news().then(setArticles).catch(() => {});
  useEffect(() => { load(); }, []);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const startEdit = (a) => {
    setEditingId(a.id);
    setForm({ title: a.title, excerpt: a.excerpt || "", body: a.body || "", cover_image_url: a.cover_image_url || "" });
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
        await api.updateArticle(editingId, form);
      } else {
        await api.createArticle(form);
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
    if (!confirm("Delete this article?")) return;
    await api.deleteArticle(id);
    load();
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div>
        <h2 className="font-display text-xl font-bold text-forest mb-4">
          {editingId ? "Edit article" : "Add a news article"}
        </h2>
        <form onSubmit={submit} className="space-y-4 bg-white/70 rounded-2xl border border-forest/10 p-6">
          <div>
            <label className="block text-sm font-medium text-ink/80 mb-1.5">Title</label>
            <input required value={form.title} onChange={update("title")}
              className="w-full rounded-xl border border-forest/20 bg-white px-4 py-2.5" />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink/80 mb-1.5">Excerpt</label>
            <input value={form.excerpt} onChange={update("excerpt")}
              className="w-full rounded-xl border border-forest/20 bg-white px-4 py-2.5" />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink/80 mb-1.5">Body</label>
            <textarea rows={6} required value={form.body} onChange={update("body")}
              className="w-full rounded-xl border border-forest/20 bg-white px-4 py-2.5" />
          </div>
          <ImageUploadField
            label="Cover image"
            value={form.cover_image_url}
            onChange={(url) => setForm((f) => ({ ...f, cover_image_url: url }))}
            destination="Shows as the article's cover photo on the News page and Home page preview cards"
            recommendedSize="at least 1200 x 630px"
            aspectHint="landscape, roughly 1.9:1"
          />

          {error && <p className="text-sm text-clay">{error}</p>}

          <div className="flex gap-3">
            <button type="submit" disabled={saving}
              className="px-5 py-2.5 rounded-full bg-forest text-cream text-sm font-semibold hover:bg-forest-light disabled:opacity-50">
              {saving ? "Saving…" : editingId ? "Save changes" : "Publish article"}
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
        <h2 className="font-display text-xl font-bold text-forest mb-4">Published articles</h2>
        <div className="space-y-3">
          {articles.map((a) => (
            <div key={a.id} className="flex items-center justify-between bg-white/70 rounded-xl border border-forest/10 px-4 py-3">
              <div className="flex items-center gap-3">
                {a.cover_image_url && <img src={mediaUrl(a.cover_image_url)} alt="" className="h-10 w-10 rounded-lg object-cover" />}
                <p className="font-medium text-sm">{a.title}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(a)} className="text-sm text-forest hover:underline">Edit</button>
                <button onClick={() => remove(a.id)} className="text-sm text-clay hover:underline">Delete</button>
              </div>
            </div>
          ))}
          {articles.length === 0 && <p className="text-sm text-ink/60">No articles yet.</p>}
        </div>
      </div>
    </div>
  );
}
