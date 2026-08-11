export default function FMDial({ frequency = "107.3", city = "Kericho" }) {
  return (
    <div className="perspective-1000 flex items-center justify-center">
      <div
        className="fm-dial-outer h-72 w-72 rounded-full flex items-center justify-center"
        style={{
          background: "radial-gradient(circle at 30% 30%, rgba(255,212,0,0.3) 0%, rgba(26,63,160,0.4) 50%, rgba(13,13,13,0.9) 100%)",
          border: "3px solid rgba(255,212,0,0.4)",
          boxShadow: "0 0 60px rgba(255,212,0,0.3), inset 0 0 40px rgba(0,0,0,0.5)",
        }}
      >
        <div
          className="fm-dial-inner h-56 w-56 rounded-full flex flex-col items-center justify-center"
          style={{
            background: "radial-gradient(circle, #1a1a1a 0%, #0d0d0d 100%)",
            border: "2px solid rgba(211,47,47,0.4)",
          }}
        >
          <p className="font-display text-5xl font-bold text-gold leading-none">{frequency}</p>
          <p className="font-display text-lg tracking-[0.3em] text-clay mt-1">FM</p>
          <p className="font-script text-sm text-cream/60 mt-2">{city}</p>
        </div>
      </div>
    </div>
  );
}
