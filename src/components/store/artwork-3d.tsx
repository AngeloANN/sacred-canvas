import { useRef, useState, type CSSProperties } from "react";
import type { FormatKey } from "@/lib/catalog";

type Props = {
  image: string;
  title: string;
  /** Print size in inches, already turned the right way (e.g. 16 × 9, or 8 × 10 for tall pieces) */
  widthIn: number;
  heightIn: number;
  format: FormatKey;
};

// How thick each product is, in inches.
const DEPTH_IN: Record<FormatKey, number> = {
  mounted: 0.1875, // 3/16" foam board
  canvas: 0.875, // standard canvas stretcher bars
};

// The biggest the box can be on screen, in pixels.
const MAX_W = 460;
const MAX_H = 420;

// Starting angle, so people see right away that it's 3D.
const START = { x: -8, y: -28 };

export function Artwork3D({ image, title, widthIn, heightIn, format }: Props) {
  // 1. Turn inches into screen pixels, keeping the real proportions.
  const scale = Math.min(MAX_W / widthIn, MAX_H / heightIn);
  const W = Math.round(widthIn * scale);
  const H = Math.round(heightIn * scale);
  const D = Math.max(3, Math.round(DEPTH_IN[format] * scale)); // never thinner than 3px

  // 2. The current rotation, changed by dragging.
  const [rot, setRot] = useState(START);
  const drag = useRef<{ x: number; y: number; start: typeof START } | null>(null);

  const onPointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId); // keep tracking even if the mouse leaves the box
    drag.current = { x: e.clientX, y: e.clientY, start: rot };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    const dy = e.clientY - drag.current.y;
    setRot({
      y: drag.current.start.y + dx * 0.4, // left/right drag spins it around
      x: Math.max(-35, Math.min(35, drag.current.start.x - dy * 0.4)), // up/down tilts it, limited
    });
  };
  const onPointerUp = () => {
    drag.current = null;
  };

  // 3. What the edges look like.
  //    Canvas: the image wraps around the sides (gallery wrap).
  //    Mounted print: plain white foam-board edges, like the one your friend printed.
  const wrap = format === "canvas";
  const edge = (position: string, w: number, h: number): CSSProperties =>
    wrap
      ? {
          backgroundImage: `url(${image})`,
          backgroundSize: `${W}px ${H}px`,
          backgroundPosition: position,
          filter: "brightness(0.75)", // sides catch less light than the front
          width: w,
          height: h,
        }
      : { background: "#f1eee8", width: w, height: h };

  const face = "absolute left-1/2 top-1/2 [backface-visibility:hidden]";

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="cursor-grab touch-none select-none active:cursor-grabbing [perspective:1400px]"
        style={{ width: MAX_W, maxWidth: "100%", height: MAX_H + 40 }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onDoubleClick={() => setRot(START)}
        role="img"
        aria-label={`${title}, ${widthIn}×${heightIn} inch ${wrap ? "canvas" : "mounted print"}, 3D preview. Drag to turn it.`}
      >
        {/* The box. Every face is positioned from the center, then pushed out into 3D. */}
        <div
          className="relative h-full w-full [transform-style:preserve-3d]"
          style={{ transform: `rotateX(${rot.x}deg) rotateY(${rot.y}deg)` }}
        >
          {/* Front: the art itself, cropped the way the print will be */}
          <div
            className={`${face} shadow-[0_30px_60px_-20px_rgba(0,0,0,0.55)]`}
            style={{
              width: W,
              height: H,
              backgroundImage: `url(${image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              transform: `translate(-50%, -50%) translateZ(${D / 2}px)`,
            }}
          />
          {/* Back */}
          <div
            className={face}
            style={{
              width: W,
              height: H,
              background: wrap ? "#c9b48f" : "#e9e5dd", // raw canvas back vs. foam board back
              transform: `translate(-50%, -50%) rotateY(180deg) translateZ(${D / 2}px)`,
            }}
          />
          {/* Right edge */}
          <div
            className={face}
            style={{
              ...edge("right center", D, H),
              transform: `translate(-50%, -50%) rotateY(90deg) translateZ(${W / 2}px)`,
            }}
          />
          {/* Left edge */}
          <div
            className={face}
            style={{
              ...edge("left center", D, H),
              transform: `translate(-50%, -50%) rotateY(-90deg) translateZ(${W / 2}px)`,
            }}
          />
          {/* Top edge */}
          <div
            className={face}
            style={{
              ...edge("center top", W, D),
              transform: `translate(-50%, -50%) rotateX(90deg) translateZ(${H / 2}px)`,
            }}
          />
          {/* Bottom edge */}
          <div
            className={face}
            style={{
              ...edge("center bottom", W, D),
              transform: `translate(-50%, -50%) rotateX(-90deg) translateZ(${H / 2}px)`,
            }}
          />
        </div>
      </div>
      <p className="text-xs uppercase tracking-widest text-muted-foreground">
        Drag to turn · double-click to reset
      </p>
    </div>
  );
}
