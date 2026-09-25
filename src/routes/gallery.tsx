import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Header } from "@/components/store/header";
import { Button } from "@/components/ui/button";
import { artworks } from "@/lib/catalog";
export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — ICXC" },
      {
        name: "description",
        content: "Walk through a quiet virtual museum of original sacred canvas works.",
      },
      { property: "og:title", content: "Gallery — ICXC" },
      {
        property: "og:description",
        content: "Walk through a quiet virtual museum of original sacred canvas works.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Gallery,
});
function Gallery() {
  const [index, setIndex] = useState(0);
  const [turn, setTurn] = useState<"next" | "prev" | null>(null);
  const startX = useRef(0);
  const navigate = useNavigate();
  const move = useCallback(
    (dir: 1 | -1) => {
      if (turn) return;
      setTurn(dir === 1 ? "next" : "prev");
      window.setTimeout(() => setIndex((i) => (i + dir + artworks.length) % artworks.length), 390);
      window.setTimeout(() => setTurn(null), 810);
    },
    [turn],
  );
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") move(1);
      if (event.key === "ArrowLeft") move(-1);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [move]);
  const art = artworks[index];
  return (
    <main className="min-h-screen overflow-hidden bg-museum-wall">
      <Header />
      <section
        className="relative h-screen pt-16 [perspective:1400px]"
        onTouchStart={(e) => {
          startX.current = e.touches[0]?.clientX ?? 0;
        }}
        onTouchEnd={(e) => {
          const dx = (e.changedTouches[0]?.clientX ?? 0) - startX.current;
          if (Math.abs(dx) > 55) move(dx < 0 ? 1 : -1);
        }}
      >
        <div
          onClick={() => navigate({ to: "/artwork/$slug", params: { slug: art.slug } })}
          className={`${turn === "next" ? "turn-next" : turn === "prev" ? "turn-prev" : ""} relative flex h-full cursor-pointer flex-col items-center justify-center bg-[radial-gradient(ellipse_at_50%_5%,var(--color-background)_0%,var(--color-museum-wall)_52%,var(--color-border)_100%)] pb-8 [transform-style:preserve-3d]`}
        >
          <img
            src={art.image}
            width={1024}
            height={1280}
            alt={art.title}
            className="max-h-[62vh] max-w-[72vw] object-contain shadow-[0_24px_45px_-18px_var(--color-foreground)]"
          />
          <div className="mt-6 min-w-52 bg-background px-5 py-3 shadow-sm">
            <h1 className="font-display text-xl">{art.title}</h1>
            <p className="text-xs text-muted-foreground">
              {art.year} · {art.medium}
            </p>
          </div>
        </div>
        <Button
          variant="icon"
          size="icon"
          aria-label="Previous artwork"
          onClick={() => move(-1)}
          className="absolute left-3 top-1/2 z-10 h-14 w-14 md:left-8"
        >
          <ChevronLeft className="!h-9 !w-9" />
        </Button>
        <Button
          variant="icon"
          size="icon"
          aria-label="Next artwork"
          onClick={() => move(1)}
          className="absolute right-3 top-1/2 z-10 h-14 w-14 md:right-8"
        >
          <ChevronRight className="!h-9 !w-9" />
        </Button>
        <span className="absolute bottom-4 left-6 text-xs">
          {String(index + 1).padStart(2, "0")} / {String(artworks.length).padStart(2, "0")}
        </span>
      </section>
    </main>
  );
}
