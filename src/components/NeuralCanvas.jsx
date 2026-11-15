import { useEffect, useRef } from "react";

/** Quiet neural-network backdrop: drifting nodes joined by faint links. Static when reduced motion is on. */
export default function NeuralCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current, ctx = c.getContext("2d");
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w, h, raf, nodes = [];
    const size = () => {
      const r = c.parentElement.getBoundingClientRect(), d = devicePixelRatio || 1;
      w = r.width; h = r.height; c.width = w * d; c.height = h * d; ctx.setTransform(d, 0, 0, d, 0, 0);
      nodes = Array.from({ length: Math.min(60, Math.floor(w / 24)) }, () => ({
        x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25 }));
    };
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const a of nodes) {
        if (!still) { a.x += a.vx; a.y += a.vy; if (a.x < 0 || a.x > w) a.vx *= -1; if (a.y < 0 || a.y > h) a.vy *= -1; }
        for (const b of nodes) {
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 130) { ctx.strokeStyle = `rgba(155,123,255,${(1 - d / 130) * .22})`; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
        }
        ctx.fillStyle = "rgba(84,200,255,.55)"; ctx.beginPath(); ctx.arc(a.x, a.y, 1.6, 0, 7); ctx.fill();
      }
      if (!still) raf = requestAnimationFrame(draw);
    };
    size(); draw(); addEventListener("resize", size);
    return () => { cancelAnimationFrame(raf); removeEventListener("resize", size); };
  }, []);
  return <canvas ref={ref} className="neural" aria-hidden="true" />;
}
