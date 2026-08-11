import { useRef } from "react";

/**
 * Wraps any card content with a subtle 3D tilt that follows the cursor,
 * plus a soft dynamic shadow that shifts with the tilt direction.
 * This is what gives cards real dimension instead of a flat hover-scale.
 */
export default function TiltCard({ children, className = "" }) {
  const ref = useRef(null);

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    const rotateY = x * 8; // deg
    const rotateX = y * -8;

    el.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px) scale(1.015)`;
    el.style.setProperty("--shadow-x", `${x * 14}px`);
    el.style.setProperty("--shadow-y", `${8 + y * 10}px`);
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)";
    el.style.setProperty("--shadow-x", "0px");
    el.style.setProperty("--shadow-y", "8px");
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`transition-transform duration-200 ease-out will-change-transform ${className}`}
      style={{
        boxShadow:
          "var(--shadow-x, 0px) var(--shadow-y, 8px) 24px -8px rgba(22,35,28,0.22), 0 2px 6px rgba(22,35,28,0.08)",
        transition: "transform 200ms ease-out, box-shadow 200ms ease-out",
      }}
    >
      {children}
    </div>
  );
}
