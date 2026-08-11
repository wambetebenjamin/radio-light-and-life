import { mediaUrl } from "../lib/api";

export default function PresenterCard({ presenter }) {
  const initials = presenter.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="bg-white/70 rounded-2xl p-6 border border-forest/10 h-full">
      <div className="h-16 w-16 rounded-full bg-forest text-cream flex items-center justify-center font-display text-xl font-bold ring-4 ring-gold/20">
        {presenter.photo_url ? (
          <img src={mediaUrl(presenter.photo_url)} alt={presenter.name} className="h-full w-full rounded-full object-cover" />
        ) : (
          initials
        )}
      </div>
      <p className="mt-4 font-display text-lg font-bold">{presenter.name}</p>
      <p className="text-clay text-sm font-medium">{presenter.role}</p>
      {presenter.show_name && (
        <p className="text-xs font-mono uppercase tracking-widest text-forest mt-1">{presenter.show_name}</p>
      )}
      {presenter.bio && <p className="mt-3 text-sm text-ink/70">{presenter.bio}</p>}
    </div>
  );
}
