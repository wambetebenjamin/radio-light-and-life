import { useRef, useState } from "react";
import { Play, Pause, Loader2 } from "lucide-react";

export default function ListenLiveButton({ station, className = "" }) {
  const audioRef = useRef(null);
  const btnRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | loading | playing | error
  const hasStream = Boolean(station?.streamUrl);

  const handleMove = (e) => {
    const el = btnRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(600px) rotateX(${y * -14}deg) rotateY(${x * 14}deg) scale(1.04)`;
  };
  const handleLeave = () => {
    const el = btnRef.current;
    if (!el) return;
    el.style.transform = "perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)";
  };

  const toggle = async () => {
    if (!hasStream) return;
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
      setStatus("idle");
      return;
    }

    try {
      setStatus("loading");
      await audio.play();
      setPlaying(true);
      setStatus("playing");
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <div className={className}>
      <button
        ref={btnRef}
        onClick={toggle}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        disabled={!hasStream}
        className={`inline-flex items-center gap-3 px-8 py-4 rounded-lg border-2 border-cream/25 text-cream font-display italic text-xl backdrop-blur-md transition-shadow duration-200 will-change-transform disabled:opacity-50 disabled:cursor-not-allowed hover:border-gold ${
          playing ? "" : "pulse-glow"
        }`}
        style={{
          background: "linear-gradient(135deg, rgba(26,63,160,0.8) 0%, rgba(211,47,47,0.75) 100%)",
          transform: "perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)",
          transition: "transform 150ms ease-out, border-color 150ms ease-out",
        }}
        aria-label={playing ? "Pause live stream" : "Listen live"}
      >
        <span className="text-gold" aria-hidden="true">
          {status === "loading" ? (
            <Loader2 size={22} className="animate-spin" />
          ) : playing ? (
            <Pause size={22} fill="currentColor" />
          ) : (
            <Play size={22} fill="currentColor" />
          )}
        </span>
        Listen <span className="font-bold not-italic text-gold">{playing ? "LIVE" : "LIVE!"}</span>
      </button>
      {status === "error" && (
        <p className="mt-2 text-xs text-gold-light">Couldn&rsquo;t connect to the stream. Try again shortly.</p>
      )}
      {!hasStream && (
        <p className="mt-2 text-xs text-cream/50 max-w-[220px]">
          Stream offline &mdash; add a stream URL in backend/.env to go live.
        </p>
      )}
      {hasStream && (
        <audio ref={audioRef} src={station.streamUrl} preload="none" onError={() => setStatus("error")} />
      )}
    </div>
  );
}
