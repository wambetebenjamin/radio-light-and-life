import { FacebookIcon, XIcon, InstagramIcon, YoutubeIcon } from "./SocialIcons";

const SOCIAL = [
  { label: "Facebook", Icon: FacebookIcon, href: "#" },
  { label: "X", Icon: XIcon, href: "#" },
  { label: "Instagram", Icon: InstagramIcon, href: "#" },
  { label: "YouTube", Icon: YoutubeIcon, href: "#" },
];

export default function Footer({ station }) {
  return (
    <footer className="bg-obsidian text-cream mt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <img src="/logo.png" alt={station?.name || "Radio Light and Life"} className="h-16 w-auto mb-2" />
          <p className="mt-2 text-cream/60 text-sm">
            {station?.frequency} &middot; {station?.city}
          </p>
          <p className="mt-1 text-gold font-mono text-xs uppercase tracking-widest">{station?.tagline}</p>
        </div>

        <div>
          <p className="font-display italic font-bold text-sm uppercase tracking-wide text-gold">Listen</p>
          <ul className="mt-4 space-y-2 text-sm text-cream/70">
            <li>Weekdays 5:30am &ndash; 11pm</li>
            <li>Saturday 6am &ndash; 9pm</li>
            <li>Sunday 7am &ndash; 8pm</li>
          </ul>
        </div>

        <div>
          <p className="font-display italic font-bold text-sm uppercase tracking-wide text-gold">Explore</p>
          <ul className="mt-4 space-y-2 text-sm text-cream/70">
            <li><a href="/schedule" className="hover:text-gold-light">Schedule</a></li>
            <li><a href="/presenters" className="hover:text-gold-light">Presenters</a></li>
            <li><a href="/news" className="hover:text-gold-light">News</a></li>
            <li><a href="/apply" className="hover:text-gold-light">Apply</a></li>
          </ul>
        </div>

        <div>
          <p className="font-display italic font-bold text-sm uppercase tracking-wide text-gold">Connect</p>
          <ul className="mt-4 space-y-2 text-sm text-cream/70">
            <li>{station?.city}</li>
            <li><a href="/contact" className="hover:text-gold-light underline underline-offset-4">Send a message</a></li>
          </ul>
          <div className="flex gap-3 mt-4">
            {SOCIAL.map(({ label, Icon, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                title={`${label} (add your real link)`}
                className="h-9 w-9 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-cream/70 hover:bg-gold hover:text-ink hover:border-gold transition-colors"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-cream/10 py-5 text-center text-xs text-cream/40">
        &copy; {new Date().getFullYear()} {station?.name || "Radio Light and Life"}. All rights reserved.
      </div>
    </footer>
  );
}
