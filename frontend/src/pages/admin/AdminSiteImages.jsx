import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import ImageUploadField from "../../components/ImageUploadField";

export default function AdminSiteImages() {
  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.settings().then(setSettings).catch(() => {});
  }, []);

  const setField = (key) => (url) => {
    setSettings((s) => ({ ...s, [key]: url }));
    setSaved(false);
  };

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      const updated = await api.updateSettings(settings);
      setSettings(updated);
      setSaved(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!settings) return <p className="text-sm text-ink/60">Loading…</p>;

  return (
    <div className="max-w-2xl">
      <p className="text-sm text-ink/70 mb-6">
        These are the background photos used across the site itself, not tied to a specific
        presenter or article. Each one below tells you exactly where it shows up and what size
        works best so nothing looks stretched, blurry, or cropped oddly.
      </p>

      <div className="space-y-8 bg-white/70 rounded-2xl border border-forest/10 p-6">
        <ImageUploadField
          label="Home page hero background"
          value={settings.hero_image_url}
          onChange={setField("hero_image_url")}
          destination="The large full-width photo behind the station name and live player at the very top of the Home page"
          recommendedSize="at least 2000 x 1200px"
          aspectHint="wide landscape, roughly 16:9"
        />

        <div className="h-px bg-forest/10" />

        <ImageUploadField
          label="About page: studio photo"
          value={settings.about_studio_image_url}
          onChange={setField("about_studio_image_url")}
          destination="Left photo in the pair on the About page"
          recommendedSize="at least 1200 x 800px"
          aspectHint="landscape, roughly 3:2"
        />

        <div className="h-px bg-forest/10" />

        <ImageUploadField
          label="About page: Kericho/landscape photo"
          value={settings.about_hills_image_url}
          onChange={setField("about_hills_image_url")}
          destination="Right photo in the pair on the About page"
          recommendedSize="at least 1200 x 800px"
          aspectHint="landscape, roughly 3:2"
        />
      </div>

      {error && <p className="text-sm text-clay mt-4">{error}</p>}

      <div className="mt-6 flex items-center gap-4">
        <button
          onClick={save}
          disabled={saving}
          className="px-5 py-2.5 rounded-full bg-forest text-cream text-sm font-semibold hover:bg-forest-light disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save site images"}
        </button>
        {saved && <span className="text-sm text-forest">Saved.</span>}
      </div>

      <p className="text-xs text-ink/50 mt-6">
        Tip: photos wider than they are tall work best for all three of these spots &mdash; the
        site will crop to fit automatically, but starting with a landscape image means less gets
        cut off. Avoid very small or portrait-orientation photos here; they'll get stretched or
        zoomed in awkwardly.
      </p>
    </div>
  );
}
