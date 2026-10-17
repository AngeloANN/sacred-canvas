import { useEffect, useRef, type RefObject } from "react";

/**
 * A grid of tiny orange lights that slowly twinkle in the background.
 * It's a <canvas> laid over the black part of the intro, and it leaves a soft
 * empty zone around the lamp and mask so no dot ever lands on them.
 */

type Props = {
  /** The box that holds the intro <video> (or the still <img>), so we know where the lamp is on screen. */
  mediaBoxRef: RefObject<HTMLElement | null>;
  /** Where the lamp + mask sit inside the video frame, as fractions (0 = left/top, 1 = right/bottom). */
  avoid?: { x0: number; y0: number; x1: number; y1: number };
};

// Space between dots, in CSS pixels.
const SPACING = 26;
// How long one dot takes to glow and fade, in seconds (each dot gets a random value in this range).
const MIN_PERIOD = 6;
const MAX_PERIOD = 14;
// The whole field fades in over this many seconds when the page opens.
const FADE_IN = 2.5;

// The gradient of each dot: hot amber in the middle, orange, then nothing.
function makeGlowSprite(size: number) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  const r = size / 2;
  const grad = g.createRadialGradient(r, r, 0, r, r, r);
  grad.addColorStop(0, "rgba(255, 214, 150, 1)"); // pale amber core
  grad.addColorStop(0.25, "rgba(255, 150, 50, 0.85)"); // orange
  grad.addColorStop(0.6, "rgba(200, 80, 10, 0.25)"); // burnt orange
  grad.addColorStop(1, "rgba(120, 40, 0, 0)"); // fades out
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return c;
}

// Smooth 0→1 ramp between a and b.
const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

// Where the video frame actually appears on screen, taking object-fit and object-position into account.
function frameRect(el: HTMLVideoElement | HTMLImageElement, canvasBox: DOMRect) {
  const box = el.getBoundingClientRect();
  const natW = (el instanceof HTMLVideoElement ? el.videoWidth : el.naturalWidth) || 16;
  const natH = (el instanceof HTMLVideoElement ? el.videoHeight : el.naturalHeight) || 9;
  const style = getComputedStyle(el);
  const scale =
    style.objectFit === "cover"
      ? Math.max(box.width / natW, box.height / natH)
      : Math.min(box.width / natW, box.height / natH);
  const w = natW * scale;
  const h = natH * scale;
  const [px = "50%", py = "50%"] = style.objectPosition.split(" ");
  const fx = parseFloat(px) / 100;
  const fy = parseFloat(py) / 100;
  return {
    left: box.left - canvasBox.left + (box.width - w) * fx,
    top: box.top - canvasBox.top + (box.height - h) * fy,
    width: w,
    height: h,
  };
}

// Default lamp + mask zone for lamp-intro.mp4 once it's mirrored: the left 40%, from 28% down.
const LAMP_ZONE = { x0: 0, y0: 0.28, x1: 0.4, y1: 1 };

type Dot = {
  x: number;
  y: number;
  phase: number;
  speed: number;
  peak: number;
  size: number;
  keep: number;
};

export function TwinkleField({ mediaBoxRef, avoid = LAMP_ZONE }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sprite = makeGlowSprite(32);
    let dots: Dot[] = [];
    let width = 0;
    let height = 0;

    // 1. Lay the dots out on a grid that fills the screen.
    const layout = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // The lamp zone, turned into an ellipse on screen.
      const media = mediaBoxRef.current?.querySelector<HTMLVideoElement | HTMLImageElement>(
        "video, img",
      );
      let zone: { cx: number; cy: number; rx: number; ry: number } | null = null;
      if (media) {
        const f = frameRect(media, rect);
        zone = {
          cx: f.left + ((avoid.x0 + avoid.x1) / 2) * f.width,
          cy: f.top + ((avoid.y0 + avoid.y1) / 2) * f.height,
          rx: ((avoid.x1 - avoid.x0) / 2) * f.width,
          ry: ((avoid.y1 - avoid.y0) / 2) * f.height,
        };
      }

      dots = [];
      for (let y = SPACING / 2; y < height; y += SPACING) {
        for (let x = SPACING / 2; x < width; x += SPACING) {
          // How far this dot is from the lamp (1 = right on the edge of the zone).
          let keep = 1;
          if (zone && zone.rx > 0 && zone.ry > 0) {
            const d = Math.hypot((x - zone.cx) / zone.rx, (y - zone.cy) / zone.ry);
            keep = smoothstep(1.05, 1.5, d); // 0 inside the zone, fades back in around it
          }
          if (keep === 0) continue;
          dots.push({
            x,
            y,
            phase: Math.random() * Math.PI * 2,
            speed: (Math.PI * 2) / (MIN_PERIOD + Math.random() * (MAX_PERIOD - MIN_PERIOD)),
            peak: 0.35 + Math.random() * 0.65, // some dots get brighter than others
            size: 7 + Math.random() * 5,
            keep,
          });
        }
      }
    };

    // 2. Draw every dot. Most of the time a dot is barely there; now and then it slowly swells and fades.
    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      const fade = reduceMotion ? 1 : smoothstep(0, FADE_IN, time);
      for (const d of dots) {
        const wave = (Math.sin(time * d.speed + d.phase) + 1) / 2; // 0..1
        const glow = reduceMotion ? 0.35 : Math.pow(wave, 4); // ^4 keeps it dim most of the time
        const alpha = (0.06 + glow * d.peak) * d.keep * fade;
        if (alpha < 0.01) continue;
        ctx.globalAlpha = alpha;
        const s = d.size * (0.7 + glow * 0.5);
        ctx.drawImage(sprite, d.x - s / 2, d.y - s / 2, s, s);
      }
      ctx.globalAlpha = 1;
    };

    layout();
    const observer = new ResizeObserver(() => {
      layout();
      if (reduceMotion) draw(0);
    });
    observer.observe(canvas);
    // The video's real size is only known once it loads (and the still image can replace it),
    // so redo the layout then. `true` = catch these events on the way down, since they don't bubble up.
    const box = mediaBoxRef.current;
    box?.addEventListener("loadedmetadata", layout, true);
    box?.addEventListener("load", layout, true);

    let frame = 0;
    const start = performance.now();
    const loop = (now: number) => {
      draw((now - start) / 1000);
      frame = requestAnimationFrame(loop);
    };
    if (reduceMotion) draw(0);
    else frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      box?.removeEventListener("loadedmetadata", layout, true);
      box?.removeEventListener("load", layout, true);
    };
  }, [mediaBoxRef, avoid]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
