import { useState } from "react";
import { api, mediaUrl } from "../lib/api";

export default function ImageUploadField({ label, value, onChange, destination, recommendedSize, aspectHint }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const { url } = await api.uploadImage(file);
      onChange(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-ink/80 mb-1">{label}</label>
      {destination && (
        <p className="text-xs text-forest/80 mb-0.5">
          <span className="font-medium">Appears:</span> {destination}
        </p>
      )}
      {recommendedSize && (
        <p className="text-xs text-ink/50 mb-2">
          Recommended: {recommendedSize}{aspectHint ? ` (${aspectHint})` : ""}. JPG, PNG, or WEBP, up to 5MB.
        </p>
      )}
      <div className="flex items-center gap-3 mt-1.5">
        {value && (
          <img src={mediaUrl(value)} alt="" className="h-14 w-14 rounded-lg object-cover border border-forest/20" />
        )}
        <label className="cursor-pointer px-4 py-2 rounded-full border border-forest/30 text-forest text-sm font-medium hover:bg-mist transition-colors">
          {uploading ? "Uploading…" : value ? "Replace image" : "Upload image"}
          <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFile} />
        </label>
        {value && (
          <button type="button" onClick={() => onChange("")} className="text-sm text-clay hover:underline">
            Remove
          </button>
        )}
      </div>
      {error && <p className="text-xs text-clay mt-1">{error}</p>}
    </div>
  );
}
